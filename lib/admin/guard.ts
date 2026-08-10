import { redirect } from "next/navigation";
import { createSupabaseServerClient, getAdmin } from "@/lib/supabase/server";

export type AdminRecord = {
  user_id: string;
  email: string;
  role: string;
};

/**
 * Gate for every admin route and every admin write.
 *
 * proxy.ts already bounces signed-out visitors, but that check is optimistic —
 * it trusts a cookie. This one asks Postgres, and it is what actually decides
 * whether the request is allowed to see or change anything.
 */
export async function requireAdmin(): Promise<AdminRecord> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin as AdminRecord;
}

/** Admin-scoped client. All writes go through this, so RLS still applies. */
export async function adminClient() {
  await requireAdmin();
  return createSupabaseServerClient();
}
