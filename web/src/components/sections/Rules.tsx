import { RULES_SECTION } from "@/content/site";
import EventIcon from "@/components/events/EventIcon";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import ChapterLabel, { SectionHeading } from "./ChapterLabel";

export default function Rules() {
  return (
    <section id="rules" className="chapter chapter--rules" aria-labelledby="rules-heading">
      <ChapterTrigger clips={["c08_watch"]} mood={{ scrim: [0.4, 0.5], embers: [0.9, 0.7], heat: [0.7, 0.5] }} />
      <div className="container">
        <ChapterLabel id="rules" />
        <SectionHeading
          id="rules-heading"
          label={RULES_SECTION.label}
          a={RULES_SECTION.titleA}
          b={RULES_SECTION.titleB}
          subtitle={RULES_SECTION.subtitle}
          center
        />

        <div className="rulebook">
          {RULES_SECTION.groups.map((group, i) => (
            <section key={group.key} className={`rulebook__group rulebook__group--${group.key} glass`} data-reveal style={{ ["--i" as string]: i }} aria-labelledby={`rules-${group.key}`}>
              <h3 className="rulebook__title" id={`rules-${group.key}`}>
                <span className="rulebook__icon">
                  <EventIcon name={group.icon} size={20} />
                </span>
                {group.title}
              </h3>
              <ol className="rulebook__list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
