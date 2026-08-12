import { notFound } from "next/navigation";
import { Sections } from "@/components/blocks/sections";
import { JsonLd, localBusinessSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/page-helpers";
import { getPackages, getPage, getPosts, getSiteConfig } from "@/lib/content";

/**
 * Home has its own route rather than going through the catch-all, because it
 * is the only page that emits LocalBusiness structured data. Its content is
 * still fully editable in /admin — it is the page with slug "/".
 */
export async function generateMetadata() {
  const page = await getPage("/");
  return page ? buildMetadata(page) : {};
}

export default async function Page() {
  const [page, packages, posts, { site }] = await Promise.all([
    getPage("/"),
    getPackages(),
    getPosts({ limit: 12 }),
    getSiteConfig(),
  ]);
  if (!page) notFound();

  return (
    <>
      <JsonLd data={localBusinessSchema(site)} />
      <Sections sections={page.sections} packages={packages} posts={posts} />
    </>
  );
}
