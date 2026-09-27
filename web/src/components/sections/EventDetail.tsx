import { EVENT_PAGE, type CseEvent } from "@/content/site";
import EventIcon from "@/components/events/EventIcon";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import type { ClipId } from "@/lib/clips";
import ChapterLabel from "./ChapterLabel";

const PRIZE_ICON = ["trophy", "medal", "medal"];

/**
 * One event's full rulebook. Rounds use <details> so the page stays scannable
 * while every rule remains in the HTML — readable without JS and by crawlers.
 * The first round of each event is open by default.
 */
export default function EventDetail({
  event,
  clip,
  mood,
}: {
  event: CseEvent;
  clip: ClipId;
  mood?: { scrim: [number, number]; embers: [number, number]; heat: [number, number] };
}) {
  const kind = event.category === "Technical" ? "tech" : "nontech";
  return (
    <section id={event.id} className={`chapter chapter--event chapter--event-${kind}`} aria-labelledby={`${event.id}-heading`}>
      <ChapterTrigger clips={[clip]} mood={mood ?? { scrim: [0.35, 0.55], embers: [1.1, 0.9], heat: [0.9, 0.7] }} />
      <div className="container event">
        <header className="event__head" data-reveal>
          <ChapterLabel id={event.id} />
          <span className="event__icon">
            <EventIcon name={event.svgIcon} size={30} />
          </span>
          <span className={`badge badge--${kind}`}>{event.category} Event</span>
          <h2 className="event__name" id={`${event.id}-heading`}>
            {event.name}
          </h2>
          <p className="event__tagline">{event.tagline}</p>
          <p className="event__summary">{event.summary}</p>
          <dl className="event__facts">
            {event.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="event__body">
          <section className="event__block glass" data-reveal aria-labelledby={`${event.id}-general`}>
            <h3 className="event__block-title" id={`${event.id}-general`}>
              <EventIcon name="list" size={18} /> {EVENT_PAGE.generalLabel}
            </h3>
            <ol className="ruleslist">
              {event.generalRules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </section>

          <section className="event__block event__block--rounds" data-reveal aria-labelledby={`${event.id}-rounds`}>
            <h3 className="event__block-title" id={`${event.id}-rounds`}>
              <EventIcon name="flag" size={18} /> {EVENT_PAGE.roundsLabel}
            </h3>
            <div className="rounds">
              {event.rounds.map((round, ri) => (
                <details key={round.name} className="round" open={ri === 0} name={`${event.id}-rounds`}>
                  <summary className="round__summary">
                    <span className="round__index" aria-hidden="true">
                      {String(ri + 1).padStart(2, "0")}
                    </span>
                    <span className="round__titles">
                      {round.number && <span className="round__number">{round.number}</span>}
                      <span className="round__name">{round.kind ? round.name : round.name}</span>
                      {round.kind && <span className="round__kind">{round.kind}</span>}
                      {round.games.length > 0 && (
                        <span className="round__count">
                          {round.games.length} {round.games.length === 1 ? "game" : "games"}
                        </span>
                      )}
                    </span>
                    <span className="round__chevron" aria-hidden="true" />
                  </summary>

                  <div className="round__body">
                    {round.rules.length > 0 && (
                      <ul className="ruleslist ruleslist--plain">
                        {round.rules.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    )}
                    {round.games.map((game) => (
                      <article className="game" key={game.name}>
                        <h4 className="game__name">
                          <EventIcon name="gamepad" size={15} /> {game.name}
                        </h4>
                        {game.note && <p className="game__note">{game.note}</p>}
                        <ol className="ruleslist">
                          {game.rules.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ol>
                      </article>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {event.scoring.length > 0 && (
            <section className="event__block glass" data-reveal aria-labelledby={`${event.id}-scoring`}>
              <h3 className="event__block-title" id={`${event.id}-scoring`}>
                <EventIcon name="scoreboard" size={18} /> {EVENT_PAGE.scoringLabel}
              </h3>
              <div className="scoring">
                {event.scoring.map((group) => (
                  <div className="scoring__group" key={group.level}>
                    <h4 className="scoring__level">{group.level}</h4>
                    <dl>
                      {group.items.map((item) => (
                        <div key={item.label + item.text}>
                          {item.label && <dt>{item.label}</dt>}
                          <dd>{item.text}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </section>
          )}

          {event.progression && (
            <section className="event__block" data-reveal aria-labelledby={`${event.id}-progression`}>
              <h3 className="event__block-title" id={`${event.id}-progression`}>
                <EventIcon name="users" size={18} /> {EVENT_PAGE.progressionLabel}
              </h3>
              <ol className="funnel">
                {event.progression.map((step, i) => (
                  <li key={step.stage} className={`funnel__step ${i === event.progression!.length - 1 ? "is-final" : ""} glass`}>
                    <span className="funnel__teams">{step.teams}</span>
                    <h4 className="funnel__stage">{step.stage}</h4>
                    <p className="funnel__detail">{step.detail}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="event__pair">
            <section className="event__block glass" data-reveal aria-labelledby={`${event.id}-regs`}>
              <h3 className="event__block-title" id={`${event.id}-regs`}>
                <EventIcon name="shield" size={18} /> {EVENT_PAGE.regulationsLabel}
              </h3>
              <ol className="ruleslist">
                {event.regulations.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ol>
            </section>

            <section className="event__block glass" data-reveal aria-labelledby={`${event.id}-conduct`}>
              <h3 className="event__block-title" id={`${event.id}-conduct`}>
                <EventIcon name="handshake" size={18} /> {EVENT_PAGE.conductLabel}
              </h3>
              <ol className="ruleslist">
                {event.conduct.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ol>
            </section>
          </div>

          <section className="event__block event__block--winning glass" data-reveal aria-labelledby={`${event.id}-winning`}>
            <h3 className="event__block-title" id={`${event.id}-winning`}>
              <EventIcon name="trophy" size={18} /> {EVENT_PAGE.winningLabel}
            </h3>
            <ul className="ruleslist ruleslist--plain">
              {event.winning.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>

            {event.prizes ? (
              <>
                <h4 className="event__prizes-title">{EVENT_PAGE.prizesLabel}</h4>
                <ol className="prizes__list">
                  {event.prizes.map((p, i) => (
                    <li key={p.place} className={`prize prize--${i + 1}`}>
                      <span className="prize__icon">
                        <EventIcon name={PRIZE_ICON[i]} size={24} />
                      </span>
                      <span className="prize__place">{p.place}</span>
                      <span className="prize__position">{p.position}</span>
                      <span className="prize__amount">{p.amount}</span>
                      <span className="prize__extra">{p.extra}</span>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <p className="event__prizes-tba">{EVENT_PAGE.prizesTba}</p>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
