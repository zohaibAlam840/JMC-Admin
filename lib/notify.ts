import { site as fileSite } from "@/content/site";
import type { LeadType } from "@/lib/leads/validation";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DELIVERY_TIMEOUT_MS = 8000;

export type LeadNotification = {
  leadType: LeadType;
  /** Stable per stored lead, used to prevent duplicate provider sends. */
  idempotencyKey?: string;
  name?: string;
  email: string;
  phone?: string;
  business?: string;
  website?: string;
  googleBusinessProfileUrl?: string;
  message?: string;
  tier?: string;
  sourcePage?: string;
  sourceCta?: string;
};

export type NotificationResult =
  | { status: "sent"; messageId: string | null }
  | { status: "not_configured"; error: string }
  | { status: "failed"; error: string };

function configuredValue(...values: Array<string | undefined>): string {
  return values.map((value) => value?.trim() ?? "").find(Boolean) ?? "";
}

function recipients(): string[] {
  const configured = configuredValue(
    process.env.LEAD_NOTIFICATION_EMAIL,
    process.env.MAIL_TO,
    fileSite.email
  );
  return configured
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

export function notificationConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      configuredValue(
        process.env.LEAD_NOTIFICATION_FROM,
        process.env.MAIL_FROM
      ) &&
      recipients().length
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value?: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 16px 6px 0;color:#6B7280;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:#2C2C2C;font-size:14px"><strong>${escapeHtml(value)}</strong></td>
  </tr>`;
}

const TYPE_COPY: Record<LeadType, { label: string; subject: string }> = {
  visibility_review: {
    label: "Visibility Review",
    subject: "Visibility Review Request",
  },
  sprint_consultation: {
    label: "Sprint Consultation",
    subject: "Sprint Consultation Request",
  },
  gbp_audit: {
    label: "Free Visibility Audit",
    subject: "Free Visibility Audit Request",
  },
};

function fields(lead: LeadNotification): Array<[string, string | undefined]> {
  return [
    ["Request type", TYPE_COPY[lead.leadType].label],
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Business", lead.business],
    ["Website", lead.website],
    ["Google Business Profile", lead.googleBusinessProfileUrl],
    ["Package tier", lead.tier],
    ["Came from", lead.sourcePage],
    ["Button", lead.sourceCta],
  ];
}

export async function notifyNewLead(
  lead: LeadNotification
): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const to = recipients();
  const from = configuredValue(
    process.env.LEAD_NOTIFICATION_FROM,
    process.env.MAIL_FROM
  );

  if (!apiKey || !from || to.length === 0) {
    return {
      status: "not_configured",
      error:
        "Resend needs RESEND_API_KEY, a verified sender, and at least one recipient.",
    };
  }

  const typeCopy = TYPE_COPY[lead.leadType];
  const subject = `${typeCopy.subject}: ${lead.business || lead.name || lead.email}`;
  const leadFields = fields(lead);
  const rows = leadFields.map(([label, value]) => row(label, value)).join("");
  const text = [
    ...leadFields
      .filter(([, value]) => Boolean(value))
      .map(([label, value]) => `${label}: ${value}`),
    ...(lead.message ? ["", "What they want to improve:", lead.message] : []),
  ].join("\n");

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:620px;font-size:15px">
    <p style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#207D84;margin:0 0 4px">Jordan Marketing Consultants</p>
    <h1 style="font-size:20px;color:#2C2C2C;margin:0 0 20px">${escapeHtml(typeCopy.subject)}</h1>
    <table style="border-collapse:collapse;width:100%">${rows}</table>
    ${
      lead.message
        ? `<div style="margin-top:20px;padding:14px 16px;background:#FAFBFC;border:1px solid #E5E7EB;border-radius:8px">
             <p style="margin:0 0 6px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#6B7280">What they want to improve</p>
             <p style="margin:0;font-size:14px;line-height:1.6;color:#2C2C2C;white-space:pre-wrap">${escapeHtml(lead.message)}</p>
           </div>`
        : ""
    }
    <p style="margin-top:24px;font-size:12px;color:#6B7280">Also saved in the dashboard under Inquiries.</p>
  </div>`;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(lead.idempotencyKey
          ? { "Idempotency-Key": lead.idempotencyKey }
          : {}),
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: lead.email,
        subject,
        text,
        html,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
    });

    const responseText = await response.text();
    if (!response.ok) {
      const error = `Resend rejected the message (${response.status}): ${responseText.slice(0, 500)}`;
      console.error("[lead] notification rejected", error);
      return { status: "failed", error };
    }

    let messageId: string | null = null;
    try {
      const body = JSON.parse(responseText) as { id?: unknown };
      messageId = typeof body.id === "string" ? body.id : null;
    } catch {
      // A successful provider response without JSON is still a successful send.
    }

    return { status: "sent", messageId };
  } catch (error) {
    const detail =
      error instanceof Error ? error.message.slice(0, 500) : "Unknown mail error";
    console.error("[lead] notification failed", detail);
    return { status: "failed", error: detail };
  }
}
