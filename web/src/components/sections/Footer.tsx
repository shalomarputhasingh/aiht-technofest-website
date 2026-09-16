import Image from "next/image";
import { FOOTER, FOOTER_LINKS } from "@/content/site";
import FooterLink from "./FooterLink";
import RegisterLink from "@/components/ui/RegisterLink";

const CONTACT_ICONS: Record<string, string> = {
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
  mobile: "M7 2h10v20H7zM11 18h2",
  mail: "M3 5h18v14H3zM3 7l9 6 9-6",
  web: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z",
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
};

export default function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__crest-row">
              <Image src="/brand/aiht-crest.png" alt="AIHT Crest" width={34} height={32} />
              <span className="footer__logo">{FOOTER.logo}</span>
            </div>
            <p className="footer__tagline">{FOOTER.tagline}</p>
            <p className="footer__college">
              <strong>{FOOTER.college}</strong>
              {FOOTER.collegeLines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </p>
            <p className="footer__address">{FOOTER.address}</p>
            <RegisterLink className="btn btn--ghost btn--sm">Register Now</RegisterLink>
          </div>

          <nav aria-label="Footer navigation — Quick Links">
            <h2 className="footer__title">{FOOTER.quickLinksTitle}</h2>
            <ul className="footer__list">
              {FOOTER_LINKS.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href} filter={l.filter}>
                    {l.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="footer__title">{FOOTER.contactTitle}</h2>
            <ul className="footer__list">
              {FOOTER.contacts.map((c) => (
                <li key={c.label}>
                  <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={CONTACT_ICONS[c.kind]} />
                    </svg>
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>{FOOTER.copyright}</p>
          <p className="footer__accred">{FOOTER.accreditation}</p>
        </div>
      </div>
    </footer>
  );
}
