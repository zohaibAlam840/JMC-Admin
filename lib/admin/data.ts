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
  term: string | null;
  positioning: string | null;
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

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  author: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  seo_title: string;
  meta_description: string;
  published: boolean;
  published_at: string | null;
  updated_at: string;
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

export async function listPosts(): Promise<AdminPost[]> {
  const supabase = await adminClient();
  const { data } = await supabase
    .from("posts")
    // Drafts have no publish date, so ordering on it alone buries them.
    // updated_at keeps whatever is being worked on at the top.
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: true })
    .order("updated_at", { ascending: false });
  return (data as AdminPost[]) ?? [];
}

export async function getPost(id: string): Promise<AdminPost | null> {
  const supabase = await adminClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as AdminPost | null) ?? null;
}

/** Existing categories, so the editor can offer them instead of free text. */
export async function listPostCategories(): Promise<string[]> {
  const supabase = await adminClient();
  const { data } = await supabase.from("posts").select("category");
  const set = new Set(
    ((data as { category: string }[]) ?? [])
      .map((r) => r.category)
      .filter(Boolean)
  );
  return [...set].sort();
}

export type AdminMedia = {
  id: string;
  path: string;
  url: string;
  alt: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
};

export async function listMedia(): Promise<AdminMedia[]> {
  const supabase = await adminClient();
  const { data } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data as AdminMedia[]) ?? [];
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

  const [pages, packages, leads, newLeads, posts, drafts] = await Promise.all([
    supabase.from("pages").select("id", { count: "exact", head: true }),
    supabase.from("packages").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("published", false),
  ]);

  return {
    pages: pages.count ?? 0,
    packages: packages.count ?? 0,
    leads: leads.count ?? 0,
    newLeads: newLeads.count ?? 0,
    posts: posts.count ?? 0,
    draftPosts: drafts.count ?? 0,
    // The articles table arrives in a later migration than the rest, so it can
    // legitimately be missing on a database that has only run schema.sql.
    postsTableMissing: Boolean(posts.error),
    /**
     * A read error here almost always means the schema has not been created
     * yet, which is a different problem from an empty database.
     */
    schemaMissing: Boolean(pages.error),
    schemaError: pages.error?.message ?? null,
  };
}
