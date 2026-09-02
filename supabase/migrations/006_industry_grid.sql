-- ============================================================================
--  JMC — bucketed industry grid
--
--  Run after 005_reporting_block.sql. Safe to run more than once.
--
--  Adds the "industryGrid" section type: eight industries in two labelled
--  groups of four, per Page Spec 01 §5. The canonical industry component,
--  reused verbatim on the Traditional SEO page.
-- ============================================================================

alter type section_type add value if not exists 'industryGrid';
