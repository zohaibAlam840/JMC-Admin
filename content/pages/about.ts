import type { PageContent } from "@/lib/types";

/**
 * About — Page Spec 11.
 *
 * The page where pillar 3 lives: SEO only, not full service. It is also the
 * only page with no third-party proof of any kind. No client names, no
 * testimonials, no statistics, no logo bar, no team grid. Everything rests on
 * the 2022 pivot, one state-issued credential, and how the work actually runs.
 *
 * Two rules are doing more work here than anywhere else on the site:
 *
 * Third person throughout, including the pivot story. It is told about JMC,
 * never by Wendell, which is what keeps a founder's story inside the voice
 * rule in Decisions Record §2.
 *
 * Headcount is never stated. "A small senior team" plus the no-handoff framing
 * holds true at two people and at eight, so it never needs editing after a
 * hire.
 *
 * Copy here is DRAFT pending the Step 4 deck, and this is the one page where
 * the spec says the writing matters more than the structure.
 */
export const aboutPage: PageContent = {
  slug: "/about",
  label: "About JMC",
  seoTitle: "About JMC | SEO Only, Explained Every Month",
  metaDescription:
    "Jordan Marketing Consultants does one thing: SEO. A League City agency working on local, regional, and industrial search visibility, explained every month.",
  sections: [
    /*
     * Centered, and deliberately without buttons. The page is the argument;
     * the CTA is at the end. A hero button here would invite a visitor to
     * leave before reading the only page that explains the position.
     */
    {
      id: "hero",
      type: "heroCentered",
      eyebrow: "About",
      heading: "An SEO Agency That Only Does SEO",
      body: "Jordan Marketing Consultants used to do everything. In 2022 it stopped, and kept the one service it was genuinely good at. Everything on this site is search visibility, explained in plain language every month.",
    },

    /*
     * The page's core section, and the strongest asset in the source material:
     * specific, and mildly unflattering, which is what makes it credible in a
     * way a credentials list never is.
     *
     * "The websites were not good enough" stays exactly as written. Softening
     * it to something like "JMC outgrew web design" costs the page the only
     * thing it has instead of proof.
     *
     * Three paragraphs, separated by blank lines so the renderer keeps them
     * as three. `groups: []` and no portrait means the copy runs full width
     * until the headshot arrives; add
     *   portrait: { src: "/wendell-jordan.jpg", alt: "Wendell Jordan" },
     * and it moves to the right column with no other change.
     */
    {
      id: "narrowing",
      type: "featureSplit",
      tone: "surface",
      eyebrow: "2022",
      heading: "The Narrowing",
      body: "JMC used to be full service, with web design as the main business. The websites were not good enough, and the process from onboarding to launch was difficult for everyone involved.\n\nThe turn came in a professional networking group. SEO was the only part of the work worth talking about. Over time it became the part worth doing.\n\nIn 2022 the agency stopped doing everything and started doing one thing.",
      groups: [],
    },

    /*
     * Pillar 3 made concrete, and the section a prospect screenshots when
     * explaining JMC to a business partner. Both lists are verbatim from
     * Decisions Record §8.
     *
     * The card titles are a deliberate exception to the positive-framing rule:
     * a page arguing that JMC does one thing has to name what it declines.
     * This is a scope statement about JMC, not a comment on anyone else, so no
     * item carries an explanation and none implies that an agency offering it
     * is worse. The list is the answer.
     */
    {
      id: "scope",
      type: "cardGrid",
      tone: "white",
      eyebrow: "Scope",
      heading: "What JMC Does, and What It Doesn't",
      body: "The boundary is the same on every engagement, and it is easier to point at than to describe.",
      columns: 2,
      cards: [
        {
          title: "What JMC Does",
          icon: "search",
          items: [
            "Local SEO",
            "Traditional SEO",
            "Google Business Profile",
            "Technical monitoring",
            "Strategic SEO pages and written content",
            "Reporting and monthly recaps",
          ],
        },
        {
          title: "What JMC Doesn't Do",
          icon: "layers",
          items: [
            "Paid ads",
            "Web design",
            "Social media posts",
            "Link building and link placements",
          ],
        },
      ],
    },

    /*
     * Where the team question gets answered without a number.
     *
     * Cards 1 and 2 turn a constraint into a real advantage: you talk to the
     * person doing your SEO, which is not true at most agencies JMC competes
     * with. Card 3 is the only credential on the site, and it works because it
     * is verifiable and state-issued. It is stated once, plainly, with no
     * course details and no logo. Real Estate SEO is cut from scope, so this
     * stays a credibility item and must not become a service pitch.
     */
    {
      id: "how-jmc-works",
      type: "cardGrid",
      tone: "surface",
      variant: "compact",
      eyebrow: "How JMC Works",
      heading: "You Work With the People Doing the Work",
      columns: 3,
      cards: [
        {
          title: "A Small Senior Team",
          icon: "users",
          body: "No account-manager layer, and no handoff to juniors once the contract is signed.",
        },
        {
          title: "Direct Access",
          icon: "message-square",
          body: "The person who answers a question about your campaign is the person running it.",
        },
        {
          title: "A TREC-Approved Instructor",
          icon: "shield-check",
          body: "Wendell Jordan teaches a TREC-approved continuing education class for Texas real estate licensees.",
        },
      ],
    },

    /*
     * Deliberately short, roughly forty words. There is no long-standing local
     * story to tell, and inventing one would undercut the transparency pillar
     * on the page meant to establish it. No city list, no heritage narrative,
     * no map, no skyline, no street address. Where the business is based is a
     * fact worth stating once.
     */
    {
      id: "league-city",
      type: "fullWidthText",
      tone: "white",
      eyebrow: "Based in League City",
      heading: "League City, Texas",
      body: "JMC is based in League City and works with businesses across the Houston area and beyond. Being nearby helps with understanding a market. It has never been a limit on who the work is for.",
    },

    /*
     * Page Spec 11 §6 corrects Decisions Record §7, which listed About among
     * the pages that do not carry this block. About argues how JMC works, and
     * how JMC reports is the clearest expression of that. The page markets an
     * ongoing service; it just does so through story rather than through a
     * package.
     */
    {
      id: "monthly-recap",
      type: "reportingBlock",
      tone: "surface",
      eyebrow: "Reporting",
      heading: "The Monthly Recap",
      body: "The same four questions every month, on every engagement.",
      did: "The specific work completed that month, named task by task.",
      why: "Why that work was the priority ahead of everything else in the queue.",
      changed:
        "What moved, reported honestly, including the months where little did.",
      next: "Next month's priorities, so nothing in the following recap is a surprise.",
      cta: {
        label: "See How JMC Reports SEO Progress",
        href: "/seo-reporting",
      },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Start With a Look at Where Your Visibility Stands",
      body: "A Visibility Review is the first step on every engagement, and it is useful even when it ends in advice rather than a contract.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "View Monthly SEO Packages",
        href: "/monthly-seo-packages",
      },
    },
  ],
};
