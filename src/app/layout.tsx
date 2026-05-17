import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navigation } from "@/components/Navigation";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://christoth.com"),
  title: {
    default: "Chris Toth — AI Adoption & Workforce Transformation",
    template: "%s · Chris Toth",
  },
  description:
    "Building the adoption layer for enterprise AI. 14 years bridging market research, consumer insights, and marketing into workforce transformation. Currently focused on AI adoption at AT&T.",
  keywords: [
    "AI adoption",
    "Chris Toth",
    "workforce transformation",
    "knowledge management",
    "consumer insights",
    "market research",
    "enterprise AI",
    "AT&T",
    "MBA",
    "disruptive technologies",
  ],
  openGraph: {
    type: "website",
    title: "Chris Toth — AI Adoption & Workforce Transformation",
    description:
      "AI adoption is a behavior-change problem. Bridging 14 years of research and insights into enterprise AI rollouts that stick.",
    siteName: "Chris Toth",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chris Toth — AI Adoption & Workforce Transformation",
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body className="noise relative min-h-screen overflow-x-hidden bg-ink-950 antialiased">
        <SmoothScroll />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Navigation />
        <main id="main" className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
