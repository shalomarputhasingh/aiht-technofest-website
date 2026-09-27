import { LEVELS_SECTION } from "@/content/site";
import LevelsGrid from "@/components/levels/LevelsGrid";
import ChapterTrigger from "@/components/stage/ChapterTrigger";
import ChapterLabel, { SectionHeading } from "./ChapterLabel";

export default function Levels() {
  return (
    <section id="levels" className="chapter chapter--levels" aria-labelledby="levels-heading">
      <ChapterTrigger clips={["c05_ride_city"]} mood={{ scrim: [0.3, 0.55], embers: [1.4, 1], heat: [1, 0.85] }} />
      <div className="levels__intro container">
        <ChapterLabel id="levels" />
        <SectionHeading
          id="levels-heading"
          label={LEVELS_SECTION.label}
          a={LEVELS_SECTION.titleA}
          b={LEVELS_SECTION.titleB}
          subtitle={LEVELS_SECTION.subtitle}
          center
        />
      </div>
      <div className="container levels__body">
        <LevelsGrid />
      </div>
    </section>
  );
}
