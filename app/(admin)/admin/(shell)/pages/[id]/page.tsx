import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
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
  Select,
  Textarea,
} from "@/components/admin/ui";
import { SectionEditor } from "@/components/admin/section-editor";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { getPageWithSections, listPackages } from "@/lib/admin/data";
import { SECTION_SCHEMAS } from "@/lib/section-schema";
import {
  addSection,
  deletePage,
  deleteSection,
  moveSection,
  saveSection,
  setSectionVisible,
  updatePage,
} from "../../../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/admin/pages/[id]">) {
  const { id } = await params;
  const { page } = await getPageWithSections(id);
  return { title: page?.label ?? "Page" };
}

export default async function PageEditor({
  params,
  searchParams,
}: PageProps<"/admin/pages/[id]">) {
  const { id } = await params;
  const { saved, error } = await searchParams;

  const [{ page, sections }, packages] = await Promise.all([
    getPageWithSections(id),
    listPackages(),
  ]);

  if (!page) notFound();

  const packageOptions = packages.map((p) => ({
    id: p.id,
    name: p.name,
    visible: p.visible,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-subtle transition-colors hover:text-ink-strong"
        >
          <ArrowLeft size={14} /> All pages
        </Link>
      </div>

      <PageHeader
        title={page.label}
        description={page.slug}
        actions={
          <a
            href={page.slug}
            target="_blank"
            rel="noreferrer"
            className={adminButton.secondary}
          >
            View page <ArrowUpRight size={13} />
          </a>
        }
      />

      {saved ? <Notice tone="success">Page details saved.</Notice> : null}
      {error ? <Notice tone="error">{String(error)}</Notice> : null}

      {/* ------------------------------------------------------- sections -- */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-[1.05rem] uppercase leading-none text-ink-strong">
            Sections
          </h2>
          <span className="text-[0.78rem] text-subtle">
            {sections.length} on this page
          </span>
        </div>

        {sections.length === 0 ? (
          <EmptyState title="This page has no sections">
            Add one below. A page with no sections renders as a blank screen.
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-3">
            {sections.map((section, i) => (
              <SectionEditor
                key={section.id}
                section={section}
                pageId={page.id}
                pageSlug={page.slug}
                packages={packageOptions}
                isFirst={i === 0}
                isLast={i === sections.length - 1}
                save={saveSection}
                move={moveSection}
                setVisible={setSectionVisible}
                remove={deleteSection}
              />
            ))}
          </ul>
        )}
      </div>

      {/* ---------------------------------------------------- add section -- */}
      <Panel>
        <PanelTitle hint="New sections are added to the bottom of the page. Move them into place with the arrows.">
          Add a section
        </PanelTitle>

        <form action={addSection} className="flex flex-col gap-3">
          <input type="hidden" name="page_id" value={page.id} />
          <input type="hidden" name="slug" value={page.slug} />

          <Field label="Section type">
            <Select name="type" defaultValue="cardGrid">
              {SECTION_SCHEMAS.map((schema) => (
                <option key={schema.type} value={schema.type}>
                  {schema.label} — {schema.description}
                </option>
              ))}
            </Select>
          </Field>

          <button type="submit" className={adminButton.primary + " self-start"}>
            Add section
          </button>
        </form>
      </Panel>

      {/* ---------------------------------------------------- page details -- */}
      <Panel>
        <PanelTitle hint="How this page appears in search results, and whether it is visible at all. This form does not save the sections above — each section has its own Save button.">
          Page details
        </PanelTitle>

        <form action={updatePage} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={page.id} />
          <input type="hidden" name="previous_slug" value={page.slug} />
          <input type="hidden" name="system" value={String(page.system)} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Page name">
              <Input name="label" defaultValue={page.label} required />
            </Field>

            <Field
              label="Address"
              hint={
                page.system
                  ? "This page has a fixed route in the code and its address cannot be changed here."
                  : "Changing this changes the page's URL. Add a redirect from the old one."
              }
            >
              <Input
                name="slug"
                defaultValue={page.slug}
                disabled={page.system}
                readOnly={page.system}
              />
            </Field>
          </div>

          <Field label="Search engine title" hint="Roughly 60 characters.">
            <Input name="seo_title" defaultValue={page.seo_title} />
          </Field>

          <Field label="Search engine description" hint="Roughly 155 characters.">
            <Textarea name="meta_description" defaultValue={page.meta_description} />
          </Field>

          <div className="flex flex-col gap-3">
            <Checkbox
              name="published"
              label="Published"
              hint="Unpublished pages are invisible to visitors and to search engines."
              defaultChecked={page.published}
            />
            <Checkbox
              name="is_service"
              label="This page describes a service"
              hint="Adds Service structured data."
              defaultChecked={page.is_service}
            />
          </div>

          <button type="submit" className={adminButton.primary + " self-start"}>
            Save page details
          </button>
        </form>
      </Panel>

      {/* --------------------------------------------------------- danger -- */}
      {page.system ? (
        <p className="text-[0.8rem] text-subtle">
          <Pill>Fixed route</Pill>{" "}
          This page is wired into the code and cannot be deleted. Its content is
          still fully editable above.
        </p>
      ) : (
        <Panel className="border-destructive/25">
          <PanelTitle hint="The page and all of its sections are removed. Search engines will start returning 404 for its address unless you add a redirect.">
            Delete this page
          </PanelTitle>
          <form action={deletePage}>
            <input type="hidden" name="id" value={page.id} />
            <input type="hidden" name="slug" value={page.slug} />
            <ConfirmButton
              className={adminButton.danger}
              message={`Delete "${page.label}" and all of its sections? This cannot be undone.`}
            >
              Delete {page.label}
            </ConfirmButton>
          </form>
        </Panel>
      )}
    </div>
  );
}
