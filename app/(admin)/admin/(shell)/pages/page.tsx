import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  adminButton,
  Checkbox,
  EmptyState,
  Field,
  Input,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
} from "@/components/admin/ui";
import { listPages } from "@/lib/admin/data";
import { createPage } from "../../actions";

export const metadata = { title: "Pages" };
export const dynamic = "force-dynamic";

export default async function PagesScreen({
  searchParams,
}: PageProps<"/admin/pages">) {
  const { error } = await searchParams;
  const pages = await listPages();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pages"
        description="Each page is a stack of sections. Open one to edit, reorder, hide, or add to it."
      />

      {error ? <Notice tone="error">{String(error)}</Notice> : null}

      {pages.length === 0 ? (
        <EmptyState title="No pages in the database yet">
          Import the launch content from the Overview screen, and the eight
          approved pages appear here ready to edit.
        </EmptyState>
      ) : (
        <Panel className="p-0">
          <ul className="divide-y divide-line">
            {pages.map((page) => (
              <li
                key={page.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4"
              >
                <Link
                  href={`/admin/pages/${page.id}`}
                  className="min-w-0 flex-1 group"
                >
                  <span className="flex items-center gap-2">
                    <span className="truncate font-display text-[1.05rem] uppercase leading-none text-ink-strong transition-colors group-hover:text-teal-ink">
                      {page.label}
                    </span>
                    {page.published ? (
                      <Pill tone="live">Live</Pill>
                    ) : (
                      <Pill tone="draft">Draft</Pill>
                    )}
                    {page.system ? <Pill>Fixed route</Pill> : null}
                  </span>
                  <span className="mt-1 block truncate text-[0.8rem] text-subtle">
                    {page.slug}
                  </span>
                </Link>

                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={page.slug}
                    target="_blank"
                    rel="noreferrer"
                    className={adminButton.ghost}
                  >
                    View <ArrowUpRight size={13} />
                  </a>
                  <Link href={`/admin/pages/${page.id}`} className={adminButton.secondary}>
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel>
        <PanelTitle hint="New pages start unpublished with a hero and a closing CTA, so you can build them out before anyone sees them.">
          Add a page
        </PanelTitle>

        <form action={createPage} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Page name" hint="Shown in this admin and in structured data.">
              <Input name="label" required placeholder="Commercial Construction SEO" />
            </Field>
            <Field label="Address" hint="Leave blank to build one from the name.">
              <Input name="slug" placeholder="/commercial-construction-seo" />
            </Field>
          </div>

          <Field label="Search engine title" hint="Roughly 60 characters. Appears as the headline in Google.">
            <Input name="seo_title" placeholder="Commercial Construction SEO | Houston" />
          </Field>

          <Field label="Search engine description" hint="Roughly 155 characters.">
            <Input name="meta_description" />
          </Field>

          <Checkbox
            name="is_service"
            label="This page describes a service"
            hint="Adds Service structured data, which helps search engines understand what is being offered."
          />

          <button type="submit" className={adminButton.primary + " self-start"}>
            Create page
          </button>
        </form>
      </Panel>
    </div>
  );
}
