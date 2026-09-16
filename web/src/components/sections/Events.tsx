import { EVENTS_SECTION } from "@/content/site";
import EventsExplorer from "@/components/events/EventsExplorer";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import ChapterLabel, { SectionHeading } from "./ChapterLabel";

export default function Events() {
  return (
    <section id="events" className="chapter chapter--events" aria-labelledby="events-heading">
      <ChapterTrigger clips={["c05_ride_city"]} mood={{ scrim: [0.3, 0.55], embers: [1.4, 1], heat: [1, 0.85] }} />
      <div className="events__intro container">
        <ChapterLabel id="events" />
        <SectionHeading id="events-heading" label={EVENTS_SECTION.label} a={EVENTS_SECTION.titleA} b={EVENTS_SECTION.titleB} subtitle={EVENTS_SECTION.subtitle} center />
      </div>
      <div className="container events__body">
        <EventsExplorer />
      </div>
    </section>
  );
}
