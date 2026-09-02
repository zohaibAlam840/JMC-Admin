-- ============================================================================
--  JMC — Monthly Recap block
--
--  Run after 004_link_stack.sql. Safe to run more than once.
--
--  Adds the "reportingBlock" section type: the four locked reporting cards from
--  Build Spec §12, which replace the five conflicting versions found across the
--  old wireframes.
-- ============================================================================

alter type section_type add value if not exists 'reportingBlock';
