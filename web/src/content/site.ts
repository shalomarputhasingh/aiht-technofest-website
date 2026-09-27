// Stack and Level content contract.
// Rules/levels/FAQ data is extracted verbatim from Source_Content/config.js +
// stack-and-level.js (see scripts/extract-content.mjs), which in turn transcribe
// the official .docx. Page copy below is written for the site and audited against
// the document by scripts/audit-content.mjs.
import source from "./source.json";

export type Level = {
  id: string;
  number: string;
  name: string;
  kind: string;
  svgIcon: string;
  tagline: string;
  duration: string;
  format: string;
  qualifier: string;
  rules: string[];
  scoring: { label: string; text: string }[];
};

export const CONFIG = source.CONFIG;
export const LEVELS = source.LEVELS as Level[];
export const GENERAL_RULES = source.GENERAL_RULES as string[];
export const REGULATIONS = source.REGULATIONS as string[];
export const CODE_OF_CONDUCT = source.CODE_OF_CONDUCT as string[];
export const WINNING = source.WINNING as string[];
export const PRIZES = source.PRIZES as { place: string; position: string; amount: string; extra: string }[];
export const PROGRESSION = source.PROGRESSION as { stage: string; teams: string; detail: string }[];
/** FAQ answers carry trusted inline markup (<strong>) from the source file. */
export const FAQ_DATA = source.FAQ as { q: string; a: string }[];

export const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "The Brief" },
  { href: "#levels", label: "Levels" },
  { href: "#rules", label: "Rules" },
  { href: "#faq", label: "FAQ" },
];

export const MOBILE_NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "The Brief" },
  { href: "#levels", label: "Levels" },
  { href: "#rules", label: "Rules" },
  { href: "#registration", label: "Register" },
  { href: "#faq", label: "FAQ" },
];

export const FOOTER_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "The Brief" },
  { href: "#levels", label: "The Three Levels" },
  { href: "#progression", label: "Prizes" },
  { href: "#rules", label: "Rules & Conduct" },
  { href: "#registration", label: "Register" },
  { href: "#faq", label: "FAQ" },
];

export const TOP_BAR = {
  collegeName: CONFIG.COLLEGE_NAME,
  autonomous: "Autonomous",
  credentials: ["AICTE Approved", "Affiliated to Anna University", "NBA Accredited", "ISO 9001:2008 Certified"],
  location: "OMR, Chennai",
  websiteLabel: "aiht.ac.in",
};

export const NAV_BRAND = { tag: `${CONFIG.FEST_NAME} • ${CONFIG.DEPARTMENT}`, logo: "STACK", year: "ERNAUT" };

export const MOBILE_NAV_COLLEGE = {
  name: CONFIG.COLLEGE_NAME,
  sub: `${CONFIG.DEPARTMENT} • ${CONFIG.FEST_NAME}`,
};

export const HERO = {
  hostPills: [CONFIG.FEST_NAME, CONFIG.DEPARTMENT, CONFIG.EVENT_TYPE],
  eyebrow: `${CONFIG.EVENT_NAME} — Rules & Regulations`,
  telemetry: [
    ["EVENT", CONFIG.EVENT_NAME],
    ["LEVELS", "03"],
    ["TEAM", CONFIG.TEAM_SIZE],
    ["DATE", "30.09.2026"],
  ] as [string, string][],
  titleA: "STACK",
  titleB: "ERNAUT",
  official: CONFIG.EVENT_NAME,
  tagline: CONFIG.EVENT_TAGLINE,
  altTagline: "Bug Bounty · Sight Unseen · Buzz or Bust",
  date: CONFIG.EVENT_DATE_DISPLAY,
  description:
    "Three levels, one device, and difficulty that climbs with every round. Fix ten broken programs against the clock, rebuild a website you only saw once, then out-buzz the teams still standing.",
  ctaRegister: "Pre-register",
  ctaExplore: "See the levels",
};

export const COUNTDOWN = {
  label: `Countdown to ${CONFIG.EVENT_NAME}`,
  live: "🎉 STACK AND LEVEL IS LIVE!",
  units: ["Days", "Hours", "Minutes", "Seconds"],
};

export const ABOUT = {
  label: "The Brief",
  titleA: "What is",
  titleB: "Stack and Level",
  paragraphs: [
    [
      { strong: "Stack and Level" },
      " is the ",
      { strong: `${CONFIG.DEPARTMENT} technical event at ${CONFIG.FEST_NAME}` },
      ". The event consists of three levels, gradually increasing in difficulty: Bug Bounty, Sight Unseen and Buzz or Bust. Twenty teams start in the labs. Three walk away as winners.",
    ],
    [
      "Participants compete in teams of 1 to 4 members. A laptop is optional — teams may use the lab computer provided, and each team competes on one device only. Everything else you need to know is on this page, straight from the rulebook.",
    ],
  ] as (string | { strong: string })[][],
  stats: [
    { value: 3, label: "Levels" },
    { value: 20, label: "Teams at the start" },
    { value: 4, label: "Members per team, max" },
    { value: 3, label: "Winning teams" },
  ],
  highlights: [
    { title: "Debug", text: "Ten broken programs across five languages, and only ten minutes on the clock." },
    { title: "Rebuild", text: "One look at a live website, then rebuild it from memory with an AI tool." },
    { title: "Buzz", text: "Hit the buzzer first, code offline, and prove the output in front of the judges." },
    { title: "Win", text: "Scores carry to the final level, where the top three teams take the prizes." },
  ],
};

export const LEVELS_SECTION = {
  label: "The Three Games",
  titleA: "Three Levels,",
  titleB: "One Run",
  subtitle:
    "Every level is harder than the last, and only the top teams carry through. Open a level for its full rules and scoring.",
  viewDetails: "Full rules",
  rulesLabel: "How it runs",
  scoringLabel: "Scoring",
};

export const PROGRESSION_SECTION = {
  label: "Qualification",
  titleA: "From Twenty Teams",
  titleB: "To Three",
  subtitle: "Teams are cut at every level. This is the whole run, from the first lab to the final buzzer.",
  prizesLabel: "The Prizes",
  prizesTitleA: "What the Winners",
  prizesTitleB: "Take Home",
  winningLabel: "Winning",
};

export const RULES_SECTION = {
  label: "Before You Compete",
  titleA: "Rules &",
  titleB: "Conduct",
  subtitle: "Read these before you arrive. Breaking them costs points, or the whole event.",
  groups: [
    { key: "general", title: "General Rules", icon: "list", items: GENERAL_RULES },
    { key: "regulations", title: "Rules & Regulations", icon: "shield", items: REGULATIONS },
    { key: "conduct", title: "Code of Conduct", icon: "handshake", items: CODE_OF_CONDUCT },
  ],
};

export const REGISTRATION = {
  label: "Get In",
  titleA: "How to",
  titleB: "Register",
  subtitle: `${CONFIG.REGISTRATION_MODE}. Pre-register online so we can keep a slot for your team.`,
  steps: [
    {
      number: "STEP 01",
      title: "Form Your Team",
      text: ["Participants compete in teams of 1 to 4 members. Pick your team before you reach the lab — you can also enter alone."],
    },
    {
      number: "STEP 02",
      title: "Pre-register Online",
      text: [
        "Hit ",
        { strong: "Pre-register" },
        ` and fill the ${CONFIG.FEST_NAME} form. This is optional, but it tells us you are coming.`,
      ],
    },
    {
      number: "STEP 03",
      title: "Register at the Venue",
      text: [
        { strong: "Registration is spot registration only, at the venue." },
        " Confirm your team on the day, keep your Team ID safe, and bring a laptop if you want one — it is optional.",
      ],
    },
  ] as { number: string; title: string; text: (string | { strong: string })[] }[],
  cta: `Pre-register for ${CONFIG.EVENT_NAME}`,
};

export const INFO = {
  label: "Key Details",
  titleA: "Important",
  titleB: "Information",
  cards: [
    { key: "date", label: "Date", value: CONFIG.EVENT_DATE_DISPLAY },
    { key: "event", label: "Event", value: CONFIG.EVENT_NAME },
    { key: "type", label: "Type", value: CONFIG.EVENT_TYPE },
    { key: "department", label: "Organised by", value: CONFIG.DEPARTMENT },
    { key: "team", label: "Team Size", value: CONFIG.TEAM_SIZE },
    { key: "rooms", label: "Rounds Run In", value: CONFIG.VENUE_ROOMS },
    { key: "registration", label: "Registration", value: CONFIG.REGISTRATION_MODE },
    { key: "prize", label: "Prize Pool", value: CONFIG.PRIZE_POOL },
    { key: "venue", label: "Venue", value: "AIHT, OMR, Kazhipattur, Chennai – 603103" },
    { key: "timing", label: "Timing", value: "To be announced", tba: true },
    { key: "website", label: "College Website", value: "www.aiht.ac.in", href: CONFIG.COLLEGE_WEBSITE },
    { key: "contact", label: "Contact", value: "044-27471330", href: "tel:+914427471330" },
  ] as { key: string; label: string; value: string; tba?: boolean; href?: string }[],
};

export const FAQ_SECTION = { label: "Got Questions?", titleA: "Frequently Asked", titleB: "Questions" };

export const FINAL_CTA = {
  heading: ["Ten Minutes.", "Ten Bugs."],
  sub: "Think you can clear all three?",
  body: "Twenty teams walk into the labs. Five reach the buzzer. Three take the prizes. Form your team, pre-register, and show up ready to debug.",
  cta: "Pre-register",
  dateBadge: CONFIG.EVENT_DATE_DISPLAY,
};

export const FOOTER = {
  logo: "STACK AND LEVEL",
  tagline: CONFIG.EVENT_TAGLINE,
  college: CONFIG.COLLEGE_NAME,
  collegeLines: [`${CONFIG.DEPARTMENT} • ${CONFIG.FEST_NAME}`, "An Autonomous Institution"],
  address: "OMR, Kazhipattur, Chennai – 603103",
  quickLinksTitle: "Quick Links",
  contactTitle: "Contact & Links",
  contacts: [
    { kind: "phone", label: "044-27471330", href: "tel:+914427471330" },
    { kind: "mobile", label: "+91 80121 36666", href: "tel:+918012136666" },
    { kind: "mail", label: "principal@aiht.ac.in", href: "mailto:principal@aiht.ac.in" },
    { kind: "web", label: "www.aiht.ac.in", href: CONFIG.COLLEGE_WEBSITE, external: true },
    { kind: "facebook", label: "Facebook", href: "https://www.facebook.com/aihtofficial", external: true },
  ],
  copyright: `© 2026 ${CONFIG.EVENT_NAME} — ${CONFIG.FEST_NAME}, ${CONFIG.COLLEGE_NAME}. All rights reserved.`,
  accreditation: "Approved by AICTE | Affiliated to Anna University, Chennai | ISO 9001:2008 Certified | Accredited by NBA",
};

export const REGISTER_PENDING = {
  title: "Pre-registration opening soon!",
  body: "The form link will be active shortly. Spot registration is always available at the venue.",
};
