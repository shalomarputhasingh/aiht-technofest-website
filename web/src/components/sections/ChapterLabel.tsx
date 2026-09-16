import { CHAPTERS } from "@/lib/chapters";

export default function ChapterLabel({ id }: { id: string }) {
  const ch = CHAPTERS[id];
  if (!ch) return null;
  return (
    <p className="chapter-label" aria-hidden="true">
      <span className="chapter-label__n">Chapter {ch.n}</span>
      <span className="chapter-label__rule" />
      <span>{ch.title}</span>
    </p>
  );
}

export function SectionHeading({
  id,
  label,
  a,
  b,
  subtitle,
  center = false,
}: {
  id: string;
  label: string;
  a: string;
  b: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <header className={`section-head ${center ? "section-head--center" : ""}`} data-reveal>
      <p className="section-head__label">{label}</p>
      <h2 className="section-head__title" id={id}>
        {a} <span>{b}</span>
      </h2>
      {subtitle && <p className="section-head__sub">{subtitle}</p>}
    </header>
  );
}
