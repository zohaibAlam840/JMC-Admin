import type { Metadata } from "next";
import Link from "next/link";
import { Sections } from "@/components/blocks/sections";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from "@/components/seo/json-ld";
import { Container } from "@/components/ui/layout";
import type { ResolvedPage } from "@/lib/content";
import type { Package, PostSummary } from "@/lib/types";

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
/**
 * The visible breadcrumb, and the only page type that gets one.
 *
 * Page Spec 09 puts it on the eight industry pages and nowhere else. They sit
 * two levels deep and are usually entered straight from search rather than
 * through the nav, so a visitor arriving on one has no other way to tell where
 * they are or that seven siblings exist.
 *
 * Derived from the address rather than stored on the page, so an industry page
 * added in /admin gets its breadcrumb without anyone having to remember to
 * switch one on.
 */
function industryTrail(page: ResolvedPage) {
  const parts = page.slug.split("/").filter(Boolean);
  if (parts.length !== 2 || parts[0] !== "industries") return null;
  return [
    { name: "Home", url: "/" },
    { name: "Industries", url: "/industries" },
    { name: page.label, url: page.slug },
  ];
}

function Breadcrumb({ trail }: { trail: { name: string; url: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-line bg-white">
      <Container className="py-3.5">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-subtle">
          {trail.map((item, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={item.url} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-ink-strong">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.url}
                      className="transition-colors hover:text-teal-ink"
                    >
                      {item.name}
                    </Link>
                    <span aria-hidden="true" className="text-line-strong">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}

export function RenderPage({
  page,
  packages,
  posts,
}: {
  page: ResolvedPage;
  packages: Package[];
  posts?: PostSummary[];
}) {
  const faq = page.sections.find((s) => s.type === "faq");
  const trail = industryTrail(page);

  return (
    <>
      {trail ? (
        <>
          <JsonLd data={breadcrumbSchema(trail)} />
          <Breadcrumb trail={trail} />
        </>
      ) : null}
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
      <Sections sections={page.sections} packages={packages} posts={posts} />
    </>
  );
}
