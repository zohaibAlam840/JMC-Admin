import type { IconName, PageContent, Section } from "@/lib/types";

/**
 * The Industries hub and its eight children — Page Specs 08 and 09.
 *
 * One template, eight pages. Four of the seven sections carry unique content
 * and three are shared, so the shared three are written once here rather than
 * copied eight times: §4 routes to the two lanes, §5 is the recap block, and
 * §7 is the closing CTA. Copying them would guarantee they drift.
 *
 * The single most important rule across all nine pages is that none of them
 * claims expertise in a sector. JMC has no vertical proof to offer at launch,
 * and a page listing eight industries is the page most likely to be read as a
 * specialization claim. The argument is that the method transfers: the audit,
 * the technical work, the content approach and the reporting are the same, and
 * what changes is the search language, the buying cycle, and what a lead is
 * worth. Every §3 below describes an industry's search behaviour and never
 * JMC's credentials in it.
 *
 * The group labels are descriptive only. "Consumer & Community" sells to
 * people, "Industrial & B2B" sells to operations, and neither assigns a
 * service lane, because every group holds both single-area operators and
 * multi-market competitors.
 *
 * Copy is DRAFT and the child business types still need checking against the
 * Decisions Record §5, which we have only seen quoted. The child counts below
 * match the 5/4/4/3/3/3/3/3 the spec fixes.
 */

/* ------------------------------------------------------ shared sections -- */

/**
 * §4. Which lane, or lanes, this industry actually routes to.
 *
 * Originally both on all eight, on the reasoning that pre-assigning an
 * industry to a lane was a claim about that industry. The client corrected
 * that in review on 2026-10-14, industry by industry, and he is describing
 * what he will actually sell rather than making a claim:
 *
 *   "They're going to be traditional SEO. We're not going to be running a
 *    local SEO campaign for them. So we can remove local."    — Energy
 *   "For maritime, we're going to keep it traditional."        — Maritime
 *   "Aerospace has no local. It's only going to be traditional SEO."
 *   "We will let it be local and traditional on this page."    — Construction
 *   "The only one so far that's going to stay both is hospitality."
 *
 * Offering a lane JMC will not run is worse than narrowing the page: it
 * invites an enquiry that gets redirected on the first call, which is the
 * precise experience the transparency pillar exists to avoid.
 *
 * Three pages stay on both because he explicitly deferred them — "I'm
 * actually going to leave this for now, but we'll work it a little bit
 * later" (home services, healthcare, professional services). They are
 * deferred, not decided, and all three sounded like they are heading
 * somewhere narrower.
 */
type Lanes = "both" | "local" | "traditional";

const LANE_COPY = {
  local: {
    title: "Local SEO",
    icon: "map-pin" as IconName,
    body: "For businesses competing for customers in a defined area, however many locations they run in it.",
    cta: { label: "Explore Local SEO", href: "/local-seo-services" },
  },
  traditional: {
    title: "Traditional SEO",
    icon: "globe" as IconName,
    body: "For businesses competing across multiple markets, multiple service lines, or genuinely competitive search.",
    cta: {
      label: "Explore Traditional SEO",
      href: "/traditional-seo-services",
    },
  },
};

function howJmcWorks(industry: string, lanes: Lanes): Section {
  const lower = industry.toLowerCase();

  if (lanes === "both") {
    return {
      id: "how-it-works",
      type: "cardGrid",
      tone: "surface",
      variant: "cards",
      columns: 2,
      eyebrow: "Where to Start",
      heading: "Two Ways In, Sorted by Reach",
      body: `The method does not change with the industry. What changes is the search language, the priorities, and what a single lead is worth. Which service fits a ${lower} business comes down to where it competes, not how big it is.`,
      cards: [LANE_COPY.local, LANE_COPY.traditional],
    };
  }

  /*
   * One lane gets a statement, not a lone card in a two-column grid.
   *
   * It also answers the question the two-card version leaves open — why not
   * the other one — which is the "something a little more elaborative" the
   * client asked for when he said describing the two ways in needed more
   * than it had.
   */
  const only = LANE_COPY[lanes];
  const because =
    lanes === "traditional"
      ? `${industry} buyers are not searching inside a drive-time radius. The work is specification, capability and procurement language across a region or a country, so a local campaign would optimise for a map pack that the people making these decisions never open.`
      : `${industry} businesses compete inside a defined area, and the profile, the map pack and the reviews attached to them decide most of it. The work belongs in local search rather than spread thin across markets the business does not sell into.`;

  return {
    id: "how-it-works",
    type: "fullWidthText",
    tone: "surface",
    eyebrow: "Where to Start",
    heading: `This Work Sits in ${only.title}`,
    body: `The method does not change with the industry. What changes is the search language, the priorities, and what a single lead is worth.\n\n${because}`,
    cta: only.cta,
  };
}

/**
 * §5. The recap, written per industry.
 *
 * It used to be one identical block on all eight pages. The client cut that
 * in review: "every monthly reporting recap section needs to be geared
 * towards the industry so that we're creating credibility in that section,
 * and not just regurgitating the same thing."
 *
 * The line each of these has to walk: say something specific about reporting
 * for this sector without claiming experience in it. Page Spec 09 forbids
 * sector expertise claims, and the shared FAQ on every one of these pages
 * says in as many words that JMC does not specialise in the industry. So
 * none of these describe past work, results or clients. Each describes what
 * gets measured and reported for a business that searches the way this
 * industry's §3 section has already established that it does — which is a
 * statement about the buyer, not about JMC.
 *
 * The four question titles are untouched and must stay that way: "What We
 * Did / Why We Did It / What Changed / Where We're Headed" are final per the
 * build brief. Only the supporting line under each one varies.
 *
 * Every "what changed" entry keeps the admission that some months move
 * little. That sentence is the whole reason this block is the site's
 * differentiator, and it is the first thing that would quietly go missing in
 * a rewrite for credibility.
 */
type Recap = {
  body: string;
  did: string;
  why: string;
  changed: string;
  next: string;
};

const RECAPS: Record<string, Recap> = {
  "home-services-trades": {
    body: "The same four questions every month. For a trades business the answers are about map pack position, the service area, and whether you were visible before the season turned.",
    did: "The work completed that month, named task by task: profile posts, service-area pages, citation corrections, and the seasonal content queued before its season rather than during it.",
    why: "Why that work came first, which is usually either a service about to peak or a part of the service area ranking well behind the rest of it.",
    changed: "Map pack position across the service area, which urgent-intent searches moved, and call volume wherever it is being tracked. Reported honestly, including the months where little moved.",
    next: "Next month's priorities, with the following seasonal spike already in the plan instead of noticed once it has started.",
  },

  "healthcare-wellness": {
    body: "The same four questions every month. For a practice the answers are about symptom language, reputation, and whether the booking path survives the click.",
    did: "The work completed that month, named task by task: condition and symptom pages, profile and review work, and fixes to the path between a search and a booked appointment.",
    why: "Why that work came first, which is usually a condition the practice should be found for and is not, or a step in the booking path losing people who had already chosen it.",
    changed: "Which symptom and condition searches moved, how the profile and reviews are tracking, and where appointment enquiries arrived from. Reported honestly, including the months where little moved.",
    next: "Next month's priorities in order, so the practice is never the last to find out what is being worked on.",
  },

  "hospitality-attractions": {
    body: "The same four questions every month. For a venue the answers run on two clocks at once: tonight's searches and the ones happening six weeks out.",
    did: "The work completed that month, named task by task: listing detail, photographs and hours, event and seasonal pages, and the content built for bookings that get planned well in advance.",
    why: "Why that work came first, which is usually a season approaching or a listing detail quietly costing clicks that the ranking had already earned.",
    changed: "What moved on the immediate searches and on the planning-ahead ones separately, because they rarely move together. Reported honestly, including the months where little moved.",
    next: "Next month's priorities, with the next booking window already accounted for rather than arriving as a surprise.",
  },

  "professional-services": {
    body: "The same four questions every month. For a firm the answers arrive more slowly than most, because the consideration does.",
    did: "The work completed that month, named task by task: practice-area pages, the location pairings that go with them, and the material doing the work of credibility before anyone picks up a phone.",
    why: "Why that work came first, which is usually a practice area with no page behind it, or one competing against firms that have published far more.",
    changed: "Which practice-area and location searches moved, and what enquiry volume did. Reported honestly, including the months where little moved, which is ordinary in a consideration cycle measured in weeks.",
    next: "Next month's priorities in order, with the reasoning behind the order rather than just the list.",
  },

  "energy-petrochemical": {
    body: "The same four questions every month. For a technical buyer the answers are about specification coverage rather than keyword counts.",
    did: "The work completed that month, named task by task: capability and specification pages, the technical detail that makes them findable, and the fixes that let a procurement search reach them at all.",
    why: "Why that work came first, which is usually a capability the business sells and cannot be found for, or a page written in adjectives where the search was written in specifications.",
    changed: "Which specification and capability searches moved, and what the enquiries that did arrive were actually looking for. Reported honestly, including the months where little moved.",
    next: "Next month's priorities in order, on a cycle measured in months rather than weeks, because the buying is.",
  },

  "maritime-logistics": {
    body: "The same four questions every month. For a logistics business the answers are organised by route, mode and capability, because that is how the searches are.",
    did: "The work completed that month, named task by task: route and capability pages, the certification and coverage detail that gets searched for by name, and the technical work behind both.",
    why: "Why that work came first, which is usually a lane or a capability with no page behind it, or a certification buyers search for that the site never actually states.",
    changed: "What moved across route, mode and capability searches, and on the urgent ones that only appear when something is down. Reported honestly, including the months where little moved.",
    next: "Next month's priorities in order, so nothing in the following recap arrives as a surprise.",
  },

  "commercial-construction-infrastructure": {
    body: "The same four questions every month. For a contractor the answers are about being qualified, which happens long before anybody calls.",
    did: "The work completed that month, named task by task: project-type pages, the evidence in text that a qualifying reader is looking for, and the technical work sitting behind both.",
    why: "Why that work came first, which is usually a project type the business bids on with nothing published about it, or a page that ranks and then fails to qualify the reader who lands on it.",
    changed: "Which project-type searches moved, and what the enquiries that arrived were bidding on. Reported honestly, including the months where little moved.",
    next: "Next month's priorities in order, aligned to the project types actually being bid rather than to a content calendar.",
  },

  "aerospace-aviation": {
    body: "The same four questions every month. In aerospace the answers start with approvals, because that is the first filter a buyer applies.",
    did: "The work completed that month, named task by task: capability and approval pages, part and service detail made findable, and the technical work that lets a very narrow search reach it.",
    why: "Why that work came first, which is usually an approval or a capability buyers filter on that the site does not state in a form search can read.",
    changed: "Which part, capability and approval searches moved, and what the enquiries that arrived were qualified against. Reported honestly, including the months where little moved.",
    next: "Next month's priorities in order, on a procurement cycle that does not reward rushing.",
  },
};

function monthlyRecap(slug: string): Section {
  const recap = RECAPS[slug];
  if (!recap) {
    // A new industry without its own recap would silently inherit nothing.
    // Failing here is cheaper than shipping a page with an empty block.
    throw new Error(`No recap copy for industry "${slug}". Add one to RECAPS.`);
  }

  return {
    id: "monthly-recap",
    type: "reportingBlock",
    tone: "white",
    eyebrow: "Reporting",
    heading: "The Monthly Recap",
    ...recap,
    cta: {
      label: "See How JMC Reports SEO Progress",
      href: "/seo-reporting",
    },
  };
}

/** §7. Identical on all eight pages. */
const finalCta: Section = {
  id: "final-cta",
  type: "finalCta",
  heading: "Start With a Visibility Review",
  body: "Where the business appears today, which searches it is missing, and which of those gaps is worth closing first.",
  primaryCta: { label: "Request a Visibility Review", href: "/contact" },
  secondaryCta: { label: "Explore Industries", href: "/industries" },
};

/** FAQ slots 4 and 5. Written once, reused eight times. */
function sharedFaq(industry: string) {
  return [
    {
      question: "Which service fits a business like this?",
      answer:
        "It depends on reach rather than size. If the customers are in a defined area, that is Local SEO, however many locations are involved. If the business competes across several markets or service lines, that is Traditional SEO. A visibility review sorts it in one conversation.",
    },
    {
      question: `Does JMC specialise in ${industry.toLowerCase()}?`,
      answer:
        "No, and that is deliberate. A specialist charges for pattern-matching from other clients in your sector, which JMC does not pretend to have yet. What is on offer instead is a method that works regardless of sector, and reporting clear enough that you can see whether it is working.",
    },
  ];
}

/* ------------------------------------------------------------- the eight -- */

type Industry = {
  slug: string;
  name: string;
  /** Shorter form where the full name would blow the 60-character title. */
  shortName?: string;
  icon: IconName;
  /** One line for the hub grid. Describes, never claims expertise. */
  blurb: string;
  group: "consumer" | "industrial";
  h1: string;
  heroSub: string;
  seoTitle: string;
  metaDescription: string;
  /**
   * How this page opens, and how §2 is laid out.
   *
   * Page Spec 09 §1 asks for the same hero visual on all eight pages, and the
   * reason it gives is "no per-industry illustration" — nothing on the page
   * should imply JMC holds sector-specific assets or expertise. Eight pages
   * opening with identical panels went further than that and made the set read
   * as one page repeated, which is its own kind of dishonesty.
   *
   * The compromise: the same component and the same abstract vocabulary on
   * every page, with the motif and the panel copy describing how buyers in
   * that sector search. That is the subject §3 is built on, it is a statement
   * about the buyer rather than about JMC, and nothing is drawn that depicts
   * an industry.
   */
  style: {
    motif: "report" | "coverage" | "roadmap" | "channels" | "growth";
    /** The hero panel. Behaviour, never a claim, and never a number. */
    panel: { label: string; title: string; items: string[] };
    aside: { label: string; title: string; items: string[] };
    /** §2 heading and layout. Rotated so no two neighbours look alike. */
    audienceHeading: string;
    audienceVariant: "cards" | "compact" | "numbered" | "split";
  };
  /** §4. Which service lane, or lanes, this page routes to. See howJmcWorks. */
  lanes: Lanes;
  /** §2. One card per child business type. Counts are fixed by the spec. */
  children: { title: string; body: string; icon: IconName }[];
  /** §3. The section that earns each page its separate existence. */
  search: {
    heading: string;
    body: string;
    points: { title: string; body: string; icon: IconName }[];
  };
  /** §6. Three industry-specific questions, before the two shared ones. */
  faq: { question: string; answer: string }[];
};

const industries: Industry[] = [
  {
    slug: "home-services-trades",
    name: "Home Services & Trades",
    icon: "wrench",
    group: "consumer",
    blurb: "Trades and home service businesses that get found at the moment something breaks.",
    h1: "SEO for Home Services and Trades",
    heroSub:
      "Home service searches are urgent, local, and mostly made on a phone. Getting found in that moment is a different problem from ranking for a term someone researches over a fortnight.",
    seoTitle: "Home Services & Trades SEO | Houston Area",
    metaDescription:
      "SEO for HVAC, roofing, plumbing, electrical and landscaping businesses in the Houston area. Local visibility, profile work, and clear monthly reporting.",
    style: {
      motif: "coverage",
      panel: {
        label: "How buyers search",
        title: "Urgent and Nearby",
        items: [
          "On a phone",
          "Outside business hours",
          "Inside a drive-time radius",
          "Decided in minutes",
        ],
      },
      aside: {
        label: "What it rests on",
        title: "Profile and Listings",
        items: ["Map pack", "Categories", "Reviews"],
      },
      audienceHeading: "The Trades This Applies To",
      audienceVariant: "cards",
    },
    /* "More often than not, home services and these tradespeople are all actually going to fall into the local SEO space. We are probably not going to do a traditional SEO campaign for them." He then said to leave it for now; acting on the conclusion rather than the pause. One word to revert. */
    lanes: "local",
    children: [
      {
        title: "HVAC & Climate Control",
        icon: "gauge",
        body: "Demand spikes with the weather, and the searches that come with it are almost always urgent. Visibility has to already be there when the heat arrives.",
      },
      {
        title: "Power Washing & Exterior Cleaning",
        icon: "storefront",
        body: "A seasonal, price-comparable service where the first few businesses a homeowner finds usually get the quote requests.",
      },
      {
        title: "Roofing & Exterior Remodeling",
        icon: "home",
        body: "High-value jobs with a longer decision than most trades, and a spike in searches after every storm.",
      },
      {
        title: "Electrical & Plumbing Trades",
        icon: "lightning",
        body: "A split between emergency calls and planned work, and the two are searched for in completely different language.",
      },
      {
        title: "Landscaping & Tree Services",
        icon: "wrench",
        body: "Recurring and one-off work side by side, usually chosen within a tight drive-time radius.",
      },
    ],
    search: {
      heading: "What Search Looks Like in the Trades",
      body: "Trades searches are mostly emergencies, and an emergency search behaves nothing like a considered one. Someone whose air conditioning has failed in August is on a phone, will call one of the first businesses they see, and will not open a second page of results. Storm damage does the same thing to roofing at a larger scale, and it happens with no notice.\n\nThe buying cycle is short, often minutes. That makes the map pack and the profile more valuable here than almost anywhere else, and it makes an incomplete listing an expensive problem rather than a tidy-up job. Competition is usually local, which is the good news: the field is the businesses inside the same drive-time radius, not every company in the state.",
      points: [
        {
          title: "Phone first, and often after hours",
          icon: "phone",
          body: "The searches that convert best arrive outside business hours and end in a tap on a phone number.",
        },
        {
          title: "Seasonal spikes with no warning",
          icon: "lightning",
          body: "Weather sets the calendar. Visibility has to be built before the spike, because there is no time to build it during one.",
        },
        {
          title: "Won or lost inside the map pack",
          icon: "map-pin",
          body: "For urgent work the profile carries more weight than the website, so the two have to agree with each other.",
        },
      ],
    },
    faq: [
      {
        question: "How quickly can a trades business expect to see movement?",
        answer:
          "Local work tends to move faster than national search because the competing field is smaller, but there is no honest way to promise a date. Profile and listing corrections can show up within weeks; content and authority work is a longer arc, and the recap tells you which one you are watching each month.",
      },
      {
        question: "Does a service-area business without a storefront rank differently?",
        answer:
          "Yes. A service-area business hides its address and is ranked against the area it covers rather than a pin on a map, which makes the service area definition, the categories, and consistent listings do more of the work.",
      },
      {
        question: "Is it worth doing SEO if most work comes from referrals?",
        answer:
          "Usually. Referrals get searched for by name before anyone calls, and a weak profile or a thin website loses jobs that were already won. That is often the cheapest fix on the list.",
      },
    ],
  },

  {
    slug: "healthcare-wellness",
    name: "Healthcare & Wellness",
    icon: "heart-pulse",
    group: "consumer",
    blurb: "Practices and clinics where patients choose from a short list and book an appointment.",
    h1: "SEO for Healthcare and Wellness Practices",
    heroSub:
      "Patients research before they book, and they usually stop at the first practice that looks credible and close. Visibility and reputation do the work together here.",
    seoTitle: "Healthcare & Wellness SEO | Houston Area",
    metaDescription:
      "SEO for dental, medical, therapy and wellness practices in the Houston area. Local visibility, profile and review support, and reporting you can actually read.",
    style: {
      motif: "growth",
      panel: {
        label: "How patients search",
        title: "By Symptom, Not Specialty",
        items: [
          "What hurts, in plain words",
          "Somewhere close by",
          "Checked against reviews",
          "Booked, or abandoned",
        ],
      },
      aside: {
        label: "What it rests on",
        title: "Reputation and Access",
        items: ["Reviews", "Photos", "Booking path"],
      },
      audienceHeading: "Practices This Applies To",
      audienceVariant: "compact",
    },
    /* "They are probably going to be local SEO, not traditional, or something custom." Same deferral as home services, same reasoning applied. One word to revert. */
    lanes: "local",
    children: [
      {
        title: "Mental & Behavioral Health Professionals",
        icon: "users",
        body: "Searched for privately and carefully, often by specialty and modality rather than by practice name.",
      },
      {
        title: "Private Dental & Medical Practices",
        icon: "heart-pulse",
        body: "Among the most competitive local categories anywhere, with searches split between routine care and urgent problems.",
      },
      {
        title: "Physical Therapy & Sports Rehab",
        icon: "shield-check",
        body: "Referral-heavy, but nearly every referral gets checked online before an appointment is made.",
      },
      {
        title: "Medical Spas & Wellness Clinics",
        icon: "star",
        body: "A discretionary purchase where reviews, photos and the profile carry as much weight as the website.",
      },
    ],
    search: {
      heading: "What Search Looks Like in Healthcare",
      body: "Patients search by symptom and by condition far more than by specialty. Somebody types what hurts, not the clinical name for the practitioner who fixes it, and the gap between those two vocabularies is where most practice websites lose traffic they should have had.\n\nThe cycle is short but not instant. A patient will usually look at two or three practices, check reviews on each, glance at photographs, and book the one that feels closest to both an answer and a location. That makes the profile, the reviews and the appointment path part of the SEO problem rather than separate from it. Competition is local and dense, particularly in dentistry, so the difference between the third and the first result is measured in booked appointments.",
      points: [
        {
          title: "Searched by symptom, not by specialty",
          icon: "search",
          body: "Content has to meet the language patients actually use before it can rank for it.",
        },
        {
          title: "Reviews are read before the site is",
          icon: "star",
          body: "Reputation and visibility are the same job here, which is why review support sits inside the packages.",
        },
        {
          title: "Booking friction undoes the ranking",
          icon: "calendar",
          body: "Being found first is worth little if the next step is a phone number and an answering machine.",
        },
      ],
    },
    faq: [
      {
        question: "Can a practice site rank without publishing medical advice?",
        answer:
          "Yes. Most of the useful traffic comes from service, condition and location pages describing what the practice treats and how a patient starts, rather than from clinical articles that need a physician to write and review them.",
      },
      {
        question: "How are patient reviews handled?",
        answer:
          "Packages include review request sends and replies. Nothing is fabricated or incentivised, and no review is ever written on a practice's behalf, which would breach both the platform rules and the positioning this agency is built on.",
      },
      {
        question: "Does a multi-location practice need separate pages?",
        answer:
          "Usually yes. Each location needs its own profile, its own consistent listings, and enough of its own content that the two locations are not competing with each other in the same results.",
      },
    ],
  },

  {
    slug: "hospitality-attractions",
    name: "Hospitality & Attractions",
    shortName: "Hospitality",
    icon: "utensils",
    group: "consumer",
    blurb: "Places people plan a visit to, from an evening out to a weekend away.",
    h1: "SEO for Hospitality and Attractions",
    heroSub:
      "Hospitality search runs on two clocks at once: someone deciding where to eat in ten minutes, and someone planning a visit six weeks out. The same business has to be visible in both.",
    seoTitle: "Hospitality & Attractions SEO | Houston Area",
    metaDescription:
      "SEO for hotels, restaurants, venues and attractions in the Houston area and beyond. Local and regional visibility, profile work, and clear monthly reporting.",
    style: {
      motif: "report",
      panel: {
        label: "Two clocks at once",
        title: "Now, and Six Weeks Out",
        items: [
          "Deciding on a street",
          "Planning a weekend",
          "Comparing across tabs",
          "Booking direct, or not",
        ],
      },
      aside: {
        label: "What it rests on",
        title: "Listings and Detail",
        items: ["Hours", "Photos", "Menus and pages"],
      },
      audienceHeading: "Places This Applies To",
      audienceVariant: "cards",
    },
    /* Confirmed both: "the only one so far that is going to stay both is hospitality and attractions." */
    lanes: "both",
    children: [
      {
        title: "RV Parks & Campground Resorts",
        icon: "map-pin",
        body: "Booked weeks ahead by people comparing sites, amenities and location across a whole region.",
      },
      {
        title: "Regional Venues & Event Spaces",
        icon: "calendar",
        body: "A long, considered booking with a high value, researched across many sites before anyone makes contact.",
      },
      {
        title: "Coastal & Waterway Attractions",
        icon: "ship",
        body: "Draws visitors from well outside the immediate area, which pulls the work beyond a single local radius.",
      },
      {
        title: "Boutique Hotels & Lodging",
        icon: "building",
        body: "Competing against booking platforms that outrank almost everyone, so direct visibility has to be earned in the gaps they leave.",
      },
    ],
    search: {
      heading: "What Search Looks Like in Hospitality",
      body: "Hospitality is two industries wearing one coat. A restaurant is found by someone standing on a street with ten minutes of patience, where hours, photographs and the map listing settle it before the website is opened. A venue or a hotel is found by someone planning weeks ahead, comparing options across a dozen tabs, and reading far more than a listing.\n\nThe second kind is where the reach question decides the service. A neighbourhood restaurant competes inside a few miles. A destination attraction or a wedding venue draws from a whole region and competes with businesses in other cities for the same visit, which is a different problem with a different set of pages behind it. Booking platforms sit on top of many of these results, so part of the work is finding the searches they do not dominate.",
      points: [
        {
          title: "Two clocks, one business",
          icon: "calendar",
          body: "Immediate searches and planned ones need different pages and different language.",
        },
        {
          title: "Photos and hours decide the click",
          icon: "image",
          body: "Profile content is not housekeeping here. It is the deciding factor on the highest-volume searches.",
        },
        {
          title: "Reach varies wildly by format",
          icon: "globe",
          body: "A local bar and a regional attraction are not the same engagement, which is why neither lane is assumed.",
        },
      ],
    },
    faq: [
      {
        question: "Is this a local or a regional problem?",
        answer:
          "It depends on where guests come from. A neighbourhood restaurant is Local SEO. An attraction or venue that draws from across the region competes across markets, which points toward Traditional SEO. That question gets answered in the review rather than assumed from the category.",
      },
      {
        question: "Can SEO compete with the booking platforms?",
        answer:
          "Not by outranking them everywhere. It works by taking the searches they handle badly, particularly branded, specific and planning-stage queries, and by making the direct booking path the obvious one once someone has found you.",
      },
      {
        question: "How much does the Google Business Profile matter?",
        answer:
          "More than in almost any other sector. Hours, photographs, menu links and attributes are read directly in the results by people who never reach the website, so a stale profile costs visits outright.",
      },
    ],
  },

  {
    slug: "professional-services",
    name: "Professional Services",
    icon: "briefcase",
    group: "consumer",
    blurb: "Firms whose clients compare a shortlist before they ever make contact.",
    h1: "SEO for Professional Services Firms",
    heroSub:
      "Professional services buyers research quietly and at length, then contact one or two firms. Most of the decision happens before anyone picks up a phone.",
    seoTitle: "Professional Services SEO | Houston Area",
    metaDescription:
      "SEO for legal, accounting, financial and consulting firms in the Houston area. Strategy, content built for how clients search, and clear monthly reporting.",
    style: {
      motif: "growth",
      panel: {
        label: "How clients search",
        title: "Quietly, Over Weeks",
        items: [
          "A practice area and a place",
          "A situation in plain words",
          "Several visits, no contact",
          "One or two firms called",
        ],
      },
      aside: {
        label: "What it rests on",
        title: "Specificity",
        items: ["Service pages", "Named people", "Clear scope"],
      },
      audienceHeading: "Firms This Applies To",
      audienceVariant: "numbered",
    },
    /* "All of these are usually going to be regional, statewide kind of things. We are going to be tackling a much larger area than any local search function is really going to want to tackle from a local grid." Same deferral; acting on the conclusion. One word to revert. */
    lanes: "traditional",
    children: [
      {
        title: "Law Firms & Legal Services",
        icon: "shield-check",
        body: "Among the most competitive search categories that exists, with a lead value high enough to justify the fight.",
      },
      {
        title: "Accounting & Wealth Management",
        icon: "bar-chart",
        body: "Strongly seasonal for some services and steady for others, with a long client relationship at the end of it.",
      },
      {
        title: "Commercial Insurance & Staffing",
        icon: "briefcase",
        body: "Sold business to business on specificity and coverage, where a vague services page loses to a precise one.",
      },
    ],
    search: {
      heading: "What Search Looks Like in Professional Services",
      body: "Buyers here are cautious and largely invisible. They read, they compare, they check credentials, and they often visit a firm's site several times over weeks without ever filling in a form. The consequence is that traffic and enquiries move on different timelines, and a report that only shows enquiries misses most of what changed.\n\nThe searches themselves are specific. People look for a practice area plus a place, or a situation described in plain language, and generic pages built around the firm rather than the problem do badly against them. Lead value is high, which changes the arithmetic: a small number of the right visitors is worth more than a large number of the wrong ones, and that is what the tracked keyword set should reflect.",
      points: [
        {
          title: "A long, quiet consideration",
          icon: "clipboard-check",
          body: "Several visits before contact is normal, so early traffic movement matters before enquiries do.",
        },
        {
          title: "Practice area plus place",
          icon: "search",
          body: "Specific pages for specific services beat one broad page that tries to hold all of them.",
        },
        {
          title: "Credibility is a ranking factor in practice",
          icon: "shield-check",
          body: "Named people, real detail and clear scope outperform anonymous copy for both readers and search engines.",
        },
      ],
    },
    faq: [
      {
        question: "Why do enquiries lag behind traffic in this sector?",
        answer:
          "Because the decision takes weeks and involves several visits. That is normal here, and it is one of the reasons the recap reports what changed in visibility as well as what came through the form.",
      },
      {
        question: "Does a firm need a page per service?",
        answer:
          "Generally yes. Clients search for a specific practice area, and a single page trying to cover six of them tends to rank for none of them well.",
      },
      {
        question: "Are results in a competitive practice area realistic?",
        answer:
          "In the most contested categories, progress usually starts on more specific searches rather than the broadest term. That is a slower route but a real one, and the reporting is explicit about which stage the work is at.",
      },
    ],
  },

  {
    slug: "energy-petrochemical",
    name: "Energy & Petrochemical",
    icon: "lightning",
    group: "industrial",
    blurb: "Suppliers and service firms selling into plants, operators and procurement teams.",
    h1: "SEO for Energy and Petrochemical Suppliers",
    heroSub:
      "Buyers in this sector search by specification, not by adjective. The work is making a business findable in the exact technical language its customers already use.",
    seoTitle: "Energy & Petrochemical SEO | Houston Area",
    metaDescription:
      "SEO for energy and petrochemical service firms, suppliers and consultancies. Search built around specifications, procurement cycles, and clear reporting.",
    style: {
      motif: "report",
      panel: {
        label: "How buyers search",
        title: "By Specification",
        items: [
          "Standards and materials",
          "Part numbers",
          "Compliance requirements",
          "Never adjectives",
        ],
      },
      aside: {
        label: "Who is searching",
        title: "Three People, One Purchase",
        items: ["Engineer", "Procurement", "Approver"],
      },
      audienceHeading: "Suppliers and Service Firms",
      audienceVariant: "split",
    },
    /* "They are going to be traditional SEO. We are not going to be running a local SEO campaign for them. So we can remove local." */
    lanes: "traditional",
    children: [
      {
        title: "Oil & Gas Field Services & Logistics",
        icon: "hard-hat",
        body: "Contracted on capability and compliance, and often searched for during a turnaround or an outage.",
      },
      {
        title: "Petrochemical Plant Services & Contracting",
        icon: "factory",
        body: "Qualified long before any conversation, on certifications, safety record and plant experience.",
      },
      {
        title: "Industrial Equipment & Supplies",
        icon: "layers",
        body: "Found by part number, specification and standard far more often than by company name.",
      },
    ],
    search: {
      heading: "What Search Looks Like in Energy",
      body: "The searches are technical and unglamorous. A procurement manager or an engineer types a specification, a standard, a material or a part number, and the pages that win are the ones that carry those terms in a form a search engine can read. Marketing language actively hurts here, because nobody is searching for a phrase like world-class solutions.\n\nThe cycle is long, often months, and rarely involves one person. An engineer shortlists, procurement checks compliance, and a manager approves, and each of those people arrives through a different search. Competition is regional and national rather than local, which is what puts most of this sector in the Traditional lane, though a small field-service business working one area is a genuine Local engagement.",
      points: [
        {
          title: "Specifications, not adjectives",
          icon: "code",
          body: "Standards, materials and part numbers are the search terms. Pages have to contain them plainly.",
        },
        {
          title: "Several searchers, one purchase",
          icon: "users",
          body: "Technical, compliance and commercial questions each need their own page rather than one overview.",
        },
        {
          title: "Months, not minutes",
          icon: "calendar",
          body: "A long cycle means early visibility work shows up in enquiries much later than it shows up in traffic.",
        },
      ],
    },
    faq: [
      {
        question: "Does SEO work when there are only a handful of real buyers?",
        answer:
          "It can, because the value of one contract is high enough that a small number of the right visitors justifies the work. It also changes what gets tracked: a narrow, technical keyword set matters far more than total traffic.",
      },
      {
        question: "How is technical content produced without in-house expertise?",
        answer:
          "By working from your specifications, datasheets and existing documentation rather than inventing them. Nothing technical is published without your review, because a wrong specification on a page costs more than a missing one.",
      },
      {
        question: "Is this Local or Traditional SEO?",
        answer:
          "Usually Traditional, because buyers are spread across markets. A field-service business working one area is a Local engagement, and location count never decides it. Reach does.",
      },
    ],
  },

  {
    slug: "maritime-logistics",
    name: "Maritime & Logistics",
    shortName: "Maritime",
    icon: "ship",
    group: "industrial",
    blurb: "Port, freight and marine operators whose customers are other businesses.",
    h1: "SEO for Maritime and Logistics Operators",
    heroSub:
      "Logistics buyers search by route, service and capability, often under time pressure. Being findable in that language is most of the job.",
    seoTitle: "Maritime & Logistics SEO | Houston Area",
    metaDescription:
      "SEO for port services, freight operators, and marine repair and fabrication firms. Search built around routes, capability, and how logistics buyers search.",
    style: {
      motif: "coverage",
      panel: {
        label: "How buyers search",
        title: "By Route and Capability",
        items: [
          "A route and a mode",
          "A port and a service",
          "A vessel and a repair",
          "Often under time pressure",
        ],
      },
      aside: {
        label: "What it rests on",
        title: "Coverage and Compliance",
        items: ["Ports served", "Certifications", "Response"],
      },
      audienceHeading: "Operators This Applies To",
      audienceVariant: "compact",
    },
    /* "For maritime, we are going to keep it traditional, just because I do not think local is a proper function." */
    lanes: "traditional",
    children: [
      {
        title: "Port Services & Stevedoring",
        icon: "ship",
        body: "Searched by service and by port, with capability and certification usually deciding the shortlist.",
      },
      {
        title: "Freight Transport & Warehousing",
        icon: "network",
        body: "Route, mode and capacity drive the search, and comparison against several operators is standard.",
      },
      {
        title: "Marine Repair & Industrial Supplies",
        icon: "wrench",
        body: "Often urgent, because a vessel out of service is costing money every day it waits.",
      },
    ],
    search: {
      heading: "What Search Looks Like in Logistics",
      body: "Logistics search sits between the urgency of a trade and the caution of a procurement purchase. A freight buyer looking for a route and a mode will compare several operators before making contact, but a vessel needing repair is an emergency with a daily cost attached, and those two searches want completely different pages.\n\nThe vocabulary is precise. Routes, ports, vessel types, cargo classes and certifications are the terms people use, and a site organised around company departments rather than around those terms is hard to find no matter how good the business is. Reach varies enormously: a single-yard repair business competes locally, while a freight operator moving cargo across the region competes with operators in other cities for the same contract.",
      points: [
        {
          title: "Route, mode, capability",
          icon: "network",
          body: "Pages organised by what customers ship and where, rather than by internal department.",
        },
        {
          title: "Downtime makes some searches urgent",
          icon: "warning",
          body: "Repair and emergency service searches behave like a trade call, and need to be treated that way.",
        },
        {
          title: "Certifications are search terms",
          icon: "shield-check",
          body: "Compliance and accreditation are often the filter, so they belong on the page rather than in a PDF.",
        },
      ],
    },
    faq: [
      {
        question: "Do customers really find logistics providers through search?",
        answer:
          "For new suppliers and for urgent requirements, frequently. Long-standing contracts come through relationships, but the shortlist for a new route or an unplanned repair is very often built from a search.",
      },
      {
        question: "Should pages be built around routes or around services?",
        answer:
          "Both, usually, because they are searched differently. A service page explains capability; a route or port page catches the searches that name a specific place.",
      },
      {
        question: "How is an urgent repair enquiry handled differently?",
        answer:
          "Those searches need a fast, obvious path to a phone number and clear coverage information, which is closer to how a trades page works than to how a procurement page works.",
      },
    ],
  },

  {
    slug: "commercial-construction-infrastructure",
    name: "Commercial Construction & Infrastructure",
    shortName: "Construction",
    icon: "hard-hat",
    group: "industrial",
    blurb: "Contractors, civil firms and suppliers working on commercial and public projects.",
    h1: "SEO for Commercial Construction Firms",
    heroSub:
      "Commercial construction is won on capability, references and bid lists, but the shortlist is increasingly built by searching. Being on it starts with being findable.",
    seoTitle: "Commercial Construction SEO | Houston Area",
    metaDescription:
      "SEO for commercial contractors, civil and infrastructure firms, and building products suppliers. Search built around project type and qualification work.",
    style: {
      motif: "growth",
      panel: {
        label: "How buyers search",
        title: "To Qualify, Not to Enquire",
        items: [
          "Project type and sector",
          "Scale and scope",
          "Certifications held",
          "Before any invitation",
        ],
      },
      aside: {
        label: "What it rests on",
        title: "Evidence in Text",
        items: ["Project pages", "Capability", "Standards met"],
      },
      audienceHeading: "Contractors and Suppliers",
      audienceVariant: "numbered",
    },
    /* Confirmed both: "we will let it be local and traditional on this page." */
    lanes: "both",
    children: [
      {
        title: "Commercial & Industrial Subcontractors",
        icon: "hard-hat",
        body: "Shortlisted on trade, project type and sector experience long before any bid conversation happens.",
      },
      {
        title: "Civil & Roadway Contracting",
        icon: "building",
        body: "Public and private procurement with long cycles and a heavy emphasis on qualification.",
      },
      {
        title: "Earthmoving, Crane & Site Services",
        icon: "layers",
        body: "Hired on equipment, capacity and availability, frequently at short notice on an active site.",
      },
    ],
    search: {
      heading: "What Search Looks Like in Construction",
      body: "The searches that matter here rarely look like lead generation. An architect looking for a product that meets a standard, a developer checking whether a contractor has done a project of a given type before, a procurement team qualifying a supplier: all of them are searching, and none of them will fill in a contact form on the first visit.\n\nThat makes the project and capability pages the working part of a construction site. Sector, project type, scale and qualification are the terms people search, and a portfolio organised as a photo gallery answers none of them. The cycle is measured in months, competition runs regional to national, and the value of a single project means a small volume of exactly the right visitors is the goal rather than traffic.",
      points: [
        {
          title: "Qualification, not enquiry",
          icon: "clipboard-check",
          body: "Most visitors are checking whether you qualify. The site has to answer that without a conversation.",
        },
        {
          title: "Project type is the search term",
          icon: "search",
          body: "Sector and project pages do the ranking. A gallery of photographs does not.",
        },
        {
          title: "Specified before it is bought",
          icon: "file-text",
          body: "For suppliers, the decision often happens with the specifier rather than with the buyer.",
        },
      ],
    },
    faq: [
      {
        question: "Does SEO matter when work comes through bid lists?",
        answer:
          "Yes, because getting onto the list increasingly involves being found and checked first. Firms are researched before they are invited, and a thin website removes you from consideration quietly.",
      },
      {
        question: "What should a project portfolio actually contain?",
        answer:
          "Project type, sector, scale and scope written as text, not only photographs. That is what people search for, and images alone cannot be read as an answer to it.",
      },
      {
        question: "How long is the payback in this sector?",
        answer:
          "Longer than in consumer categories, because the cycle itself is long. The recap tracks visibility and qualification-stage movement in the meantime rather than pretending an enquiry count tells the whole story.",
      },
    ],
  },

  {
    slug: "aerospace-aviation",
    name: "Aerospace & Aviation",
    icon: "plane",
    group: "industrial",
    blurb: "Manufacturers, service providers and suppliers in a heavily qualified supply chain.",
    h1: "SEO for Aerospace and Aviation Suppliers",
    heroSub:
      "Aerospace buyers search by part, standard and certification, and they qualify before they contact. The work is being findable and credible in that order.",
    seoTitle: "Aerospace & Aviation SEO | Houston Area",
    metaDescription:
      "SEO for aerospace manufacturers, MRO and ground service providers, and avionics suppliers. Search built around parts, certification and procurement work.",
    style: {
      motif: "report",
      panel: {
        label: "How buyers search",
        title: "By Part and Approval",
        items: [
          "Part numbers",
          "Materials and specifications",
          "Certifications first",
          "Across several weeks",
        ],
      },
      aside: {
        label: "What it rests on",
        title: "Findable Detail",
        items: ["Crawlable pages", "Named approvals", "Published ranges"],
      },
      audienceHeading: "Suppliers This Applies To",
      audienceVariant: "split",
    },
    /* "Aerospace has no local. It is only going to be traditional SEO." */
    lanes: "traditional",
    children: [
      {
        title: "Aviation Services & Hangar Operations",
        icon: "plane",
        body: "Capability, certification and location together decide who gets contacted.",
      },
      {
        title: "Aerospace Manufacturing & Parts Suppliers",
        icon: "factory",
        body: "Found by part number, material and specification, frequently by an engineer rather than a buyer.",
      },
      {
        title: "Defense & Space Contracting",
        icon: "shield-check",
        body: "Clearance, compliance and past performance are the first filters applied, before capability.",
      },
    ],
    search: {
      heading: "What Search Looks Like in Aerospace",
      body: "Aerospace is the clearest example of search as qualification rather than as marketing. A procurement manager comparing specifications over six weeks is not going to be moved by a headline, and an engineer searching for a part number either finds a page carrying that number or does not. Certification is often the first filter applied, before capability and long before price.\n\nThe practical consequence is that the searchable surface of a supplier's site is usually far too small. Capabilities live in a PDF, part ranges live in a table nobody can crawl, and approvals are named on an about page rather than where they would be searched for. Fixing that is unglamorous work with an unusually direct effect, and the competition for it is national rather than local.",
      points: [
        {
          title: "Certification filters first",
          icon: "shield-check",
          body: "Approvals belong on crawlable pages, not only inside a downloadable document.",
        },
        {
          title: "Part numbers are queries",
          icon: "search",
          body: "If a range only exists inside a PDF or a script-driven table, it cannot be found.",
        },
        {
          title: "Weeks of comparison before contact",
          icon: "calendar",
          body: "The site is doing the selling during a period when nobody is talking to you.",
        },
      ],
    },
    faq: [
      {
        question: "Is search volume high enough to be worth the work?",
        answer:
          "Volume is low and value is very high, so the goal is not traffic. A narrow set of technical searches, found by the right handful of people, is what the tracked keyword set is built around.",
      },
      {
        question: "What about content that cannot be published?",
        answer:
          "Plenty in this sector is restricted, and none of it needs publishing. The gains usually come from making already-public capability, approvals and part information properly findable.",
      },
      {
        question: "Is a supplier competing locally or nationally?",
        answer:
          "Almost always nationally, which puts most aerospace suppliers in the Traditional lane. A ground services business tied to one airport is the exception, and it is a Local engagement.",
      },
    ],
  },
];

/* ------------------------------------------------------------ the pages -- */

function industryPage(industry: Industry): PageContent {
  const columns = industry.children.length as 3 | 4 | 5;

  return {
    slug: `/industries/${industry.slug}`,
    label: industry.name,
    seoTitle: industry.seoTitle,
    metaDescription: industry.metaDescription,
    sections: [
      {
        id: "hero",
        type: "heroSplit",
        eyebrow: industry.name,
        heading: industry.h1,
        body: industry.heroSub,
        primaryCta: { label: "Request a Visibility Review", href: "/contact" },
        secondaryCta: {
          label: "View Monthly SEO Packages",
          href: "/monthly-seo-packages",
        },
        // Same component and same abstract vocabulary on all eight, with
        // the motif and the copy describing how buyers in this sector search.
        // Nothing here depicts an industry or claims expertise in one.
        showcase: [
          { kind: industry.style.motif, ...industry.style.panel },
          { kind: "coverage", ...industry.style.aside },
        ],
      },

      {
        id: "who-this-is-for",
        type: "cardGrid",
        tone: "surface",
        variant: industry.style.audienceVariant,
        columns,
        eyebrow: "Who This Is For",
        heading: industry.style.audienceHeading,
        body: "The kinds of business this applies to. Naming a category is not a claim of expertise in it.",
        // Deliberately no cta on any card: the child pages are phase two, and
        // the card already accepts one, so shipping them later is content
        // entry rather than a template change.
        cards: industry.children,
      },

      {
        id: "search-behaviour",
        type: "featureSplit",
        tone: "white",
        /*
         * Copy left, points right, on all eight. Fixed rather than a
         * per-industry field, because the client was unambiguous: "This is
         * the layout that I want on every single page right here... I want
         * this layout, not the other way around. I like this better because
         * we read from left to right here in the US."
         *
         * It used to alternate down the set so no two neighbouring pages
         * looked alike. That was solving a problem nobody reported — these
         * pages are landed on one at a time from search, not read in
         * sequence — at the cost of the reading order being inconsistent on
         * the one section that carries each page's actual argument.
         */
        align: "left",
        eyebrow: "Search Behaviour",
        heading: industry.search.heading,
        body: industry.search.body,
        groups: industry.search.points,
      },

      howJmcWorks(industry.name, industry.lanes),
      monthlyRecap(industry.slug),

      {
        id: "faq",
        type: "faq",
        tone: "surface",
        eyebrow: "Questions",
        heading: `${industry.shortName ?? industry.name} Questions`,
        items: [...industry.faq, ...sharedFaq(industry.name)],
        cta: { label: "Request a Visibility Review", href: "/contact" },
      },

      finalCta,
    ],
  };
}

export const industryPages: PageContent[] = industries.map(industryPage);

/* -------------------------------------------------------------- the hub -- */

const group = (which: "consumer" | "industrial") =>
  industries
    .filter((i) => i.group === which)
    .map((i) => ({
      title: i.name,
      body: i.blurb,
      icon: i.icon,
      href: `/industries/${i.slug}`,
    }));

export const industriesIndexPage: PageContent = {
  slug: "/industries",
  label: "Industries",
  seoTitle: "Industries | Houston Area SEO for Any Sector",
  metaDescription:
    "JMC works across trades, healthcare, hospitality, professional services, energy, maritime, construction and aerospace. The method does not change at all.",
  sections: [
    {
      id: "hero",
      type: "heroCentered",
      eyebrow: "Industries",
      heading: "The Method Doesn't Change With the Industry",
      body: "Eight sectors, one approach. What changes between them is the search language, not the work.",
      // Page Spec 08 §1 opened this hero with no buttons, on the reasoning
      // that the grid below is the action. Overridden in the client review on
      // 2026-10-14: "I think we do need a CTA up here ... but it needs to be a
      // button." The body was cut in the same pass, for the reason he gave --
      // the hero ran long and then the section under it said the same thing.
      // The clause that left ("how long they take to decide, and what a single
      // lead is worth") still appears verbatim in "the-method" below, so this
      // is de-duplication rather than a cut.
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "grid",
      type: "industryGrid",
      tone: "surface",
      eyebrow: "Where JMC Works",
      heading: "Eight Industries, Two Kinds of Buyer",
      body: "The grouping below is descriptive. It says who a business sells to, and nothing about which service it needs.",
      groups: [
        { label: "Consumer & Community", cards: group("consumer") },
        { label: "Industrial & B2B", cards: group("industrial") },
      ],
      escapeHatch:
        "The method doesn't change with the industry. If yours isn't listed, it almost certainly still applies.",
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "the-method",
      type: "featureSplit",
      tone: "white",
      align: "left",
      eyebrow: "Pillar",
      heading: "What Stays the Same, and What Doesn't",
      body: "The work is the same regardless of sector. The same audit, the same technical foundation, the same content approach, the same reporting. What changes is the search language buyers use, how long they take to decide, and what a single lead is worth.\n\nThat is a deliberate position rather than a gap. A specialist charges for pattern-matching from other clients in your sector, and JMC does not claim to have that yet. What it offers instead is a method that transfers, run on two tracks depending on whether a business competes in a defined area or across markets.",
      tableHeadings: ["Stays the same", "Varies by industry"],
      tableRows: [
        {
          cells: [
            "Audit and technical foundation",
            "The search language buyers actually use",
          ],
        },
        {
          cells: [
            "On-page and content approach",
            "How long the buying cycle runs",
          ],
        },
        {
          cells: [
            "Reporting and recap structure",
            "What a single lead is worth",
          ],
        },
      ],
      groups: [],
      /**
       * Lane-neutral on purpose. This was "Explore Local SEO" and the client
       * rejected it in the 2026-10-14 review: "because we're doing industries,
       * they may be a traditional SEO client that we've now pushed to local
       * SEO ... that's the wrong CTA." The section argues the method runs on
       * two tracks, so a button that picks one of them for the reader
       * contradicts the paragraph above it. The packages page carries both
       * tracks side by side and lets the reader sort themselves. He also said
       * the final label is still open, so this is the safe answer rather than
       * the settled one.
       */
      cta: { label: "View SEO Packages", href: "/monthly-seo-packages" },
    },

    {
      id: "monthly-recap",
      type: "reportingBlock",
      tone: "surface",
      eyebrow: "Reporting",
      heading: "The Monthly Recap",
      body: "The same four questions every month, whatever the industry.",
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
      id: "faq",
      type: "faq",
      tone: "white",
      eyebrow: "Questions",
      heading: "Industry Questions",
      items: [
        {
          question: "Does JMC specialise in a particular industry?",
          answer:
            "No, and that is deliberate. A specialist charges for pattern-matching from other clients in your sector, which JMC cannot honestly offer yet. What it offers instead is a method that works regardless of sector, and reporting clear enough that you can see whether it is working.",
        },
        {
          question: "What if an industry isn't listed here?",
          answer:
            "The method still applies. The eight above are the sectors most common around the Houston area, not a list of what JMC is willing to work on. A visibility review is the fastest way to find out how the approach lands in yours.",
        },
        {
          question: "Which service fits?",
          answer:
            "Reach decides it, not size. A business competing for customers in a defined area is Local SEO, however many locations it runs. A business competing across markets or service lines is Traditional SEO.",
        },
        {
          question: "Does the industry change the price?",
          answer:
            "No. The packages are the same across every industry. Scope is what produces a custom quote, and scope is about reach and volume rather than sector.",
        },
        {
          question: "Does the industry change the work?",
          answer:
            "The priorities and the search language shift, sometimes a great deal. The method and the reporting do not.",
        },
      ],
      cta: { label: "Request a Visibility Review", href: "/contact" },
    },

    {
      id: "final-cta",
      type: "finalCta",
      heading: "Start With a Visibility Review",
      body: "Where the business appears today, which searches it is missing, and which of those gaps is worth closing first.",
      primaryCta: { label: "Request a Visibility Review", href: "/contact" },
      secondaryCta: {
        label: "View Monthly SEO Packages",
        href: "/monthly-seo-packages",
      },
    },
  ],
};
