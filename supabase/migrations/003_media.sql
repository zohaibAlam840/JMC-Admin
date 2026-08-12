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
