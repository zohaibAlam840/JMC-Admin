-- ============================================================================
--  JMC — database schema
--
--  Paste this whole file into the Supabase SQL editor and run it once.
--  It is written to be re-runnable: every object is created with
--  "if not exists" or dropped first, so running it twice is harmless and it
--  never destroys content you have already edited in /admin.
--
--  Model
--  -----
--  A page is an ordered list of typed sections — never HTML. `sections.type`
--  mirrors the union in lib/types.ts, and `sections.data` carries whatever
--  fields that section type declares. That is what lets the admin build pages
--  from a fixed block library instead of shipping a rich-text editor that can
--  break the design.
--
--  Security
--  --------
--  Every table has row level security on. The publishable key that ships to the
--  browser can only read published content and insert a lead. All writes
--  require a signed-in user who is listed in `admins`.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- enums ----
do $$ begin
  create type section_type as enum (
    'heroSplit', 'heroCentered', 'cardGrid', 'processSteps', 'fullWidthText',
    'featureSplit', 'pricingCards', 'calloutBanner', 'faq', 'finalCta',
    'postList', 'linkStack', 'reportingBlock', 'industryGrid'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type package_group as enum ('local', 'traditional', 'realEstate', 'sprint');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new', 'contacted', 'qualified', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type nav_location as enum ('main', 'footer');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------- updated_at -------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ============================================================== admins ====
-- Who is allowed into /admin. A Supabase Auth user with no row here can sign
-- in but sees nothing and can write nothing.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null default '',
  role       text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Bootstrap. The first authenticated user to call this becomes the owner;
-- once any admin exists the function does nothing, so it cannot be used to
-- grant yourself access later.
create or replace function public.claim_admin()
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return false; end if;
  if exists (select 1 from public.admins) then return false; end if;
  insert into public.admins (user_id, email, role)
  values (auth.uid(), coalesce((select email from auth.users where id = auth.uid()), ''), 'owner');
  return true;
end $$;

grant execute on function public.claim_admin() to authenticated;

-- =============================================================== pages ====
create table if not exists public.pages (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  label            text not null,
  seo_title        text not null default '',
  meta_description text not null default '',
  published        boolean not null default true,
  -- Emits Service structured data. True for the service pages only.
  is_service       boolean not null default false,
  -- A system page is rendered by a hand-built route (contact, thank-you) or is
  -- linked from code. Its slug cannot be changed and it cannot be deleted.
  system           boolean not null default false,
  position         integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

drop trigger if exists pages_touch on public.pages;
create trigger pages_touch before update on public.pages
  for each row execute function public.touch_updated_at();

-- ============================================================ sections ====
create table if not exists public.sections (
  id        uuid primary key default gen_random_uuid(),
  page_id   uuid not null references public.pages (id) on delete cascade,
  -- Stable anchor. In-page links (#includes, #options) point at this, so it is
  -- part of the public URL surface and must not change casually.
  key       text not null,
  type      section_type not null,
  tone      text check (tone in ('white', 'surface')),
  -- Everything the section type declares in lib/types.ts, minus id/type/tone.
  data      jsonb not null default '{}'::jsonb,
  position  integer not null default 0,
  visible   boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (page_id, key)
);

create index if not exists sections_page_position_idx
  on public.sections (page_id, position);

drop trigger if exists sections_touch on public.sections;
create trigger sections_touch before update on public.sections
  for each row execute function public.touch_updated_at();

-- ============================================================ packages ====
-- Text ids on purpose: pricingCards sections reference packages by the same
-- readable id used in the content files ("local-citywide"), so the seed import
-- and any hand-written section keep working.
create table if not exists public.packages (
  id              text primary key,
  group_key       package_group not null,
  name            text not null,
  price           text not null default '',
  price_unit      text,
  onboarding_fee  text,
  timeline        text,
  best_fit        text not null default '',
  deliverables    text[] not null default '{}',
  cta_label       text not null default 'Request a Visibility Review',
  cta_href        text not null default '/contact',
  featured        boolean not null default false,
  visible         boolean not null default true,
  -- Surfaces a "pricing not set" warning in /admin. Real Estate ships this way.
  pricing_pending boolean not null default false,
  position        integer not null default 0,
  updated_at      timestamptz not null default now()
);

drop trigger if exists packages_touch on public.packages;
create trigger packages_touch before update on public.packages
  for each row execute function public.touch_updated_at();

-- =========================================================== nav_items ====
-- One table for both menus. A row with parent_id null is a top-level item; in
-- the footer those top-level rows are the column headings.
create table if not exists public.nav_items (
  id        uuid primary key default gen_random_uuid(),
  location  nav_location not null default 'main',
  parent_id uuid references public.nav_items (id) on delete cascade,
  label     text not null,
  href      text not null default '',
  position  integer not null default 0
);

create index if not exists nav_items_lookup_idx
  on public.nav_items (location, parent_id, position);

-- ======================================================= site_settings ====
-- Singleton. The check constraint on a boolean primary key is the standard
-- trick for "exactly one row".
create table if not exists public.site_settings (
  id                 boolean primary key default true check (id),
  name               text not null default '',
  short_name         text not null default '',
  url                text not null default '',
  email              text not null default '',
  phone              text not null default '',
  phone_href         text not null default '',
  locality           text not null default '',
  region             text not null default '',
  positioning        text not null default '',
  footer_blurb       text not null default '',
  primary_cta_label  text not null default '',
  primary_cta_href   text not null default '/contact',
  updated_at         timestamptz not null default now()
);

drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- =========================================================== redirects ====
create table if not exists public.redirects (
  id          uuid primary key default gen_random_uuid(),
  source      text not null unique,
  destination text not null,
  permanent   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- =============================================================== leads ====
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  name       text not null default '',
  email      text not null default '',
  phone      text,
  company    text,
  website    text,
  service    text,
  message    text,
  -- Which page and which button produced the request. Answers "what is
  -- actually converting" without needing analytics.
  page_path  text,
  source_cta text,
  -- Which pricing card the visitor came from, via ?tier= on the CTA.
  tier       text,
  status     lead_status not null default 'new',
  notes      text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);

-- ============================================== row level security ========

alter table public.admins        enable row level security;
alter table public.pages         enable row level security;
alter table public.sections      enable row level security;
alter table public.packages      enable row level security;
alter table public.nav_items     enable row level security;
alter table public.site_settings enable row level security;
alter table public.redirects     enable row level security;
alter table public.leads         enable row level security;

-- admins ------------------------------------------------------------------
drop policy if exists admins_read on public.admins;
create policy admins_read on public.admins
  for select using (public.is_admin());

drop policy if exists admins_write on public.admins;
create policy admins_write on public.admins
  for all using (public.is_admin()) with check (public.is_admin());

-- pages -------------------------------------------------------------------
drop policy if exists pages_public_read on public.pages;
create policy pages_public_read on public.pages
  for select using (published or public.is_admin());

drop policy if exists pages_admin_write on public.pages;
create policy pages_admin_write on public.pages
  for all using (public.is_admin()) with check (public.is_admin());

-- sections ----------------------------------------------------------------
drop policy if exists sections_public_read on public.sections;
create policy sections_public_read on public.sections
  for select using (
    public.is_admin()
    or (visible and exists (
      select 1 from public.pages p where p.id = page_id and p.published
    ))
  );

drop policy if exists sections_admin_write on public.sections;
create policy sections_admin_write on public.sections
  for all using (public.is_admin()) with check (public.is_admin());

-- packages ----------------------------------------------------------------
drop policy if exists packages_public_read on public.packages;
create policy packages_public_read on public.packages
  for select using (visible or public.is_admin());

drop policy if exists packages_admin_write on public.packages;
create policy packages_admin_write on public.packages
  for all using (public.is_admin()) with check (public.is_admin());

-- nav / settings / redirects ----------------------------------------------
drop policy if exists nav_public_read on public.nav_items;
create policy nav_public_read on public.nav_items for select using (true);

drop policy if exists nav_admin_write on public.nav_items;
create policy nav_admin_write on public.nav_items
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists settings_public_read on public.site_settings;
create policy settings_public_read on public.site_settings for select using (true);

drop policy if exists settings_admin_write on public.site_settings;
create policy settings_admin_write on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists redirects_public_read on public.redirects;
create policy redirects_public_read on public.redirects for select using (true);

drop policy if exists redirects_admin_write on public.redirects;
create policy redirects_admin_write on public.redirects
  for all using (public.is_admin()) with check (public.is_admin());

-- leads --------------------------------------------------------------------
-- Anyone may submit the contact form. Nobody but an admin may read one back:
-- there is deliberately no public select policy here.
drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads
  for insert with check (true);

drop policy if exists leads_admin_read on public.leads;
create policy leads_admin_read on public.leads
  for select using (public.is_admin());

drop policy if exists leads_admin_write on public.leads;
create policy leads_admin_write on public.leads
  for all using (public.is_admin()) with check (public.is_admin());
