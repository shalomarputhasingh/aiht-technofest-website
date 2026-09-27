import { INFO } from "@/content/site";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import ChapterLabel, { SectionHeading } from "./ChapterLabel";

// One icon per INFO card key (see content/site.ts). `fallback` keeps a renamed key from rendering an empty path.
const ICONS: Record<string, string> = {
  date: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  event: "M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z",
  department: "M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3M5 5h14v14H5zM9.5 9.5h5v5h-5z",
  type: "M13 2L4 14h7l-1 8 9-12h-7z",
  team: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  rooms: "M3 21h18M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9.5 8h.01M14.5 8h.01M9.5 12h.01M14.5 12h.01M10 21v-4h4v4",
  registration: "M9 3h6v4H9zM6 5H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1M8 13h8M8 17h5",
  prize: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3a3 3 0 0 1-3 4M7 5H4a3 3 0 0 0 3 4",
  venue: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  timing: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  website: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z",
  contact:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
  fallback: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01",
};

export default function Info() {
  return (
    <section id="info" className="chapter chapter--info" aria-labelledby="info-heading">
      <ChapterTrigger clips={["c10_highway"]} mood={{ scrim: [0.4, 0.5], embers: [1.1, 0.8], heat: [0.9, 0.6] }} />
      <div className="container">
        <ChapterLabel id="info" />
        <SectionHeading id="info-heading" label={INFO.label} a={INFO.titleA} b={INFO.titleB} />
        <ul className="intel">
          {INFO.cards.map((c, i) => (
            <li key={c.key} className={`intel__card ${c.tba ? "is-tba" : ""}`} data-reveal style={{ ["--i" as string]: i }}>
              <svg className="intel__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={ICONS[c.key] ?? ICONS.fallback} />
              </svg>
              <span className="intel__label">{c.label}</span>
              {c.href ? (
                <a
                  className="intel__value"
                  href={c.href}
                  {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {c.value}
                </a>
              ) : (
                <p className="intel__value">{c.value}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
