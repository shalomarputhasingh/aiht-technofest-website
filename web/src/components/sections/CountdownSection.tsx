import ChapterTrigger from "@/components/stage/ChapterTrigger";
import ChapterLabel from "./ChapterLabel";
import Countdown from "./Countdown";

export default function CountdownSection() {
  return (
    <section id="countdown" className="chapter chapter--countdown" aria-labelledby="countdown-heading">
      <ChapterTrigger clips={["c02_approach"]} mood={{ scrim: [0.1, 0.15], embers: [0.9, 0.8], heat: [0.6, 0.5] }} />
      <div className="chapter__sticky chapter__sticky--bottom">
        <div className="container">
          <ChapterLabel id="countdown" />
          <Countdown />
        </div>
      </div>
    </section>
  );
}
