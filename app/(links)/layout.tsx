/**
 * The link hub's own shell.
 *
 * Deliberately outside the (site) group: a link-in-bio page arrives from a
 * social profile and has one job, so the marketing header, the dropdown menus,
 * and the footer would all be in the way. Fonts and tokens still come from the
 * root layout, so it is unmistakably the same brand.
 */
export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main id="main" className="flex min-h-full flex-1 flex-col bg-white">{children}</main>;
}
