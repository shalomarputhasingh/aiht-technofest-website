import { PARTICIPATION } from "@/content/site";
import ChainCanvas from "@/components/chain/ChainCanvas";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import ChapterLabel, { SectionHeading } from "./ChapterLabel";

const ICONS: Record<string, React.ReactNode> = {
  tech: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  nontech: <path d="M4 5c4-2 12-2 16 0v6c0 5-4 9-8 10-4-1-8-5-8-10zM9 10h.01M15 10h.01M9 15c1.5 1.3 4.5 1.3 6 0" />,
  both: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z" />,
};

export default function Participation() {
  return (
    <section id="participation" className="chapter chapter--participation" aria-labelledby="participation-heading">
      <ChapterTrigger clips={["c06_ride_future"]} mood={{ scrim: [0.5, 0.35], embers: [1, 1.2], heat: [0.9, 0.9] }} />
      <div className="container">
        <ChapterLabel id="participation" />
        <SectionHeading id="participation-heading" label={PARTICIPATION.label} a={PARTICIPATION.titleA} b={PARTICIPATION.titleB} subtitle={PARTICIPATION.subtitle} center />

        <div className="choices">
          <ChainCanvas variant="span" inset={40} heat={0.9} className="choices__chain" />
          <ul className="choices__list">
            {PARTICIPATION.cards.map((c, i) => (
              <li key={c.key} className={`choice choice--${c.key} glass`} data-reveal style={{ ["--i" as string]: i }}>
                <span className="choice__shackle" aria-hidden="true" />
                <svg className="choice__icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  {ICONS[c.key]}
                </svg>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="note glass" role="note" data-reveal>
          <strong>{PARTICIPATION.noteLead}</strong>
          {PARTICIPATION.note}
        </p>
      </div>
    </section>
  );
}
