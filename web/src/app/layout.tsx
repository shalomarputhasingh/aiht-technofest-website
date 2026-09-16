import type { Metadata, Viewport } from "next";
import { Big_Shoulders, JetBrains_Mono, Manrope } from "next/font/google";
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
  title: "Technofest 2026 | AIHT College Technical & Non-Technical Fest",
  description:
    "Technofest 2026 — Anand Institute of Higher Technology's college technical and non-technical fest featuring innovation, competitions, creativity and exciting student events on 30 September 2026.",
  keywords: [
    "Technofest 2026",
    "AIHT",
    "Anand Institute of Higher Technology",
    "college fest",
    "technical events",
    "non-technical events",
    "student competition",
    "innovation fest",
    "Chennai",
    "OMR",
  ],
  authors: [{ name: "Anand Institute of Higher Technology — Technofest 2026" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "Technofest 2026 | AIHT — Where Technology Meets Talent",
    description:
      "Technofest 2026 at Anand Institute of Higher Technology, Chennai — 30 September 2026. 20 technical & non-technical events. Register now!",
    siteName: "Technofest 2026 — AIHT",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Technofest 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technofest 2026 | Where Technology Meets Talent",
    description: "Technofest 2026 — 30 September 2026. Technical & Non-Technical college fest.",
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
