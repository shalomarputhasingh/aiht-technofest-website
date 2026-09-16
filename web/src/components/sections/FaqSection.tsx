import { FAQ_SECTION } from "@/content/site";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import ChapterLabel, { SectionHeading } from "./ChapterLabel";
import Faq from "./Faq";

export default function FaqSection() {
  return (
    <section id="faq" className="chapter chapter--faq" aria-labelledby="faq-heading">
      {/* The silence: hold the last frame of the watch shot, dim the fire. */}
      <ChapterTrigger clips={["c08_watch"]} mood={{ scrim: [0.55, 0.6], embers: [0.35, 0.3], heat: [0.35, 0.3] }} hold={1} />
      <div className="container faq-layout">
        <div className="faq-layout__head">
          <ChapterLabel id="faq" />
          <SectionHeading id="faq-heading" label={FAQ_SECTION.label} a={FAQ_SECTION.titleA} b={FAQ_SECTION.titleB} />
        </div>
        <Faq />
      </div>
    </section>
  );
}
