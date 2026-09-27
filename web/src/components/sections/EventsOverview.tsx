import { EVENTS, EVENTS_SECTION } from "@/content/site";
import EventIcon from "@/components/events/EventIcon";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import { ArrowIcon } from "@/components/ui/RegisterLink";
import ChapterLabel, { SectionHeading } from "./ChapterLabel";

export default function EventsOverview() {
  return (
    <section id="events" className="chapter chapter--events" aria-labelledby="events-heading">
      <ChapterTrigger clips={["c04_ignition"]} mood={{ scrim: [0.25, 0.45], embers: [1.2, 1.4], heat: [0.8, 1] }} />
      <div className="events__intro container">
        <ChapterLabel id="events" />
        <SectionHeading
          id="events-heading"
          label={EVENTS_SECTION.label}
          a={EVENTS_SECTION.titleA}
          b={EVENTS_SECTION.titleB}
          subtitle={EVENTS_SECTION.subtitle}
          center
        />
      </div>

      <div className="container">
        <ul className="lineup">
          {EVENTS.map((event, i) => {
            const games = event.rounds.reduce((n, r) => n + r.games.length, 0);
            return (
              <li key={event.id} className={`lineup__card lineup__card--${event.category === "Technical" ? "tech" : "nontech"}`} data-reveal style={{ ["--i" as string]: i }}>
                <span className="lineup__icon">
                  <EventIcon name={event.svgIcon} size={28} />
                </span>
                <span className={`badge badge--${event.category === "Technical" ? "tech" : "nontech"}`}>{event.category}</span>
                <h3 className="lineup__name">
                  <a href={`#${event.id}`}>{event.name}</a>
                </h3>
                <p className="lineup__tagline">{event.tagline}</p>
                <p className="lineup__summary">{event.summary}</p>
                <dl className="lineup__stats">
                  <div>
                    <dt>{EVENTS_SECTION.roundsLabel}</dt>
                    <dd>{event.rounds.length}</dd>
                  </div>
                  {games > 0 && (
                    <div>
                      <dt>{EVENTS_SECTION.gamesLabel}</dt>
                      <dd>{games}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Team</dt>
                    <dd>{event.teamSize}</dd>
                  </div>
                </dl>
                <a className="lineup__link" href={`#${event.id}`}>
                  {EVENTS_SECTION.viewRules} <ArrowIcon size={13} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
