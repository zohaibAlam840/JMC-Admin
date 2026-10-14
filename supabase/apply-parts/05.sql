-- ======================================================================
--  JMC apply, part 5 of 5
--
--  GENERATED. Run the parts IN ORDER, each on its own, letting each
--  finish before starting the next. Safe to run more than once.
--
--  These exist because the single combined file is too large to paste
--  into the Supabase SQL editor without being truncated.
-- ======================================================================

begin;
insert into public.packages (id, group_key, name, price, price_unit, onboarding_fee, term, positioning, timeline, best_fit, deliverables, cta_label, cta_href, featured, visible, pricing_pending, position) values (
  'sprint-regional', 'sprint', 'Regional Launch Sprint', '$1,495', 'one-time', NULL, NULL, NULL, '45 days',
  'For businesses targeting a broader service region or multiple markets that want a strong foundation before starting monthly service.', ARRAY['Kickoff and access setup', 'Technical and on-page SEO audit', 'Regional keyword and competitor analysis', 'Google Search Console and Bing setup or verification', 'Schema, sitemap, and robots.txt review', 'Titles and meta descriptions for up to 10 priority pages', 'Backlink audit', '30-Day Roadmap and next-step recommendations']::text[],
  'Start the Regional Sprint', '/contact?type=sprint', false, true, false, 10)
on conflict (id) do update set
  name = excluded.name, price = excluded.price,
  price_unit = excluded.price_unit, onboarding_fee = excluded.onboarding_fee,
  term = excluded.term, positioning = excluded.positioning,
  timeline = excluded.timeline, best_fit = excluded.best_fit,
  deliverables = excluded.deliverables,
  cta_label = excluded.cta_label, cta_href = excluded.cta_href,
  featured = excluded.featured;
insert into public.packages (id, group_key, name, price, price_unit, onboarding_fee, term, positioning, timeline, best_fit, deliverables, cta_label, cta_href, featured, visible, pricing_pending, position) values (
  'sprint-national', 'sprint', 'National Launch Sprint', '$2,295', 'one-time', NULL, NULL, NULL, '45 days',
  'For businesses that need foundational technical and on-page SEO work in place before starting a national monthly campaign.', ARRAY['Kickoff and access setup', 'Technical and on-page SEO audit', 'National keyword and competitor analysis', 'Google Search Console and Bing setup or verification', 'Schema, sitemap, and robots.txt review', 'Titles and meta descriptions for up to 15 priority pages', 'Backlink audit', '30-Day Roadmap and next-step recommendations']::text[],
  'Start the National Sprint', '/contact?type=sprint', false, true, false, 11)
on conflict (id) do update set
  name = excluded.name, price = excluded.price,
  price_unit = excluded.price_unit, onboarding_fee = excluded.onboarding_fee,
  term = excluded.term, positioning = excluded.positioning,
  timeline = excluded.timeline, best_fit = excluded.best_fit,
  deliverables = excluded.deliverables,
  cta_label = excluded.cta_label, cta_href = excluded.cta_href,
  featured = excluded.featured;
-- ------------------------------------------------------------- menus ----
-- Rebuilt wholesale. Every industry item and the Pricing dropdown changed
-- address, so a merge would leave half the menu pointing at dead URLs.
delete from public.nav_items;
insert into public.nav_items (id, location, parent_id, label, href, position) values ('29405e57-086e-456b-a51c-58f2822c9189', 'main', null, 'Home', '/', 0);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('e71a5b75-b828-40d7-a237-c8e993eea1bb', 'main', null, 'SEO Services', '/local-seo-services', 1);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('302755fa-df20-4319-a0da-cd41b6ac97e6', 'main', 'e71a5b75-b828-40d7-a237-c8e993eea1bb', 'Local SEO Services', '/local-seo-services', 0);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('389ff470-d84e-4b5c-8b8a-22cfd9fa1795', 'main', 'e71a5b75-b828-40d7-a237-c8e993eea1bb', 'Traditional SEO Services', '/traditional-seo-services', 1);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('8a82f0ec-628e-4576-9af1-c290c6ffd446', 'main', 'e71a5b75-b828-40d7-a237-c8e993eea1bb', 'Google Business Profile Optimization', '/google-business-profile-optimization', 2);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('3200c766-9ea5-42c6-ba5e-4f839e8fd88f', 'main', null, 'Industries', '/industries', 2);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('62672904-27eb-437a-8b3d-33639df607b3', 'main', '3200c766-9ea5-42c6-ba5e-4f839e8fd88f', 'Home Services & Trades', '/industries/home-services-trades', 0);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('63d00efd-0c02-4dc5-a14f-ae95f857042f', 'main', '3200c766-9ea5-42c6-ba5e-4f839e8fd88f', 'Healthcare & Wellness', '/industries/healthcare-wellness', 1);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('f89ece4f-47e1-4597-b834-ee3841658e93', 'main', '3200c766-9ea5-42c6-ba5e-4f839e8fd88f', 'Hospitality & Attractions', '/industries/hospitality-attractions', 2);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('0dad0eee-6fc5-4803-bb42-9b5c061e8de8', 'main', '3200c766-9ea5-42c6-ba5e-4f839e8fd88f', 'Professional Services', '/industries/professional-services', 3);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('42a69f83-4c86-4e76-9541-cc2c05cdb1a2', 'main', '3200c766-9ea5-42c6-ba5e-4f839e8fd88f', 'Energy & Petrochemical', '/industries/energy-petrochemical', 4);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('b1dc19fd-884d-4d72-8432-2131e44e090a', 'main', '3200c766-9ea5-42c6-ba5e-4f839e8fd88f', 'Maritime & Logistics', '/industries/maritime-logistics', 5);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('62faaa90-9fbe-454e-96f1-686560c0828b', 'main', '3200c766-9ea5-42c6-ba5e-4f839e8fd88f', 'Commercial Construction & Infrastructure', '/industries/commercial-construction-infrastructure', 6);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('76511558-a853-4f4d-be97-e6091b0a8781', 'main', '3200c766-9ea5-42c6-ba5e-4f839e8fd88f', 'Aerospace & Aviation', '/industries/aerospace-aviation', 7);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('95be9f0d-dc8d-4369-ba10-f0aac84b0f89', 'main', null, 'Pricing', '/monthly-seo-packages', 3);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('1aa2641f-50df-4576-b17d-f8d46bad0935', 'main', '95be9f0d-dc8d-4369-ba10-f0aac84b0f89', 'Monthly SEO Packages', '/monthly-seo-packages', 0);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('845d1eab-8f52-4bb6-9e17-bfdea7e41d8a', 'main', '95be9f0d-dc8d-4369-ba10-f0aac84b0f89', 'Launch Sprints', '/launch-sprints', 1);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('09559896-3bf7-495d-9a6a-8a65600e34dd', 'main', null, 'About', '/about', 4);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('39b7328c-18f6-4795-a1bf-0284c6cd2bb1', 'main', null, 'Contact', '/contact', 5);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('a4de9bb7-fac2-450d-bdfe-e7bca2286fed', 'footer', null, 'SEO Services', '', 0);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('445d1520-aead-494a-b6ab-036f1d1ccb89', 'footer', 'a4de9bb7-fac2-450d-bdfe-e7bca2286fed', 'Local SEO Services', '/local-seo-services', 0);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('be4273e1-5068-4daf-90eb-c9f9fe8ebc83', 'footer', 'a4de9bb7-fac2-450d-bdfe-e7bca2286fed', 'Traditional SEO Services', '/traditional-seo-services', 1);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('f7dda2a0-2265-4477-83e4-828c224663aa', 'footer', 'a4de9bb7-fac2-450d-bdfe-e7bca2286fed', 'Google Business Profile Optimization', '/google-business-profile-optimization', 2);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('7b78f031-b2b8-4e78-8eae-e026f23b8b28', 'footer', 'a4de9bb7-fac2-450d-bdfe-e7bca2286fed', 'SEO Reporting', '/seo-reporting', 3);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('28843a4e-56ab-478b-8356-6fbc4459adee', 'footer', null, 'Industries', '', 1);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('8a526d47-3358-427c-a3a4-157b1bd9a89e', 'footer', '28843a4e-56ab-478b-8356-6fbc4459adee', 'Home Services & Trades', '/industries/home-services-trades', 0);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('608ad8ac-3b25-414c-8f40-7892f412f8ea', 'footer', '28843a4e-56ab-478b-8356-6fbc4459adee', 'Healthcare & Wellness', '/industries/healthcare-wellness', 1);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('4ed6984a-51b2-4aae-85ce-75556d877522', 'footer', '28843a4e-56ab-478b-8356-6fbc4459adee', 'Hospitality & Attractions', '/industries/hospitality-attractions', 2);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('0b13dc08-94a8-4873-a40c-e9484394d6d7', 'footer', '28843a4e-56ab-478b-8356-6fbc4459adee', 'Professional Services', '/industries/professional-services', 3);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('3e895f93-b631-453c-84f1-9055279df530', 'footer', '28843a4e-56ab-478b-8356-6fbc4459adee', 'Energy & Petrochemical', '/industries/energy-petrochemical', 4);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('9379fd52-38b8-456b-a9ff-7305ffbc2e17', 'footer', '28843a4e-56ab-478b-8356-6fbc4459adee', 'Maritime & Logistics', '/industries/maritime-logistics', 5);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('452a58e5-3224-4732-9476-7ceeeacd9888', 'footer', '28843a4e-56ab-478b-8356-6fbc4459adee', 'Commercial Construction & Infrastructure', '/industries/commercial-construction-infrastructure', 6);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('8efde981-7cab-44df-bfc0-052745987364', 'footer', '28843a4e-56ab-478b-8356-6fbc4459adee', 'Aerospace & Aviation', '/industries/aerospace-aviation', 7);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('235e6c4c-b9f9-4ef6-bfae-f05a3de41346', 'footer', null, 'Company', '', 2);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('dc619db7-82f6-4f38-bc19-c271b26e1e53', 'footer', '235e6c4c-b9f9-4ef6-bfae-f05a3de41346', 'Monthly SEO Packages', '/monthly-seo-packages', 0);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('e3b88f5b-1ac7-437b-abe2-c0913d90cfdb', 'footer', '235e6c4c-b9f9-4ef6-bfae-f05a3de41346', 'Launch Sprints', '/launch-sprints', 1);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('28626ecb-ce2f-456b-a15c-584c5098d5dc', 'footer', '235e6c4c-b9f9-4ef6-bfae-f05a3de41346', 'About', '/about', 2);
insert into public.nav_items (id, location, parent_id, label, href, position) values ('e01a0791-47b2-4dfc-9fc9-8c40f2d06089', 'footer', '235e6c4c-b9f9-4ef6-bfae-f05a3de41346', 'Contact', '/contact', 3);
-- ------------------------------------------------------ homepage links ----
-- Only the sections whose destinations or card counts changed. The rest of
-- the homepage, including any copy edited in /admin, is left alone.
update public.sections set data = '{"eyebrow":"SEO for local, regional, and industrial businesses","heading":"Search Visibility, Explained Every Month.","body":"Jordan Marketing Consultants does one thing: search visibility for local, regional, and industrial businesses. Every month you get a plain recap of what was done, why, and what changed.","primaryCta":{"label":"Request a Visibility Review","href":"/contact"},"secondaryCta":{"label":"See How JMC Reports SEO Progress","href":"/seo-reporting"},"showcase":[{"kind":"report","label":"Every month","title":"Monthly Recap","items":["What was done","Why it matters","What changed","What comes next"]},{"kind":"coverage","label":"Where you appear","title":"Search Visibility","items":["Search","Maps","Local grid"]},{"kind":"roadmap","label":"The plan","title":"SEO Roadmap","items":["Priorities set","Content queued","Technical fixes tracked"]}]}'::jsonb where key = 'hero' and page_id = (select id from public.pages where slug = '/');
update public.sections set data = '{"eyebrow":"SEO Growth Paths","heading":"Two Paths, Sorted by Where You Compete","body":"Different businesses need different SEO strategies. Which one fits comes down to reach: a defined area, or several markets at once.","columns":2,"cards":[{"title":"Local SEO","icon":"map-pin","body":"For businesses that need stronger visibility in Google Search, Google Maps, and local service-area searches.","cta":{"label":"Explore Local SEO","href":"/local-seo-services"}},{"title":"Traditional SEO","icon":"trending-up","body":"For regional, national, and industry-focused companies competing across larger search markets.","cta":{"label":"Explore Traditional SEO","href":"/traditional-seo-services"}}]}'::jsonb where key = 'growth-paths' and page_id = (select id from public.pages where slug = '/');
update public.sections set data = '{"treatment":"statement","heading":"No Mystery SEO. No Confusing Reports. No Guessing What You Paid For.","body":"Most agencies keep the work behind a login and the reasoning to themselves. JMC does the opposite. You see what was done, why it was done, and what it changed, in language that does not need translating. That is how the work is run, not a reporting add-on.","cta":{"label":"See How JMC Reports SEO Progress","href":"/seo-reporting"}}'::jsonb where key = 'transparency' and page_id = (select id from public.pages where slug = '/');
update public.sections set data = '{"eyebrow":"SEO Services","heading":"SEO Work Built Around Strategy, Visibility, and Accountability","body":"JMC focuses on the pieces of SEO that help businesses become easier to find, easier to understand, and easier to trust in search.","columns":3,"cards":[{"title":"SEO Strategy","icon":"target","body":"Keyword priorities, search intent, competitor visibility, and roadmap planning."},{"title":"Local Optimization","icon":"map-pin","body":"Local search improvements that support visibility in Google Search, Google Maps, and service-area searches."},{"title":"Google Business Profile Support","icon":"star","body":"Profile optimization, post strategy, service alignment, and activity that supports local trust."},{"title":"SEO Content Planning","icon":"file-text","body":"Strategic SEO pages, content roadmaps, service page improvements, and search-focused messaging."},{"title":"Technical SEO Monitoring","icon":"wrench","body":"Ongoing review of technical issues that can affect crawling, indexing, visibility, and site performance."},{"title":"Reporting and Monthly Recaps","icon":"bar-chart","body":"Clear monthly updates that explain progress, priorities, and next steps without burying you in jargon."}],"cta":{"label":"Explore Local SEO","href":"/local-seo-services"}}'::jsonb where key = 'services' and page_id = (select id from public.pages where slug = '/');
update public.sections set data = '{"eyebrow":"Industries","heading":"Where This Method Gets Pointed","body":"One method, aimed at two different kinds of search problem.","groups":[{"label":"Consumer & Community","cards":[{"title":"Home Services & Trades","icon":"wrench","body":"Roofers, plumbers, electricians, and the trades that live on calls from a service area.","href":"/industries/home-services-trades"},{"title":"Healthcare & Wellness","icon":"heart-pulse","body":"Practices and clinics where people check credibility before they ever call.","href":"/industries/healthcare-wellness"},{"title":"Hospitality & Attractions","icon":"utensils","body":"Venues, parks, and places people search for by what they want to do, not by name.","href":"/industries/hospitality-attractions"},{"title":"Professional Services","icon":"briefcase","body":"Firms whose next client is comparing three local options in a single sitting.","href":"/industries/professional-services"}]},{"label":"Industrial & B2B","cards":[{"title":"Energy & Petrochemical","icon":"factory","body":"Operators and suppliers selling technical capability to a small, specific buyer pool.","href":"/industries/energy-petrochemical"},{"title":"Maritime & Logistics","icon":"network","body":"Port, freight, and supply chain businesses working across regions rather than a radius.","href":"/industries/maritime-logistics"},{"title":"Commercial Construction","icon":"hard-hat","body":"Contractors and infrastructure firms bidding well outside one city.","href":"/industries/commercial-construction-infrastructure"},{"title":"Aerospace & Aviation","icon":"compass","body":"Suppliers and services in a market where the search volume is low and the intent is high.","href":"/industries/aerospace-aviation"}]}],"escapeHatch":"The method does not change with the industry. If yours is not listed, it probably still applies.","cta":{"label":"Explore Industries","href":"/industries"}}'::jsonb where key = 'industries' and page_id = (select id from public.pages where slug = '/');
update public.sections set data = '{"eyebrow":"Clear Reporting","heading":"What You Get Every Month","body":"SEO should not feel vague. Every month you get the same four answers, in the same order, in language that does not need a glossary.","did":"A plain summary of the SEO work completed: content, technical checks, local visibility tasks, and everything else inside the scope.","why":"The reasoning behind each piece of work, and how it supports visibility, relevance, or trust.","changed":"What moved, what did not, and what is still being watched.","next":"The priorities for the coming month, in order, so you always know where the campaign is heading.","cta":{"label":"See How JMC Reports SEO Progress","href":"/seo-reporting"}}'::jsonb where key = 'monthly-recap' and page_id = (select id from public.pages where slug = '/');
-- ---------------------------------------------------------- page meta ----
-- Titles and descriptions only, on every page. Sections are untouched here,
-- so this cannot disturb copy edited in /admin. Descriptions are retuned to
-- the 150 to 160 characters Build Spec §14 asks for.
update public.pages set seo_title = 'Houston-Area SEO Agency | Jordan Marketing Consultants', meta_description = 'Houston-area SEO from Jordan Marketing Consultants. Local and traditional SEO, content planning, and a plain monthly recap of what changed, and why it did.' where slug = '/';
update public.pages set seo_title = 'Local SEO Services | Houston Area', meta_description = 'Local SEO for Houston-area businesses. Google Business Profile, citations, reviews, local search grid tracking, and a monthly recap of what actually changed.' where slug = '/local-seo-services';
update public.pages set seo_title = 'Traditional SEO Services | Multi-Market Search', meta_description = 'SEO for businesses competing across several markets, service lines or competitive search. Strategy, strategic pages, technical monitoring, clear reporting.' where slug = '/traditional-seo-services';
update public.pages set seo_title = 'Real Estate SEO for Agents, Teams, and Brokerages', meta_description = 'Real estate SEO for agents, teams and brokerages. Neighborhood-level visibility, market content, local profile work, and reporting that shows what changed.' where slug = '/real-estate-seo';
update public.pages set seo_title = 'Monthly SEO Packages & Pricing | Houston Area', meta_description = 'SEO pricing published in full. Local packages from $875 a month, Traditional from $2,295, with what each tier includes, what onboarding covers, and the terms.' where slug = '/monthly-seo-packages';
update public.pages set seo_title = 'SEO Launch Sprints | One-Time, Fixed Scope', meta_description = 'One-time SEO Launch Sprints from $799, with a fixed scope and a fixed end date. A full audit, foundational optimization, and a 30-day action roadmap at the end.' where slug = '/launch-sprints';
update public.pages set seo_title = 'About JMC | SEO Only, Explained Every Month', meta_description = 'Jordan Marketing Consultants does one thing: SEO. A League City agency working on local, regional, and industrial search visibility, explained every month.' where slug = '/about';
update public.pages set seo_title = 'SEO Resources for Houston-Area Businesses', meta_description = 'Plain-English SEO explainers from JMC, covering local search, organic search, reporting, and where AI answer tools actually fit into modern search work.' where slug = '/resources';
update public.pages set seo_title = 'Jordan Marketing Consultants | Houston-Area SEO', meta_description = 'Houston-area SEO from Jordan Marketing Consultants. Request a visibility review, see the monthly packages and pricing, or read the SEO resources here.' where slug = '/links';
update public.pages set seo_title = 'SEO Reporting You Can Actually Read', meta_description = 'How JMC reports SEO progress: a monthly recap that answers what was done, why it was done, what changed, and what comes next. Plus a quarterly project update.' where slug = '/seo-reporting';
update public.pages set seo_title = 'Google Business Profile Optimization | Houston', meta_description = 'Google Business Profile optimization for Houston-area businesses. Categories, services, citations, posts, reviews and grid tracking, plus a free audit.' where slug = '/google-business-profile-optimization';
update public.pages set seo_title = 'Industries | Houston Area SEO for Any Sector', meta_description = 'JMC works across trades, healthcare, hospitality, professional services, energy, maritime, construction and aerospace. The method does not change at all.' where slug = '/industries';
update public.pages set seo_title = 'Home Services & Trades SEO | Houston Area', meta_description = 'SEO for HVAC, roofing, plumbing, electrical and landscaping businesses in the Houston area. Local visibility, profile work, and clear monthly reporting.' where slug = '/industries/home-services-trades';
update public.pages set seo_title = 'Healthcare & Wellness SEO | Houston Area', meta_description = 'SEO for dental, medical, therapy and wellness practices in the Houston area. Local visibility, profile and review support, and reporting you can actually read.' where slug = '/industries/healthcare-wellness';
update public.pages set seo_title = 'Hospitality & Attractions SEO | Houston Area', meta_description = 'SEO for hotels, restaurants, venues and attractions in the Houston area and beyond. Local and regional visibility, profile work, and clear monthly reporting.' where slug = '/industries/hospitality-attractions';
update public.pages set seo_title = 'Professional Services SEO | Houston Area', meta_description = 'SEO for legal, accounting, financial and consulting firms in the Houston area. Strategy, content built for how clients search, and clear monthly reporting.' where slug = '/industries/professional-services';
update public.pages set seo_title = 'Energy & Petrochemical SEO | Houston Area', meta_description = 'SEO for energy and petrochemical service firms, suppliers and consultancies. Search built around specifications, procurement cycles, and clear reporting.' where slug = '/industries/energy-petrochemical';
update public.pages set seo_title = 'Maritime & Logistics SEO | Houston Area', meta_description = 'SEO for port services, freight operators, and marine repair and fabrication firms. Search built around routes, capability, and how logistics buyers search.' where slug = '/industries/maritime-logistics';
update public.pages set seo_title = 'Commercial Construction SEO | Houston Area', meta_description = 'SEO for commercial contractors, civil and infrastructure firms, and building products suppliers. Search built around project type and qualification work.' where slug = '/industries/commercial-construction-infrastructure';
update public.pages set seo_title = 'Aerospace & Aviation SEO | Houston Area', meta_description = 'SEO for aerospace manufacturers, MRO and ground service providers, and avionics suppliers. Search built around parts, certification and procurement work.' where slug = '/industries/aerospace-aviation';
-- --------------------------------------------------- real estate seo ----
-- Cut from scope by Page Spec 01 §2. Unpublished rather than deleted: the
-- decision comes from a Decisions Record we have only seen quoted, and the
-- page and its two tiers come straight back if that changes.
--
-- Nothing links to it any more. The homepage and About both carried a Real
-- Estate card and both now show two service lanes instead of three.
update public.pages set published = false where slug = '/real-estate-seo';
update public.packages set visible = false where group_key = 'realEstate';
-- ----------------------------------------------------------- resources ----
-- Built, not published — Page Spec 14. The route and the post template
-- exist and work; zero posts go live, and the page stays out of the nav,
-- the footer and the sitemap until content is sourced.
--
-- This has to be stated here because the page rebuild above only touches
-- the pages it owns, and /resources is not one of them. Left
-- alone it stays published from the original seed, and the sitemap picks
-- it up the moment the database is reachable — listing a URL that 302s.
update public.pages set published = false where slug = '/resources';
-- --------------------------------------------------------- redirects ----
-- /seo-packages is the important one here. It was live and linked, and
-- Page Spec 06 renames it, so it has to keep resolving.
insert into public.redirects (source, destination, permanent) values ('/local-seo-service', '/local-seo-services', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/reputation-management', '/local-seo-services', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/link-building-service', '/traditional-seo-services', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/real-estate-seo', '/local-seo-services', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/seo-website-services', '/traditional-seo-services', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/free-website-audit', '/google-business-profile-optimization', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/services', '/local-seo-services', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/contact-us', '/contact', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/seo-service', '/local-seo-services', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/seo-league-city', '/local-seo-services', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/about-us', '/about', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/online-reviews-for-roofers', '/industries/home-services-trades', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/audit', '/google-business-profile-optimization', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/general', '/', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/general/feed', '/', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/navigating-the-ai-frontier', '/', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/seo-packages', '/monthly-seo-packages', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/seo-packages-pricing', '/monthly-seo-packages', true) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;
insert into public.redirects (source, destination, permanent) values ('/resources', '/', false) on conflict (source) do update set destination = excluded.destination, permanent = excluded.permanent;

commit;
