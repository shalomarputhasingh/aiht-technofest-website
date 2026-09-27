import type { Metadata, Viewport } from "next";
import { Big_Shoulders, JetBrains_Mono, Manrope } from "next/font/google";
import { CONFIG, LEVELS } from "@/content/site";
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

// Copy mirrors the <head> of Source_Content/index.html.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${CONFIG.EVENT_NAME} | ${CONFIG.FEST_NAME} — ${CONFIG.COLLEGE_SHORT}`,
  description: `${CONFIG.EVENT_NAME} is the ${CONFIG.DEPARTMENT} technical event at ${CONFIG.FEST_NAME}, ${CONFIG.COLLEGE_NAME}, on ${CONFIG.EVENT_DATE_DISPLAY}. Three levels — ${LEVELS.map((l) => l.name).join(", ")} — for teams of ${CONFIG.TEAM_SIZE}.`,
  keywords: [
    CONFIG.EVENT_NAME,
    CONFIG.EVENT_DISPLAY_TITLE,
    ...LEVELS.map((l) => l.name),
    CONFIG.FEST_NAME,
    "AIHT",
    CONFIG.COLLEGE_NAME,
    "debugging contest",
    "coding event",
    "CSE",
    "Chennai",
    "OMR",
  ],
  authors: [{ name: "Anand Institute of Higher Technology — Technofest 2026" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: `${CONFIG.EVENT_NAME} — ${CONFIG.EVENT_TAGLINE}`,
    description: `Three levels at ${CONFIG.FEST_NAME}: Bug Bounty, Sight Unseen and Buzz or Bust. Teams of ${CONFIG.TEAM_SIZE}, ${CONFIG.EVENT_DATE_DISPLAY}. ${CONFIG.PRIZE_POOL}.`,
    siteName: `${CONFIG.EVENT_NAME} — ${CONFIG.FEST_NAME}`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: CONFIG.EVENT_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${CONFIG.EVENT_NAME} | ${CONFIG.EVENT_TAGLINE}`,
    description: `${CONFIG.DEPARTMENT} technical event at ${CONFIG.FEST_NAME} — ${CONFIG.EVENT_DATE_DISPLAY}.`,
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
