import { CONFIG, LEVELS, PRIZES } from "@/content/site";
import CinemaStage from "@/components/stage/CinemaStage";
import Header from "@/components/ui/Header";
import Chrome from "@/components/ui/Chrome";
import Toast from "@/components/ui/Toast";
import RevealObserver from "@/components/ui/RevealObserver";
import Hero from "@/components/sections/Hero";
import CountdownSection from "@/components/sections/CountdownSection";
import About from "@/components/sections/About";
import Levels from "@/components/sections/Levels";
import Progression from "@/components/sections/Progression";
import Rules from "@/components/sections/Rules";
import Registration from "@/components/sections/Registration";
import Info from "@/components/sections/Info";
import FaqSection from "@/components/sections/FaqSection";
import FinalRide from "@/components/sections/FinalRide";
import Footer from "@/components/sections/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${CONFIG.EVENT_NAME} — ${CONFIG.FEST_NAME}`,
  description: CONFIG.EVENT_TAGLINE,
  startDate: CONFIG.EVENT_DATE.slice(0, 10),
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: { "@type": "Place", name: CONFIG.COLLEGE_NAME, address: CONFIG.COLLEGE_ADDRESS },
  organizer: { "@type": "CollegeOrUniversity", name: CONFIG.COLLEGE_NAME, url: CONFIG.COLLEGE_WEBSITE },
  subEvent: LEVELS.map((l) => ({ "@type": "Event", name: l.name, description: l.kind })),
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", price: "0", priceCurrency: "INR", url: CONFIG.GOOGLE_FORM_URL },
  award: PRIZES.map((p) => `${p.position}: ${p.amount} ${p.extra}`),
};

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <CinemaStage />
      <Header />
      <main id="main">
        <Hero />
        <CountdownSection />
        <About />
        <Levels />
        <Progression />
        <Rules />
        <Registration />
        <Info />
        <FaqSection />
        <FinalRide />
      </main>
      <Footer />
      <Chrome />
      <Toast />
      <RevealObserver />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
