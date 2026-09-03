-- ============================================================================
--  JMC — complete database setup
--
--  GENERATED FILE. Do not edit — run `npm run sql:bundle` instead.
--  Sources: supabase/schema.sql, migrations/002_posts.sql, migrations/003_media.sql, migrations/004_link_stack.sql, migrations/005_reporting_block.sql, migrations/006_industry_grid.sql, migrations/007_lead_tier.sql, migrations/008_page_specs_02_09.sql, migrations/009_package_positioning.sql
--
--  For a brand new Supabase project: paste this whole file into the SQL editor
--  and run it once. Then run supabase/seed.sql to load the launch content.
--
--  Safe to run more than once. It creates structure only — it never writes or
--  deletes page content.
-- ============================================================================

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
    'postList', 'linkStack', 'reportingBlock', 'industryGrid',
    'fourQuestions', 'recapExample', 'auditForm', 'waiverMatrix'
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
  -- The commitment as a plain line, e.g. "12-month term, then month to month".
  term            text,
  timeline        text,
  -- A short line under the name, e.g. "Local Foundation". Page Spec 06.
  positioning     text,
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


-- ############################################################################
-- ##  002_posts.sql
-- ############################################################################

-- ============================================================================
--  JMC — articles
--
--  Run this after schema.sql. Safe to run more than once.
--
--  Articles are the Resources hub's content. They live in their own table
--  rather than as `pages` rows because they are a different shape: one body of
--  long-form writing, not a stack of layout sections, plus the dated metadata
--  a search engine wants on an article (published, updated, author).
-- ============================================================================

create extension if not exists pgcrypto;

-- The "Latest articles" block, so any page can carry a list of posts.
-- Harmless if schema.sql already created the enum with this value.
alter type section_type add value if not exists 'postList';

create table if not exists public.posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  -- Shown in listings and used as the meta description when none is set.
  excerpt          text not null default '',
  -- Markdown. Rendered to React elements, never to raw HTML.
  body             text not null default '',
  category         text not null default '',
  tags             text[] not null default '{}',
  author           text not null default '',
  -- Optional. The brand guardrails rule out stock photography, so most posts
  -- will not have one.
  cover_image_url  text,
  cover_image_alt  text,
  -- Falls back to the title / excerpt when blank.
  seo_title        text not null default '',
  meta_description text not null default '',
  published        boolean not null default false,
  -- The date shown on the article and given to search engines. Set when the
  -- post is first published, and editable afterwards so a backdated import
  -- reads correctly.
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists posts_published_idx
  on public.posts (published, published_at desc);

create index if not exists posts_category_idx on public.posts (category);

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

/*
 * Stamps published_at the first time a post goes live, so the client never has
 * to think about it. Unpublishing and republishing keeps the original date —
 * a correction should not look like a brand new article to a search engine.
 */
create or replace function public.stamp_published_at()
returns trigger language plpgsql as $$
begin
  if new.published and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end $$;

drop trigger if exists posts_stamp_published on public.posts;
create trigger posts_stamp_published before insert or update on public.posts
  for each row execute function public.stamp_published_at();

-- ------------------------------------------------------ row level security --

alter table public.posts enable row level security;

/*
 * A post is public only once it is published AND its publish date has arrived,
 * which is what makes scheduling work: set a future date, and it appears on
 * its own without anyone touching the site.
 */
drop policy if exists posts_public_read on public.posts;
create policy posts_public_read on public.posts
  for select using (
    public.is_admin()
    or (published and (published_at is null or published_at <= now()))
  );

drop policy if exists posts_admin_write on public.posts;
create policy posts_admin_write on public.posts
  for all using (public.is_admin()) with check (public.is_admin());


-- ############################################################################
-- ##  003_media.sql
-- ############################################################################

-- ============================================================================
--  JMC — image uploads
--
--  Run after 002_posts.sql. Safe to run more than once.
--
--  Files go into Supabase Storage; this table is the catalogue that sits
--  alongside them, so the admin can show a media library and remember the alt
--  text written for each image rather than asking for it again every time.
-- ============================================================================

/*
 * The bucket is public-read: these are images on a marketing site, and a
 * signed URL that expires would break every article that embeds one.
 *
 * SVG is deliberately not in the allowed list. An SVG can carry script, and
 * "upload an image" should never be a route to executing code.
 */
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ------------------------------------------------------- storage access ----

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- ------------------------------------------------------------ catalogue ----

create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  -- Path inside the bucket. Unique so re-recording an upload cannot duplicate.
  path        text not null unique,
  url         text not null,
  -- The description screen readers announce. Stored per asset so it is written
  -- once and offered again wherever the image is reused.
  alt         text not null default '',
  file_name   text not null default '',
  mime_type   text,
  size_bytes  integer,
  width       integer,
  height      integer,
  created_at  timestamptz not null default now()
);

create index if not exists media_created_idx on public.media (created_at desc);

alter table public.media enable row level security;

-- Admin-only, including reads: the catalogue lists every file that has ever
-- been uploaded, which is not something to hand to anonymous visitors. The
-- images themselves are public through Storage.
drop policy if exists media_admin_all on public.media;
create policy media_admin_all on public.media
  for all using (public.is_admin()) with check (public.is_admin());


-- ############################################################################
-- ##  004_link_stack.sql
-- ############################################################################

-- ============================================================================
--  JMC — link hub block
--
--  Run after 003_media.sql. Safe to run more than once.
--
--  Adds the "Link hub" section type: the link-in-bio page that replaces
--  linktr.ee, so social profiles point at our own domain.
-- ============================================================================

alter type section_type add value if not exists 'linkStack';


-- ############################################################################
-- ##  005_reporting_block.sql
-- ############################################################################

-- ============================================================================
--  JMC — Monthly Recap block
--
--  Run after 004_link_stack.sql. Safe to run more than once.
--
--  Adds the "reportingBlock" section type: the four locked reporting cards from
--  Build Spec §12, which replace the five conflicting versions found across the
--  old wireframes.
-- ============================================================================

alter type section_type add value if not exists 'reportingBlock';


-- ############################################################################
-- ##  006_industry_grid.sql
-- ############################################################################

-- ============================================================================
--  JMC — bucketed industry grid
--
--  Run after 005_reporting_block.sql. Safe to run more than once.
--
--  Adds the "industryGrid" section type: eight industries in two labelled
--  groups of four, per Page Spec 01 §5. The canonical industry component,
--  reused verbatim on the Traditional SEO page.
-- ============================================================================

alter type section_type add value if not exists 'industryGrid';


-- ############################################################################
-- ##  007_lead_tier.sql
-- ############################################################################

-- ============================================================================
--  JMC — lead tier attribution
--
--  Run any time. Safe to run more than once.
--
--  Pricing card CTAs pass ?tier=neighborhood; Build Spec §13 wants that carried
--  through to the enquiry so it is clear which package produced it.
-- ============================================================================

alter table public.leads add column if not exists tier text;


-- ############################################################################
-- ##  008_page_specs_02_09.sql
-- ############################################################################

-- ============================================================================
--  JMC — block types for Page Specs 02 to 09
--
--  Run after 007_lead_tier.sql. Safe to run more than once.
--
--  Adds the four section types the new page specs need:
--
--    fourQuestions  Page Spec 05 §2. The four recap headings argued at length
--                   rather than listed. Deliberately not the compact recap
--                   block, which every other page uses.
--    recapExample   Page Spec 05 §3. A worked example of a monthly recap,
--                   drawn in HTML and carrying no figures at all.
--    auditForm      Page Spec 04 §4. The Free Visibility Audit band.
--    waiverMatrix   Page Specs 06 §7 and 07 §6. The onboarding-fee waiver,
--                   read from either the package side or the sprint side.
--
--  Postgres will not let a new enum value be *used* in the same transaction
--  that added it, so this file must run on its own before any insert that
--  references one of these types.
-- ============================================================================

alter type section_type add value if not exists 'fourQuestions';
alter type section_type add value if not exists 'recapExample';
alter type section_type add value if not exists 'auditForm';
alter type section_type add value if not exists 'waiverMatrix';


-- ############################################################################
-- ##  009_package_positioning.sql
-- ############################################################################

-- ============================================================================
--  JMC — package positioning line and term
--
--  Run any time, in the same run as 008 or after it. Safe to run more than
--  once.
--
--  positioning  Page Spec 06 gives every tier a short line under the name
--               (Local Foundation, City-Level Growth, Metro Expansion) so the
--               three read as an arc rather than as three prices.
--
--  term         The commitment as a plain line rather than a badge. Page Spec
--               06 extends it past "12-month term" deliberately: that alone
--               reads as rigid, while "then month to month" is both true and a
--               materially easier thing to accept. Leaving the second half off
--               was making the offer look worse than it is.
-- ============================================================================

alter table public.packages add column if not exists positioning text;
alter table public.packages add column if not exists term text;
