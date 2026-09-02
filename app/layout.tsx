import type { Metadata } from "next";
import { Anton, Archivo, Montserrat } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

/**
 * Type stack, per Build Spec §3.
 *
 * Anton is display only — one weight, very tight — and is reserved for the hero
 * H1 and price figures. Archivo carries every other heading; the condensed look
 * comes from its width axis, which is why `axes` is declared. Without that the
 * axis is not loaded and the heading rule silently falls back to normal width.
 * "Archivo Condensed" is not a real Google Fonts family and must not be used.
 *
 * All three are self-hosted by next/font, so the site makes no external font
 * request and there is nothing render-blocking.
 */
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Houston-Area SEO Agency | Jordan Marketing Consultants",
    template: "%s | Jordan Marketing Consultants",
  },
  description:
    "Jordan Marketing Consultants helps Houston-area businesses improve search visibility through local SEO, traditional SEO, real estate SEO, content planning, and clear reporting.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Jordan Marketing Consultants",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-black focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
