import { ALL_EVENTS, CONFIG } from "@/content/site";
import CinemaStage from "@/components/stage/CinemaStage";
import Header from "@/components/ui/Header";
import Chrome from "@/components/ui/Chrome";
import Toast from "@/components/ui/Toast";
import RevealObserver from "@/components/ui/RevealObserver";
import Hero from "@/components/sections/Hero";
import CountdownSection from "@/components/sections/CountdownSection";
import About from "@/components/sections/About";
import Events from "@/components/sections/Events";
import Participation from "@/components/sections/Participation";
import Registration from "@/components/sections/Registration";
import Info from "@/components/sections/Info";
import FaqSection from "@/components/sections/FaqSection";
import FinalRide from "@/components/sections/FinalRide";
import Footer from "@/components/sections/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: CONFIG.EVENT_NAME,
  description: CONFIG.EVENT_TAGLINE,
  startDate: CONFIG.EVENT_DATE.slice(0, 10),
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: CONFIG.COLLEGE_NAME,
    address: CONFIG.COLLEGE_ADDRESS,
  },
  organizer: { "@type": "CollegeOrUniversity", name: CONFIG.COLLEGE_NAME, url: CONFIG.COLLEGE_WEBSITE },
  subEvent: ALL_EVENTS.map((e) => ({ "@type": "Event", name: e.name, description: e.description })),
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
        <Events />
        <Participation />
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
