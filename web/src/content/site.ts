// Department of CSE @ Technofest-3.0 2026 — content contract.
// Event/rule data is extracted verbatim from Source_Content/config.js +
// cse-events.js (see scripts/extract-content.mjs), which transcribe the official
// .docx. Page copy below is written for the site and audited against the
// document by scripts/audit-content.mjs.
import source from "./source.json";

export type Game = { name: string; note: string; rules: string[] };
export type Round = { number: string | null; name: string; kind: string | null; rules: string[]; games: Game[] };
export type Prize = { place: string; position: string; amount: string; extra: string };
export type CseEvent = {
  id: string;
  name: string;
  category: "Technical" | "Non-Technical";
  svgIcon: string;
  tagline: string;
  summary: string;
  teamSize: string;
  facts: { label: string; value: string }[];
  generalRules: string[];
  rounds: Round[];
  scoring: { level: string; items: { label: string; text: string }[] }[];
  regulations: string[];
  conduct: string[];
  winning: string[];
  prizes: Prize[] | null;
  progression: { stage: string; teams: string; detail: string }[] | null;
};

export const CONFIG = source.CONFIG;
export const EVENTS = source.EVENTS as CseEvent[];
export const PRIZE_NOTE = source.PRIZE_NOTE as string;
/** FAQ answers carry trusted inline markup (<strong>) from the source file. */
export const FAQ_DATA = source.FAQ as { q: string; a: string }[];

export const TOTALS = {
  events: EVENTS.length,
  rounds: EVENTS.reduce((n, e) => n + e.rounds.length, 0),
  games: EVENTS.reduce((n, e) => n + e.rounds.reduce((m, r) => m + r.games.length, 0), 0),
  technical: EVENTS.filter((e) => e.category === "Technical").length,
  nonTechnical: EVENTS.filter((e) => e.category === "Non-Technical").length,
};

export const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "The Brief" },
  { href: "#events", label: "Events" },
  { href: "#rules", label: "Rules" },
  { href: "#faq", label: "FAQ" },
];

export const MOBILE_NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "The Brief" },
  { href: "#events", label: "Events" },
  ...EVENTS.map((e) => ({ href: `#${e.id}`, label: e.name })),
  { href: "#registration", label: "Register" },
  { href: "#faq", label: "FAQ" },
];

export const FOOTER_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "The Brief" },
  ...EVENTS.map((e) => ({ href: `#${e.id}`, label: e.name })),
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
  websiteHref: CONFIG.COLLEGE_WEBSITE,
};

export const NAV_BRAND = { tag: `${CONFIG.FEST_NAME} • ${CONFIG.DEPARTMENT}`, logo: "CSE", year: "3.0" };

export const MOBILE_NAV_COLLEGE = {
  name: CONFIG.COLLEGE_NAME,
  sub: `${CONFIG.DEPARTMENT} • ${CONFIG.FEST_NAME}`,
};

export const HERO = {
  hostPills: [CONFIG.FEST_NAME, CONFIG.DEPARTMENT, CONFIG.EVENT_TYPE],
  eyebrow: `${CONFIG.DEPARTMENT_FULL} — Rules & Regulations`,
  telemetry: [
    ["DEPT", "CSE"],
    ["EVENTS", String(TOTALS.events).padStart(2, "0")],
    ["GAMES", String(TOTALS.games)],
    ["DATE", "30.09.2026"],
  ] as [string, string][],
  titleA: "CSE",
  titleB: "3.0",
  official: CONFIG.DEPARTMENT_FULL,
  tagline: CONFIG.EVENT_TAGLINE,
  altTagline: EVENTS.map((e) => e.name).join(" · "),
  date: CONFIG.EVENT_DATE_DISPLAY,
  description:
    "One technical gauntlet and two non-technical brawls, run by the Department of Computer Science and Engineering. Debug under the clock, survive ten party games, or out-buzz the room on Tamil cinema.",
  ctaRegister: "Pre-register",
  ctaExplore: "See the events",
};

export const COUNTDOWN = {
  label: `Countdown to ${CONFIG.FEST_NAME}`,
  live: "🎉 TECHNOFEST 3.0 IS LIVE!",
  units: ["Days", "Hours", "Minutes", "Seconds"],
};

export const ABOUT = {
  label: "The Brief",
  titleA: "What the CSE",
  titleB: "Department Runs",
  paragraphs: [
    [
      "The ",
      { strong: CONFIG.DEPARTMENT_FULL },
      ` is running ${TOTALS.events} events at ${CONFIG.FEST_NAME}: `,
      { strong: EVENTS.map((e) => e.name).join(", ") },
      ". One is technical, two are not, and all of them are decided on the day.",
    ],
    [
      `Between them there are ${TOTALS.rounds} rounds and ${TOTALS.games} individual games. Registration is spot registration only, at the venue — pre-register online if you want us to keep a slot. Every rule for every game is on this page, straight from the rulebook.`,
    ],
  ] as (string | { strong: string })[][],
  stats: [
    { value: TOTALS.events, label: "Events" },
    { value: TOTALS.rounds, label: "Rounds" },
    { value: TOTALS.games, label: "Games" },
    { value: 1, label: "Day of Excitement" },
  ],
  highlights: [
    { title: "Debug", text: "Ten broken programs across five languages, and only ten minutes on the clock." },
    { title: "Rebuild", text: "One look at a live website, then rebuild it from memory with an AI tool." },
    { title: "Survive", text: "Balloons, chopsticks, QR codes and bottle flips — ten games, two players, one winner." },
    { title: "Buzz", text: "Blurred movie stills, blindfolded jigsaws and face-to-face betting on Tamil cinema." },
  ],
};

export const EVENTS_SECTION = {
  label: "The Line-up",
  titleA: `${TOTALS.events} Events,`,
  titleB: "One Department",
  subtitle: "One technical, two non-technical. Pick your fight — full rules for each are below.",
  viewRules: "Read the rules",
  roundsLabel: "Rounds",
  gamesLabel: "Games",
};

export const EVENT_PAGE = {
  generalLabel: "General Rules",
  roundsLabel: "Round Details",
  scoringLabel: "Scoring Criteria",
  regulationsLabel: "Rules & Regulations",
  conductLabel: "Code of Conduct",
  winningLabel: "Winning",
  prizesLabel: "Prizes",
  progressionLabel: "Qualification",
  prizesTba: PRIZE_NOTE,
};

export const RULES_SECTION = {
  label: "Before You Compete",
  titleA: "Common",
  titleB: "Ground",
  subtitle: "These apply across every CSE event. Each event adds its own rules on top.",
  groups: [
    {
      key: "conduct",
      title: "Code of Conduct",
      icon: "handshake",
      items: [
        "Respect event coordinators, fellow participants, and judges.",
        "Fair play is mandatory; copying, sharing answers or any unethical behaviour will lead to disqualification.",
        "Participants must follow the instructions given by the event coordinators throughout the event.",
      ],
    },
    {
      key: "general",
      title: "Across All Events",
      icon: "list",
      items: [
        "Participants must complete each challenge within the given time limit.",
        "All participants must follow the specific rules provided for each game.",
        "Any violation of the rules may result in disqualification.",
        "The decision of the event coordinators and judges will be final.",
      ],
    },
    {
      key: "registration",
      title: "Getting In",
      icon: "shield",
      items: [
        "Registration is spot registration only, at the venue.",
        "Team sizes differ per event: Stack and Level 1 to 4 members, The Reckoning 2 members, Chill Flex 2–4 members.",
        "Pre-registering online is optional, and helps the coordinators plan slots.",
      ],
    },
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
      title: "Pick Your Event",
      text: [
        `All ${TOTALS.events} events run on the same day. Read the rules, then decide whether you are debugging, surviving the games, or answering on cinema.`,
      ],
    },
    {
      number: "STEP 02",
      title: "Form Your Team",
      text: [
        "Team sizes differ per event: ",
        { strong: "Stack and Level 1 to 4, The Reckoning 2, Chill Flex 2–4" },
        ". Sort your team before you reach the venue.",
      ],
    },
    {
      number: "STEP 03",
      title: "Register at the Venue",
      text: [
        { strong: "Registration is spot registration only, at the venue." },
        ` The CSE department is in ${CONFIG.VENUE_BLOCK}, so head there on the day — all three events run in ${CONFIG.VENUE_BLOCK}. Pre-register online if you want a slot held, keep your Team ID safe, and turn up ready.`,
      ],
    },
  ] as { number: string; title: string; text: (string | { strong: string })[] }[],
  cta: `Pre-register for ${CONFIG.FEST_SHORT}`,
};

export const INFO = {
  label: "Key Details",
  titleA: "Important",
  titleB: "Information",
  cards: [
    { key: "date", label: "Date", value: CONFIG.EVENT_DATE_DISPLAY },
    { key: "event", label: "Fest", value: CONFIG.FEST_NAME },
    { key: "department", label: "Organised by", value: CONFIG.DEPARTMENT_FULL },
    { key: "type", label: "Events", value: `${TOTALS.technical} Technical + ${TOTALS.nonTechnical} Non-Technical` },
    { key: "team", label: "Team Size", value: "Varies by event (1–4)" },
    { key: "rooms", label: "Stack and Level Runs In", value: `${CONFIG.VENUE_BLOCK} — ${CONFIG.VENUE_ROOMS}` },
    { key: "registration", label: "Registration", value: CONFIG.REGISTRATION_MODE },
    { key: "prize", label: "Prize Pool", value: CONFIG.PRIZE_POOL },
    { key: "venue", label: "Venue", value: `AIHT — ${CONFIG.VENUE_BLOCK}, OMR, Kazhipattur, Chennai – 603103` },
    { key: "timing", label: "Timing", value: "To be announced", tba: true },
    { key: "website", label: "College Website", value: "aiht.ac.in", href: CONFIG.COLLEGE_WEBSITE },
    { key: "contact", label: "Contact", value: "044-27471330", href: "tel:+914427471330" },
  ] as { key: string; label: string; value: string; tba?: boolean; href?: string }[],
};

export const FAQ_SECTION = { label: "Got Questions?", titleA: "Frequently Asked", titleB: "Questions" };

export const FINAL_CTA = {
  heading: ["Three Events.", "One Day."],
  sub: "Which one are you walking into?",
  body: `${TOTALS.games} games across ${TOTALS.rounds} rounds, run by the Department of Computer Science and Engineering. Form your team, pre-register, and show up ready.`,
  cta: "Pre-register",
  dateBadge: CONFIG.EVENT_DATE_DISPLAY,
};

export const FOOTER = {
  logo: "CSE · TECHNOFEST 3.0",
  tagline: CONFIG.EVENT_TAGLINE,
  college: CONFIG.COLLEGE_NAME,
  collegeLines: [`${CONFIG.DEPARTMENT_FULL} • ${CONFIG.FEST_NAME}`, "An Autonomous Institution"],
  address: `${CONFIG.VENUE_BLOCK} · OMR, Kazhipattur, Chennai – 603103`,
  quickLinksTitle: "Quick Links",
  contactTitle: "Contact & Links",
  contacts: [
    { kind: "phone", label: "044-27471330", href: "tel:+914427471330" },
    { kind: "mobile", label: "+91 80121 36666", href: "tel:+918012136666" },
    { kind: "mail", label: "principal@aiht.ac.in", href: "mailto:principal@aiht.ac.in" },
    { kind: "web", label: "aiht.ac.in", href: CONFIG.COLLEGE_WEBSITE, external: true },
    { kind: "facebook", label: "Facebook", href: "https://www.facebook.com/aihtofficial", external: true },
  ],
  copyright: `© 2026 ${CONFIG.DEPARTMENT_FULL} — ${CONFIG.FEST_NAME}, ${CONFIG.COLLEGE_NAME}. All rights reserved.`,
  accreditation: "Approved by AICTE | Affiliated to Anna University, Chennai | ISO 9001:2008 Certified | Accredited by NBA",
};

export const REGISTER_PENDING = {
  title: "Pre-registration opening soon!",
  body: "The form link will be active shortly. Spot registration is always available at the venue.",
};

/** Boot sequence for the loading screen — CSE flavoured, purely decorative. */
export const BOOT = {
  host: "aiht.ac.in",
  user: "technofest",
  lines: [
    { cmd: "ssh technofest@aiht.ac.in", out: "Connected · Department of Computer Science and Engineering" },
    { cmd: "cd /dept/cse/technofest-3.0", out: "3 events · 10 rounds · 15 games" },
    { cmd: "make all", out: "stack-and-level.o  the-reckoning.o  chill-flex.o" },
    { cmd: "./technofest --start", out: "Spot registration open at the venue" },
  ],
  compiling: "compiling technofest-3.0",
  ready: "BUILD SUCCESSFUL",
  skip: "Skip",
};
