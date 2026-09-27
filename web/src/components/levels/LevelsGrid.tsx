"use client";

import { useRef, useState } from "react";
import { LEVELS, LEVELS_SECTION, type Level } from "@/content/site";
import { ArrowIcon } from "@/components/ui/RegisterLink";
import LevelIcon from "./LevelIcon";
import LevelModal from "./LevelModal";

/**
 * The three levels. Every rule and scoring line is in the DOM (inside the card
 * and again in the dialog), so the page carries the full rulebook without JS.
 */
export default function LevelsGrid() {
  const [open, setOpen] = useState<Level | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  return (
    <>
      <ol className="levels">
        {LEVELS.map((level, i) => (
          <li key={level.id} className={`level level--${i + 1}`} data-reveal style={{ ["--i" as string]: i }}>
            <div className="level__head">
              <span className="level__icon">
                <LevelIcon name={level.svgIcon} size={26} />
              </span>
              <div>
                <p className="level__number">{level.number}</p>
                <h3 className="level__name" id={`level-${level.id}`}>
                  {level.name}
                </h3>
                <p className="level__kind">{level.kind}</p>
              </div>
            </div>

            <p className="level__tagline">{level.tagline}</p>

            <dl className="level__meta">
              <div>
                <dt>Time</dt>
                <dd>{level.duration}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{level.format}</dd>
              </div>
              <div>
                <dt>Qualifier</dt>
                <dd>{level.qualifier}</dd>
              </div>
            </dl>

            <div className="level__rules">
              <h4 className="level__label">{LEVELS_SECTION.rulesLabel}</h4>
              <ul>
                {level.rules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="level__scoring">
              <h4 className="level__label">{LEVELS_SECTION.scoringLabel}</h4>
              <dl>
                {level.scoring.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.text}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <button
              type="button"
              className="level__more"
              aria-haspopup="dialog"
              aria-label={`${level.name} — full rules and scoring`}
              onClick={(e) => {
                returnFocus.current = e.currentTarget;
                setOpen(level);
              }}
            >
              {LEVELS_SECTION.viewDetails} <ArrowIcon size={13} />
            </button>
          </li>
        ))}
      </ol>

      <LevelModal
        level={open}
        onClose={() => {
          setOpen(null);
          returnFocus.current?.focus({ preventScroll: true });
        }}
      />
    </>
  );
}
