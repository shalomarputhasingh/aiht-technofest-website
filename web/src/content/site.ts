// Technofest 2026 content contract.
// Event/FAQ/config data is extracted verbatim from Source_Content/config.js + app.js
// (see scripts/extract-content.mjs). Static page copy below is transcribed from
// Source_Content/index.html and verified by scripts/audit-content.mjs.
import source from "./source.json";

export type TechnofestEvent = {
  id: string;
  name: string;
  icon: string;
  svgIcon: string;
  category: "Technical" | "Non-Technical";
  description: string;
  rules: string[];
  eligibility: string;
  teamSize: string;
  duration: string;
  venue: string;
  coordinators: string[];
  additionalInfo: string;
};

export type FilterKey = "all" | "technical" | "non-technical";

export const CONFIG = source.CONFIG;
export const TECHNICAL_EVENTS = source.TECHNICAL_EVENTS as TechnofestEvent[];
export const NON_TECHNICAL_EVENTS = source.NON_TECHNICAL_EVENTS as TechnofestEvent[];
export const ALL_EVENTS: (TechnofestEvent & { filterKey: Exclude<FilterKey, "all"> })[] = [
  ...TECHNICAL_EVENTS.map((e) => ({ ...e, filterKey: "technical" as const })),
  ...NON_TECHNICAL_EVENTS.map((e) => ({ ...e, filterKey: "non-technical" as const })),
];
/** FAQ answers contain trusted inline markup (<strong>) from the source app.js. */
export const FAQ_DATA = source.FAQ_DATA as { q: string; a: string }[];

/** Fallback copy used by the original modal when a field is empty. */
export const COMING_SOON = "Details will be announced soon.";

export const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#events", label: "Technical Events", filter: "technical" as FilterKey },
  { href: "#events", label: "Non-Technical", filter: "non-technical" as FilterKey },
  { href: "#participation", label: "Rules" },
  { href: "#faq", label: "FAQ" },
];

export const MOBILE_NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#participation", label: "Rules" },
  { href: "#faq", label: "FAQ" },
];

export const FOOTER_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#events", label: "Technical Events", filter: "technical" as FilterKey },
  { href: "#events", label: "Non-Technical Events", filter: "non-technical" as FilterKey },
  { href: "#participation", label: "Rules" },
  { href: "#faq", label: "FAQ" },
];

export const TOP_BAR = {
  collegeName: "Anand Institute of Higher Technology",
  autonomous: "Autonomous",
  credentials: ["AICTE Approved", "Affiliated to Anna University", "NBA Accredited", "ISO 9001:2008 Certified"],
  location: "OMR, Chennai",
  websiteLabel: "aiht.ac.in",
};

export const NAV_BRAND = { tag: "AIHT • AUTONOMOUS", logo: "TECHNOFEST", year: "2026" };

export const MOBILE_NAV_COLLEGE = {
  name: "Anand Institute of Higher Technology",
  sub: "An Autonomous Institution • Chennai",
};

export const HERO = {
  hostPills: ["AIHT PRESENTS", "An Autonomous Institution", "Anna University Affiliated", "NBA Accredited"],
  eyebrow: "Annual National-Level Technical & Non-Technical Fest",
  telemetry: [
    ["SYS", "ONLINE"],
    ["CAMPUS", "AIHT OMR"],
    ["COORD", "12.8231° N, 80.2285° E"],
    ["DATE", "30.09.2026"],
  ] as [string, string][],
  titleA: "TECHNO",
  titleB: "FEST",
  year: "2026",
  tagline: "Where Technology Meets Talent",
  altTagline: "Innovate. Compete. Create.",
  date: "30 September 2026",
  description:
    "An exciting college technical and non-technical fest bringing together innovation, competition, creativity and entertainment. 20 events. One unforgettable day.",
  ctaRegister: "Register Now",
  ctaExplore: "Explore Events",
};

export const COUNTDOWN = {
  label: "Countdown to Technofest 2026",
  live: "🎉 TECHNOFEST 2026 IS LIVE!",
  units: ["Days", "Hours", "Minutes", "Seconds"],
};

export const ABOUT = {
  label: "About the Fest",
  titleA: "About",
  titleB: "Technofest",
  paragraphs: [
    [
      "Technofest 2026 is the annual technical and cultural celebration of ",
      { strong: "Anand Institute of Higher Technology (AIHT)" },
      ", an autonomous institution affiliated to Anna University, Chennai. From cutting-edge technical competitions to fun-filled non-technical activities, the fest gives students an opportunity to showcase their skills, discover new talents and compete with peers.",
    ],
    [
      "Whether you're a coder, an engineer, a creative thinker or just someone ready to take on a challenge, Technofest 2026 at AIHT's OMR campus has something for everyone. Come prepared to innovate, compete and create.",
    ],
  ] as (string | { strong: string })[][],
  stats: [
    { value: 9, label: "Technical Events" },
    { value: 11, label: "Non-Technical Events" },
    { value: 20, label: "Total Events" },
    { value: 1, label: "Day of Excitement" },
  ],
  highlights: [
    { title: "Innovation", text: "Explore ideas and challenge yourself with forward-thinking competitions." },
    { title: "Competition", text: "Compete, solve problems and prove your skills against the best." },
    { title: "Creativity", text: "Think differently, break boundaries and showcase your talent." },
    { title: "Experience", text: "Meet students, participate in events and enjoy an unforgettable fest." },
  ],
};

export const EVENTS_SECTION = {
  label: "Explore the Competitions",
  titleA: "Discover",
  titleB: "Events",
  subtitle: "20 exciting events across technical and non-technical categories. Find your challenge and register today.",
  filters: [
    { key: "all" as FilterKey, label: "All Events" },
    { key: "technical" as FilterKey, label: "Technical" },
    { key: "non-technical" as FilterKey, label: "Non-Technical" },
  ],
  searchPlaceholder: "Search events…",
  techHeading: "Technical Events — 9",
  nontechHeading: "Non-Technical Events — 11",
  noResults: "No events match your search. Try a different keyword.",
  viewDetails: "View Details",
};

export const PARTICIPATION = {
  label: "Participation Guidelines",
  titleA: "How Participation",
  titleB: "Works",
  subtitle: "Choose your category and select the events that suit you. The registration form will guide you through the rest.",
  cards: [
    {
      key: "tech",
      title: "Technical Event",
      text: "Students choosing the Technical Event category will select one or more technical events in the registration form. Showcase your engineering and analytical skills.",
    },
    {
      key: "nontech",
      title: "Non-Technical Event",
      text: "Students choosing the Non-Technical Event category will select one or more non-technical events. Creativity, fun and teamwork are at the heart of these challenges.",
    },
    {
      key: "both",
      title: "Both",
      text: "Students choosing Both can select one or more technical events AND one or more non-technical events. The ultimate Technofest experience.",
    },
  ],
  noteLead: "Important:",
  note: " Choose your participation category carefully before selecting your events. The registration form will show the relevant event options based on your selection.",
};

export const REGISTRATION = {
  label: "Get Registered",
  titleA: "How to",
  titleB: "Register",
  subtitle: "Registration is fast and simple through the official Technofest 2026 Google Form.",
  steps: [
    {
      number: "STEP 01",
      title: "Choose Your Events",
      text: [
        "Explore the technical and non-technical events. Decide which competitions you want to participate in — Technical, Non-Technical or Both.",
      ],
    },
    {
      number: "STEP 02",
      title: "Fill the Registration Form",
      text: [
        "Click ",
        { strong: "Register Now" },
        " and complete the official Technofest 2026 Google Form. Enter your details, select your category and choose your events.",
      ],
    },
    {
      number: "STEP 03",
      title: "Get Ready",
      text: [
        "Check the event information on this website and prepare for 30 September 2026. Your journey to Technofest begins now.",
      ],
    },
  ] as { number: string; title: string; text: (string | { strong: string })[] }[],
  cta: "Register for Technofest 2026",
};

export const INFO = {
  label: "Key Details",
  titleA: "Important",
  titleB: "Information",
  cards: [
    { key: "date", label: "Date", value: "30 September 2026" },
    { key: "event", label: "Event", value: "Technofest 2026" },
    { key: "type", label: "Type", value: "Technical + Non-Technical" },
    { key: "registration", label: "Registration", value: "Online via Google Form" },
    { key: "venue", label: "Venue", value: "AIHT, OMR, Kazhipattur, Chennai – 603103" },
    { key: "timing", label: "Timing", value: "To be announced", tba: true },
    { key: "deadline", label: "Registration Deadline", value: "To be announced", tba: true },
    { key: "organiser", label: "Organiser", value: "Anand Institute of Higher Technology (AIHT)" },
    { key: "website", label: "College Website", value: "www.aiht.ac.in", href: "https://www.aiht.ac.in" },
    { key: "contact", label: "Contact", value: "044-27471330", href: "tel:+914427471330" },
  ] as { key: string; label: string; value: string; tba?: boolean; href?: string }[],
};

export const FAQ_SECTION = { label: "Got Questions?", titleA: "Frequently Asked", titleB: "Questions" };

export const FINAL_CTA = {
  heading: ["Ready to Take", "the Challenge?"],
  sub: "Your idea. Your skill. Your moment.",
  body: "Explore the events, choose your challenges and register for Technofest 2026. The stage is set — are you ready?",
  cta: "Register Now",
  dateBadge: "30 September 2026",
};

export const FOOTER = {
  logo: "TECHNOFEST 2026",
  tagline: "Where Technology Meets Talent",
  college: "Anand Institute of Higher Technology",
  collegeLines: ["An Autonomous Institution", "Affiliated to Anna University, Chennai"],
  address: "OMR, Kazhipattur, Chennai – 603103",
  quickLinksTitle: "Quick Links",
  contactTitle: "Contact & Links",
  contacts: [
    { kind: "phone", label: "044-27471330", href: "tel:+914427471330" },
    { kind: "mobile", label: "+91 80121 36666", href: "tel:+918012136666" },
    { kind: "mail", label: "principal@aiht.ac.in", href: "mailto:principal@aiht.ac.in" },
    { kind: "web", label: "www.aiht.ac.in", href: "https://www.aiht.ac.in", external: true },
    { kind: "facebook", label: "Facebook", href: "https://www.facebook.com/aihtofficial", external: true },
  ],
  copyright: "© 2026 Technofest 2026 — Anand Institute of Higher Technology. All rights reserved.",
  accreditation: "Approved by AICTE | Affiliated to Anna University, Chennai | ISO 9001:2008 Certified | Accredited by NBA",
};

export const REGISTER_PENDING = {
  title: "Registration coming soon!",
  body: "The Google Form link will be active shortly. Stay tuned.",
};
