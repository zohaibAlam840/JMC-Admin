import type { PageContent } from "@/lib/types";

/**
 * SEO Reporting — Page Spec 05.
 *
 * The pillar page for transparency. Every other page claims clear reporting
 * and links here; this is the only one that has to prove it, which is why §3
 * is a drawn example rather than another paragraph about clarity.
 *
 * Absent from the main navigation by decision, but it receives the "See How
 * JMC Reports SEO Progress" CTA from nearly every page, which makes it one of
 * the most internally-linked pages on the site. It must stay in the footer and
 * the sitemap, and it must never be noindexed.
 *
 * No Service schema: this page describes a method, not something you can buy.
 * That is handled by keeping its slug out of servicePageSlugs.
 *
 * Copy is DRAFT. The Step 4 copy deck replaces it. Written against the §Must
 * Not Appear list, which on this page is stricter than anywhere else: not one
 * number, percentage or performance figure appears below, including inside the
 * example panel.
 */
export const seoReportingPage: PageContent = {
  slug: "/seo-reporting",
  label: "SEO Reporting",
  seoTitle: "SEO Reporting You Can Actually Read",
  metaDescription:
    "How JMC reports SEO progress: a monthly recap that answers what was done, why it was done, what changed, and what comes next. Plus a quarterly project update.",
  sections: [
    /*
     * Centred, with the chart behind it and no panel beside it. All three
     * come from the same note in the client review on 2026-10-14: "put the
     * graphic behind everything, and then overlay the verbiage ... we're
     * moving this off, you can center all of this out", and on the two
     * buttons, "we'll definitely get paralysis analysis here ... it needs to
     * just be one CTA".
     *
     * The showcase cards that used to sit on the right previewed the four
     * recap headings. They are not lost: the section immediately below this
     * one is those four headings, at full size.
     */
    {
      id: "hero",
      type: "heroCentered",
      backdrop: "chart",
      eyebrow: "SEO Reporting",
      heading: "SEO Reporting That Answers Four Questions",
      body: "Most SEO reporting either buries the work in numbers or skips it entirely. JMC reports every month in the same shape, so you always know what was done, why it was the priority, and what it changed.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "four-questions",
      type: "fourQuestions",
      tone: "surface",
      eyebrow: "The Shape of It",
      heading: "The Four Questions Every Recap Answers",
      body: "The same four headings every month, in the same order, on every package in both service lines.",
      did: "The actual work completed that month, listed as specific tasks rather than categories. Not “content optimization” but which pages were rewritten, which titles changed, and which listings were corrected.",
      didExample:
        "Rewrote service page titles and meta descriptions for four priority pages.",
      why: "The reasoning behind the order. SEO is a queue of things worth doing, and the useful part of a report is understanding why this month's work went to the front of it rather than something else.",
      whyExample:
        "Those four pages already had impressions and no clear title, so they were the cheapest movement available.",
      changed:
        "Movement, reported honestly. Some months show clear change and some show very little, and the recap says which one it was. A report that reads like progress every single month is not a report.",
      changedExample:
        "Grid visibility for the primary service term, compared with last month.",
      next: "Next month's priorities, written down before the month starts, so nothing in the following recap is a surprise. It also gives you somewhere to push back before the work happens rather than after.",
      nextExample:
        "Next: the two service pages with no dedicated content, then a citation audit.",
    },

    {
      id: "example",
      type: "recapExample",
      tone: "white",
      eyebrow: "An Example",
      heading: "What a Recap Actually Looks Like",
      body: "The structure, drawn out. Every line below describes the kind of thing a recap contains.",
      panelTitle: "Monthly Project Recap",
      panelMeta: "Structure only. Not a real client report.",
      did: [
        "Rewrote titles and meta descriptions for four priority service pages.",
        "Corrected the business category and service list on the Google Business Profile.",
        "Published one strategic SEO page for the highest-intent service term.",
      ],
      why: [
        "Those four pages already had impressions with no clear title, so they were the cheapest movement available.",
        "The profile category was narrower than the services actually offered, which limits which searches it can appear for.",
      ],
      changed: [
        "Grid visibility for the primary service term, compared with last month.",
        "Movement on the tracked keyword set, with the ones that moved named individually.",
        "Where the month was quiet, the recap says so and says why.",
      ],
      next: [
        "The two service pages with no dedicated content.",
        "A citation audit across the listings that carry an old address.",
      ],
      caption:
        "An example of the structure, not a real client report. No figures appear in it because none of them would be real, and a page about honest reporting is the worst possible place for an invented number.",
    },

    {
      id: "deliverables",
      type: "cardGrid",
      tone: "surface",
      variant: "cards",
      columns: 3,
      eyebrow: "What Arrives",
      heading: "What Arrives, and When",
      body: "Three deliverables, included in every package in both service lines.",
      cards: [
        {
          title: "Monthly Reporting",
          icon: "bar-chart",
          body: "Detailed reporting on the work and the tracked keyword and competitor set. Traditional SEO packages add dashboard reporting on top of it.",
        },
        {
          title: "Monthly Project Recap",
          icon: "message-square",
          body: "Delivered by Loom or a video call. A person walking through what happened and answering questions, rather than a file dropped into an inbox.",
        },
        {
          title: "Quarterly Project Update",
          icon: "calendar",
          body: "A wider look every three months: what the quarter changed, what it taught, and where the next one is pointed.",
        },
      ],
    },

    /*
     * Stacked rather than two columns, and considerably longer than it was.
     *
     * The decisions record specifies two columns here; the client overrode
     * it in review on 2026-10-14 after seeing it built: "I know the document
     * says two columns, but local SEO on top, traditional SEO below it ...
     * more of a paragraph style, with the same Explore Local SEO, Explore
     * Traditional CTAs at the end. We have an opportunity there to be more
     * elaborative ... this is maybe a little too high level."
     *
     * So each lane now says what is actually measured, how it is measured,
     * and what the recap does with it, which is the difference a reader is
     * trying to judge. Both still carry equal weight and identical styling:
     * this section is the page's routing mechanism as well as its argument.
     */
    {
      id: "by-lane",
      type: "cardGrid",
      tone: "surface",
      variant: "cards",
      columns: 1,
      eyebrow: "By Service",
      heading: "Reporting Differs by Where You Compete",
      body: "The four questions are the same in both lanes. What sits underneath them is not, because the two are not measuring the same thing.",
      cards: [
        {
          title: "Local SEO Reporting",
          icon: "map-pin",
          body: "A single rank is close to meaningless in local search, because the result changes street by street. You can hold the first position near your own address and be invisible four miles away, and one blended number hides exactly that. So local reporting leads with grid tracking: visibility checked from a spread of points across the service area, the same points every month, shown as a map of where you are strong and where you are not.\n\nAround it sits what moves that map. Profile activity, because for many local searches the profile is what is being ranked rather than the site. Review movement, both what arrived and what was replied to. Citation consistency, which is slow, unglamorous and the thing most often quietly wrong. The recap names the listings corrected and the posts published rather than reporting that local optimization was carried out.",
          cta: { label: "Explore Local SEO", href: "/local-seo-services" },
        },
        {
          title: "Traditional SEO Reporting",
          icon: "globe",
          body: "Competing across markets means the field matters as much as your own position. Keywords and competitors are tracked as one set and reported together, so a month where you held position while two competitors moved past you reads as what it is rather than as no change. Dashboard reporting sits alongside the recap on these packages.\n\nUnderneath that sits the work itself. Which strategic pages were published and what they are starting to rank for, which takes months rather than weeks and is reported as a trajectory rather than a verdict. Technical issues flagged as they appeared, because a redirect chain or a stray noindex introduced in a redesign can undo a quarter before anyone notices. And the authority recommendations made, including the ones you are better placed to act on than JMC is.",
          cta: {
            label: "Explore Traditional SEO",
            href: "/traditional-seo-services",
          },
        },
      ],
    },

    {
      id: "faq",
      type: "faq",
      tone: "white",
      eyebrow: "Questions",
      heading: "Reporting Questions",
      items: [
        {
          question: "How often do reports arrive?",
          answer:
            "A recap every month and a project update every quarter. Both are included in every package in both service lines, at every tier.",
        },
        {
          question: "Is the recap a document or a call?",
          answer:
            "A Loom video or a live video call, whichever suits you. Either way a person walks through the work rather than sending a file and hoping it gets read. Written reporting comes alongside it.",
        },
        {
          question: "What happens in a month where little moves?",
          answer:
            "The recap says so, and says why. SEO does not move in a straight line, and a report that reads like progress every single month is telling you less than one that admits a quiet stretch.",
        },
        {
          question: "Are rankings guaranteed?",
          answer:
            "No, and anyone guaranteeing them is guessing. What is guaranteed is the scope, the reporting, and knowing exactly what was done and why.",
        },
        {
          question: "Who else can see the reports?",
          answer:
            "Your call. The recap and the reporting are yours to share internally with whoever needs them, and the video format tends to make that easier rather than harder.",
        },
        {
          question: "What tools are used?",
          answer:
            "A mix of rank and grid tracking, Google Search Console, Google Analytics, and technical crawling. The tools matter less than the reading of them, which is the part the recap is for.",
        },
      ],
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "See What the First Report Would Say",
      body: "A visibility review covers where you appear now, what is holding it back, and which of those is worth acting on first.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "View Monthly SEO Packages",
        href: "/monthly-seo-packages",
      },
    },
  ],
};
