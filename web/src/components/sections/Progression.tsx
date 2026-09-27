import { PRIZES, PROGRESSION, PROGRESSION_SECTION, WINNING } from "@/content/site";
import ChainCanvas from "@/components/chain/ChainCanvas";
import LevelIcon from "@/components/levels/LevelIcon";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import ChapterLabel, { SectionHeading } from "./ChapterLabel";

const PRIZE_ICON = ["trophy", "medal", "medal"];

export default function Progression() {
  return (
    <section id="progression" className="chapter chapter--progression" aria-labelledby="progression-heading">
      <ChapterTrigger clips={["c06_ride_future"]} mood={{ scrim: [0.5, 0.35], embers: [1, 1.2], heat: [0.9, 0.9] }} />
      <div className="container">
        <ChapterLabel id="progression" />
        <SectionHeading
          id="progression-heading"
          label={PROGRESSION_SECTION.label}
          a={PROGRESSION_SECTION.titleA}
          b={PROGRESSION_SECTION.titleB}
          subtitle={PROGRESSION_SECTION.subtitle}
          center
        />

        <ol className="funnel">
          <ChainCanvas variant="span" inset={40} heat={0.9} className="funnel__chain" />
          {PROGRESSION.map((step, i) => (
            <li key={step.stage} className={`funnel__step ${i === PROGRESSION.length - 1 ? "is-final" : ""} glass`} data-reveal style={{ ["--i" as string]: i }}>
              <span className="funnel__shackle" aria-hidden="true" />
              <span className="funnel__teams">{step.teams}</span>
              <h3 className="funnel__stage">{step.stage}</h3>
              <p className="funnel__detail">{step.detail}</p>
            </li>
          ))}
        </ol>

        <div className="prizes" data-reveal>
          <h3 className="prizes__title" id="prizes">
            <span className="prizes__label">{PROGRESSION_SECTION.prizesLabel}</span>
            {PROGRESSION_SECTION.prizesTitleA} <span>{PROGRESSION_SECTION.prizesTitleB}</span>
          </h3>
          <ol className="prizes__list">
            {PRIZES.map((p, i) => (
              <li key={p.place} className={`prize prize--${i + 1}`}>
                <span className="prize__icon">
                  <LevelIcon name={PRIZE_ICON[i]} size={26} />
                </span>
                <span className="prize__place">{p.place}</span>
                <span className="prize__position">{p.position}</span>
                <span className="prize__amount">{p.amount}</span>
                <span className="prize__extra">{p.extra}</span>
              </li>
            ))}
          </ol>
          <ul className="prizes__notes">
            {WINNING.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
