import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/blocks/legal-page";
import { getPolicy } from "@/lib/legal";

/**
 * /cookie-policy — Page Spec 15, part 1. A shell around a Termageddon embed.
 *
 * Returns a 404 until the embed key is configured. See lib/legal.ts for why
 * shipping the shell empty is the worse option.
 */
const policy = getPolicy("/cookie-policy")!;

export const metadata: Metadata = {
  title: policy.seoTitle,
  description: policy.metaDescription,
  alternates: { canonical: policy.slug },
};

export default function Page() {
  if (!policy.embedKey) notFound();
  return <LegalPage policy={policy} />;
}
