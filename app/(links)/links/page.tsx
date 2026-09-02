import { notFound } from "next/navigation";
import { Sections } from "@/components/blocks/sections";
import { buildMetadata } from "@/lib/page-helpers";
import { getPage } from "@/lib/content";

/**
 * The page social bios point at, replacing linktr.ee/htxseo.
 *
 * Content is a normal page row with slug "/links", so the buttons are edited in
 * the page builder like anything else — no code change to swap a link.
 */
export async function generateMetadata() {
  const page = await getPage("/links");
  return page ? buildMetadata(page) : {};
}

export default async function LinksPage() {
  const page = await getPage("/links");
  if (!page) notFound();

  return <Sections sections={page.sections} />;
}
