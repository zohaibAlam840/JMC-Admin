import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from "./config";

/**
 * Cached public reads.
 *
 * The public site talks to PostgREST with plain `fetch` rather than through
 * supabase-js, for one reason: `fetch` is the unit Next's data cache works on,
 * so a page read can be tagged and then invalidated the moment an admin hits
 * Publish. supabase-js issues its own uncacheable requests.
 *
 * Reads use the publishable key, so row level security decides what comes back:
 * unpublished pages and hidden sections are simply not in the response.
 */
export async function restGet<T>(
  path: string,
  { tags, revalidate = 300 }: { tags: string[]; revalidate?: number }
): Promise<T | null> {
  if (!supabaseConfigured) return null;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: "application/json",
      },
      cache: "force-cache",
      next: { tags, revalidate },
    });

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // A database that is unreachable must not take the marketing site down.
    // Callers fall back to the content files in content/.
    return null;
  }
}

/** Cache tags. Kept here so the writers and the readers cannot drift apart. */
export const tags = {
  pages: "pages",
  page: (slug: string) => `page:${slug}`,
  packages: "packages",
  nav: "nav",
  settings: "settings",
  posts: "posts",
  post: (slug: string) => `post:${slug}`,
} as const;
