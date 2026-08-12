import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  adminButton,
  Notice,
  PageHeader,
  Panel,
  Pill,
} from "@/components/admin/ui";
import { getSettings, listPages, listPosts, type AdminPost } from "@/lib/admin/data";
import { site as fileSite } from "@/content/site";

export const metadata = { title: "Search engine sitemap" };
export const dynamic = "force-dynamic";

/**
 * A readable view of /sitemap.xml.
 *
 * The sitemap itself is generated from the database on request, so there is
 * nothing here to edit. What this screen is for is answering the two questions
 * that actually come up — "is my new page in there?" and, more often, "why
 * isn't it?" — without anyone having to read XML.
 */

type Row = {
  path: string;
  label: string;
  kind: "Home" | "Page" | "Article" | "Fixed";
  lastModified: string | null;
  priority: number;
};

type Excluded = {
  path: string;
  label: string;
  reason: string;
  editHref?: string;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isScheduled(post: AdminPost) {
  return (
    post.published &&
    post.published_at !== null &&
    new Date(post.published_at) > new Date()
  );
}

export default async function SitemapScreen() {
  const [pages, settings] = await Promise.all([listPages(), getSettings()]);

  // Articles arrive in a later migration, so a database that has only run
  // schema.sql legitimately has no posts table.
  let posts: AdminPost[] = [];
  let postsMissing = false;
  try {
    posts = await listPosts();
  } catch {
    postsMissing = true;
  }

  const baseUrl = settings?.url || fileSite.url;

  /* ------------------------------------------------------------ included -- */
  const rows: Row[] = [];

  for (const page of pages) {
    if (!page.published) continue;
    rows.push({
      path: page.slug,
      label: page.label,
      kind: page.slug === "/" ? "Home" : "Page",
      lastModified: page.updated_at,
      priority: page.slug === "/" ? 1 : 0.8,
    });
  }

  rows.push({
    path: "/contact",
    label: "Request a Visibility Review",
    kind: "Fixed",
    lastModified: null,
    priority: 0.7,
  });

  for (const post of posts) {
    if (!post.published || isScheduled(post)) continue;
    rows.push({
      path: `/resources/${post.slug}`,
      label: post.title,
      kind: "Article",
      lastModified: post.updated_at,
      priority: 0.6,
    });
  }

  /* ------------------------------------------------------------ excluded -- */
  const excluded: Excluded[] = [];

  for (const page of pages) {
    if (page.published) continue;
    excluded.push({
      path: page.slug,
      label: page.label,
      reason: "Not published",
      editHref: `/admin/pages/${page.id}`,
    });
  }

  for (const post of posts) {
    if (post.published && !isScheduled(post)) continue;
    excluded.push({
      path: `/resources/${post.slug}`,
      label: post.title,
      reason: isScheduled(post)
        ? `Scheduled for ${formatDate(post.published_at)}`
        : "Draft",
      editHref: `/admin/articles/${post.id}`,
    });
  }

  excluded.push({
    path: "/thank-you",
    label: "Thank you",
    reason: "Left out on purpose — it is marked noindex",
  });
  excluded.push({
    path: "/admin",
    label: "This admin",
    reason: "Blocked in robots.txt and marked noindex",
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Search engine sitemap"
        description="The list of addresses handed to Google and Bing. It is built from your pages and articles every time it is requested — there is nothing here to publish."
        actions={
          <>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className={adminButton.secondary}
            >
              Open the XML <ArrowUpRight size={13} />
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className={adminButton.ghost}
            >
              robots.txt <ArrowUpRight size={13} />
            </a>
          </>
        }
      />

      {postsMissing ? (
        <Notice tone="warning">
          Articles are not set up yet, so none appear below. Run{" "}
          <code>supabase/migrations/002_posts.sql</code> in the Supabase SQL
          editor.
        </Notice>
      ) : null}

      <Notice>
        Publishing a page or article adds it here immediately, and unpublishing
        removes it. Submit <code>{baseUrl}/sitemap.xml</code> once in Google
        Search Console and it will be re-read on its own from then on.
      </Notice>

      <Panel className="p-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-5 py-4">
          <h2 className="font-display text-[1.05rem] uppercase leading-none text-ink-strong">
            In the sitemap
          </h2>
          <span className="text-[0.8rem] text-subtle">
            {rows.length} address{rows.length === 1 ? "" : "es"}
          </span>
        </div>

        {/* Scrolls inside itself — the page body must never scroll sideways. */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-[0.85rem]">
            <thead>
              <tr className="border-b border-line text-[0.72rem] uppercase tracking-[0.08em] text-subtle">
                <th className="px-5 py-2.5 font-semibold">Address</th>
                <th className="px-5 py-2.5 font-semibold">What it is</th>
                <th className="px-5 py-2.5 font-semibold">Last updated</th>
                <th className="px-5 py-2.5 text-right font-semibold">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => (
                <tr key={row.path}>
                  <td className="px-5 py-3">
                    <a
                      href={row.path}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-ink-strong hover:text-teal-ink"
                    >
                      {row.path}
                    </a>
                    <span className="block truncate text-[0.78rem] text-subtle">
                      {row.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Pill tone={row.kind === "Article" ? "live" : "neutral"}>
                      {row.kind}
                    </Pill>
                  </td>
                  <td className="px-5 py-3 text-subtle tabular-nums">
                    {formatDate(row.lastModified)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-subtle">
                    {row.priority.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="p-0">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-display text-[1.05rem] uppercase leading-none text-ink-strong">
            Left out
          </h2>
          <p className="mt-1.5 text-[0.8rem] text-subtle">
            Search engines are not being told about these. If something here
            should be public, publish it.
          </p>
        </div>

        <ul className="divide-y divide-line">
          {excluded.map((item) => (
            <li
              key={item.path}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-[0.85rem]"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-ink-strong">
                  {item.path}
                </span>
                <span className="block truncate text-[0.78rem] text-subtle">
                  {item.label}
                </span>
              </span>
              <span className="shrink-0 text-[0.78rem] text-subtle">
                {item.reason}
              </span>
              {item.editHref ? (
                <Link href={item.editHref} className={adminButton.tiny}>
                  Open
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </Panel>

      <p className="text-[0.8rem] leading-relaxed text-subtle">
        Priority and update frequency are set automatically. Google has said
        publicly that it ignores both, so they are not worth exposing as
        settings — what matters is that a page is published and reachable.
      </p>
    </div>
  );
}
