import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from "@/lib/supabase/config";

/**
 * Runs before every page request.
 *
 * Two jobs:
 *  1. Keep the Supabase session cookie fresh, so an admin is not logged out
 *     mid-edit. This has to happen here — a Server Component cannot write
 *     cookies once the response has started streaming.
 *  2. Gate /admin. This is an optimistic check only: it redirects a visitor
 *     with no session to the login screen so they never see a flash of the
 *     dashboard. The real protection is row level security in Postgres plus
 *     requireAdmin() on every admin route.
 *
 * Renamed from middleware.ts — Next 16 calls this convention `proxy`.
 */

/* ------------------------------------------------------------ redirects -- */
/*
 * Legacy URL redirects live in the database so the client can add one without
 * a deploy, which means they have to be resolved at request time. The map is
 * held in module memory and refreshed at most once every five minutes, so this
 * costs one small request per instance per five minutes rather than one per
 * page view.
 */
type RedirectRow = { source: string; destination: string; permanent: boolean };

let redirectCache: Map<string, RedirectRow> | null = null;
let redirectCacheAt = 0;
const REDIRECT_TTL_MS = 5 * 60 * 1000;

async function getRedirects(): Promise<Map<string, RedirectRow>> {
  const now = Date.now();
  if (redirectCache && now - redirectCacheAt < REDIRECT_TTL_MS) {
    return redirectCache;
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/redirects?select=source,destination,permanent`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error(String(res.status));
    const rows = (await res.json()) as RedirectRow[];
    redirectCache = new Map(rows.map((r) => [normalise(r.source), r]));
    redirectCacheAt = now;
  } catch {
    // Keep serving the previous map rather than 500-ing the whole site.
    redirectCache = redirectCache ?? new Map();
    redirectCacheAt = now;
  }

  return redirectCache;
}

/** Trailing slashes and case are not meaningful in the legacy URL inventory. */
function normalise(path: string) {
  const trimmed = path.trim().toLowerCase().replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/* ----------------------------------------------------------------- proxy -- */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!supabaseConfigured) return NextResponse.next();

  // Redirects first — a legacy URL should never reach a route handler.
  if (!pathname.startsWith("/admin")) {
    const hit = (await getRedirects()).get(normalise(pathname));
    if (hit) {
      const url = new URL(hit.destination, request.url);
      return NextResponse.redirect(url, hit.permanent ? 308 : 307);
    }
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // Responses that set auth cookies must never be cached by a CDN.
        for (const [key, val] of Object.entries(headers)) {
          response.headers.set(key, val);
        }
      },
    },
  });

  // Must be awaited before the response is returned, or a refresh that lands
  // late is lost and the next request refreshes again.
  const { data } = await supabase.auth.getUser();

  const isAdminArea =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (isAdminArea && !data.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except Next internals and static assets. Matching image and
     * font requests would refresh the session dozens of times per page load.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|ttf)$).*)",
  ],
};
