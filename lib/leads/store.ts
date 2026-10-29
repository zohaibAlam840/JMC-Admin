import { createSupabaseServiceClient, leadServiceConfigured } from "@/lib/supabase/service";
import type { ValidLead } from "./validation";

export type StoreLeadResult =
  | { ok: true; leadId: string }
  | { ok: false; reason: "rate_limited" | "duplicate" | "invalid" | "unavailable" };

type RpcRow = {
  accepted: boolean;
  reason: string;
  lead_id: string | null;
};

export async function storeLead(
  lead: ValidLead,
  submissionId: string,
  rateKey: string
): Promise<StoreLeadResult> {
  if (!leadServiceConfigured()) return { ok: false, reason: "unavailable" };

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.rpc("submit_lead", {
    p_rate_key: rateKey,
    p_submission_id: submissionId,
    p_lead_type: lead.leadType,
    p_name: lead.name,
    p_email: lead.email,
    p_phone: lead.phone || null,
    p_company: lead.business,
    p_website: lead.website || null,
    p_google_business_profile_url: lead.googleBusinessProfileUrl || null,
    p_message: lead.message || null,
    p_page_path: lead.sourcePage,
    p_source_cta: lead.sourceCta,
    p_tier: lead.tier || null,
  });

  if (error) {
    console.error("[lead] secure submission failed", {
      code: error.code,
      message: error.message,
    });
    return { ok: false, reason: "unavailable" };
  }

  const row = (Array.isArray(data) ? data[0] : data) as RpcRow | null;
  if (!row?.accepted || !row.lead_id) {
    if (row?.reason === "rate_limited") {
      return { ok: false, reason: "rate_limited" };
    }
    if (row?.reason === "duplicate") {
      return { ok: false, reason: "duplicate" };
    }
    return { ok: false, reason: "invalid" };
  }

  return { ok: true, leadId: row.lead_id };
}
