import type { PageContent } from "@/lib/types";

/**
 * Google Business Profile Optimization — Page Spec 04.
 *
 * Built as a lead-generation page rather than as a third service page, which
 * is why it has no audience-fit grid and no pricing cards. Somebody arriving
 * on a single-service search term is not shopping for an agency yet, so §3
 * asks them to recognise a problem instead of asking them what kind of
 * business they are, and the hero CTA is the free audit rather than the
 * sitewide Visibility Review. This is the only page where that substitution
 * applies.
 *
 * Two constraints worth keeping in view while editing. There is no delivery
 * timeline for the audit anywhere on this page, by decision: a stated deadline
 * has to hold on the worst week rather than the average one, so the
 * reassurance lives on /thank-you?type=audit instead. And nothing here shows a
 * real profile, a star rating, a review count or a statistic about local
 * search, because none of those could be shown honestly at launch.
 *
 * Copy is DRAFT. The Step 4 copy deck replaces it.
 */
export const gbpOptimizationPage: PageContent = {
  slug: "/google-business-profile-optimization",
  label: "Google Business Profile Optimization",
  seoTitle: "Google Business Profile Optimization | Houston",
  metaDescription:
    "Google Business Profile optimization for Houston-area businesses. Categories, services, citations, posts, reviews and grid tracking, plus a free audit.",
  sections: [
    {
      id: "hero",
      type: "heroSplit",
      eyebrow: "Google Business Profile Optimization",
      heading: "Your Google Business Profile Is Doing More Work Than Your Website",
      body: "For most local searches the profile is what people see, read and act on, often without ever opening a website. Getting it right is the fastest visibility work available to a local business.",
      // The free audit, not the sitewide Visibility Review. An in-page anchor
      // to a five-field form converts far better here than a link to a
      // contact page, and §1 calls for exactly that swap.
      primaryCta: { label: "Get a Free Visibility Audit", href: "#free-audit" },
      secondaryCta: { label: "Explore Local SEO", href: "/local-seo-services" },
      showcase: [
        {
          kind: "coverage",
          label: "What gets worked",
          title: "The Profile Itself",
          items: [
            "Categories and services",
            "Business information",
            "Photos and posts",
            "Reviews and replies",
          ],
        },
        {
          kind: "channels",
          label: "Where it shows",
          title: "Local Surfaces",
          items: ["Map results", "Local search", "Profile panel"],
        },
      ],
    },

    {
      id: "what-it-affects",
      type: "cardGrid",
      tone: "surface",
      variant: "cards",
      columns: 3,
      eyebrow: "Why It Matters",
      heading: "What the Profile Actually Affects",
      body: "Three things, none of which the website controls.",
      cards: [
        {
          title: "Map Results",
          icon: "map-pin",
          body: "Where the business appears when somebody searches nearby. The profile is what is being ranked in that result, not the website behind it.",
        },
        {
          title: "First Impressions",
          icon: "storefront",
          body: "Hours, photos, services and reviews are read directly in the results. For a lot of searches that is the whole of what someone sees before deciding.",
        },
        {
          title: "Direct Actions",
          icon: "phone",
          body: "Calls, direction requests and website clicks all happen from the profile itself. A weak one loses those before a visit ever starts.",
        },
      ],
    },

    {
      id: "problems",
      type: "cardGrid",
      tone: "white",
      // Compact tiles rather than the standard card. Six symptoms should read
      // as a checklist someone scans against their own profile, and the dense
      // treatment also keeps this section from looking like the one above it.
      variant: "compact",
      columns: 3,
      eyebrow: "Sound Familiar",
      heading: "Common Profile Problems",
      body: "Most profiles have at least two of these. Several of them take minutes to fix and have been costing visibility for years.",
      cards: [
        {
          title: "Incomplete Categories",
          icon: "list-checks",
          body: "Your primary category is wrong, or the secondary ones were never set. Categories decide which searches you are eligible for at all.",
        },
        {
          title: "Inconsistent Information",
          icon: "warning",
          body: "Your name, address or phone number disagrees with what other listings say. Search engines notice the disagreement even when customers do not.",
        },
        {
          title: "No Recent Activity",
          icon: "calendar",
          body: "Your profile has not been posted to in months. An inactive profile reads as an inactive business.",
        },
        {
          title: "Unanswered Reviews",
          icon: "message-square",
          body: "Reviews sitting without a reply, good ones as well as bad. The reply is read by everyone who arrives afterwards.",
        },
        {
          title: "Missing Services",
          icon: "file-text",
          body: "Your services and products are undefined, so the profile cannot match a search for something you genuinely do.",
        },
        {
          title: "No Visibility Tracking",
          icon: "search",
          body: "You have no way of knowing whether any of it is working, or where in your area you are visible and where you are not.",
        },
      ],
    },

    {
      id: "free-audit",
      type: "auditForm",
      eyebrow: "Free Visibility Audit",
      heading: "Get a Free Look at Your Profile",
      body: "A written audit of the profile and the site behind it, built on the same four headings as the monthly recap: what is there, why it matters, what is working and what is not, and what to do next.",
      covers: [
        "Categories, services and business information",
        "Listing consistency across the web",
        "Profile activity, photos and reviews",
        "Where the profile is visible across the service area",
      ],
      note: "No call required.",
      submitLabel: "Get a Free Visibility Audit",
      profileHelp: "Optional. Paste the map listing link if you have it handy.",
      source: "Free Visibility Audit",
    },

    {
      id: "what-jmc-does",
      type: "cardGrid",
      tone: "surface",
      variant: "cards",
      columns: 3,
      eyebrow: "The Work",
      heading: "What JMC Does to a Profile",
      body: "Three things once, and three things every month. Which of the two you need is the whole of the choice below.",
      // The split is load-bearing: §6 offers one path for each half, and the
      // two cards there only make sense to a reader who has seen this.
      groupLabels: [
        { at: 0, label: "One-time foundation" },
        { at: 3, label: "Ongoing every month" },
      ],
      cards: [
        {
          title: "Profile Audit",
          icon: "clipboard-check",
          body: "A full review of the profile as it stands, against how people in your area actually search for what you do.",
        },
        {
          title: "Category & Services Setup",
          icon: "list-checks",
          body: "Primary and secondary categories set deliberately, with services and products defined so the profile can match real searches.",
        },
        {
          title: "NAP & Citation Consistency",
          icon: "shield-check",
          body: "Name, address and phone standardised, then corrected across the listings that carry an older version of them.",
        },
        {
          title: "Ongoing Profile Posts",
          icon: "pencil",
          body: "Regular posts through the month, so the profile stays active rather than going quiet after the setup work finishes.",
        },
        {
          title: "Review Requests & Replies",
          icon: "star",
          body: "Requests sent to real customers and replies written to what arrives, positive and negative alike. Nothing is fabricated or incentivised.",
        },
        {
          title: "Local Search Grid Tracking",
          icon: "map-pin",
          body: "Visibility measured across the service area rather than as one blended number, so you can see where the profile is strong and where it is not.",
          visual: "searchGrid",
        },
      ],
    },

    {
      id: "two-ways",
      type: "cardGrid",
      tone: "white",
      variant: "cards",
      columns: 2,
      eyebrow: "Two Ways In",
      heading: "One-Time Setup, or Ongoing Management",
      body: "The foundation work can be bought once on its own. The monthly work only makes sense as an ongoing engagement.",
      cards: [
        {
          title: "One-Time Setup",
          icon: "rocket",
          meta: "Neighborhood Launch Sprint, $799",
          body: "Completed within 30 days. Covers the profile audit and core optimization, a citation audit and a single standard for your business information, and a 30-day roadmap for the whole picture rather than the profile alone. Start monthly service within 30 days and the onboarding fee on any Local package is waived.",
          cta: { label: "View Launch Sprints", href: "/launch-sprints" },
        },
        {
          title: "Ongoing Management",
          icon: "layers",
          meta: "Local SEO packages, from $875 a month",
          body: "Monthly profile posts, review requests and replies, citation work, local search grid tracking, and the monthly recap that says what changed. The profile work sits inside the wider local engagement rather than beside it.",
          cta: { label: "Explore Local SEO", href: "/local-seo-services" },
        },
      ],
      cta: {
        label: "Not sure which fits? Request a Visibility Review",
        href: "/contact",
      },
    },

    {
      id: "monthly-recap",
      type: "reportingBlock",
      tone: "surface",
      eyebrow: "Reporting",
      heading: "The Monthly Recap",
      body: "Profile work is easy to do invisibly, which is exactly why it gets reported the same way as everything else.",
      did: "The posts published, the listings corrected, the reviews replied to, named individually.",
      why: "Why that work was the priority, and what it was expected to affect.",
      changed: "Grid visibility across the service area, compared with last month, including the quiet ones.",
      next: "What is queued for the coming month, written down before it starts.",
      cta: {
        label: "See How JMC Reports SEO Progress",
        href: "/seo-reporting",
      },
    },

    {
      id: "faq",
      type: "faq",
      tone: "white",
      eyebrow: "Questions",
      heading: "Profile Questions",
      items: [
        {
          question: "Is this the same as Google My Business?",
          answer:
            "Yes. Google renamed Google My Business to Google Business Profile, and a lot of people still search for the old name. It is the same listing and the same work.",
        },
        {
          question: "Can this be done without a monthly package?",
          answer:
            "Yes. The Neighborhood Launch Sprint covers the foundation work as a one-time engagement and finishes with a 30-day roadmap, with no obligation to continue into a monthly package afterwards.",
        },
        {
          question: "How long before the profile improves?",
          answer:
            "Some changes show up almost immediately: corrected categories, services, hours and information can be reflected within days. Movement in map rankings is slower and depends on how competitive your area is, which is why the reporting separates the two rather than blending them.",
        },
        {
          question: "Who owns the profile?",
          answer:
            "You do, always. JMC requests manager access to a profile you own and never takes ownership of one. If the engagement ends, access is removed and nothing has to be handed back, because it was never held.",
        },
        {
          question: "Can suspended or duplicate profiles be fixed?",
          answer:
            "Duplicates can usually be merged or removed. Suspensions vary: some are caused by fixable information problems and some are not, and nobody can promise reinstatement. What JMC will do is look at the cause honestly and tell you whether it is worth pursuing.",
        },
        {
          question: "Does this help a business with no storefront?",
          answer:
            "Yes. A service-area business hides its address and is ranked against the area it covers, which makes categories, service definitions and listing consistency do more of the work. JMC is a service-area business itself and does not publish a street address.",
        },
      ],
      cta: { label: "Get a Free Visibility Audit", href: "#free-audit" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Start With the Profile",
      body: "A visibility review covers the profile, the site behind it, and which of the two is holding the other back.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: { label: "View Launch Sprints", href: "/launch-sprints" },
    },
  ],
};
