-- ============================================================================
--  JMC — timeline section type
--
--  Run after 009_package_positioning.sql. Safe to run more than once.
--
--  Adds the "timeline" section type: dated events on a single rail. Asked for
--  in the client review on 2026-10-12 — a section on About detailing what the
--  agency has become, drawn as a timeline — and distinct from "processSteps",
--  which is the undated stages of an engagement drawn as a route.
--
--  RUN THIS ON ITS OWN, BEFORE the apply script.
--
--  Postgres will not let a new enum value be used by a statement in the same
--  transaction that added it. The apply script inserts timeline sections, so
--  if this line is pasted at the top of that script the whole run fails with
--  "unsafe use of new value of enum type section_type". Run this file, let it
--  finish, then run the apply parts.
-- ============================================================================

alter type section_type add value if not exists 'timeline';
