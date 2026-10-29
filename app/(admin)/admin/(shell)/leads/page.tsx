import {
  adminButton,
  EmptyState,
  Notice,
  PageHeader,
  Panel,
  Pill,
  Select,
} from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { listLeads, type AdminLead } from "@/lib/admin/data";
import {
  deleteLead,
  retryLeadNotification,
  setLeadStatus,
} from "../../actions";
import { notificationConfigured } from "@/lib/notify";
import { leadSecurityConfigured } from "@/lib/leads/security";
import { leadServiceConfigured } from "@/lib/supabase/service";

export const metadata = { title: "Inquiries" };
export const dynamic = "force-dynamic";

const STATUSES: AdminLead["status"][] = [
  "new",
  "contacted",
  "qualified",
  "archived",
];

export default async function LeadsScreen({
  searchParams,
}: PageProps<"/admin/leads">) {
  const { delivery } = await searchParams;
  const leads = await listLeads();
  const active = leads.filter((l) => l.status !== "archived");
  const archived = leads.filter((l) => l.status === "archived");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inquiries"
        description="Visibility Reviews, Sprint Consultations, and Free Visibility Audits submitted through the site."
      />

      {delivery ? (
        <Notice tone="success">
          Notification delivery was attempted. Its current result appears on
          the inquiry below.
        </Notice>
      ) : null}

      {!leadServiceConfigured() || !leadSecurityConfigured() ? (
        <Notice tone="error">
          Public form storage is not ready. Add the server-only Supabase service
          key and lead security secret before launch.
        </Notice>
      ) : null}

      {!notificationConfigured() ? (
        <Notice tone="warning">
          Email notification is not configured. New inquiries can still be
          stored once form storage is ready, but they will only appear here
          until the Resend variables are added.
        </Notice>
      ) : null}

      {leads.length === 0 ? (
        <EmptyState title="No inquiries yet">
          Requests from both public forms land here the moment they are sent.
        </EmptyState>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {active.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>

          {archived.length > 0 ? (
            <details>
              <summary className="cursor-pointer text-[0.85rem] font-semibold text-subtle hover:text-ink-strong">
                Archived ({archived.length})
              </summary>
              <div className="flex flex-col gap-3 pt-3">
                {archived.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            </details>
          ) : null}
        </>
      )}
    </div>
  );
}

function LeadCard({ lead }: { lead: AdminLead }) {
  const received = new Date(lead.created_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[1.05rem] uppercase leading-none text-ink-strong">
              {lead.name || lead.company || "Unnamed inquiry"}
            </span>
            <Pill tone={lead.status === "new" ? "live" : "neutral"}>
              {lead.status}
            </Pill>
            <Pill tone="neutral">{leadTypeLabel(lead.lead_type)}</Pill>
            <Pill tone={notificationTone(lead.notification_status)}>
              email {lead.notification_status.replace("_", " ")}
            </Pill>
          </p>
          <p className="mt-1 text-[0.8rem] text-subtle">{received}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form action={setLeadStatus} className="flex items-center gap-2">
            <input type="hidden" name="id" value={lead.id} />
            <Select name="status" defaultValue={lead.status} className="py-1.5">
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <button type="submit" className={adminButton.secondary}>
              Update
            </button>
          </form>

          <form action={deleteLead}>
            <input type="hidden" name="id" value={lead.id} />
            <ConfirmButton
              className={adminButton.tiny + " h-[38px] px-3"}
              message="Delete this inquiry permanently?"
            >
              Delete
            </ConfirmButton>
          </form>
        </div>
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-3 border-t border-line pt-4 text-[0.85rem] sm:grid-cols-2">
        <Detail label="Email">
          {lead.email ? (
            <a href={`mailto:${lead.email}`} className="text-teal-ink hover:underline">
              {lead.email}
            </a>
          ) : null}
        </Detail>
        <Detail label="Phone">
          {lead.phone ? (
            <a href={`tel:${lead.phone}`} className="text-teal-ink hover:underline">
              {lead.phone}
            </a>
          ) : null}
        </Detail>
        <Detail label="Business">{lead.company}</Detail>
        <Detail label="Website">
          {lead.website ? (
            <a
              href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
              target="_blank"
              rel="noreferrer"
              className="break-all text-teal-ink hover:underline"
            >
              {lead.website}
            </a>
          ) : null}
        </Detail>
        <Detail label="Google Business Profile">
          {lead.google_business_profile_url ? (
            <a
              href={lead.google_business_profile_url}
              target="_blank"
              rel="noreferrer"
              className="break-all text-teal-ink hover:underline"
            >
              {lead.google_business_profile_url}
            </a>
          ) : null}
        </Detail>
        <Detail label="Interested in">{lead.service}</Detail>
        <Detail label="Came from">{lead.page_path}</Detail>
        <Detail label="Source button">{lead.source_cta}</Detail>
        <Detail label="Package tier">{lead.tier}</Detail>
      </dl>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3 rounded-[10px] border border-line bg-surface-2 p-3">
        <div className="min-w-0">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-subtle">
            Email delivery
          </p>
          <p className="mt-1 text-[0.83rem] text-ink-strong">
            {lead.notification_status === "sent"
              ? "Sent to the configured recipient."
              : lead.notification_status === "pending"
                ? "Queued for delivery."
                : lead.notification_status === "not_configured"
                  ? "Resend is not configured."
                  : "The last delivery attempt failed."}
          </p>
          {lead.notification_error ? (
            <p className="mt-1 max-w-2xl break-words text-[0.76rem] text-destructive">
              {lead.notification_error}
            </p>
          ) : null}
        </div>
        {lead.notification_status !== "sent" ? (
          <form action={retryLeadNotification}>
            <input type="hidden" name="id" value={lead.id} />
            <button type="submit" className={adminButton.secondary}>
              Retry email
            </button>
          </form>
        ) : null}
      </div>

      {lead.message ? (
        <div className="mt-4 rounded-[10px] border border-line bg-surface-2 p-3">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-subtle">
            Message
          </p>
          <p className="mt-1.5 whitespace-pre-wrap text-[0.88rem] leading-relaxed text-ink">
            {lead.message}
          </p>
        </div>
      ) : null}
    </Panel>
  );
}

function leadTypeLabel(type: AdminLead["lead_type"]) {
  if (type === "sprint_consultation") return "Sprint";
  if (type === "gbp_audit") return "Free audit";
  return "Visibility review";
}

function notificationTone(
  status: AdminLead["notification_status"]
): "neutral" | "live" | "draft" {
  if (status === "sent") return "live";
  if (status === "failed" || status === "not_configured") return "draft";
  return "neutral";
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-subtle">
        {label}
      </dt>
      <dd className="mt-0.5 text-ink-strong">{children || <span className="text-subtle">—</span>}</dd>
    </div>
  );
}
