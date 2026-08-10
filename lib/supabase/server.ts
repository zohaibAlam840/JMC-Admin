import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Request-scoped client that carries the signed-in admin's session.
 *
 * Everything it can do is bounded by row level security, so this is safe to use
 * for admin writes without a service role key: a request from a user who is not
 * in the `admins` table simply writes nothing.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where the response is already
          // being streamed. proxy.ts refreshes the session on every request,
          // so dropping the write here is safe.
        }
      },
    },
  });
}

/** The signed-in user, or null. */
export async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/**
 * Resolves the admin record for the current session.
 *
 * Signing in is not the same as being an admin: an authenticated user with no
 * `admins` row is treated as a stranger. Returns null in both cases.
 */
export async function getAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data } = await supabase
    .from("admins")
    .select("user_id, email, role")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  return data ?? null;
}
