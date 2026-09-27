import type { Metadata, Viewport } from "next";
import { Big_Shoulders, JetBrains_Mono, Manrope } from "next/font/google";
import { CONFIG, EVENTS } from "@/content/site";
import "./globals.css";

const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  display: "swap",
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Derived from the event data, so metadata follows the rulebook.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${CONFIG.DEPARTMENT} | ${CONFIG.FEST_NAME} — ${CONFIG.COLLEGE_SHORT}`,
  description: `${CONFIG.DEPARTMENT_FULL} events at ${CONFIG.FEST_NAME}, ${CONFIG.COLLEGE_NAME}, on ${CONFIG.EVENT_DATE_DISPLAY}: ${EVENTS.map((e) => e.name).join(", ")}. Full rules for every round and game.`,
  keywords: [
    ...EVENTS.map((e) => e.name),
    CONFIG.DEPARTMENT_FULL,
    CONFIG.FEST_NAME,
    "Technofest 3.0",
    "AIHT",
    CONFIG.COLLEGE_NAME,
    "debugging contest",
    "coding event",
    "CSE",
    "Chennai",
    "OMR",
  ],
  authors: [{ name: `${CONFIG.COLLEGE_NAME} — ${CONFIG.DEPARTMENT_FULL}` }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: `${CONFIG.DEPARTMENT_FULL} — ${CONFIG.FEST_NAME}`,
    description: `${EVENTS.map((e) => e.name).join(" · ")} — ${CONFIG.EVENT_DATE_DISPLAY} at ${CONFIG.COLLEGE_NAME}. Spot registration at the venue.`,
    siteName: `${CONFIG.DEPARTMENT} — ${CONFIG.FEST_NAME}`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: CONFIG.FEST_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${CONFIG.DEPARTMENT} | ${CONFIG.FEST_NAME}`,
    description: `${EVENTS.length} events — ${EVENTS.map((e) => e.name).join(", ")} — on ${CONFIG.EVENT_DATE_DISPLAY}.`,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Gate reveal-on-scroll styles on JS so content is never hidden without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preload" as="image" href="/media/posters/c01_awakening_start.webp" fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}
