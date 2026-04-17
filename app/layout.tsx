import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import AgeGate from "@/components/AgeGate";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Tomoverde — Where connection grows.",
  description:
    "Tomo means friendship. Verde means green. We're building a cannabis community that feels like coming home, not a transaction.",
  openGraph: {
    title: "Tomoverde",
    description: "Tell us what you actually want.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tomoverde",
    description: "Tell us what you actually want.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-forest-deep text-cream antialiased">
        {children}
        <AgeGate />
        <Analytics />
      </body>
    </html>
  );
}
