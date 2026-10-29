-- ======================================================================
--  JMC — footer navigation only
--
--  Applies the Decisions Record §4 footer without touching the main menu,
--  page content, packages, redirects, or site settings.
-- ======================================================================

begin;

delete from public.nav_items where location = 'footer';

insert into public.nav_items (id, location, parent_id, label, href, position) values
  ('7a4b573a-dedf-43e4-b389-f4512d6f80c6', 'footer', null, 'SEO Services', '', 0),
  ('0ef717e1-2c3c-44d0-b41c-a7638abca4df', 'footer', '7a4b573a-dedf-43e4-b389-f4512d6f80c6', 'Local SEO Services', '/local-seo-services', 0),
  ('0c3deb65-5807-4608-a4da-489d81b9f908', 'footer', '7a4b573a-dedf-43e4-b389-f4512d6f80c6', 'Traditional SEO Services', '/traditional-seo-services', 1),
  ('5f03001b-594f-446f-b3fc-fed00b53b16e', 'footer', '7a4b573a-dedf-43e4-b389-f4512d6f80c6', 'Google Business Profile Optimization', '/google-business-profile-optimization', 2),
  ('d97b61eb-e3a8-4c97-90ff-2ef212c4944e', 'footer', '7a4b573a-dedf-43e4-b389-f4512d6f80c6', 'SEO Reporting', '/seo-reporting', 3),

  ('d0c69d10-e1ff-4fbf-9721-919c6fecdf7f', 'footer', null, 'Industries', '', 1),
  ('6434bf9d-e35d-4175-849f-a6d77ac2dab6', 'footer', 'd0c69d10-e1ff-4fbf-9721-919c6fecdf7f', 'Home Services & Trades', '/industries/home-services-trades', 0),
  ('63a3b110-c23e-488f-907a-15f7966acfa4', 'footer', 'd0c69d10-e1ff-4fbf-9721-919c6fecdf7f', 'Healthcare & Wellness', '/industries/healthcare-wellness', 1),
  ('e1f1794e-1e59-48ef-98b5-0cacba7cb86b', 'footer', 'd0c69d10-e1ff-4fbf-9721-919c6fecdf7f', 'Hospitality & Attractions', '/industries/hospitality-attractions', 2),
  ('3e0c3dd3-b77f-4f74-aad8-05b8ca368d82', 'footer', 'd0c69d10-e1ff-4fbf-9721-919c6fecdf7f', 'Professional Services', '/industries/professional-services', 3),
  ('57fd6327-4d94-454a-8601-b815f4d7cd51', 'footer', 'd0c69d10-e1ff-4fbf-9721-919c6fecdf7f', 'Energy & Petrochemical', '/industries/energy-petrochemical', 4),
  ('09de6221-41b1-4024-a4ba-e384c6e500c8', 'footer', 'd0c69d10-e1ff-4fbf-9721-919c6fecdf7f', 'Maritime & Logistics', '/industries/maritime-logistics', 5),
  ('effad9a5-4d4b-4ba7-9ac4-bcc69789adb5', 'footer', 'd0c69d10-e1ff-4fbf-9721-919c6fecdf7f', 'Commercial Construction & Infrastructure', '/industries/commercial-construction-infrastructure', 6),
  ('bd13a547-6620-4dbc-a405-6da60c2f5ad6', 'footer', 'd0c69d10-e1ff-4fbf-9721-919c6fecdf7f', 'Aerospace & Aviation', '/industries/aerospace-aviation', 7),

  ('c86702a5-991b-4a58-bf8b-3ea8e0ddde34', 'footer', null, 'Company', '', 2),
  ('7e211be1-1557-41df-9a20-18d849ddb479', 'footer', 'c86702a5-991b-4a58-bf8b-3ea8e0ddde34', 'About', '/about', 0),
  ('6ab80665-bac2-4597-823c-b0261efe699b', 'footer', 'c86702a5-991b-4a58-bf8b-3ea8e0ddde34', 'Contact', '/contact', 1),
  ('cc140996-b902-4084-afee-080a6cf27c20', 'footer', 'c86702a5-991b-4a58-bf8b-3ea8e0ddde34', 'Request a Visibility Review', '/contact', 2),
  ('e0a242ee-b0cc-403d-ad02-75358fdbc6c8', 'footer', 'c86702a5-991b-4a58-bf8b-3ea8e0ddde34', 'wendell@jordanmarketingconsultants.com', 'mailto:wendell@jordanmarketingconsultants.com', 3),
  ('98165890-7115-4b19-9d2c-6b5c7ae2a197', 'footer', 'c86702a5-991b-4a58-bf8b-3ea8e0ddde34', '(281) 989-0468', 'tel:+12819890468', 4);

commit;
