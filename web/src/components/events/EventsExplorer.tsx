"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ALL_EVENTS, EVENTS_SECTION, type FilterKey } from "@/content/site";
import { on } from "@/lib/bus";
import { ScrollTrigger } from "@/lib/gsap";
import { ArrowIcon } from "@/components/ui/RegisterLink";
import EventIcon from "./EventIcon";
import EventModal from "./EventModal";

type Ev = (typeof ALL_EVENTS)[number];

export default function EventsExplorer() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Nav "Technical Events" / "Non-Technical" links pre-select the filter.
  useEffect(() => on("tf:filter", (f) => setFilter(f)), []);

  const q = query.toLowerCase().trim();
  const filtered = useMemo(
    () =>
      ALL_EVENTS.filter(
        (e) =>
          (filter === "all" || e.filterKey === filter) &&
          (!q || e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)),
      ),
    [filter, q],
  );
  const tech = filtered.filter((e) => e.category === "Technical");
  const nontech = filtered.filter((e) => e.category === "Non-Technical");

  // The section height changes with the result set; keep scroll triggers in sync.
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(id);
  }, [filtered.length]);

  const open = (e: Ev, trigger: HTMLElement) => {
    returnFocus.current = trigger;
    setOpenId(e.id);
  };

  const active = ALL_EVENTS.find((e) => e.id === openId) ?? null;

  return (
    <>
      <div className="events-controls glass" data-reveal>
        <div className="segmented" role="group" aria-label="Filter events by category">
          {EVENTS_SECTION.filters.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`segmented__btn ${filter === f.key ? "is-active" : ""}`}
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="search">
          <svg className="search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            className="search__input"
            placeholder={EVENTS_SECTION.searchPlaceholder}
            aria-label="Search events"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <p className="events-counter" aria-live="polite" aria-atomic="true">
          Showing <b>{filtered.length}</b> of {ALL_EVENTS.length} events
        </p>
      </div>

      {tech.length > 0 && (
        <EventGroup heading={EVENTS_SECTION.techHeading} kind="tech" events={tech} label="Technical events" onOpen={open} />
      )}
      {nontech.length > 0 && (
        <EventGroup heading={EVENTS_SECTION.nontechHeading} kind="nontech" events={nontech} label="Non-technical events" onOpen={open} />
      )}
      {filtered.length === 0 && (
        <p className="events-empty glass" role="status">
          {EVENTS_SECTION.noResults}
        </p>
      )}

      <EventModal
        event={active}
        onClose={() => {
          setOpenId(null);
          returnFocus.current?.focus({ preventScroll: true });
        }}
      />
    </>
  );
}

function EventGroup({
  heading,
  kind,
  events,
  label,
  onOpen,
}: {
  heading: string;
  kind: "tech" | "nontech";
  events: Ev[];
  label: string;
  onOpen: (e: Ev, trigger: HTMLElement) => void;
}) {
  return (
    <div className={`event-group event-group--${kind}`}>
      <h3 className="event-group__heading">
        <span className="event-group__rule" aria-hidden="true" />
        {heading}
      </h3>
      <ul className="events-grid" aria-label={label}>
        {events.map((e, i) => (
          <li key={e.id} className="event-card-wrap" style={{ ["--i" as string]: i }}>
            <button
              type="button"
              className={`event-card event-card--${kind}`}
              onClick={(ev) => onOpen(e, ev.currentTarget)}
              aria-haspopup="dialog"
              aria-label={`${e.name} — ${e.category} event. View details.`}
            >
              <span className="event-card__top">
                <span className="event-card__icon">
                  <EventIcon name={e.svgIcon} />
                </span>
                <span className={`badge badge--${kind}`}>{e.category}</span>
              </span>
              <span className="event-card__name">{e.name}</span>
              <span className="event-card__desc">{e.description}</span>
              <span className="event-card__more">
                {EVENTS_SECTION.viewDetails} <ArrowIcon size={12} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
