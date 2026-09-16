"use client";

import { useState } from "react";
import { FAQ_DATA, FAQ_SECTION } from "@/content/site";
import { ScrollTrigger } from "@/lib/gsap";

/** Single-open accordion, matching the original behaviour. Answers keep their source markup. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq">
      <ul className="faq__list" aria-label={`${FAQ_SECTION.titleA} ${FAQ_SECTION.titleB}`}>
        {FAQ_DATA.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={i} className={`faq__item ${isOpen ? "is-open" : ""}`} data-reveal style={{ ["--i" as string]: i }}>
              <h3 className="faq__q">
                <button
                  type="button"
                  id={`faq-btn-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => {
                    setOpen(isOpen ? null : i);
                    setTimeout(() => ScrollTrigger.refresh(), 450);
                  }}
                >
                  <span className="faq__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="faq__text">{item.q}</span>
                  <span className="faq__chevron" aria-hidden="true" />
                </button>
              </h3>
              <div id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} className="faq__a" inert={!isOpen}>
                <div className="faq__a-inner">
                  {/* trusted static markup from the original app.js FAQ_DATA */}
                  <p dangerouslySetInnerHTML={{ __html: item.a }} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
