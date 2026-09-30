import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrushCursor } from "@/components/ui/BrushCursor";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { AmbientTexture } from "@/components/webgl/AmbientTexture";
import { LiquidLens } from "@/components/ui/LiquidLens";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { siteConfig, artist } from "@/data/artist";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s — Fabiha Shaheen",
  },
  description: siteConfig.description,
  keywords: [
    "Fabiha Shaheen",
    "visual artist",
    "Pakistani artist",
    "oil painting",
    "contemporary art",
    "art commissions",
  ],
  authors: [{ name: artist.name }],
  openGraph: {
    type: "website",
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: artist.name,
    images: [
      {
        url: "/images/artworks/unfulfillment.jpg",
        width: 1518,
        height: 2000,
        alt: "Unfulfillment — Fabiha Shaheen",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/images/artworks/unfulfillment.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-charcoal focus:px-4 focus:py-2 focus:text-warmwhite focus:text-sm"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <GrainOverlay />
        <AmbientTexture />
        <LiquidLens />
        <BrushCursor />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
