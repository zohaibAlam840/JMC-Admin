-- ======================================================================
--  JMC apply, part 1 of 5
--
--  GENERATED. Run the parts IN ORDER, each on its own, letting each
--  finish before starting the next. Safe to run more than once.
--
--  These exist because the single combined file is too large to paste
--  into the Supabase SQL editor without being truncated.
-- ======================================================================

begin;
-- ==========================================================================
--  JMC — apply Page Specs 02 to 09 to an EXISTING database
--
--  GENERATED FILE. Do not hand-edit — run `npm run sql:apply` instead.
--
--  Run these FIRST, each in its own separate run, and let each finish:
--
--      supabase/migrations/008_page_specs_02_09.sql
--      supabase/migrations/009_package_positioning.sql
--
--  Postgres will not use a newly added enum value in the same transaction
--  that added it, so 008 cannot be pasted together with this file.
--
--  What this does
--  --------------
--  Rebuilds these pages to their specs and creates the ones that are new:
--
--      /about                                         About JMC
--      /local-seo-services                            Local SEO Services
--      /traditional-seo-services                      Traditional SEO Services
--      /monthly-seo-packages                          Monthly SEO Packages
--      /launch-sprints                                Launch Sprints
--      /google-business-profile-optimization          Google Business Profile Optimization
--      /seo-reporting                                 SEO Reporting
--      /industries                                    Industries
--      /industries/home-services-trades               Home Services & Trades
--      /industries/healthcare-wellness                Healthcare & Wellness
--      /industries/hospitality-attractions            Hospitality & Attractions
--      /industries/professional-services              Professional Services
--      /industries/energy-petrochemical               Energy & Petrochemical
--      /industries/maritime-logistics                 Maritime & Logistics
--      /industries/commercial-construction-infrastructure Commercial Construction & Infrastructure
--      /industries/aerospace-aviation                 Aerospace & Aviation
--
--  It also:
--
--    - refreshes the packages, both menus, and the legacy redirects, since
--      /seo-packages is renamed to /monthly-seo-packages and every link to
--      it moved with it;
--    - updates six homepage sections and one on About, which is all that
--      changed on those two pages;
--    - retunes every page title and description to the Build Spec lengths;
--    - unpublishes Real Estate SEO and hides its two tiers, which Page
--      Spec 01 §2 cuts from scope.
--
--  Sections on the rebuilt pages are REPLACED wholesale. Any edit made to
--  one of them in /admin is overwritten. Copy on the homepage and About,
--  outside the sections named above, is left alone, as are articles and
--  enquiries.
--
--  Safe to run more than once.
-- ==========================================================================

begin;
-- ------------------------------------------------------------- pages ----
-- Position is left alone on update: the client may have reordered the page
-- list in /admin, and this file has no business undoing that.
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/about', 'About JMC', 'About JMC | SEO Only, Explained Every Month', 'Jordan Marketing Consultants does one thing: SEO. A League City agency working on local, regional, and industrial search visibility, explained every month.', true, false, false, 6)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/local-seo-services', 'Local SEO Services', 'Local SEO Services | Houston Area', 'Local SEO for Houston-area businesses. Google Business Profile, citations, reviews, local search grid tracking, and a monthly recap of what actually changed.', true, true, false, 1)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/traditional-seo-services', 'Traditional SEO Services', 'Traditional SEO Services | Multi-Market Search', 'SEO for businesses competing across several markets, service lines or competitive search. Strategy, strategic pages, technical monitoring, clear reporting.', true, true, false, 2)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/monthly-seo-packages', 'Monthly SEO Packages', 'Monthly SEO Packages & Pricing | Houston Area', 'SEO pricing published in full. Local packages from $875 a month, Traditional from $2,295, with what each tier includes, what onboarding covers, and the terms.', true, false, false, 4)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/launch-sprints', 'Launch Sprints', 'SEO Launch Sprints | One-Time, 30 Days', 'One-time SEO Launch Sprints from $799, completed within 30 days. A fixed scope, a full audit, foundational optimization, and a 30-day action roadmap at the end.', true, false, false, 5)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/google-business-profile-optimization', 'Google Business Profile Optimization', 'Google Business Profile Optimization | Houston', 'Google Business Profile optimization for Houston-area businesses. Categories, services, citations, posts, reviews and grid tracking, plus a free audit.', true, true, false, 10)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/seo-reporting', 'SEO Reporting', 'SEO Reporting You Can Actually Read', 'How JMC reports SEO progress: a monthly recap that answers what was done, why it was done, what changed, and what comes next. Plus a quarterly project update.', true, false, false, 9)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/industries', 'Industries', 'Industries | Houston Area SEO for Any Sector', 'JMC works across trades, healthcare, hospitality, professional services, energy, maritime, construction and aerospace. The method does not change at all.', true, false, false, 11)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/industries/home-services-trades', 'Home Services & Trades', 'Home Services & Trades SEO | Houston Area', 'SEO for HVAC, roofing, plumbing, electrical and landscaping businesses in the Houston area. Local visibility, profile work, and clear monthly reporting.', true, false, false, 12)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/industries/healthcare-wellness', 'Healthcare & Wellness', 'Healthcare & Wellness SEO | Houston Area', 'SEO for dental, medical, therapy and wellness practices in the Houston area. Local visibility, profile and review support, and reporting you can actually read.', true, false, false, 13)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/industries/hospitality-attractions', 'Hospitality & Attractions', 'Hospitality & Attractions SEO | Houston Area', 'SEO for hotels, restaurants, venues and attractions in the Houston area and beyond. Local and regional visibility, profile work, and clear monthly reporting.', true, false, false, 14)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/industries/professional-services', 'Professional Services', 'Professional Services SEO | Houston Area', 'SEO for legal, accounting, financial and consulting firms in the Houston area. Strategy, content built for how clients search, and clear monthly reporting.', true, false, false, 15)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/industries/energy-petrochemical', 'Energy & Petrochemical', 'Energy & Petrochemical SEO | Houston Area', 'SEO for energy and petrochemical service firms, suppliers and consultancies. Search built around specifications, procurement cycles, and clear reporting.', true, false, false, 16)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/industries/maritime-logistics', 'Maritime & Logistics', 'Maritime & Logistics SEO | Houston Area', 'SEO for port services, freight operators, and marine repair and fabrication firms. Search built around routes, capability, and how logistics buyers search.', true, false, false, 17)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/industries/commercial-construction-infrastructure', 'Commercial Construction & Infrastructure', 'Commercial Construction SEO | Houston Area', 'SEO for commercial contractors, civil and infrastructure firms, and building products suppliers. Search built around project type and qualification work.', true, false, false, 18)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
insert into public.pages (slug, label, seo_title, meta_description, published, is_service, system, position) values ('/industries/aerospace-aviation', 'Aerospace & Aviation', 'Aerospace & Aviation SEO | Houston Area', 'SEO for aerospace manufacturers, MRO and ground service providers, and avionics suppliers. Search built around parts, certification and procurement work.', true, false, false, 19)
on conflict (slug) do update set
  label = excluded.label,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  is_service = excluded.is_service,
  system = excluded.system;
-- The renamed page. Its sections are rebuilt below under the new address,
-- so the old row is removed rather than left behind as a duplicate.
delete from public.pages where slug = '/seo-packages';
-- ---------------------------------------------------------- sections ----
-- Replaced rather than merged: a section dropped by the new spec should
-- disappear here too, not linger as an orphan.
--
-- Each page clears its own sections immediately before re-inserting them,
-- rather than one delete covering all sixteen up front. That keeps every
-- page block self-contained, which is what lets the split files below be
-- run one at a time without a page ever being left with no sections.

-- About JMC
delete from public.sections where page_id = (select id from public.pages where slug = '/about');
insert into public.sections (page_id, key, type, tone, data, position) select id, 'hero', 'heroCentered', NULL, '{"eyebrow":"About","heading":"An SEO Agency That Only Does SEO","body":"Jordan Marketing Consultants used to do everything. In 2022 it stopped, and kept the one service it was genuinely good at. Everything on this site is search visibility, explained in plain language every month."}'::jsonb, 0 from public.pages where slug = '/about';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'narrowing', 'featureSplit', 'surface', '{"eyebrow":"2022","heading":"The Narrowing","body":"JMC used to be full service, with web design as the main business. The websites were not good enough, and the process from onboarding to launch was difficult for everyone involved.\n\nThe turn came in a professional networking group. SEO was the only part of the work worth talking about. Over time it became the part worth doing.\n\nIn 2022 the agency stopped doing everything and started doing one thing.","portrait":{"src":"/images/wendell-jordan.png","alt":"Wendell Jordan","shape":"circle"},"groups":[]}'::jsonb, 1 from public.pages where slug = '/about';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'scope', 'cardGrid', 'white', '{"eyebrow":"Scope","heading":"What JMC Does, and What It Doesn''t","body":"The boundary is the same on every engagement, and it is easier to point at than to describe.","columns":2,"cards":[{"title":"What JMC Does","icon":"search","items":["Local SEO","Traditional SEO","Google Business Profile","Technical monitoring","Strategic SEO pages and written content","Reporting and monthly recaps"]},{"title":"What JMC Doesn''t Do","icon":"layers","items":["Paid ads","Web design","Social media posts","Link building and link placements"]}]}'::jsonb, 2 from public.pages where slug = '/about';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'how-jmc-works', 'cardGrid', 'surface', '{"variant":"compact","eyebrow":"How JMC Works","heading":"You Work With the People Doing the Work","columns":3,"cards":[{"title":"A Small Senior Team","icon":"users","body":"No account-manager layer, and no handoff to juniors once the contract is signed."},{"title":"Direct Access","icon":"message-square","body":"The person who answers a question about your campaign is the person running it."},{"title":"A TREC-Approved Instructor","icon":"shield-check","body":"Wendell Jordan teaches a TREC-approved continuing education class for Texas real estate licensees."}]}'::jsonb, 3 from public.pages where slug = '/about';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'league-city', 'fullWidthText', 'white', '{"eyebrow":"Based in League City","heading":"League City, Texas","body":"JMC is based in League City and works with businesses across the Houston area and beyond. Being nearby helps with understanding a market. It has never been a limit on who the work is for."}'::jsonb, 4 from public.pages where slug = '/about';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'monthly-recap', 'reportingBlock', 'surface', '{"eyebrow":"Reporting","heading":"The Monthly Recap","body":"The same four questions every month, on every engagement.","did":"The specific work completed that month, named task by task.","why":"Why that work was the priority ahead of everything else in the queue.","changed":"What moved, reported honestly, including the months where little did.","next":"Next month''s priorities, so nothing in the following recap is a surprise.","cta":{"label":"See How JMC Reports SEO Progress","href":"/seo-reporting"}}'::jsonb, 5 from public.pages where slug = '/about';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'final-cta', 'finalCta', NULL, '{"heading":"Start With a Look at Where Your Visibility Stands","body":"A Visibility Review is the first step on every engagement, and it is useful even when it ends in advice rather than a contract.","primaryCta":{"label":"Request a Visibility Review","href":"/contact"},"secondaryCta":{"label":"View Monthly SEO Packages","href":"/monthly-seo-packages"}}'::jsonb, 6 from public.pages where slug = '/about';
-- Local SEO Services
delete from public.sections where page_id = (select id from public.pages where slug = '/local-seo-services');
insert into public.sections (page_id, key, type, tone, data, position) select id, 'hero', 'heroSplit', NULL, '{"eyebrow":"Local SEO Services","heading":"Get Found Where Your Customers Are Looking","body":"Local SEO is the work of appearing when somebody nearby searches for what you do. It runs across your Google Business Profile, your listings, your reviews and your service pages, and it is measured across your whole service area rather than as one number.","primaryCta":{"label":"Request a Visibility Review","href":"/contact"},"secondaryCta":{"label":"View Local SEO Packages","href":"/monthly-seo-packages#local"},"showcase":[{"kind":"coverage","label":"Where you appear","title":"Local Surfaces","items":["Google Search results","Google Maps and the map pack","Service-area searches","The profile panel itself"]},{"kind":"channels","label":"Three tiers","title":"Sized by Area","items":["Neighborhood","Citywide","Metro"]}]}'::jsonb, 0 from public.pages where slug = '/local-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'audience-fit', 'cardGrid', 'surface', '{"variant":"cards","columns":4,"eyebrow":"Is This You","heading":"Who Local SEO Is For","body":"The first three sort by how customers reach you. The fourth is about scale, so a practice with four offices is both the third and the fourth.","cards":[{"title":"Storefront","icon":"storefront","body":"Customers come to you, and being findable on a map is most of the battle. Shops, showrooms, studios, gyms."},{"title":"Service Area","icon":"map-pin","body":"You travel to the customer, so you are ranked against an area rather than an address. Trades, contractors, mobile services."},{"title":"Appointment-Based","icon":"calendar","body":"Customers book time with you, and they compare two or three options before doing it. Practices, clinics, salons, consultants."},{"title":"Multi-Location","icon":"building","body":"Several locations competing across the same broad area. Each one needs its own profile, its own citations and its own tracking, or they compete with each other."}]}'::jsonb, 1 from public.pages where slug = '/local-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'includes', 'cardGrid', 'white', '{"variant":"cards","columns":3,"eyebrow":"What You Get","heading":"What Local SEO Includes","body":"Every package includes all six. Tiers differ by volume, not by what is included.","cards":[{"title":"SEO Strategy & Roadmap","icon":"compass","body":"A plan for the next quarter rather than a list of tasks, with the reasoning behind the order it runs in."},{"title":"Content & On-Page Optimization","icon":"pencil","body":"Service pages, titles, descriptions and on-page structure written for how people in your area actually search."},{"title":"Technical Monitoring","icon":"gauge","body":"Crawling, indexing and site health watched month to month, so a problem is found before it costs you visibility."},{"title":"Detailed Monthly Reporting","icon":"bar-chart","body":"What was tracked, what moved and what did not, in language that does not need translating."},{"title":"Monthly Project Recap (via Loom or video call)","icon":"message-square","body":"A person walking through the month rather than a file dropped into an inbox, with room to ask questions."},{"title":"Review Management","icon":"star","body":"Review requests sent to real customers and replies written to what comes back, positive and negative alike."}]}'::jsonb, 2 from public.pages where slug = '/local-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'visibility-system', 'cardGrid', 'surface', '{"variant":"cards","columns":5,"eyebrow":"The System","heading":"The Local Visibility System","body":"Five parts, worked together. Any one of them on its own tends to stall.","cards":[{"title":"Google Business Profile","icon":"storefront","body":"Categories, services, information, photos and posts. For many local searches the profile is what is being ranked.","href":"/google-business-profile-optimization"},{"title":"Citations & NAP Consistency","icon":"shield-check","body":"One standard for your name, address and phone number, applied across the listings that currently disagree with each other."},{"title":"Reviews","icon":"star","body":"Requests to real customers and replies to what arrives. Nothing fabricated, nothing incentivised."},{"title":"Local Search Grid Tracking","icon":"map-pin","body":"Visibility measured across a grid of points in your service area rather than as one blended rank, so you can see where you are strong and where you are not.","visual":"searchGrid"},{"title":"Strategic SEO Pages","icon":"file-text","body":"Pages built for the services and areas worth competing for, rather than one page trying to hold all of them."}]}'::jsonb, 3 from public.pages where slug = '/local-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'houston', 'fullWidthText', 'white', '{"eyebrow":"Where JMC Is","heading":"Based in League City, Working Across the Houston Area","body":"JMC is a Houston-area agency and most of its clients are within reach of it. Local SEO is not limited to the Houston area, though, and the work is the same wherever a business competes for customers in a defined patch."}'::jsonb, 4 from public.pages where slug = '/local-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'packages', 'pricingCards', 'surface', '{"eyebrow":"Pricing","heading":"Local SEO Packages","body":"Three tiers, sized by how much ground you are competing for. Every tier includes all six of the deliverables above.","packageIds":["local-neighborhood","local-citywide","local-metro"]}'::jsonb, 5 from public.pages where slug = '/local-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'custom-scope', 'fullWidthText', 'surface', '{"heading":"Working With Something Bigger?","body":"If the scope is bigger or more involved than what is here, JMC will look at it and put together a quote. However many locations are involved, a business competing in local results is still a Local engagement.","cta":{"label":"Request a Visibility Review","href":"/contact"}}'::jsonb, 6 from public.pages where slug = '/local-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'sprint-callout', 'calloutBanner', 'surface', '{"heading":"Or Start With a Launch Sprint","body":"The Neighborhood Launch Sprint is $799, one-time, completed within 30 days. It builds the local foundation and finishes with a 30-day roadmap. Begin monthly service within 30 days of the sprint finishing and the onboarding fee on any Local package is waived, up to $649.","primaryCta":{"label":"View Launch Sprints","href":"/launch-sprints"},"secondaryCta":{"label":"View Local SEO Packages","href":"/monthly-seo-packages#local"}}'::jsonb, 7 from public.pages where slug = '/local-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'monthly-recap', 'reportingBlock', 'white', '{"eyebrow":"Reporting","heading":"The Monthly Recap","body":"Four questions, every month, in the same order.","did":"The pages rewritten, the listings corrected, the posts published, named individually.","why":"Why that work was the priority ahead of everything else in the queue.","changed":"Grid visibility across the service area, compared with last month, including the quiet ones.","next":"What is queued for the coming month, written down before it starts.","cta":{"label":"See How JMC Reports SEO Progress","href":"/seo-reporting"}}'::jsonb, 8 from public.pages where slug = '/local-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'faq', 'faq', 'surface', '{"eyebrow":"Questions","heading":"Local SEO Questions","items":[{"question":"How long before there are results?","answer":"Local tends to move faster than national search because the competing field is smaller, and profile or listing corrections can show within weeks. Ranking movement across a service area is a longer arc, usually a few months before the shape of it is clear. Nobody can honestly give you a date, and the recap tells you which stage the work is at each month."},{"question":"Is there a contract?","answer":"Yes. Twelve months, then month to month, with 30 days written notice to end it. The term exists because the work compounds and a three-month engagement cannot show what a twelve-month one can."},{"question":"What does the onboarding fee cover?","answer":"The audit, tracking setup, the foundational on-page work and the local visibility setup: profile, categories, services, citations and the grid baseline. It is the work that has to happen once before the monthly work means anything."},{"question":"How is this different from Traditional SEO?","answer":"Local SEO is for businesses competing for customers in a defined area, however many locations they run in it. Traditional SEO is for businesses competing across multiple markets, multiple service lines, or genuinely competitive search. It is a difference in reach, not in size."},{"question":"Do you guarantee rankings?","answer":"No, and anyone who does is guessing. What is guaranteed is the scope, the reporting, and knowing exactly what was done and why."},{"question":"What is local search grid tracking?","answer":"Instead of checking your rank from one point, it checks from a grid of points across your service area. That matters because local results change street by street: you can be first near your own address and invisible four miles away, and one blended number hides that completely."},{"question":"What if the business is not in Houston?","answer":"Local SEO is not limited to the Houston area. JMC is based in League City and most clients are nearby, but the work is the same for a business competing in a defined area anywhere."}],"cta":{"label":"Request a Visibility Review","href":"/contact"}}'::jsonb, 9 from public.pages where slug = '/local-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'final-cta', 'finalCta', NULL, '{"heading":"Start With a Visibility Review","body":"Where you appear across your service area today, what is holding it back, and which of those gaps is worth closing first.","primaryCta":{"label":"Request a Visibility Review","href":"/contact"},"secondaryCta":{"label":"View Local SEO Packages","href":"/monthly-seo-packages#local"}}'::jsonb, 10 from public.pages where slug = '/local-seo-services';
-- Traditional SEO Services
delete from public.sections where page_id = (select id from public.pages where slug = '/traditional-seo-services');
insert into public.sections (page_id, key, type, tone, data, position) select id, 'hero', 'heroSplit', NULL, '{"eyebrow":"Traditional SEO Services","heading":"Built for Businesses Competing Beyond One Market","body":"When buyers are spread across cities, regions or the whole country, the work changes shape. Traditional SEO is strategy, strategic pages, technical monitoring and authority, measured against a competitive field rather than a service area.","primaryCta":{"label":"Request a Visibility Review","href":"/contact"},"secondaryCta":{"label":"View Traditional SEO Packages","href":"/monthly-seo-packages#traditional"},"showcase":[{"kind":"report","label":"What gets worked","title":"The Search Footprint","items":["Tracked keywords across markets","Tracked competitors","Strategic SEO pages","Technical monitoring"]},{"kind":"channels","label":"Three tiers","title":"Sized by Reach","items":["Regional","National","National+"]}]}'::jsonb, 0 from public.pages where slug = '/traditional-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'audience-fit', 'cardGrid', 'surface', '{"variant":"cards","columns":4,"eyebrow":"Is This You","heading":"Who Traditional SEO Is For","body":"All four describe reach rather than size. One address selling nationally belongs here; seven addresses inside one metro does not.","cards":[{"title":"Multiple Markets","icon":"globe","body":"The business sells into more than one city, region or state, and the same search returns a different set of competitors in each of them."},{"title":"Multiple Service Lines","icon":"layers","body":"Several distinct offerings, each with its own buyers and its own search language. One page trying to hold all of them ranks for none of them."},{"title":"Competitive Search","icon":"target","body":"High-value searches with established competitors already sitting on them, where progress starts on the specific terms rather than the broadest one."},{"title":"Longer Buying Cycles","icon":"clipboard-check","body":"Procurement, requests for quotes and research-heavy purchases rather than a phone call. Several people search for different things before one decision is made."}]}'::jsonb, 1 from public.pages where slug = '/traditional-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'includes', 'cardGrid', 'white', '{"variant":"cards","columns":5,"eyebrow":"What You Get","heading":"What Traditional SEO Includes","body":"Every package includes all five. Tiers differ by scale, not by what is included.","cards":[{"title":"SEO Strategy & Roadmap","icon":"compass","body":"A plan for the quarter with the reasoning behind the order, rather than a list of tasks arriving one at a time."},{"title":"Strategic SEO Pages","icon":"file-text","body":"Pages built for specific searches worth competing for, produced to a schedule rather than when there is time."},{"title":"Technical Monitoring","icon":"gauge","body":"Crawling, indexing and site health watched month to month, with issues flagged as they appear rather than found in an annual audit."},{"title":"Reporting & Monthly Recap","icon":"bar-chart","body":"Dashboard reporting alongside a recap delivered by Loom or a video call, so somebody explains it rather than sending it."},{"title":"Authority-Building Recommendations","icon":"network","body":"What would strengthen the site''s authority and why, as advice you can act on. Recommendations, not placements bought on your behalf."}]}'::jsonb, 2 from public.pages where slug = '/traditional-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'industries', 'cardGrid', 'surface', '{"variant":"cards","columns":4,"eyebrow":"Common Fits","heading":"Industries That Usually Land Here","body":"Businesses in other industries fit here too when they compete across several markets. Reach matters more than sector.","cards":[{"title":"Energy & Petrochemical","icon":"lightning","body":"Suppliers and service firms found by specification, standard and part number rather than by name.","href":"/industries/energy-petrochemical"},{"title":"Maritime & Logistics","icon":"ship","body":"Port, freight and marine businesses searched by route, mode and capability.","href":"/industries/maritime-logistics"},{"title":"Commercial Construction","icon":"hard-hat","body":"Contractors, civil firms and suppliers qualified on project type long before any bid conversation.","href":"/industries/commercial-construction-infrastructure"},{"title":"Aerospace & Aviation","icon":"plane","body":"Manufacturers and service providers where certification is the first filter a buyer applies.","href":"/industries/aerospace-aviation"}],"cta":{"label":"Explore Industries","href":"/industries"}}'::jsonb, 3 from public.pages where slug = '/traditional-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'footprint', 'featureSplit', 'white', '{"align":"left","eyebrow":"Coverage","heading":"Coverage That Scales With the Business","body":"The three tiers are not different services. They are the same work applied to a wider footprint: more keywords tracked, more competitors watched, and more strategic pages produced each month.\n\nWhich one fits comes out of the visibility review rather than out of a headcount. A business competing in two states against four serious competitors is a different problem from one competing nationally against ten, and the coverage is what has to match.","tableHeadings":["","Regional","National","National+"],"tableRows":[{"cells":["Tracked keywords","Up to 60","Up to 75","Up to 90"]},{"cells":["Tracked competitors","Up to 5","Up to 8","Up to 10"]},{"cells":["Strategic pages a month","Up to 2","Up to 3","Up to 4"]}],"groups":[]}'::jsonb, 4 from public.pages where slug = '/traditional-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'content-technical', 'cardGrid', 'surface', '{"variant":"split","columns":3,"eyebrow":"In Detail","heading":"Content and Technical Work, Explained","body":"Three items from the list above that get misread more often than the rest.","cards":[{"title":"Strategic SEO Pages","icon":"file-text","body":"Pages built for a specific search that a buyer actually makes, with the depth to answer it. They are not blog posts: a blog post is published and left, a strategic page is built to rank for something and maintained until it does."},{"title":"Technical Monitoring","icon":"gauge","body":"Ongoing issue flagging rather than a one-time audit. Sites break quietly, and a redirect chain or a noindex tag introduced during a redesign can undo months of work before anyone notices."},{"title":"Authority-Building Recommendations","icon":"network","body":"JMC advises on authority building and does not sell link placements. What you get is what would genuinely strengthen the site''s standing and why, including the parts you are best placed to do yourself. Bought links are a risk taken with your domain, not with the agency''s."}]}'::jsonb, 5 from public.pages where slug = '/traditional-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'packages', 'pricingCards', 'white', '{"eyebrow":"Pricing","heading":"Traditional SEO Packages","body":"Three tiers, sized by footprint. Every tier includes all five deliverables above.","packageIds":["traditional-regional","traditional-national","traditional-national-plus"]}'::jsonb, 6 from public.pages where slug = '/traditional-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'custom-scope', 'fullWidthText', 'white', '{"heading":"Working With Something Bigger?","body":"If the scope is bigger or more involved than what is here, JMC will look at it and put together a quote.","cta":{"label":"Request a Visibility Review","href":"/contact"}}'::jsonb, 7 from public.pages where slug = '/traditional-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'sprint-callout', 'waiverMatrix', 'white', '{"eyebrow":"Another Way In","heading":"Or Start With a Launch Sprint","body":"Each sprint is one-time, completed within 30 days, and finishes with a 30-day roadmap. Begin monthly service within 30 days of the sprint completing and the onboarding fee on the matching package is waived.","sprintHeading":"Sprint","priceHeading":"One-time","waivesHeading":"Waives onboarding on","rows":[{"sprint":"Regional Launch Sprint","price":"$1,495","waives":"Regional"},{"sprint":"National Launch Sprint","price":"$2,295","waives":"National or National+"}],"condition":"Monthly service must begin within 30 calendar days of sprint completion.","cta":{"label":"View Launch Sprints","href":"/launch-sprints"}}'::jsonb, 8 from public.pages where slug = '/traditional-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'monthly-recap', 'reportingBlock', 'surface', '{"eyebrow":"Reporting","heading":"The Monthly Recap","body":"Four questions, every month, in the same order.","did":"The pages built, the technical issues fixed, the recommendations made, named individually.","why":"Why that work was the priority ahead of everything else in the queue.","changed":"Movement across the tracked keyword and competitor set, including the months where little moved.","next":"What is queued for the coming month, written down before it starts.","cta":{"label":"See How JMC Reports SEO Progress","href":"/seo-reporting"}}'::jsonb, 9 from public.pages where slug = '/traditional-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'faq', 'faq', 'white', '{"eyebrow":"Questions","heading":"Traditional SEO Questions","items":[{"question":"How long before there are results?","answer":"Longer than local, because the competing field is bigger and the buying cycles behind it are slower. Technical fixes can show within weeks, but movement on competitive terms is usually a matter of months, and it starts on the specific searches before the broad ones. The recap says which stage the work is at rather than implying steady progress."},{"question":"Is there a contract?","answer":"Yes. Twelve months, then month to month, with 30 days written notice to end it. The term exists because this work compounds and a short engagement cannot show what a full one can."},{"question":"What does the onboarding fee cover?","answer":"The technical and on-page audit, tracking setup across markets, competitor analysis, and the foundational fixes that have to happen once before the monthly work means anything."},{"question":"Do you build links?","answer":"No. JMC advises on authority building and does not sell or place links. Bought placements are a risk taken with your domain rather than with the agency''s, and the recommendations you get are the ones JMC would follow on its own domain."},{"question":"How is this different from Local SEO?","answer":"Local SEO is for businesses competing for customers in a defined area, however many locations they run in it. Traditional SEO is for businesses competing across markets, service lines or genuinely competitive search. It is a difference in reach, not in size, and a large single-area business is still a Local engagement."},{"question":"Do you guarantee rankings?","answer":"No, and anyone who does is guessing. What is guaranteed is the scope, the reporting, and knowing exactly what was done and why."}],"cta":{"label":"Request a Visibility Review","href":"/contact"}}'::jsonb, 10 from public.pages where slug = '/traditional-seo-services';
insert into public.sections (page_id, key, type, tone, data, position) select id, 'final-cta', 'finalCta', NULL, '{"heading":"Start With a Visibility Review","body":"Where the business appears across its markets today, who is holding the space, and which gap is worth closing first.","primaryCta":{"label":"Request a Visibility Review","href":"/contact"},"secondaryCta":{"label":"View Traditional SEO Packages","href":"/monthly-seo-packages#traditional"}}'::jsonb, 11 from public.pages where slug = '/traditional-seo-services';

commit;
