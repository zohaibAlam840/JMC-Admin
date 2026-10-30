import type { Metadata } from "next";

/*
 * Valid catch-all pages provide their own metadata from page.tsx. When the
 * page calls notFound(), this segment-level fallback gives the 404 document a
 * useful title instead of inheriting the homepage title.
 */
export const metadata: Metadata = {
  title: "Page Not Found | Jordan Marketing Consultants",
  description: "The requested page could not be found.",
  robots: { index: false, follow: false },
};

export default function CatchAllLayout({ children }: LayoutProps<"/[...slug]">) {
  return children;
}
