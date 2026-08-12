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
