import type { Metadata, Viewport } from "next";
import { Nunito, Fraunces } from "next/font/google";
import { BellyBuddyProvider } from "@/components/belly-buddy/BellyBuddyProvider";
import { BellyBuddyShell } from "@/components/belly-buddy/BellyBuddyShell";
import "./belly-buddy.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-bb-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-bb-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Belly Buddy",
  description:
    "A kind daily check-in for burping, gas, and indigestion — with a gentle 7-day plan and a doctor-ready report.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#E7F2EC",
  width: "device-width",
  initialScale: 1,
};

export default function BellyBuddyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`belly-buddy ${nunito.variable} ${fraunces.variable} min-h-screen`}
    >
      <BellyBuddyProvider>
        <BellyBuddyShell>{children}</BellyBuddyShell>
      </BellyBuddyProvider>
    </div>
  );
}
