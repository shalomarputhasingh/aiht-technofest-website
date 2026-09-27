"use client";

import { useEffect, useRef } from "react";
import { LEVELS_SECTION, type Level } from "@/content/site";
import RegisterLink, { ArrowIcon } from "@/components/ui/RegisterLink";
import LevelIcon from "./LevelIcon";

/**
 * Full rules + scoring for one level in a native modal <dialog>: the page behind
 * goes inert, Escape closes, and Tab is cycled inside so focus cannot escape.
 */
export default function LevelModal({ level, onClose }: { level: Level | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (level && !dlg.open) {
      dlg.showModal();
      closeRef.current?.focus();
    } else if (!level && dlg.open) {
      dlg.close();
    }
  }, [level]);

  // Scroll lock is bound to the open state, so it is always released.
  const isOpen = !!level;
  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("scroll-locked");
    return () => document.body.classList.remove("scroll-locked");
  }, [isOpen]);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const onDialogClose = () => onClose();
    const onCancel = (e: Event) => {
      e.preventDefault();
      dlg.close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dlg.close();
        return;
      }
      if (e.key !== "Tab") return;
      const f = dlg.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onBackdrop = (e: MouseEvent) => {
      if (e.target === dlg) dlg.close();
    };
    dlg.addEventListener("close", onDialogClose);
    dlg.addEventListener("cancel", onCancel);
    dlg.addEventListener("keydown", onKey);
    dlg.addEventListener("click", onBackdrop);
    return () => {
      dlg.removeEventListener("close", onDialogClose);
      dlg.removeEventListener("cancel", onCancel);
      dlg.removeEventListener("keydown", onKey);
      dlg.removeEventListener("click", onBackdrop);
    };
  }, [onClose]);

  return (
    <dialog ref={ref} className="modal" aria-labelledby="modal-level-title">
      {level && (
        <div className="modal__panel">
          <div className="modal__header">
            <div className="modal__title-group">
              <span className="modal__icon">
                <LevelIcon name={level.svgIcon} size={26} />
              </span>
              <div>
                <span className="badge badge--tech">{level.number}</span>
                <h3 className="modal__title" id="modal-level-title">
                  {level.name}
                </h3>
                <p className="modal__subtitle">{level.kind}</p>
              </div>
            </div>
            <button ref={closeRef} type="button" className="modal__close" aria-label="Close level details" onClick={() => ref.current?.close()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="modal__body">
            <div className="modal__section">
              <h4 className="modal__label">At a glance</h4>
              <dl className="modal__grid">
                {[
                  ["Time", level.duration],
                  ["Format", level.format],
                  ["Qualifier", level.qualifier],
                ].map(([label, value]) => (
                  <div className="modal__item" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="modal__section">
              <h4 className="modal__label">{LEVELS_SECTION.rulesLabel}</h4>
              <ul className="modal__rules">
                {level.rules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="modal__section">
              <h4 className="modal__label">{LEVELS_SECTION.scoringLabel}</h4>
              <dl className="modal__scoring">
                {level.scoring.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="modal__footer">
            <RegisterLink className="btn btn--fire" label={`Pre-register for ${level.name}`}>
              Pre-register <ArrowIcon />
            </RegisterLink>
          </div>
        </div>
      )}
    </dialog>
  );
}
