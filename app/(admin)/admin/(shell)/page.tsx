import Link from "next/link";
import { FileText, Inbox, Tags } from "lucide-react";
import {
  adminButton,
  EmptyState,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
} from "@/components/admin/ui";
import { getOverview, listPages } from "@/lib/admin/data";
import { seedFromCode } from "../actions";

export const metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  const { seeded } = await searchParams;
  const overview = await getOverview();

  if (overview.schemaMissing) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Finish the database setup"
          description="The site is connected to Supabase, but the tables it needs do not exist yet."
        />
        <Notice tone="error">{overview.schemaError}</Notice>
        <Panel>
          <PanelTitle>One-time setup</PanelTitle>
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-[0.88rem] leading-relaxed text-ink">
            <li>Open your Supabase project and go to the SQL editor.</li>
            <li>
              Paste the whole of <code>supabase/schema.sql</code> from this
              repository and run it.
            </li>
            <li>Reload this page and import the launch content.</li>
          </ol>
          <p className="mt-4 text-[0.82rem] text-subtle">
            Until then the public site keeps serving the approved launch content
            from the code, so nothing visitors see is affected.
          </p>
        </Panel>
      </div>
    );
  }

  const pages = overview.pages > 0 ? await listPages() : [];
  const unpublished = pages.filter((p) => !p.published);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overview"
        description="Everything on the public site is edited from here."
        actions={
          <Link href="/admin/pages" className={adminButton.primary}>
            Edit pages
          </Link>
        }
      />

      {seeded ? (
        <Notice tone="success">
          Launch content imported. The public site is now reading from the
          database.
        </Notice>
      ) : null}

      {overview.pages === 0 ? (
        <Panel>
          <PanelTitle hint="This copies the approved launch content — every page, section, price, and menu item — out of the code and into the database. Run it once.">
            Import the launch content
          </PanelTitle>
          <form action={seedFromCode}>
            <button type="submit" className={adminButton.primary}>
              Import launch content
            </button>
          </form>
          <p className="mt-3 text-[0.8rem] text-subtle">
            Until this runs, the public site serves the same content straight
            from the code, so visitors see no difference either way.
          </p>
        </Panel>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          href="/admin/pages"
          icon={<FileText size={17} />}
          value={overview.pages}
          label="Pages"
          note={
            unpublished.length
              ? `${unpublished.length} not published`
              : "All published"
          }
        />
        <StatCard
          href="/admin/packages"
          icon={<Tags size={17} />}
          value={overview.packages}
          label="Packages"
          note="Prices shown across the site"
        />
        <StatCard
          href="/admin/leads"
          icon={<Inbox size={17} />}
          value={overview.leads}
          label="Enquiries"
          note={overview.newLeads ? `${overview.newLeads} new` : "None new"}
        />
      </div>

      <Panel>
        <PanelTitle hint="Click a page to edit its sections.">Pages</PanelTitle>
        {pages.length === 0 ? (
          <EmptyState title="No pages yet">
            Import the launch content above, or create a page from the Pages
            screen.
          </EmptyState>
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {pages.map((page) => (
              <li key={page.id}>
                <Link
                  href={`/admin/pages/${page.id}`}
                  className="flex items-center justify-between gap-4 py-2.5 text-[0.88rem] transition-colors hover:text-teal-ink"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-ink-strong">
                      {page.label}
                    </span>
                    <span className="block truncate text-[0.78rem] text-subtle">
                      {page.slug}
                    </span>
                  </span>
                  {!page.published ? (
                    <span className="shrink-0 text-[0.72rem] font-semibold uppercase tracking-wide text-[#7a5b00]">
                      Draft
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function StatCard({
  href,
  icon,
  value,
  label,
  note,
}: {
  href: string;
  icon: React.ReactNode;
  value: number;
  label: string;
  note: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-card border border-line bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className="inline-flex size-9 items-center justify-center rounded-[10px] bg-surface text-teal-ink transition-colors group-hover:bg-brand-black group-hover:text-white">
        {icon}
      </span>
      <p className="mt-4 font-display text-3xl font-bold leading-none text-ink-strong">
        {value}
      </p>
      <p className="mt-1 text-[0.85rem] font-medium text-ink-strong">{label}</p>
      <p className="text-[0.78rem] text-subtle">{note}</p>
    </Link>
  );
}
