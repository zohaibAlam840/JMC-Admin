/**
 * Supabase connection details, read once and validated.
 *
 * Both values are public by design — the publishable key is meant to ship to
 * the browser and every table is protected by row level security. See
 * supabase/schema.sql for the policies that back that claim.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Whether the site has been pointed at a Supabase project yet.
 *
 * When false the site falls back to the content files in content/, so a
 * missing or misconfigured environment degrades to the launch content rather
 * than to an error page.
 */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
