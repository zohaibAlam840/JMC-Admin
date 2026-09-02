-- ============================================================================
--  JMC — lead tier attribution
--
--  Run any time. Safe to run more than once.
--
--  Pricing card CTAs pass ?tier=neighborhood; Build Spec §13 wants that carried
--  through to the enquiry so it is clear which package produced it.
-- ============================================================================

alter table public.leads add column if not exists tier text;
