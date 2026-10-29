-- ======================================================================
--  JMC — client-audit fixes that should preserve the live page structure
--
--  These pages already contain valid dashboard edits or section structures.
--  Update only the audited fields instead of deleting and rebuilding them.
-- ======================================================================

begin;

-- Traditional SEO: correct the fourth industry label without unmerging or
-- rebuilding the live 12-section page.
update public.sections
set data = jsonb_set(
  data,
  '{cards,2,title}',
  to_jsonb('Commercial Construction & Infrastructure'::text),
  true
)
where key = 'industries'
  and page_id = (
    select id from public.pages where slug = '/traditional-seo-services'
  );

-- Traditional SEO: retain the existing six FAQs, including the guarantees
-- answer, and add the missing seventh question once.
update public.sections
set data = jsonb_set(
  data,
  '{items}',
  coalesce(data -> 'items', '[]'::jsonb) || jsonb_build_array(
    jsonb_build_object(
      'question', 'What are Strategic SEO Pages?',
      'answer', 'Strategic SEO Pages are written for specific searches worth competing for. Each page has one clear role in the roadmap and is planned, written, and optimized as part of the monthly scope.'
    )
  ),
  true
)
where key = 'faq'
  and page_id = (
    select id from public.pages where slug = '/traditional-seo-services'
  )
  and not exists (
    select 1
    from jsonb_array_elements(coalesce(data -> 'items', '[]'::jsonb)) as item
    where item ->> 'question' = 'What are Strategic SEO Pages?'
  );

-- Monthly Packages: neutral middle-tier emphasis and US spelling, while
-- preserving the live single onboarding section.
update public.packages
set featured = (id = 'traditional-national')
where id in (
  'traditional-regional',
  'traditional-national',
  'traditional-national-plus'
);

update public.sections
set data = replace(data::text, 'prioritise', 'prioritize')::jsonb
where key = 'faq'
  and data::text like '%prioritise%'
  and page_id = (
    select id from public.pages where slug = '/monthly-seo-packages'
  );

-- Launch Sprints: the audited US-spelling correction only.
update public.sections
set data = replace(data::text, 'itemised', 'itemized')::jsonb
where data::text like '%itemised%'
  and page_id = (
    select id from public.pages where slug = '/launch-sprints'
  );

-- About: positive scope labels and the one-sentence League City statement.
update public.sections
set data = jsonb_set(
  jsonb_set(
    jsonb_set(
      data,
      '{heading}',
      to_jsonb('JMC''s SEO Focus'::text),
      true
    ),
    '{cards,0,title}',
    to_jsonb('SEO Work JMC Provides'::text),
    true
  ),
  '{cards,1,title}',
  to_jsonb('Services Outside the SEO Scope'::text),
  true
)
where key = 'scope'
  and page_id = (select id from public.pages where slug = '/about');

update public.sections
set data = jsonb_set(
  data,
  '{body}',
  to_jsonb('JMC is based in League City, Texas.'::text),
  true
)
where key = 'league-city'
  and page_id = (select id from public.pages where slug = '/about');

commit;
