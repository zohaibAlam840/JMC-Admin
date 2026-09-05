-- ============================================================================
--  JMC — page titles and meta descriptions
--
--  Run any time. Safe to run more than once. Sections are not touched, so this
--  cannot disturb anything edited in /admin.
--
--  Build Spec §14 asks for titles under 60 characters and descriptions between
--  150 and 160. Seven descriptions were over, which means Google truncates the
--  tail, and the tail is where the useful part usually sits.
--
--  Generated from supabase/seed.sql.
-- ============================================================================

begin;

insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/', 'Homepage', 'Houston-Area SEO Agency | Jordan Marketing Consultants', 'Houston-area SEO from Jordan Marketing Consultants. Local and traditional SEO, content planning, and a plain monthly recap of what changed and why.', true, false, true, 0)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system,
  position = excluded.position;

insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/local-seo-services', 'Local SEO Services', 'Local SEO Services in the Houston Area', 'Local SEO for Houston-area businesses. Google Business Profile, citations, local content, review support, and clear monthly reporting.', true, true, false, 1)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system,
  position = excluded.position;

insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/traditional-seo-services', 'Traditional SEO Services', 'Traditional SEO Services | Regional and National Organic SEO', 'Traditional SEO for regional, national, and industry-focused search. Strategy, strategic SEO pages, technical monitoring, and clear reporting.', true, true, false, 2)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system,
  position = excluded.position;

insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/real-estate-seo', 'Real Estate SEO', 'Real Estate SEO for Agents, Teams, and Brokerages', 'Real estate SEO for agents, teams, and brokerages. Neighborhood visibility, market content, and reporting that shows what changed.', false, true, false, 3)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system,
  position = excluded.position;

insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/seo-packages', 'Monthly SEO Packages', 'Monthly SEO Packages and Pricing', 'Monthly SEO packages from $875, and fixed-scope Launch Sprints from $799. Real prices, defined scope, and reporting you can read.', true, false, false, 4)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system,
  position = excluded.position;

insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/launch-sprints', 'Launch Sprints', 'SEO Launch Sprints | Fixed-Scope 30-Day SEO Setup', 'One-time, fixed-scope SEO Launch Sprints. A 30-day audit, setup, and optimization engagement that ends with a clear roadmap and a path into monthly SEO.', true, false, false, 5)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system,
  position = excluded.position;

insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/about', 'About JMC', 'About Jordan Marketing Consultants', 'A Houston-area SEO agency rooted in League City. Practical strategy, local optimization, content planning, and reporting you can actually read.', true, false, false, 6)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system,
  position = excluded.position;

insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/resources', 'Resources', 'SEO Resources for Houston-Area Businesses', 'Plain-English SEO explainers covering local search, organic search, reporting, and how AI answer tools fit into modern SEO.', true, false, false, 7)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system,
  position = excluded.position;

insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/links', 'Link Hub', 'Jordan Marketing Consultants | Houston-Area SEO', 'Houston-area SEO from Jordan Marketing Consultants. Request a visibility review, see packages, or read the resources.', false, false, true, 8)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system,
  position = excluded.position;

commit;

-- Every description should now be at or under 160 characters.
select slug, length(meta_description) as description_length, length(seo_title) as title_length
from public.pages
order by position;
