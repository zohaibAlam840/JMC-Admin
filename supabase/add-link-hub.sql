-- ============================================================================
--  JMC — add the link hub to an EXISTING database
--
--  Only needed on a database that was seeded before the link hub existed. A
--  fresh project gets this from setup.sql + seed.sql and should skip this file.
--
--  Run supabase/migrations/004_link_stack.sql FIRST, in its own run, and let it
--  finish. Postgres will not let a newly added enum value be used in the same
--  transaction that added it, so the two cannot be pasted together.
--
--  Touches nothing else: existing pages, sections, articles, and settings are
--  left exactly as they are.
-- ============================================================================

begin;

insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/links', 'Link Hub', 'Jordan Marketing Consultants | Houston-Area SEO', 'Houston-area SEO from Jordan Marketing Consultants. Request a visibility review, see packages, or read the resources.', false, false, true, 8)
on conflict (slug) do nothing;

-- Only inserted if the page has no section with this key yet, so re-running
-- cannot duplicate it or overwrite buttons already edited in /admin.
insert into public.sections (page_id, key, type, tone, data, position) select id, 'links', 'linkStack', NULL, '{"eyebrow":"@htxseo","theme":"dark","heading":"Houston’s SEO Agency","body":"Houston-area SEO. Practical strategy, local optimization, content planning, and reporting you can actually read.","socials":[{"platform":"instagram","href":"https://instagram.com/"},{"platform":"facebook","href":"https://facebook.com/"},{"platform":"linkedin","href":"https://linkedin.com/"}],"links":[{"label":"Request a Visibility Review","href":"/contact","description":"Where you show up now, and what to fix first","icon":"target","featured":true},{"label":"SEO Packages & Pricing","href":"/seo-packages","description":"Local, traditional, and launch sprints","icon":"layers"},{"label":"Local SEO Services","href":"/local-seo-services","description":"Google Business Profile, citations, local content","icon":"map-pin"},{"label":"SEO Resources","href":"/resources","description":"Plain-English explainers, no jargon","icon":"file-text"},{"label":"Call (281) 989-0468","href":"tel:+12819890468","icon":"message-square"}],"footnote":"League City, TX · Serving the Greater Houston area"}'::jsonb, 0 from public.pages where slug = '/links'
  and not exists (
    select 1 from public.sections s
    join public.pages p on p.id = s.page_id
    where p.slug = '/links' and s.key = 'links'
  );

commit;

-- Expected: 1 page, 1 section.
select
  (select count(*) from public.pages where slug = '/links') as link_hub_page,
  (select count(*) from public.sections s
     join public.pages p on p.id = s.page_id
     where p.slug = '/links') as link_hub_sections;
