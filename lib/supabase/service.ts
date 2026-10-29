import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/**
 * Server-only database client for the public lead boundary.
 *
 * The service key must never use a NEXT_PUBLIC_ prefix. Public visitors can no
 * longer insert directly into `leads`; the two validated Server Actions call a
 * narrow Postgres function through this client instead.
 */
function serviceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

export function leadServiceConfigured(): boolean {
  return Boolean(SUPABASE_URL && serviceRoleKey());
}

export function createSupabaseServiceClient() {
  const key = serviceRoleKey();
  if (!SUPABASE_URL || !key) {
    throw new Error("Lead storage is not configured.");
  }

  return createClient(SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
