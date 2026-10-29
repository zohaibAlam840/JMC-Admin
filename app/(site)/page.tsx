import { notFound } from "next/navigation";
import { Sections } from "@/components/blocks/sections";
import { buildMetadata } from "@/lib/page-helpers";
import { getPackages, getPage, getPosts } from "@/lib/content";

/**
 * Home has its own route rather than going through the catch-all. Its content is
 * still fully editable in /admin — it is the page with slug "/".
 */
export async function generateMetadata() {
  const page = await getPage("/");
  return page ? buildMetadata(page) : {};
}

export default async function Page() {
  const [page, packages, posts] = await Promise.all([
    getPage("/"),
    getPackages(),
    getPosts({ limit: 12 }),
  ]);
  if (!page) notFound();

  return (
    <Sections sections={page.sections} packages={packages} posts={posts} />
  );
}
