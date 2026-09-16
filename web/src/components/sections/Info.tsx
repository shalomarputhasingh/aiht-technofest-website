import { INFO } from "@/content/site";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import ChapterLabel, { SectionHeading } from "./ChapterLabel";

const ICONS: Record<string, string> = {
  date: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
  event: "M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z",
  type: "M13 2L4 14h7l-1 8 9-12h-7z",
  registration: "M9 3h6v4H9zM6 5H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1M8 13h8M8 17h5",
  venue: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  timing: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  deadline: "M6 2h12M6 22h12M7 2c0 5 10 5 10 10S7 17 7 22M17 2c0 5-10 5-10 10s10 5 10 10",
  organiser: "M22 10L12 5 2 10l10 5zM6 12v5c3 2 9 2 12 0v-5",
  website: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z",
  contact: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
};

export default function Info() {
  return (
    <section id="info" className="chapter chapter--info" aria-labelledby="info-heading">
      <ChapterTrigger clips={["c08_watch"]} mood={{ scrim: [0.3, 0.45], embers: [0.7, 0.45], heat: [0.55, 0.4] }} />
      <div className="container">
        <ChapterLabel id="info" />
        <SectionHeading id="info-heading" label={INFO.label} a={INFO.titleA} b={INFO.titleB} />
        <ul className="intel">
          {INFO.cards.map((c, i) => (
            <li key={c.key} className={`intel__card ${c.tba ? "is-tba" : ""}`} data-reveal style={{ ["--i" as string]: i }}>
              <svg className="intel__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={ICONS[c.key]} />
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
