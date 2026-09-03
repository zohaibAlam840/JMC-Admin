-- ============================================================================
--  JMC — block types for Page Specs 02 to 09
--
--  Run after 007_lead_tier.sql. Safe to run more than once.
--
--  Adds the four section types the new page specs need:
--
--    fourQuestions  Page Spec 05 §2. The four recap headings argued at length
--                   rather than listed. Deliberately not the compact recap
--                   block, which every other page uses.
--    recapExample   Page Spec 05 §3. A worked example of a monthly recap,
--                   drawn in HTML and carrying no figures at all.
--    auditForm      Page Spec 04 §4. The Free Visibility Audit band.
--    waiverMatrix   Page Specs 06 §7 and 07 §6. The onboarding-fee waiver,
--                   read from either the package side or the sprint side.
--
--  Postgres will not let a new enum value be *used* in the same transaction
--  that added it, so this file must run on its own before any insert that
--  references one of these types.
-- ============================================================================

alter type section_type add value if not exists 'fourQuestions';
alter type section_type add value if not exists 'recapExample';
alter type section_type add value if not exists 'auditForm';
alter type section_type add value if not exists 'waiverMatrix';
