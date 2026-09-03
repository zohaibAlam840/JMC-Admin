-- ============================================================================
--  JMC — package positioning line and term
--
--  Run any time, in the same run as 008 or after it. Safe to run more than
--  once.
--
--  positioning  Page Spec 06 gives every tier a short line under the name
--               (Local Foundation, City-Level Growth, Metro Expansion) so the
--               three read as an arc rather than as three prices.
--
--  term         The commitment as a plain line rather than a badge. Page Spec
--               06 extends it past "12-month term" deliberately: that alone
--               reads as rigid, while "then month to month" is both true and a
--               materially easier thing to accept. Leaving the second half off
--               was making the offer look worse than it is.
-- ============================================================================

alter table public.packages add column if not exists positioning text;
alter table public.packages add column if not exists term text;
