"use server";

import { redirect } from "next/navigation";
import { SERVICE_OPTIONS } from "@/lib/lead-options";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";

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
 * Phase 4 writes this to the `leads` table and sends the notification email.
 * Until then it validates, captures which CTA and page produced the request,
 * and hands off to the thank-you page where conversion tracking fires.
 */
export async function submitLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  // Honeypot. Bots fill hidden fields; humans never see this one.
  if (str(formData, "company_website")) {
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

  // TODO(phase 4): notify wendell@ via Resend.
  redirect("/thank-you");
}


