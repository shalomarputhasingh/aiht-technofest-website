import { REGISTRATION } from "@/content/site";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import RegisterLink, { ArrowIcon } from "@/components/ui/RegisterLink";
import ChapterLabel, { SectionHeading } from "./ChapterLabel";

export default function Registration() {
  return (
    <section id="registration" className="chapter chapter--registration" aria-labelledby="reg-heading">
      <ChapterTrigger clips={["c08_watch"]} mood={{ scrim: [0.5, 0.35], embers: [0.7, 0.8], heat: [0.5, 0.6] }} hold={0.6} />
      <div className="container registration">
        <div className="registration__head">
          <ChapterLabel id="registration" />
          <SectionHeading id="reg-heading" label={REGISTRATION.label} a={REGISTRATION.titleA} b={REGISTRATION.titleB} subtitle={REGISTRATION.subtitle} />
        </div>

        <ol className="steps">
          {REGISTRATION.steps.map((s, i) => (
            <li key={s.number} className="step glass" data-reveal style={{ ["--i" as string]: i }}>
              <span className="step__number">{s.number}</span>
              <h3>{s.title}</h3>
              <p>{s.text.map((part, j) => (typeof part === "string" ? part : <strong key={j}>{part.strong}</strong>))}</p>
            </li>
          ))}
        </ol>

        <div className="registration__cta" data-reveal>
          <RegisterLink className="btn btn--fire btn--lg">
            {REGISTRATION.cta} <ArrowIcon size={18} />
          </RegisterLink>
        </div>
      </div>
    </section>
  );
}
