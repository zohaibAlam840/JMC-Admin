import { site as fileSite } from "@/content/site";

/**
 * Lead notification email.
 *
 * Build Spec §13 routes every submission to
 * wendell@jordanmarketingconsultants.com. Sent through Resend's HTTP API with
 * plain fetch — no SDK, because one POST does not justify a dependency.
 *
 * Two rules this follows deliberately:
 *
 *  1. It never throws. The lead is already committed to the database by the
 *     time this runs, and a mail outage must not turn a captured enquiry into
 *     an error page for the person who sent it.
 *  2. It no-ops without a key, so the site runs perfectly well before the
 *     Resend account and DNS records exist.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type LeadNotification = {
  name: string;
  email: string;
  phone?: string;
  business?: string;
  website?: string;
  service?: string;
  message?: string;
  tier?: string;
  sourcePage?: string;
  sourceCta?: string;
};

/** HTML-escapes a value before it goes anywhere near the email body. */
function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value?: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 16px 6px 0;color:#6B7280;font-size:13px;white-space:nowrap;vertical-align:top">${esc(label)}</td>
    <td style="padding:6px 0;color:#2C2C2C;font-size:14px">${esc(value)}</td>
  </tr>`;
}

export async function notifyNewLead(lead: LeadNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL ?? fileSite.email;
  // Must be a domain verified in Resend. Falls back to Resend's shared sender,
  // which works for testing but will land in spam in production.
  const from = process.env.LEAD_NOTIFICATION_FROM ?? "onboarding@resend.dev";

  if (!apiKey) {
    console.info("[lead] no RESEND_API_KEY set, notification skipped", {
      wouldHaveEmailed: to,
    });
    return;
  }

  const subject = `New Visibility Review request${lead.business ? ` — ${lead.business}` : ""}`;

  const html = `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px">
    <p style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#207D84;margin:0 0 4px">
      Jordan Marketing Consultants
    </p>
    <h1 style="font-size:20px;color:#2C2C2C;margin:0 0 20px">${esc(subject)}</h1>
    <table style="border-collapse:collapse;width:100%">
      ${row("Name", lead.name)}
      ${row("Email", lead.email)}
      ${row("Phone", lead.phone)}
      ${row("Business", lead.business)}
      ${row("Website", lead.website)}
      ${row("Interested in", lead.service)}
      ${row("Package tier", lead.tier)}
      ${row("Came from", lead.sourcePage)}
      ${row("Button", lead.sourceCta)}
    </table>
    ${
      lead.message
        ? `<div style="margin-top:20px;padding:14px 16px;background:#FAFBFC;border:1px solid #E5E7EB;border-radius:8px">
             <p style="margin:0 0 6px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#6B7280">What they want to improve</p>
             <p style="margin:0;font-size:14px;line-height:1.6;color:#2C2C2C;white-space:pre-wrap">${esc(lead.message)}</p>
           </div>`
        : ""
    }
    <p style="margin-top:24px;font-size:12px;color:#6B7280">
      Also saved in the admin under Enquiries.
    </p>
  </div>`;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        // So hitting reply in the inbox writes back to the person who enquired.
        reply_to: lead.email || undefined,
        subject,
        html,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[lead] notification rejected", res.status, await res.text());
    }
  } catch (error) {
    console.error(
      "[lead] notification failed",
      error instanceof Error ? error.message : error
    );
  }
}
