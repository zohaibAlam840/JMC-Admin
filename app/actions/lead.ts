"use server";

import { redirect } from "next/navigation";
import { SERVICE_OPTIONS } from "@/lib/lead-options";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { notifyNewLead } from "@/lib/notify";

export type LeadState = {
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

function str(data: FormData, key: string): string {
  const v = data.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Visibility Review request.
 *
 * Validates, stores the enquiry, emails Wendell, and hands off to the
 * thank-you page where conversion tracking fires.
 *
 * Order matters: the database write comes first and is the only step allowed
 * to fail the submission. Everything after it is best-effort, because a lead
 * that is safely stored must never be lost to a mail outage.
 */
export async function submitLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  /*
   * Spam checks, Build Spec §13: a honeypot plus a timing check, and no
   * CAPTCHA. Both fail silently to the thank-you page rather than explaining
   * themselves, so a bot learns nothing from the response.
   */

  // Bots fill hidden fields; humans never see this one.
  if (str(formData, "company_website")) {
    redirect("/thank-you");
  }

  // Nobody reads six fields and writes a paragraph in under three seconds.
  const renderedAt = Number(str(formData, "renderedAt"));
  if (Number.isFinite(renderedAt) && Date.now() - renderedAt < 3000) {
    redirect("/thank-you");
  }

  const values = {
    name: str(formData, "name"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    business: str(formData, "business"),
    website: str(formData, "website"),
    service: str(formData, "service"),
    message: str(formData, "message"),
    sourceCta: str(formData, "sourceCta"),
    sourcePage: str(formData, "sourcePage"),
    // Arrives as ?tier=neighborhood from a pricing card CTA.
    tier: str(formData, "tier"),
  };

  const errors: Record<string, string> = {};

  if (!values.name) {
    errors.name = "Enter your name so we know who we're talking to.";
  }
  if (!values.email) {
    errors.email = "We need an email address to send your review.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
    errors.email = "That email address doesn't look right.";
  }
  if (
    values.service &&
    !(SERVICE_OPTIONS as readonly string[]).includes(values.service)
  ) {
    errors.service = "Choose one of the listed options.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  if (supabaseConfigured) {
    // Anonymous insert, allowed by the leads_public_insert policy. There is
    // deliberately no matching select policy, so a submitted lead cannot be
    // read back with the publishable key — only from /admin.
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("leads").insert({
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      company: values.business || null,
      website: values.website || null,
      service: values.service || null,
      message: values.message || null,
      page_path: values.sourcePage || null,
      source_cta: values.sourceCta || null,
      tier: values.tier || null,
    });

    if (error) {
      // Losing an enquiry is worse than showing the form again. Log it and put
      // the visitor's answers back rather than sending them to the thank-you
      // page for a request that was never stored.
      console.error("[lead] could not save request", error.message);
      return {
        errors: {
          form: "Something went wrong sending that. Please try again, or email us directly.",
        },
        values,
      };
    }
  } else {
    console.info("[lead] visibility review request (no database configured)", {
      ...values,
      receivedAt: new Date().toISOString(),
    });
  }

  /*
   * Awaited rather than fired and forgotten: a Server Action's runtime can be
   * torn down the moment it returns, so an un-awaited send would be cancelled
   * about half the time. notifyNewLead never throws and no-ops without a key,
   * so this cannot fail the submission.
   */
  await notifyNewLead(values);

  // TODO: post to Bigin once the API credentials and target pipeline arrive.
  redirect("/thank-you");
}


