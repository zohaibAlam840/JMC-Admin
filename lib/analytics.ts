/**
 * Analytics configuration.
 *
 * One value, read from the environment rather than the database, for the same
 * reason the Termageddon keys are (lib/legal.ts): it is deployment
 * configuration, not content, and a client editing it in /admin could silently
 * detach the site from its own reporting.
 *
 * The ID is public by design — it ships to the browser in the tag URL on every
 * page of every GA4 site on the web — so it is a NEXT_PUBLIC_ variable and
 * there is nothing to protect about it.
 *
 * Absent the ID nothing loads: no tag, no consent banner, no cookies. That is
 * the site's current state, and it means the whole analytics layer can sit in
 * the tree unconditionally and cost nothing until Wendell sends the ID.
 */

/** GA4 Measurement ID, in the form G-XXXXXXXXXX. */
export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

/**
 * Guards a common paste error. A Measurement ID (G-) and a Tag/Container ID
 * (GT- or GTM-) are different things and only the first works with the tag
 * this site loads, so a wrong-shaped value is treated as no value rather than
 * silently loading a tag that reports nowhere.
 */
export const analyticsConfigured = /^G-[A-Z0-9]{4,}$/i.test(gaMeasurementId);
