import { restGet, tags } from "@/lib/supabase/rest";
import {
  filePages,
  getFilePage,
  servicePageSlugs,
} from "@/content/pages";
import { packages as filePackages } from "@/content/packages";
import {
  footerNav as fileFooterNav,
  mainNav as fileMainNav,
  primaryCta as filePrimaryCta,
  site as fileSite,
} from "@/content/site";
import type {
  NavItem,
  Package,
  Post,
  PostSummary,
  Section,
} from "@/lib/types";

/**
 * The public site's data layer.
 *
 * Every read tries Supabase first and falls back to the approved content files.
 * That fallback is not a nicety — it means the marketing site keeps serving the
 * launch content if the database is unreachable, unseeded, or not configured at
 * all, instead of showing an error page to a prospect.
 */

/* ------------------------------------------------------------------ pages -- */

export type ResolvedPage = {
  slug: string;
  label: string;
  seoTitle: string;
  metaDescription: string;
  isService: boolean;
  sections: Section[];
  /** Where the content came from. Surfaced in /admin, never on the site. */
  source: "db" | "file";
};

type SectionRow = {
  key: string;
  type: Section["type"];
  tone: "white" | "surface" | null;
  data: Record<string, unknown>;
  position: number;
  visible: boolean;
};

type PageRow = {
  slug: string;
  label: string;
  seo_title: string;
  meta_description: string;
  is_service: boolean;
  published: boolean;
  sections: SectionRow[];
};

/**
 * Rebuilds a Section from its row. The database splits out the three fields
 * every section shares; everything type-specific rides in `data`.
 */
function toSection(row: SectionRow): Section {
  return {
    ...(row.data as object),
    id: row.key,
    type: row.type,
    ...(row.tone ? { tone: row.tone } : {}),
  } as Section;
}

const PAGE_SELECT =
  "slug,label,seo_title,meta_description,is_service,published," +
  "sections(key,type,tone,data,position,visible)";

function fromFile(slug: string): ResolvedPage | null {
  const page = getFilePage(slug);
  if (!page) return null;
  return {
    slug: page.slug,
    label: page.label,
    seoTitle: page.seoTitle,
    metaDescription: page.metaDescription,
    isService: servicePageSlugs.has(page.slug),
    sections: page.sections,
    source: "file",
  };
}

export async function getPage(slug: string): Promise<ResolvedPage | null> {
  const rows = await restGet<PageRow[]>(
    `pages?slug=eq.${encodeURIComponent(slug)}&select=${PAGE_SELECT}` +
      `&sections.order=position.asc&limit=1`,
    { tags: [tags.pages, tags.page(slug)] }
  );

  const row = rows?.[0];
  if (!row) return fromFile(slug);

  return {
    slug: row.slug,
    label: row.label,
    seoTitle: row.seo_title,
    metaDescription: row.meta_description,
    isService: row.is_service,
    sections: (row.sections ?? [])
      .filter((s) => s.visible)
      .sort((a, b) => a.position - b.position)
      .map(toSection),
    source: "db",
  };
}

/** Every published page. Drives the sitemap and the static route params. */
export async function getPublishedPages(): Promise<
  { slug: string; label: string }[]
> {
  const rows = await restGet<{ slug: string; label: string }[]>(
    "pages?published=is.true&select=slug,label&order=position.asc",
    { tags: [tags.pages] }
  );

  if (!rows || rows.length === 0) {
    return filePages.map((p) => ({ slug: p.slug, label: p.label }));
  }
  return rows;
}

/* --------------------------------------------------------------- packages -- */

type PackageRow = {
  id: string;
  group_key: Package["group"];
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
};

function toPackage(row: PackageRow): Package {
  return {
    id: row.id,
    group: row.group_key,
    name: row.name,
    price: row.price,
    ...(row.price_unit ? { priceUnit: row.price_unit } : {}),
    ...(row.onboarding_fee ? { onboardingFee: row.onboarding_fee } : {}),
    ...(row.timeline ? { timeline: row.timeline } : {}),
    bestFit: row.best_fit,
    deliverables: row.deliverables ?? [],
    cta: { label: row.cta_label, href: row.cta_href },
    featured: row.featured,
    visible: row.visible,
    pricingPending: row.pricing_pending,
  };
}

/** Visible packages only — a hidden tier must not reach the public site. */
export async function getPackages(): Promise<Package[]> {
  const rows = await restGet<PackageRow[]>(
    "packages?visible=is.true&select=*&order=position.asc",
    { tags: [tags.packages] }
  );

  if (!rows || rows.length === 0) {
    return filePackages.filter((p) => p.visible !== false);
  }
  return rows.map(toPackage);
}

/* --------------------------------------------------------------- articles -- */

type PostRow = {
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

function toPost(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    category: row.category,
    tags: row.tags ?? [],
    author: row.author,
    ...(row.cover_image_url ? { coverImageUrl: row.cover_image_url } : {}),
    ...(row.cover_image_alt ? { coverImageAlt: row.cover_image_alt } : {}),
    // Falling back here rather than in the renderer means an article is never
    // published with an empty <title>, however little the author filled in.
    seoTitle: row.seo_title || row.title,
    metaDescription: row.meta_description || row.excerpt,
    published: row.published,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

const SUMMARY_SELECT =
  "slug,title,excerpt,category,published_at,cover_image_url,cover_image_alt";

/**
 * Published articles, newest first.
 *
 * Scheduling is enforced in the database, not here: the RLS policy hides a post
 * whose publish date has not arrived, so a future-dated article cannot leak
 * through any read path.
 */
export async function getPosts({
  limit = 12,
  category,
  excludeSlug,
}: { limit?: number; category?: string; excludeSlug?: string } = {}): Promise<
  PostSummary[]
> {
  const filters = [
    "published=is.true",
    `select=${SUMMARY_SELECT}`,
    "order=published_at.desc",
    // One extra, so dropping the article you are currently reading still
    // leaves a full row of related links.
    `limit=${limit + (excludeSlug ? 1 : 0)}`,
  ];
  if (category) filters.push(`category=eq.${encodeURIComponent(category)}`);

  const rows = await restGet<
    (Pick<PostRow, "slug" | "title" | "excerpt" | "category" | "published_at"> & {
      cover_image_url: string | null;
      cover_image_alt: string | null;
    })[]
  >(`posts?${filters.join("&")}`, { tags: [tags.posts] });

  if (!rows) return [];

  return rows
    .filter((r) => r.slug !== excludeSlug)
    .slice(0, limit)
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      category: r.category,
      publishedAt: r.published_at,
      ...(r.cover_image_url ? { coverImageUrl: r.cover_image_url } : {}),
      ...(r.cover_image_alt ? { coverImageAlt: r.cover_image_alt } : {}),
    }));
}

export async function getPost(slug: string): Promise<Post | null> {
  const rows = await restGet<PostRow[]>(
    `posts?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
    { tags: [tags.posts, tags.post(slug)] }
  );

  const row = rows?.[0];
  return row ? toPost(row) : null;
}

/** Slugs for the static params and the sitemap. */
export async function getPublishedPostSlugs(): Promise<
  { slug: string; updatedAt: string }[]
> {
  const rows = await restGet<{ slug: string; updated_at: string }[]>(
    "posts?published=is.true&select=slug,updated_at&order=published_at.desc",
    { tags: [tags.posts] }
  );
  return (rows ?? []).map((r) => ({ slug: r.slug, updatedAt: r.updated_at }));
}

/* ------------------------------------------------------- nav and settings -- */

export type SiteConfig = {
  site: typeof fileSite;
  primaryCta: { label: string; href: string };
  mainNav: NavItem[];
  footerNav: { heading: string; links: { label: string; href: string }[] }[];
};

type NavRow = {
  id: string;
  location: "main" | "footer";
  parent_id: string | null;
  label: string;
  href: string;
  position: number;
};

type SettingsRow = {
  name: string;
  short_name: string;
  url: string;
  email: string;
  phone: string;
  phone_href: string;
  locality: string;
  region: string;
  positioning: string;
  footer_blurb: string;
  primary_cta_label: string;
  primary_cta_href: string;
};

function buildNav(rows: NavRow[], location: "main" | "footer") {
  const scoped = rows
    .filter((r) => r.location === location)
    .sort((a, b) => a.position - b.position);

  const tops = scoped.filter((r) => !r.parent_id);
  return tops.map((top) => ({
    ...top,
    children: scoped.filter((r) => r.parent_id === top.id),
  }));
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const [settingsRows, navRows] = await Promise.all([
    restGet<SettingsRow[]>("site_settings?select=*&limit=1", {
      tags: [tags.settings],
    }),
    restGet<NavRow[]>(
      "nav_items?select=id,location,parent_id,label,href,position&order=position.asc",
      { tags: [tags.nav] }
    ),
  ]);

  const s = settingsRows?.[0];

  const site = s
    ? {
        name: s.name,
        shortName: s.short_name,
        url: s.url,
        email: s.email,
        phone: s.phone,
        phoneHref: s.phone_href,
        locality: s.locality,
        region: s.region,
        positioning: s.positioning,
        footerBlurb: s.footer_blurb,
      }
    : fileSite;

  const primaryCta = s
    ? { label: s.primary_cta_label, href: s.primary_cta_href }
    : filePrimaryCta;

  const hasNav = Boolean(navRows && navRows.length > 0);

  const mainNav: NavItem[] = hasNav
    ? buildNav(navRows!, "main").map((item) => ({
        label: item.label,
        href: item.href,
        ...(item.children.length
          ? {
              children: item.children.map((c) => ({
                label: c.label,
                href: c.href,
              })),
            }
          : {}),
      }))
    : fileMainNav;

  const footerNav = hasNav
    ? buildNav(navRows!, "footer").map((group) => ({
        heading: group.label,
        links: group.children.map((c) => ({ label: c.label, href: c.href })),
      }))
    : fileFooterNav;

  return {
    site: site as typeof fileSite,
    primaryCta,
    mainNav,
    // A footer group with no links is a heading with nothing under it.
    footerNav: footerNav.filter((g) => g.links.length > 0),
  };
}
