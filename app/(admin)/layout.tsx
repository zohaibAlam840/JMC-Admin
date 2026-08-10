import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · JMC Admin" },
  // Belt and braces with robots.ts. The admin must never be indexed.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-full flex-1 flex-col bg-surface">{children}</div>;
}
