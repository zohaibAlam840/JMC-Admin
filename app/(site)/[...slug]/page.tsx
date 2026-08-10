import { notFound } from "next/navigation";
import { buildMetadata, RenderPage } from "@/lib/page-helpers";
import { getPackages, getPage, getPublishedPages } from "@/lib/content";

/**
 * Every content page is served from here.
 *
 * There is deliberately no route folder per page any more: the client can add
 * a page in /admin and it has to work without a deploy, which a hand-built
 * route cannot do. Hand-built routes that are not just content — /contact,
 * /thank-you — still exist as folders and take priority over this catch-all.
 */

export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await getPublishedPages();
  return pages
    .filter((p) => p.slug !== "/")
    .map((p) => ({ slug: p.slug.replace(/^\//, "").split("/") }));
}

function toSlug(segments: string[]) {
  return `/${segments.join("/")}`;
}

export async function generateMetadata({ params }: PageProps<"/[...slug]">) {
  const { slug } = await params;
  const page = await getPage(toSlug(slug));
  return page ? buildMetadata(page) : {};
}

export default async function Page({ params }: PageProps<"/[...slug]">) {
  const { slug } = await params;
  const [page, packages] = await Promise.all([
    getPage(toSlug(slug)),
    getPackages(),
  ]);

  if (!page) notFound();

  return <RenderPage page={page} packages={packages} />;
}
