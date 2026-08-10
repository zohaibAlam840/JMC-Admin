import { adminClient } from "@/lib/admin/guard";

/**
 * Admin reads.
 *
 * These deliberately go through supabase-js rather than the cached REST helper
 * the public site uses: an editor must see unpublished pages and hidden
 * sections, and must never be shown a cached copy of what they just saved.
 */

export type AdminPage = {
  id: string;
  slug: string;
  label: string;
  seo_title: string;
  meta_description: string;
  published: boolean;
  is_service: boolean;
  system: boolean;
  position: number;
  updated_at: string;
};

export type AdminSection = {
  id: string;
  page_id: string;
  key: string;
  type: string;
  tone: "white" | "surface" | null;
  data: Record<string, unknown>;
  position: number;
  visible: boolean;
};

export type AdminPackage = {
  id: string;
  group_key: "local" | "traditional" | "realEstate" | "sprint";
  name: string;
  price: string;
  price_unit: string | null;
  onboarding_fee: string | null;
  timeline: string | null;
  best_fit: string;
  deliverables: string[];
  cta_label: string;
  cta_href: string;
  featured: boolean;
  visible: boolean;
  pricing_pending: boolean;
  position: number;
};

export type AdminNavItem = {
  id: string;
  location: "main" | "footer";
  parent_id: string | null;
  label: string;
  href: string;
  position: number;
};

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website: string | null;
  service: string | null;
  message: string | null;
  page_path: string | null;
  status: "new" | "contacted" | "qualified" | "archived";
  created_at: string;
};

export type AdminRedirect = {
  id: string;
  source: string;
  destination: string;
  permanent: boolean;
};

export async function listPages(): Promise<AdminPage[]> {
  const supabase = await adminClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .order("position", { ascending: true })
    .order("label", { ascending: true });
  return (data as AdminPage[]) ?? [];
}

export async function getPageWithSections(id: string) {
  const supabase = await adminClient();

  const [{ data: page }, { data: sections }] = await Promise.all([
    supabase.from("pages").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("sections")
      .select("*")
      .eq("page_id", id)
      .order("position", { ascending: true }),
  ]);

  return {
    page: (page as AdminPage | null) ?? null,
    sections: (sections as AdminSection[]) ?? [],
  };
}

export async function listPackages(): Promise<AdminPackage[]> {
  const supabase = await adminClient();
  const { data } = await supabase
    .from("packages")
    .select("*")
    .order("position", { ascending: true });
  return (data as AdminPackage[]) ?? [];
}

export async function listNavItems(): Promise<AdminNavItem[]> {
  const supabase = await adminClient();
  const { data } = await supabase
    .from("nav_items")
    .select("*")
    .order("position", { ascending: true });
  return (data as AdminNavItem[]) ?? [];
}

export async function listLeads(): Promise<AdminLead[]> {
  const supabase = await adminClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data as AdminLead[]) ?? [];
}

export async function listRedirects(): Promise<AdminRedirect[]> {
  const supabase = await adminClient();
  const { data } = await supabase
    .from("redirects")
    .select("*")
    .order("source", { ascending: true });
  return (data as AdminRedirect[]) ?? [];
}

export async function getSettings() {
  const supabase = await adminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  return data as Record<string, string> | null;
}

/** Counts for the overview screen, and the "has this been seeded yet" answer. */
export async function getOverview() {
  const supabase = await adminClient();

  const [pages, packages, leads, newLeads] = await Promise.all([
    supabase.from("pages").select("id", { count: "exact", head: true }),
    supabase.from("packages").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  return {
    pages: pages.count ?? 0,
    packages: packages.count ?? 0,
    leads: leads.count ?? 0,
    newLeads: newLeads.count ?? 0,
    /**
     * A read error here almost always means the schema has not been created
     * yet, which is a different problem from an empty database.
     */
    schemaMissing: Boolean(pages.error),
    schemaError: pages.error?.message ?? null,
  };
}
