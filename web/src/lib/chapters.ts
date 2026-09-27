// Story chapters, keyed by section id. Purely presentational (aria-hidden labels).
// One clip per chapter, in film order — no shot is reused.
export const CHAPTERS: Record<string, { n: string; title: string }> = {
  hero: { n: "01", title: "The Awakening" },
  countdown: { n: "02", title: "The Machine" },
  about: { n: "03", title: "The Engine" },
  events: { n: "04", title: "Ignition" },
  "stack-and-level": { n: "05", title: "The Ride" },
  "the-reckoning": { n: "06", title: "The Chase" },
  "chill-flex": { n: "07", title: "The Stop" },
  rules: { n: "08", title: "The Code" },
  registration: { n: "09", title: "The Return" },
  info: { n: "10", title: "The Highway" },
  faq: { n: "11", title: "The Silence" },
  "final-cta": { n: "12", title: "The Skull" },
};
