import { createSupabaseServiceClient, leadServiceConfigured } from "@/lib/supabase/service";
import { notifyNewLead } from "@/lib/notify";
import type { LeadNotification } from "@/lib/notify";
import type { LeadType } from "./validation";

type StoredLead = {
  id: string;
  lead_type: LeadType;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website: string | null;
  google_business_profile_url: string | null;
  message: string | null;
  page_path: string | null;
  source_cta: string | null;
  tier: string | null;
};

function notificationFor(lead: StoredLead): LeadNotification {
  return {
    leadType: lead.lead_type,
    idempotencyKey: `jmc-lead-${lead.id}`,
    name: lead.name || undefined,
    email: lead.email,
    phone: lead.phone || undefined,
    business: lead.company || undefined,
    website: lead.website || undefined,
    googleBusinessProfileUrl:
      lead.google_business_profile_url || undefined,
    message: lead.message || undefined,
    sourcePage: lead.page_path || undefined,
    sourceCta: lead.source_cta || undefined,
    tier: lead.tier || undefined,
  };
}

/**
 * Sends or retries the notification for one safely stored lead.
 *
 * This is deliberately separate from the form mutation. The visitor should be
 * redirected as soon as storage succeeds; Resend runs after the response, and
 * any failure remains visible and retryable from the dashboard.
 */
export async function deliverLeadNotification(leadId: string) {
  if (!leadServiceConfigured()) return;

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("leads")
    .select(
      "id,lead_type,name,email,phone,company,website,google_business_profile_url,message,page_path,source_cta,tier"
    )
    .eq("id", leadId)
    .maybeSingle();

  if (error || !data) {
    console.error("[lead] could not load stored lead for notification", {
      leadId,
      message: error?.message ?? "Lead not found",
    });
    return;
  }

  const result = await notifyNewLead(notificationFor(data as StoredLead));
  const attemptedAt = new Date().toISOString();

  const patch =
    result.status === "sent"
      ? {
          notification_status: "sent",
          notification_message_id: result.messageId,
          notification_error: null,
          notification_attempted_at: attemptedAt,
        }
      : {
          notification_status: result.status,
          notification_message_id: null,
          notification_error: result.error.slice(0, 1000),
          notification_attempted_at: attemptedAt,
        };

  const { error: updateError } = await supabase
    .from("leads")
    .update(patch)
    .eq("id", leadId);

  if (updateError) {
    console.error("[lead] could not record notification status", {
      leadId,
      message: updateError.message,
    });
  }
}
