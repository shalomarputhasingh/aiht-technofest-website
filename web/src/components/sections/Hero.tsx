import { HERO } from "@/content/site";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import RegisterLink, { ArrowIcon } from "@/components/ui/RegisterLink";
import ChapterLabel from "./ChapterLabel";

export default function Hero() {
  return (
    <section id="hero" className="chapter hero" aria-labelledby="hero-title" tabIndex={-1}>
      <ChapterTrigger clips={["c01_awakening"]} start="top top" mood={{ scrim: [0, 0.1], embers: [1.2, 0.9], heat: [0.3, 0.6] }} />
      <div className="chapter__sticky hero__sticky">
        <div className="container hero__inner">
          <ChapterLabel id="hero" />

          <div className="hero__host intro-step" style={{ ["--d" as string]: "0.9s" }}>
            <ul className="hero__pills" aria-label="Anand Institute of Higher Technology presents Technofest 2026">
              {HERO.hostPills.map((p, i) => (
                <li key={p} className={i === 0 ? "pill pill--fire" : "pill"}>
                  {p}
                </li>
              ))}
            </ul>
            <p className="hero__eyebrow">{HERO.eyebrow}</p>
          </div>

          <h1 className="hero__title" id="hero-title">
            <span className="hero__title-line intro-step" style={{ ["--d" as string]: "1.3s" }}>
              <span className="hero__techno">{HERO.titleA}</span>
              <span className="hero__fest">{HERO.titleB}</span>
            </span>
            <span className="hero__year intro-step" style={{ ["--d" as string]: "1.6s" }}>
              {HERO.year}
            </span>
          </h1>

          <div className="hero__copy intro-step" style={{ ["--d" as string]: "2s" }}>
            <p className="hero__tagline">{HERO.tagline}</p>
            <p className="hero__alt">{HERO.altTagline}</p>
            <p className="hero__date" aria-label={`Event date: ${HERO.date}`}>
              <CalendarIcon /> {HERO.date}
            </p>
            <p className="hero__desc">{HERO.description}</p>
            <div className="hero__actions">
              <RegisterLink className="btn btn--fire" label="Register for Technofest 2026 via Google Form">
                {HERO.ctaRegister} <ArrowIcon />
              </RegisterLink>
              <a href="#events" className="btn btn--ghost" aria-label="Explore Technofest 2026 events">
                {HERO.ctaExplore} <ArrowIcon dir="down" />
              </a>
            </div>
          </div>

          <p className="hero__slate intro-step" style={{ ["--d" as string]: "2.4s" }} aria-hidden="true">
            {HERO.telemetry.map(([k, v]) => (
              <span key={k}>
                {k}: <b>{v}</b>
              </span>
            ))}
          </p>
        </div>
        <div className="hero__scroll-hint" aria-hidden="true">
          <span className="hero__scroll-line" />
          Scroll
        </div>
      </div>
    </section>
  );
}

export function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
