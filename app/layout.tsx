import type { Metadata } from "next";
import { Barlow_Condensed, Montserrat } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

/**
 * Barlow Condensed stands in for the logo face (Square 721 Cn BT), per the
 * implementation brief. Montserrat carries body copy. Both are self-hosted by
 * next/font — the site makes no external font requests.
 *
 * This layout deliberately holds nothing but the document, the fonts, and the
 * default metadata. The marketing header and footer live in the (site) group so
 * that /admin can share the type and tokens without inheriting the chrome.
 */
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
      className={`${barlowCondensed.variable} ${montserrat.variable} h-full antialiased`}
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
