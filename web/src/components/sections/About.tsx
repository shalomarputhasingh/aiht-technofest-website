import { ABOUT } from "@/content/site";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import ChapterLabel, { SectionHeading } from "./ChapterLabel";
import StatCounter from "./StatCounter";

const HIGHLIGHT_ICONS: Record<string, React.ReactNode> = {
  Innovation: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" />,
  Competition: <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3a3 3 0 0 1-3 4M7 5H4a3 3 0 0 0 3 4" />,
  Creativity: <path d="M12 3l2.4 5.6L20 9.3l-4.3 3.9 1.2 5.8L12 16l-4.9 3 1.2-5.8L4 9.3l5.6-.7z" />,
  Experience: <path d="M12 2c1.5 3 5 4.5 5 9a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.5 1 2.5 2 3 0-3 .5-5.5 1-7.5z" />,
};

export default function About() {
  return (
    <section id="about" className="chapter chapter--about" aria-labelledby="about-heading">
      <ChapterTrigger
        clips={["c03_mount", "c04_ignition"]}
        mood={{ scrim: [0.15, 0.25], embers: [0.8, 1.4], heat: [0.45, 1] }}
      />
      <div className="container about">
        <div className="about__text">
          <ChapterLabel id="about" />
          <SectionHeading id="about-heading" label={ABOUT.label} a={ABOUT.titleA} b={ABOUT.titleB} />
          <div className="glass about__copy" data-reveal>
            {ABOUT.paragraphs.map((para, i) => (
              <p key={i}>
                {para.map((part, j) => (typeof part === "string" ? part : <strong key={j}>{part.strong}</strong>))}
              </p>
            ))}
          </div>
        </div>

        <dl className="about__stats" data-reveal>
          {ABOUT.stats.map((s) => (
            <div className="stat" key={s.label}>
              <dt className="stat__label">{s.label}</dt>
              <dd className="stat__value">
                <StatCounter value={s.value} />
              </dd>
            </div>
          ))}
        </dl>

        <ul className="about__highlights">
          {ABOUT.highlights.map((h, i) => (
            <li className="highlight glass" key={h.title} data-reveal style={{ ["--i" as string]: i }}>
              <svg className="highlight__icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                {HIGHLIGHT_ICONS[h.title]}
              </svg>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
