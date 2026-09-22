/**
 * The three legal pages — Page Spec 15, part 1.
 *
 * Privacy Policy, Terms and Cookie Policy share one plain template, and none of
 * their text lives in this repository. All three are generated and hosted by
 * Termageddon and embedded so they update themselves when the law changes.
 * Copying the policy text in as static content is the one thing the spec is
 * emphatic about not doing: it stops auto-updating the moment it is pasted, and
 * nobody notices for a year.
 *
 * Each policy therefore needs one thing from the client before it can ship: the
 * Termageddon embed key. Until that arrives the route returns a 404 and the
 * footer link is not rendered, which is deliberate. An indexable legal page
 * carrying "policy coming soon" is worse than no page: it is a published
 * statement that the site has no privacy policy, on a site whose central claim
 * is that it tells clients the truth about what is and is not done.
 *
 * Keys are read from the environment rather than the database. They are
 * deployment configuration, not content, and a client editing them in /admin
 * could silently unpublish the site's privacy policy.
 */

export type Policy = {
  slug: string;
  /** Internal label and the visible H1. */
  title: string;
  seoTitle: string;
  metaDescription: string;
  /** Termageddon policy key, supplied by the client. */
  embedKey: string;
};

const POLICIES: Policy[] = [
  {
    slug: "/privacy-policy",
    title: "Privacy Policy",
    seoTitle: "Privacy Policy | Jordan Marketing Consultants",
    metaDescription:
      "How Jordan Marketing Consultants collects, uses, and stores information submitted through this website, including contact and audit requests and analytics data.",
    embedKey: process.env.TERMAGEDDON_PRIVACY_KEY ?? "",
  },
  {
    /*
     * Website use only. Service engagements are governed by client contracts,
     * and Terms must not restate or summarise them: the 12-month term, the
     * cancellation notice and the pricing all live in the signed agreement. A
     * mismatch between a website's terms and a contract is a problem nobody
     * needs, and keeping the two apart avoids it entirely.
     */
    slug: "/terms",
    title: "Terms",
    seoTitle: "Terms | Jordan Marketing Consultants",
    metaDescription:
      "Terms governing use of the Jordan Marketing Consultants website, including content ownership, third-party links, and limitation of liability.",
    embedKey: process.env.TERMAGEDDON_TERMS_KEY ?? "",
  },
  {
    slug: "/cookie-policy",
    title: "Cookie Policy",
    seoTitle: "Cookie Policy | Jordan Marketing Consultants",
    metaDescription:
      "Which cookies this website sets, what they are used for, and how consent is handled for analytics on jordanmarketingconsultants.com.",
    embedKey: process.env.TERMAGEDDON_COOKIES_KEY ?? "",
  },
];

/** Every policy, configured or not. Used by the routes, which 404 on their own. */
export function getPolicy(slug: string): Policy | null {
  return POLICIES.find((p) => p.slug === slug) ?? null;
}

/**
 * The policies that can actually be served.
 *
 * Both the footer's bottom bar and the sitemap read this, so a policy without
 * an embed key is not linked and not submitted to Google rather than being
 * linked to a 404.
 */
export function publishedPolicies(): Policy[] {
  return POLICIES.filter((p) => p.embedKey);
}
