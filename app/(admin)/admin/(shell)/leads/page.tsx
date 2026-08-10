import {
  adminButton,
  EmptyState,
  PageHeader,
  Panel,
  Pill,
  Select,
} from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { listLeads, type AdminLead } from "@/lib/admin/data";
import { deleteLead, setLeadStatus } from "../../actions";

export const metadata = { title: "Enquiries" };
export const dynamic = "force-dynamic";

const STATUSES: AdminLead["status"][] = [
  "new",
  "contacted",
  "qualified",
  "archived",
];

export default async function LeadsScreen() {
  const leads = await listLeads();
  const active = leads.filter((l) => l.status !== "archived");
  const archived = leads.filter((l) => l.status === "archived");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Enquiries"
        description="Every Visibility Review request submitted through the site."
      />

      {leads.length === 0 ? (
        <EmptyState title="No enquiries yet">
          Requests submitted through the contact form land here the moment they
          are sent.
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
              {lead.name || "No name given"}
            </span>
            <Pill tone={lead.status === "new" ? "live" : "neutral"}>
              {lead.status}
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
              message="Delete this enquiry permanently?"
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
        <Detail label="Interested in">{lead.service}</Detail>
        <Detail label="Came from">{lead.page_path}</Detail>
      </dl>

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
