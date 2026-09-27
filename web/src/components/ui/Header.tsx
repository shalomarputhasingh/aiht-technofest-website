"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MOBILE_NAV_COLLEGE, MOBILE_NAV_LINKS, NAV_BRAND, NAV_LINKS, TOP_BAR } from "@/content/site";
import { CHAPTERS } from "@/lib/chapters";
import { director } from "@/lib/director";
import RegisterLink, { ArrowIcon } from "./RegisterLink";

const crest = "/brand/aiht-crest.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [chapter, setChapter] = useState("hero");
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const off = director.onChapter(setChapter);
    return () => {
      window.removeEventListener("scroll", onScroll);
      off();
    };
  }, []);

  // Mobile menu: lock scroll, trap focus, Escape to close, restore focus.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const burger = burgerRef.current;
    document.body.classList.add("scroll-locked");
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []).concat(burger ? [burger] : []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
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
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("scroll-locked");
      document.removeEventListener("keydown", onKey);
      burger?.focus({ preventScroll: true });
    };
  }, [open]);

  const ch = CHAPTERS[chapter];

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="topbar" aria-label="Institution Credentials">
          <div className="container topbar__inner">
            <div className="topbar__left">
              <Image src={crest} alt="AIHT Emblem" width={20} height={19} className="topbar__crest" />
              <span>{TOP_BAR.collegeName}</span>
              <span className="topbar__tag">{TOP_BAR.autonomous}</span>
            </div>
            <ul className="topbar__center" aria-label="Accreditations">
              {TOP_BAR.credentials.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className="topbar__right">
              <span>{TOP_BAR.location}</span>
              <a href="https://www.aiht.ac.in" target="_blank" rel="noopener noreferrer" aria-label="Visit AIHT official website (opens in new tab)">
                {TOP_BAR.websiteLabel} ↗
              </a>
            </div>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <div className="container nav__inner">
            <a href="#hero" className="nav__brand" aria-label="Technofest 2026 - Anand Institute of Higher Technology">
              <Image src={crest} alt="AIHT Logo" width={34} height={32} priority />
              <span className="nav__brand-text">
                <span className="nav__brand-tag">{NAV_BRAND.tag}</span>
                <span className="nav__brand-logo">
                  {NAV_BRAND.logo}
                  <em>{NAV_BRAND.year}</em>
                </span>
              </span>
            </a>

            {ch && (
              <span className="nav__chapter" aria-hidden="true">
                <span>{ch.n}</span> {ch.title}
              </span>
            )}

            <ul className="nav__links">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    aria-current={l.href === `#${chapter}` ? "location" : undefined}
                    className={l.href === `#${chapter}` ? "is-active" : ""}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <RegisterLink className="btn btn--fire btn--sm nav__cta">Pre-register</RegisterLink>

            <button
              ref={burgerRef}
              type="button"
              className={`burger ${open ? "is-open" : ""}`}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-nav"
        ref={panelRef}
        className={`mobile-nav ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        <div className="mobile-nav__college">
          <Image src={crest} alt="AIHT Crest" width={44} height={42} />
          <div>
            <div className="mobile-nav__name">{MOBILE_NAV_COLLEGE.name}</div>
            <div className="mobile-nav__sub">{MOBILE_NAV_COLLEGE.sub}</div>
          </div>
        </div>
        <ul>
          {MOBILE_NAV_LINKS.map((l, i) => (
            <li key={l.label} style={{ ["--i" as string]: i }}>
              <a href={l.href} className="mobile-nav__link" onClick={() => setOpen(false)}>
                <span className="mobile-nav__num" aria-hidden="true">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <RegisterLink className="btn btn--fire btn--block" onNavigate={() => setOpen(false)}>
          Pre-register <ArrowIcon />
        </RegisterLink>
      </div>
    </>
  );
}
