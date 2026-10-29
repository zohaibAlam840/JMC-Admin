"use server";

import { after } from "next/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { deliverLeadNotification } from "@/lib/leads/delivery";
import {
  CONVERSION_COOKIE_NAME,
  createConversionToken,
  createRateKey,
  verifyFormToken,
} from "@/lib/leads/security";
import { storeLead } from "@/lib/leads/store";
import {
  hasHoneypotValue,
  validateAuditLead,
  validateContactLead,
  type LeadValues,
  type ValidLead,
} from "@/lib/leads/validation";

export type LeadState = {
  errors?: Record<string, string>;
  values?: Partial<LeadValues>;
};

function formString(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function storageError(values: LeadValues): LeadState {
  return {
    errors: {
      form:
        "That did not send. Please try again, or email wendell@jordanmarketingconsultants.com directly.",
    },
    values,
  };
}

function tokenError(reason: "unconfigured" | "invalid" | "expired", values: LeadValues): LeadState {
  const message =
    reason === "expired"
      ? "This form has been open for a while. Refresh the page and try again."
      : "The secure form check could not be completed. Refresh the page and try again.";
  return { errors: { form: message }, values };
}

async function requestIdentity(email: string): Promise<string> {
  const requestHeaders = await headers();
  const forwarded =
    requestHeaders.get("x-vercel-forwarded-for") ||
    requestHeaders.get("cf-connecting-ip") ||
    requestHeaders.get("x-real-ip") ||
    requestHeaders.get("x-forwarded-for") ||
    "";
  const ip = forwarded.split(",")[0]?.trim();
  if (ip) return `ip:${ip}`;

  // Some local/self-hosted adapters do not expose the client address. The
  // email plus user agent still gives the rate limiter a stable fallback.
  return `fallback:${email}:${requestHeaders.get("user-agent") ?? "unknown"}`;
}

async function markSuccessfulSubmission(leadId: string, lead: ValidLead) {
  const conversionToken = createConversionToken({
    leadId,
    leadType: lead.leadType,
    tier: lead.tier,
  });

  if (conversionToken) {
    (await cookies()).set(CONVERSION_COOKIE_NAME, conversionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/thank-you",
      maxAge: 10 * 60,
      priority: "high",
    });
  }

  // Resend runs after the visitor receives the redirect. Its result is written
  // back to the lead and can be retried from the dashboard.
  after(() => deliverLeadNotification(leadId));
}

async function persistValidatedLead(
  lead: ValidLead,
  submissionId: string
) {
  const rateKey = createRateKey(await requestIdentity(lead.email));
  if (!rateKey) return { ok: false as const, reason: "unavailable" as const };
  return storeLead(lead, submissionId, rateKey);
}

/** Visibility Review and Sprint Consultation form. */
export async function submitLead(
  _previous: LeadState,
  formData: FormData
): Promise<LeadState> {
  const isSprint = formString(formData, "type") === "sprint";
  const confirmation = isSprint ? "/thank-you?type=sprint" : "/thank-you";

  // Honeypot traffic receives an ordinary success-shaped response but is never
  // stored, emailed, or counted as a conversion.
  if (hasHoneypotValue(formData)) redirect(confirmation);

  const validation = validateContactLead(formData);
  if (!validation.lead) {
    return { errors: validation.errors, values: validation.values };
  }

  const token = verifyFormToken(formString(formData, "formToken"), "contact");
  if (!token.ok) {
    if (token.reason === "too_fast") redirect(confirmation);
    return tokenError(token.reason, validation.values);
  }

  const stored = await persistValidatedLead(validation.lead, token.submissionId);
  if (!stored.ok) {
    if (stored.reason === "rate_limited" || stored.reason === "duplicate") {
      redirect(confirmation);
    }
    return storageError(validation.values);
  }

  await markSuccessfulSubmission(stored.leadId, validation.lead);
  const tier = validation.lead.tier
    ? `${confirmation.includes("?") ? "&" : "?"}tier=${validation.lead.tier}`
    : "";
  redirect(`${confirmation}${tier}`);
}

/** Free Visibility Audit form on the GBP service page. */
export async function submitAudit(
  _previous: LeadState,
  formData: FormData
): Promise<LeadState> {
  const confirmation = "/thank-you?type=audit";
  if (hasHoneypotValue(formData)) redirect(confirmation);

  const validation = validateAuditLead(formData);
  if (!validation.lead) {
    return { errors: validation.errors, values: validation.values };
  }

  const token = verifyFormToken(formString(formData, "formToken"), "audit");
  if (!token.ok) {
    if (token.reason === "too_fast") redirect(confirmation);
    return tokenError(token.reason, validation.values);
  }

  const stored = await persistValidatedLead(validation.lead, token.submissionId);
  if (!stored.ok) {
    if (stored.reason === "rate_limited" || stored.reason === "duplicate") {
      redirect(confirmation);
    }
    return storageError(validation.values);
  }

  await markSuccessfulSubmission(stored.leadId, validation.lead);
  redirect(confirmation);
}
