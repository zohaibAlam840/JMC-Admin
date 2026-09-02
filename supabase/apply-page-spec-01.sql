-- ============================================================================
--  JMC — apply Page Spec 01 to an EXISTING database
--
--  Run these FIRST, each in its own separate run, and let each finish:
--
--      supabase/migrations/005_reporting_block.sql
--      supabase/migrations/006_industry_grid.sql
--
--  Postgres will not use a newly added enum value in the same transaction that
--  added it, so they cannot be pasted together with this file.
--
--  What this does
--  --------------
--  Rebuilds the HOMEPAGE ONLY to the ten sections Page Spec 01 specifies, in
--  its order, with its background alternation:
--
--      1 Hero (split)            6 Packages Preview
--      2 Two Growth Paths        7 How It Works
--      3 Transparency Promise    8 The Monthly Recap
--      4 What JMC Does           9 Houston Positioning
--      5 Industries Served      10 Final CTA
--
--  This REPLACES every section on the homepage. Any edit made to one of
--  them in /admin is overwritten. Every other page, article,
--  package, menu item and setting is untouched.
--
--  Generated from supabase/seed.sql so the two cannot drift.
-- ============================================================================

begin;

-- Keeps the page row current (title, description) without disturbing its id,
-- so nothing that points at the homepage breaks.
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/', 'Homepage', 'Houston-Area SEO Agency | Jordan Marketing Consultants', 'Houston-area SEO from Jordan Marketing Consultants. Local and traditional SEO, content planning, and a plain monthly recap of what changed and why.', true, false, true, 0)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description;

delete from public.sections s
using public.pages p
where s.page_id = p.id and p.slug = '/';

insert into public.sections (page_id, key, type, tone, data, position) select id, 'hero', 'heroSplit', NULL, '{"eyebrow":"SEO for local, regional, and industrial businesses","heading":"Search Visibility, Explained Every Month.","body":"Jordan Marketing Consultants does one thing: search visibility for local, regional, and industrial businesses. Every month you get a plain recap of what was done, why, and what changed.","primaryCta":{"label":"Request a Visibility Review","href":"/contact"},"secondaryCta":{"label":"See How JMC Reports SEO Progress","href":"#monthly-recap"},"showcase":[{"kind":"report","label":"Every month","title":"Monthly Recap","items":["What was done","Why it matters","What changed","What comes next"]},{"kind":"coverage","label":"Where you appear","title":"Search Visibility","items":["Search","Maps","Local grid"]},{"kind":"roadmap","label":"The plan","title":"SEO Roadmap","items":["Priorities set","Content queued","Technical fixes tracked"]}]}'::jsonb, 0 from public.pages where slug = '/';

insert into public.sections (page_id, key, type, tone, data, position) select id, 'growth-paths', 'cardGrid', 'surface', '{"eyebrow":"SEO Growth Paths","heading":"Choose the SEO Path That Fits Where You Are Growing","body":"Different businesses need different SEO strategies. JMC helps visitors find the right path based on market size, competition, audience, and growth goals.","columns":3,"cards":[{"title":"Local SEO","icon":"map-pin","body":"For businesses that need stronger visibility in Google Search, Google Maps, and local service-area searches.","cta":{"label":"Explore Local SEO","href":"/local-seo-services"}},{"title":"Traditional SEO","icon":"trending-up","body":"For regional, national, and industry-focused companies competing across larger search markets.","cta":{"label":"Explore Traditional SEO","href":"/traditional-seo-services"}},{"title":"Real Estate SEO","icon":"home","body":"For agents, teams, and brokerages that want stronger local search presence and content that supports trust.","cta":{"label":"Explore Real Estate SEO","href":"/real-estate-seo"}}]}'::jsonb, 1 from public.pages where slug = '/';

insert into public.sections (page_id, key, type, tone, data, position) select id, 'transparency', 'fullWidthText', NULL, '{"treatment":"statement","heading":"No Mystery SEO. No Confusing Reports. No Guessing What You Paid For.","body":"Most agencies keep the work behind a login and the reasoning to themselves. JMC does the opposite. You see what was done, why it was done, and what it changed, in language that does not need translating. That is how the work is run, not a reporting add-on.","cta":{"label":"See How JMC Reports SEO Progress","href":"#monthly-recap"}}'::jsonb, 2 from public.pages where slug = '/';

insert into public.sections (page_id, key, type, tone, data, position) select id, 'services', 'cardGrid', 'white', '{"eyebrow":"SEO Services","heading":"SEO Work Built Around Strategy, Visibility, and Accountability","body":"JMC focuses on the pieces of SEO that help businesses become easier to find, easier to understand, and easier to trust in search.","columns":3,"cards":[{"title":"SEO Strategy","icon":"target","body":"Keyword priorities, search intent, competitor visibility, and roadmap planning."},{"title":"Local Optimization","icon":"map-pin","body":"Local search improvements that support visibility in Google Search, Google Maps, and service-area searches."},{"title":"Google Business Profile Support","icon":"star","body":"Profile optimization, post strategy, service alignment, and activity that supports local trust."},{"title":"SEO Content Planning","icon":"file-text","body":"Strategic SEO pages, content roadmaps, service page improvements, and search-focused messaging."},{"title":"Technical SEO Monitoring","icon":"wrench","body":"Ongoing review of technical issues that can affect crawling, indexing, visibility, and site performance."},{"title":"Reporting and Monthly Recaps","icon":"bar-chart","body":"Clear monthly updates that explain progress, priorities, and next steps without burying you in jargon."}],"cta":{"label":"Explore SEO Services","href":"/local-seo-services"}}'::jsonb, 3 from public.pages where slug = '/';

insert into public.sections (page_id, key, type, tone, data, position) select id, 'industries', 'industryGrid', 'surface', '{"eyebrow":"Industries","heading":"Where This Method Gets Pointed","body":"One method, aimed at two different kinds of search problem.","groups":[{"label":"Businesses that serve a defined area","serviceLine":"Local SEO","serviceHref":"/local-seo-services","cards":[{"title":"Home Services & Trades","icon":"wrench","body":"Roofers, plumbers, electricians, and the trades that live on calls from a service area.","href":"/local-seo-services"},{"title":"Healthcare & Wellness","icon":"heart-pulse","body":"Practices and clinics where people check credibility before they ever call.","href":"/local-seo-services"},{"title":"Hospitality & Attractions","icon":"utensils","body":"Venues, parks, and places people search for by what they want to do, not by name.","href":"/local-seo-services"},{"title":"Professional Services","icon":"briefcase","body":"Firms whose next client is comparing three local options in a single sitting.","href":"/local-seo-services"}]},{"label":"Businesses selling across multiple markets","serviceLine":"Traditional SEO","serviceHref":"/traditional-seo-services","cards":[{"title":"Energy & Petrochemical","icon":"factory","body":"Operators and suppliers selling technical capability to a small, specific buyer pool.","href":"/traditional-seo-services"},{"title":"Maritime & Logistics","icon":"network","body":"Port, freight, and supply chain businesses working across regions rather than a radius.","href":"/traditional-seo-services"},{"title":"Commercial Construction","icon":"hard-hat","body":"Contractors and infrastructure firms bidding well outside one city.","href":"/traditional-seo-services"},{"title":"Aerospace & Aviation","icon":"compass","body":"Suppliers and services in a market where the search volume is low and the intent is high.","href":"/traditional-seo-services"}]}],"escapeHatch":"The method does not change with the industry. If yours is not listed, it probably still applies."}'::jsonb, 4 from public.pages where slug = '/';

insert into public.sections (page_id, key, type, tone, data, position) select id, 'packages', 'cardGrid', 'white', '{"eyebrow":"SEO Packages","heading":"SEO Options Built for Different Growth Stages","body":"JMC offers structured SEO options for businesses that need ongoing monthly support or a focused starting point before moving into a longer campaign.","columns":3,"cards":[{"title":"Monthly Local SEO","icon":"map-pin","meta":"From $875/mo","body":"For businesses that need consistent local visibility support across search, maps, content, reviews, and reporting.","cta":{"label":"View Local SEO Packages","href":"/seo-packages#local"}},{"title":"Monthly Traditional SEO","icon":"trending-up","meta":"From $2,295/mo","body":"For businesses targeting regional, national, or competitive industry visibility with a larger search footprint.","cta":{"label":"View Traditional SEO Packages","href":"/seo-packages#traditional"}},{"title":"Launch Sprints","icon":"compass","meta":"From $799 one-time","body":"For businesses that need a fixed-scope SEO foundation before deciding on monthly service.","cta":{"label":"View Launch Sprints","href":"/launch-sprints"}}]}'::jsonb, 5 from public.pages where slug = '/';

insert into public.sections (page_id, key, type, tone, data, position) select id, 'process', 'processSteps', 'surface', '{"eyebrow":"How It Works","heading":"A Clear SEO Process From Review to Recap","body":"SEO works better when the process is organized. JMC keeps the work focused around visibility, priorities, implementation, and clear communication.","steps":[{"title":"Visibility Review","body":"We review where your business currently shows up, where visibility is weak, and which opportunities are worth prioritizing."},{"title":"SEO Roadmap","body":"We organize the work around keyword priorities, content needs, local visibility, technical issues, and business goals."},{"title":"Implementation","body":"We complete the scoped SEO work, content updates, local optimization, and technical improvements tied to the plan."},{"title":"Monthly Recap","body":"You receive a clear summary of what was completed, what changed, and what should happen next."}],"cta":{"label":"Start with a Visibility Review","href":"/contact"}}'::jsonb, 6 from public.pages where slug = '/';

insert into public.sections (page_id, key, type, tone, data, position) select id, 'monthly-recap', 'reportingBlock', 'white', '{"eyebrow":"Clear Reporting","heading":"What You Get Every Month","body":"SEO should not feel vague. Every month you get the same four answers, in the same order, in language that does not need a glossary.","did":"A plain summary of the SEO work completed: content, technical checks, local visibility tasks, and everything else inside the scope.","why":"The reasoning behind each piece of work, and how it supports visibility, relevance, or trust.","changed":"What moved, what did not, and what we are still watching.","next":"The priorities for the coming month, in order, so you always know where the campaign is heading.","cta":{"label":"See How JMC Reports SEO Progress","href":"#monthly-recap"}}'::jsonb, 7 from public.pages where slug = '/';

insert into public.sections (page_id, key, type, tone, data, position) select id, 'houston', 'fullWidthText', 'surface', '{"eyebrow":"Houston-Area SEO Agency","heading":"Rooted in League City. Built for Houston-Area Growth.","body":"JMC is based in League City and works with businesses across the Houston area that need practical SEO strategy, stronger search visibility, and clearer reporting. Whether the goal is local visibility, regional growth, or a more focused real estate SEO strategy, the work starts with understanding where your business is trying to grow.","cta":{"label":"Learn More About JMC","href":"/about"}}'::jsonb, 8 from public.pages where slug = '/';

insert into public.sections (page_id, key, type, tone, data, position) select id, 'final-cta', 'finalCta', NULL, '{"heading":"Not Sure Where Your SEO Is Stuck? Start with a Visibility Review.","body":"We will help you identify visibility gaps, priority opportunities, and the best next step based on your business, market, and goals.","primaryCta":{"label":"Request a Visibility Review","href":"/contact"},"secondaryCta":{"label":"View SEO Packages","href":"/seo-packages"}}'::jsonb, 9 from public.pages where slug = '/';

commit;

-- Expected: the locked H1, and ten sections in Page Spec 01 order.
select
  (select data->>'heading' from public.sections s
     join public.pages p on p.id = s.page_id
     where p.slug = '/' and s.key = 'hero') as hero_h1,
  (select count(*) from public.sections s
     join public.pages p on p.id = s.page_id
     where p.slug = '/') as sections;

select s.position, s.key, s.type, s.tone
from public.sections s
join public.pages p on p.id = s.page_id
where p.slug = '/'
order by s.position;
