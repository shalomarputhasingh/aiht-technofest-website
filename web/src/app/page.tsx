import { CONFIG, EVENTS } from "@/content/site";
import type { ClipId } from "@/lib/clips";
import CinemaStage from "@/components/stage/CinemaStage";
import Header from "@/components/ui/Header";
import Chrome from "@/components/ui/Chrome";
import Toast from "@/components/ui/Toast";
import Preloader from "@/components/ui/Preloader";
import RevealObserver from "@/components/ui/RevealObserver";
import Hero from "@/components/sections/Hero";
import CountdownSection from "@/components/sections/CountdownSection";
import About from "@/components/sections/About";
import EventsOverview from "@/components/sections/EventsOverview";
import EventDetail from "@/components/sections/EventDetail";
import Rules from "@/components/sections/Rules";
import Registration from "@/components/sections/Registration";
import Info from "@/components/sections/Info";
import FaqSection from "@/components/sections/FaqSection";
import FinalRide from "@/components/sections/FinalRide";
import Footer from "@/components/sections/Footer";

// One chapter of the film per event, in order.
const EVENT_CLIPS: Record<string, ClipId> = {
  "stack-and-level": "c05_ride_city",
  "the-reckoning": "c06_ride_future",
  "chill-flex": "c07_stop",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${CONFIG.FEST_NAME} — ${CONFIG.DEPARTMENT_FULL}`,
  description: CONFIG.EVENT_TAGLINE,
  startDate: CONFIG.EVENT_DATE.slice(0, 10),
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: { "@type": "Place", name: `${CONFIG.COLLEGE_NAME} — ${CONFIG.VENUE_BLOCK}`, address: CONFIG.COLLEGE_ADDRESS },
  organizer: { "@type": "CollegeOrUniversity", name: CONFIG.COLLEGE_NAME, url: CONFIG.COLLEGE_WEBSITE },
  subEvent: EVENTS.map((e) => ({
    "@type": "Event",
    name: e.name,
    description: e.summary,
    startDate: CONFIG.EVENT_DATE.slice(0, 10),
    location: { "@type": "Place", name: `${CONFIG.COLLEGE_NAME} — ${CONFIG.VENUE_BLOCK}`, address: CONFIG.COLLEGE_ADDRESS },
  })),
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", price: "0", priceCurrency: "INR", url: CONFIG.GOOGLE_FORM_URL },
};

export default function Home() {
  return (
    <>
      <Preloader />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <CinemaStage />
      <Header />
      <main id="main">
        <Hero />
        <CountdownSection />
        <About />
        <EventsOverview />
        {EVENTS.map((event) => (
          <EventDetail key={event.id} event={event} clip={EVENT_CLIPS[event.id] ?? "c05_ride_city"} />
        ))}
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
