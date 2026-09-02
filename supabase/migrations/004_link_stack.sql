-- ============================================================================
--  JMC — link hub block
--
--  Run after 003_media.sql. Safe to run more than once.
--
--  Adds the "Link hub" section type: the link-in-bio page that replaces
--  linktr.ee, so social profiles point at our own domain.
-- ============================================================================

alter type section_type add value if not exists 'linkStack';
