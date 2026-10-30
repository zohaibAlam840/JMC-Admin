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

-- Monthly Packages: keep the hero informational, use the approved positive
-- closing heading, retain neutral middle-tier emphasis, and use US spelling.
-- These field-level updates preserve the live single onboarding section.
update public.sections
set data = data - 'primaryCta' - 'secondaryCta' - 'cta'
where key = 'hero'
  and page_id = (
    select id from public.pages where slug = '/monthly-seo-packages'
  );

update public.sections
set data = jsonb_set(
  data,
  '{heading}',
  to_jsonb('Start With a Visibility Review'::text),
  true
)
where key = 'final-cta'
  and page_id = (
    select id from public.pages where slug = '/monthly-seo-packages'
  );

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

-- Launch Sprints: replace the remaining older comparison-heavy paragraph and
-- apply the audited US-spelling correction without rebuilding the page.
update public.sections
set data = jsonb_set(
  data,
  '{body}',
  to_jsonb(
    $copy$A Launch Sprint is a single piece of SEO work with a start date, an end date, and a list agreed before anything begins. It is not a trial of monthly service, and it is not a discounted version of it.

It brings the foundational work into one defined engagement: the audit, technical and on-page fixes, and the setup that should be in place before ongoing work begins.

The scope and finish date are agreed at the start, so a business can establish the foundation without committing to a year of service.

At the end, the completed work and a written roadmap show what to do next. The roadmap remains useful whether the next step is monthly service, an internal team, or a pause.$copy$::text
  ),
  true
)
where key = 'what-a-sprint-is'
  and page_id = (
    select id from public.pages where slug = '/launch-sprints'
  );

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
