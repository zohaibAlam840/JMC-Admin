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

/** §4. Both lanes on all eight pages: no industry is pre-assigned to one. */
function howJmcWorks(industry: string): Section {
  return {
    id: "how-it-works",
    type: "cardGrid",
    tone: "surface",
    variant: "cards",
    columns: 2,
    eyebrow: "Where to Start",
    heading: "Two Ways In, Sorted by Reach",
    body: `The method does not change with the industry. What changes is the search language, the priorities, and what a single lead is worth. Which service fits a ${industry.toLowerCase()} business comes down to where it competes, not how big it is.`,
    cards: [
      {
        title: "Local SEO",
        icon: "map-pin",
        body: "For businesses competing for customers in a defined area, however many locations they run in it.",
        cta: { label: "Explore Local SEO", href: "/local-seo-services" },
      },
      {
        title: "Traditional SEO",
        icon: "globe",
        body: "For businesses competing across multiple markets, multiple service lines, or genuinely competitive search.",
        cta: {
          label: "Explore Traditional SEO",
          href: "/traditional-seo-services",
        },
      },
    ],
  };
}

/** §5. Identical on all eight pages, titles and supporting lines alike. */
const monthlyRecap: Section = {
  id: "monthly-recap",
  type: "reportingBlock",
  tone: "white",
  eyebrow: "Reporting",
  heading: "The Monthly Recap",
  body: "The same four questions every month, whatever the industry.",
  did: "The specific work completed that month, named task by task.",
  why: "Why that work was the priority ahead of everything else in the queue.",
  changed: "What moved, reported honestly, including the months where little did.",
  next: "Next month's priorities, so nothing in the following recap is a surprise.",
  cta: {
    label: "See How JMC Reports SEO Progress",
    href: "/seo-reporting",
  },
};

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
    children: [
      {
        title: "HVAC & Climate Control",
        icon: "gauge",
        body: "Demand spikes with the weather and the searches that come with it are almost always urgent. Visibility has to already be there when the heat arrives.",
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
    children: [
      {
        title: "Dental Practices",
        icon: "heart-pulse",
        body: "One of the most competitive local categories anywhere, with searches split between routine care and urgent problems.",
      },
      {
        title: "Medical & Specialty Clinics",
        icon: "shield-check",
        body: "Often searched by condition rather than by specialty, which is rarely the language the practice uses about itself.",
      },
      {
        title: "Physical Therapy & Chiropractic",
        icon: "users",
        body: "Referral-heavy, but nearly every referral gets checked online before an appointment is made.",
      },
      {
        title: "Med Spas & Wellness Studios",
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
    children: [
      {
        title: "Hotels & Lodging",
        icon: "building",
        body: "Competing against booking platforms that outrank almost everyone, so direct visibility has to be earned in the gaps they leave.",
      },
      {
        title: "Restaurants & Bars",
        icon: "utensils",
        body: "Short-notice, heavily map-driven searches where photos, hours and the menu decide the click.",
      },
      {
        title: "Venues & Event Spaces",
        icon: "calendar",
        body: "A long, considered booking with a high value, researched across many sites before anyone makes contact.",
      },
      {
        title: "Attractions & Tours",
        icon: "compass",
        body: "Draws visitors from well outside the immediate area, which pulls the work beyond a single local radius.",
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
    children: [
      {
        title: "Legal Practices",
        icon: "shield-check",
        body: "Among the most competitive search categories that exists, with a lead value high enough to justify the fight.",
      },
      {
        title: "Accounting & Financial Services",
        icon: "bar-chart",
        body: "Strongly seasonal for some services and steady for others, with a long client relationship at the end of it.",
      },
      {
        title: "Consulting & Agencies",
        icon: "compass",
        body: "Sold on credibility and specificity, where a vague services page loses to a precise one every time.",
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
    children: [
      {
        title: "Field & Industrial Services",
        icon: "hard-hat",
        body: "Contracted on capability and compliance, and often searched for during a turnaround or an outage.",
      },
      {
        title: "Equipment & Component Suppliers",
        icon: "factory",
        body: "Found by part number, specification and standard far more often than by company name.",
      },
      {
        title: "Engineering & Technical Consultancies",
        icon: "compass",
        body: "A long procurement cycle with several people involved, each searching for something different.",
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
    children: [
      {
        title: "Port & Terminal Services",
        icon: "ship",
        body: "Searched by service and by port, with capability and certification usually deciding the shortlist.",
      },
      {
        title: "Freight & Transport Operators",
        icon: "network",
        body: "Route and mode drive the search, and comparison against several operators is standard.",
      },
      {
        title: "Marine Repair & Fabrication",
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
    children: [
      {
        title: "General & Specialty Contractors",
        icon: "hard-hat",
        body: "Shortlisted on project type and sector experience long before any bid conversation happens.",
      },
      {
        title: "Civil & Infrastructure Firms",
        icon: "building",
        body: "Public and private procurement with long cycles and a heavy emphasis on qualification.",
      },
      {
        title: "Building Products & Materials Suppliers",
        icon: "layers",
        body: "Specified by architects and engineers, which means being found by product and standard rather than by brand.",
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
    children: [
      {
        title: "Parts & Component Manufacturers",
        icon: "factory",
        body: "Found by part number, material and specification, frequently by an engineer rather than a buyer.",
      },
      {
        title: "MRO & Ground Services",
        icon: "wrench",
        body: "Capability, certification and location together decide who gets contacted.",
      },
      {
        title: "Avionics & Systems Suppliers",
        icon: "code",
        body: "Highly technical searches, with compliance often acting as the first filter applied.",
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
        // The same composition on all eight pages, by instruction. A
        // per-industry illustration would be the first place a specialization
        // claim crept back in.
        showcase: [
          {
            kind: "roadmap",
            label: "Every engagement",
            title: "The Same Method",
            items: [
              "Audit and technical foundation",
              "On-page and content work",
              "Visibility tracking",
              "Monthly recap",
            ],
          },
          {
            kind: "coverage",
            label: "What changes",
            title: "Not the Method",
            items: ["Search language", "Buying cycle", "Lead value"],
          },
        ],
      },

      {
        id: "who-this-is-for",
        type: "cardGrid",
        tone: "surface",
        variant: "cards",
        columns,
        eyebrow: "Who This Is For",
        heading: `Businesses Inside ${industry.name}`,
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
        align: "left",
        eyebrow: "Search Behaviour",
        heading: industry.search.heading,
        body: industry.search.body,
        groups: industry.search.points,
      },

      howJmcWorks(industry.name),
      monthlyRecap,

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
      body: "Eight sectors, one approach. What changes between them is the language buyers search in, how long they take to decide, and what a single lead is worth.",
      // No buttons at all: the grid directly below is the action, per Page
      // Spec 08 §1.
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
      cta: { label: "Explore Local SEO", href: "/local-seo-services" },
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
