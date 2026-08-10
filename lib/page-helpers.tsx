import type { Metadata } from "next";
import { Sections } from "@/components/blocks/sections";
import { JsonLd, faqSchema, serviceSchema } from "@/components/seo/json-ld";
import type { ResolvedPage } from "@/lib/content";
import type { Package } from "@/lib/types";

export function buildMetadata(page: ResolvedPage): Metadata {
  return {
    title: page.seoTitle,
    description: page.metaDescription,
    alternates: { canonical: page.slug },
    openGraph: {
      title: page.seoTitle,
      description: page.metaDescription,
      url: page.slug,
    },
  };
}

/**
 * Renders a page's sections plus the structured data its content implies.
 * FAQ schema is emitted only when the page actually has an accordion, so the
 * markup never claims content the page doesn't show.
 */
export function RenderPage({
  page,
  packages,
}: {
  page: ResolvedPage;
  packages: Package[];
}) {
  const faq = page.sections.find((s) => s.type === "faq");

  return (
    <>
      {page.isService ? (
        <JsonLd
          data={serviceSchema({
            name: page.label,
            description: page.metaDescription,
            url: page.slug,
          })}
        />
      ) : null}
      {faq ? <JsonLd data={faqSchema(faq.items)} /> : null}
      <Sections sections={page.sections} packages={packages} />
    </>
  );
}
