"use client";

import { useEffect, useRef } from "react";
import { COMING_SOON, type TechnofestEvent } from "@/content/site";
import RegisterLink, { ArrowIcon } from "@/components/ui/RegisterLink";
import EventIcon from "./EventIcon";

/**
 * Event details in a native modal <dialog>: the page behind becomes inert,
 * Escape closes it, and Tab is additionally cycled inside so focus can never
 * escape to the browser chrome mid-dialog. Content mirrors buildModalBody() in
 * the original app.js.
 */
export default function EventModal({ event, onClose }: { event: TechnofestEvent | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (event && !dlg.open) {
      dlg.showModal();
      closeRef.current?.focus();
    } else if (!event && dlg.open) {
      dlg.close();
    }
  }, [event]);

  // Scroll lock is bound to the open state, so it is always released.
  const isOpen = !!event;
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
      e.preventDefault(); // run our own close so state + focus restore stay in sync
      dlg.close();
    };
    const onKey = (e: KeyboardEvent) => {
      // Explicit Escape handling (as in the original app.js) — don't rely solely on
      // the browser's dialog close-watcher, which can swallow repeated cancels.
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

  const isTech = event?.category === "Technical";
  const kind = isTech ? "tech" : "nontech";

  return (
    <dialog ref={ref} className="modal" aria-labelledby="modal-event-title">
      {event && (
        <div className={`modal__panel modal__panel--${kind}`}>
          <div className="modal__header">
            <div className="modal__title-group">
              <span className="modal__icon">
                <EventIcon name={event.svgIcon} size={26} />
              </span>
              <div>
                <h3 className="modal__title" id="modal-event-title">
                  {event.name}
                </h3>
                <span className={`badge badge--${kind}`}>{event.category}</span>
              </div>
            </div>
            <button ref={closeRef} type="button" className="modal__close" aria-label="Close event details" onClick={() => ref.current?.close()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="modal__body">
            <div className="modal__section">
              <h4 className="modal__label">Description</h4>
              <p>{event.description}</p>
            </div>
            <div className="modal__section">
              <h4 className="modal__label">Event Details</h4>
              <dl className="modal__grid">
                {[
                  ["Category", event.category],
                  ["Team Size", event.teamSize || COMING_SOON],
                  ["Duration", event.duration || COMING_SOON],
                  ["Venue", event.venue || COMING_SOON],
                ].map(([label, value]) => (
                  <div className="modal__item" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="modal__section">
              <h4 className="modal__label">Eligibility</h4>
              <p>{event.eligibility || COMING_SOON}</p>
            </div>
            <div className="modal__section">
              <h4 className="modal__label">Rules &amp; Guidelines</h4>
              {event.rules.length > 0 ? (
                <ul className="modal__rules">
                  {event.rules.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p>{COMING_SOON}</p>
              )}
            </div>
            <div className="modal__section">
              <h4 className="modal__label">Coordinators</h4>
              <p>{event.coordinators.length > 0 ? event.coordinators.join(", ") : COMING_SOON}</p>
            </div>
            {event.additionalInfo && (
              <div className="modal__section">
                <h4 className="modal__label">Additional Information</h4>
                <p>{event.additionalInfo}</p>
              </div>
            )}
          </div>

          <div className="modal__footer">
            <RegisterLink className="btn btn--fire" label={`Register for ${event.name}`}>
              Register Now <ArrowIcon />
            </RegisterLink>
          </div>
        </div>
      )}
    </dialog>
  );
}
