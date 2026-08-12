import { site as fileSite } from "@/content/site";
import type { FaqItem } from "@/lib/types";

type SiteDetails = typeof fileSite;

/**
 * Renders structured data. The `<` replacement is the XSS guard Next's JSON-LD
 * guide calls for — JSON.stringify alone does not escape script-closing tags.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * Business details come from the caller so the schema reflects what is in the
 * database — a phone number changed in /admin has to change here too, or the
 * structured data quietly contradicts the page it sits on.
 */
export function localBusinessSchema(site: SiteDetails = fileSite) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.name,
    description: site.positioning,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Greater Houston, Texas",
    },
    knowsAbout: [
      "Local SEO",
      "Traditional SEO",
      "Real Estate SEO",
      "Google Business Profile optimization",
      "SEO content strategy",
      "Technical SEO",
    ],
  };
}

export function serviceSchema({
  name,
  description,
  url,
  site = fileSite,
}: {
  name: string;
  description: string;
  url: string;
  site?: SiteDetails;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: `${site.url}${url}`,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Greater Houston, Texas",
    },
  };
}

export function articleSchema({
  title,
  description,
  url,
  publishedAt,
  updatedAt,
  author,
  imageUrl,
  site = fileSite,
}: {
  title: string;
  description: string;
  url: string;
  publishedAt: string | null;
  updatedAt: string;
  author?: string;
  imageUrl?: string;
  site?: SiteDetails;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${site.url}${url}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}${url}` },
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    dateModified: updatedAt,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    author: {
      "@type": author ? "Person" : "Organization",
      name: author || site.name,
      ...(author ? {} : { "@id": `${site.url}/#organization` }),
    },
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function breadcrumbSchema(
  trail: { name: string; url: string }[],
  site: SiteDetails = fileSite
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.url}`,
    })),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
