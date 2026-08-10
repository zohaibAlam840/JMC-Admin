"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { adminButton, Field, Input, Notice, Select } from "@/components/admin/ui";
import { FieldInput, type PackageOption } from "@/components/admin/field-inputs";
import { getSectionSchema } from "@/lib/section-schema";
import type { AdminSection } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

type SaveResult = { ok: boolean; message?: string };

/**
 * One block on the page.
 *
 * The form is generated from the section's schema, so this component knows
 * nothing about heroes or pricing tables — adding a section type to
 * lib/section-schema.ts gives it an editor here for free.
 *
 * Reordering, hiding, and deleting post to Server Actions and reload the page,
 * because they change the list this card lives in. Editing keeps its state
 * locally and saves on demand, so a long section is not re-rendered on every
 * keystroke.
 */
export function SectionEditor({
  section,
  pageId,
  pageSlug,
  packages,
  isFirst,
  isLast,
  save,
  move,
  setVisible,
  remove,
}: {
  section: AdminSection;
  pageId: string;
  pageSlug: string;
  packages: PackageOption[];
  isFirst: boolean;
  isLast: boolean;
  save: (payload: {
    id: string;
    pageSlug: string;
    key: string;
    tone: "white" | "surface" | null;
    data: Record<string, unknown>;
  }) => Promise<SaveResult>;
  move: (form: FormData) => Promise<void>;
  setVisible: (form: FormData) => Promise<void>;
  remove: (form: FormData) => Promise<void>;
}) {
  const schema = getSectionSchema(section.type);
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<Record<string, unknown>>(section.data ?? {});
  const [key, setKey] = React.useState(section.key);
  const [tone, setTone] = React.useState<"white" | "surface" | null>(section.tone);
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  /*
   * Each section saves itself, separately from the page details form further
   * down the screen. That is easy to get wrong — edit a heading, scroll past
   * it, press "Save page details", and the page reports success while the
   * heading is still only in this component's state. The browser warning is
   * the backstop; the Save button in the toolbar below is the real fix.
   */
  React.useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!schema) {
    return (
      <li className="rounded-card border border-destructive/30 bg-white p-4">
        <Notice tone="error">
          This section has the type <code>{section.type}</code>, which the site
          has no renderer for. It will not appear on the page.
        </Notice>
      </li>
    );
  }

  const heading =
    typeof data.heading === "string" && data.heading.trim()
      ? (data.heading as string)
      : schema.label;

  const set = (name: string, value: unknown) => {
    setData((prev) => {
      const next = { ...prev };
      if (value === undefined) delete next[name];
      else next[name] = value;
      return next;
    });
    setDirty(true);
    setMessage(null);
  };

  async function onSave() {
    setSaving(true);
    setError(null);

    // Blank trailing lines are convenient while typing a list and meaningless
    // on the page, so they are dropped here rather than being stored.
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      cleaned[k] = Array.isArray(v)
        ? v.filter((item) => (typeof item === "string" ? item.trim() !== "" : true))
        : v;
    }

    const result = await save({
      id: section.id,
      pageSlug,
      key,
      tone: schema?.supportsTone ? (tone ?? "white") : null,
      data: cleaned,
    });

    setSaving(false);
    if (result.ok) {
      setData(cleaned);
      setDirty(false);
      setMessage("Saved. The live page is updated.");
      // Pulls the row back from the database so the section header, the page
      // list, and anything else reading this section reflect what was actually
      // stored rather than what we hoped was stored.
      router.refresh();
    } else {
      setError(result.message ?? "Could not save this section.");
    }
  }

  return (
    <li
      className={cn(
        "rounded-card border bg-white shadow-soft",
        section.visible ? "border-line" : "border-dashed border-line-strong opacity-75"
      )}
    >
      {/* ------------------------------------------------------- toolbar -- */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="shrink-0 rounded-pill border border-line bg-surface px-2 py-0.5 text-[0.66rem] font-semibold uppercase tracking-[0.08em] text-subtle">
            {schema.label}
          </span>
          <span className="min-w-0 flex-1 truncate text-[0.9rem] font-medium text-ink-strong">
            {heading}
          </span>
          {dirty ? (
            <span className="shrink-0 rounded-pill bg-[#fff6dd] px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-[#7a5b00]">
              Unsaved
            </span>
          ) : null}
          {!section.visible ? (
            <span className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-wide text-subtle">
              Hidden
            </span>
          ) : null}
          <ChevronDown
            size={16}
            className={cn(
              "shrink-0 text-subtle transition-transform",
              open && "rotate-180"
            )}
          />
        </button>

        <div className="flex shrink-0 items-center gap-1">
          {/* Sits in the toolbar, not just at the foot of a long form, so the
              save for this section is always in view while editing it. */}
          {dirty ? (
            <button
              type="button"
              className={adminButton.primary + " mr-1 py-1.5 text-[0.78rem]"}
              onClick={onSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save section"}
            </button>
          ) : null}

          <ActionForm action={move} pageId={pageId} slug={pageSlug} id={section.id} extra={{ direction: "up" }}>
            <button type="submit" className={adminButton.tiny} disabled={isFirst} aria-label="Move up">
              <ChevronUp size={13} />
            </button>
          </ActionForm>
          <ActionForm action={move} pageId={pageId} slug={pageSlug} id={section.id} extra={{ direction: "down" }}>
            <button type="submit" className={adminButton.tiny} disabled={isLast} aria-label="Move down">
              <ChevronDown size={13} />
            </button>
          </ActionForm>
          <ActionForm
            action={setVisible}
            pageId={pageId}
            slug={pageSlug}
            id={section.id}
            extra={{ visible: section.visible ? "false" : "true" }}
          >
            <button
              type="submit"
              className={adminButton.tiny}
              aria-label={section.visible ? "Hide section" : "Show section"}
              title={section.visible ? "Hide from the live page" : "Show on the live page"}
            >
              {section.visible ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>
          </ActionForm>
          <ActionForm action={remove} pageId={pageId} slug={pageSlug} id={section.id}>
            <button
              type="submit"
              className={adminButton.tiny}
              aria-label="Delete section"
              onClick={(e) => {
                if (!confirm("Delete this section? This cannot be undone.")) {
                  e.preventDefault();
                }
              }}
            >
              <Trash2 size={13} />
            </button>
          </ActionForm>
        </div>
      </div>

      {/* ---------------------------------------------------------- body -- */}
      {open ? (
        <div className="flex flex-col gap-5 p-4">
          <p className="text-[0.8rem] leading-relaxed text-subtle">
            {schema.description}
          </p>

          {error ? <Notice tone="error">{error}</Notice> : null}
          {message ? <Notice tone="success">{message}</Notice> : null}

          {schema.fields.map((field) => (
            <FieldInput
              key={field.name}
              field={field}
              value={data[field.name]}
              ctx={{ packages }}
              onChange={(next) => set(field.name, next)}
            />
          ))}

          <div className="grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
            <Field
              label="Anchor"
              hint="Used by in-page links like #packages. Changing it breaks any link that points here."
            >
              <Input
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setDirty(true);
                }}
              />
            </Field>

            {schema.supportsTone ? (
              <Field label="Background" hint="Alternate these so the page has rhythm.">
                <Select
                  value={tone ?? "white"}
                  onChange={(e) => {
                    setTone(e.target.value as "white" | "surface");
                    setDirty(true);
                  }}
                >
                  <option value="white">White</option>
                  <option value="surface">Tinted</option>
                </Select>
              </Field>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className={adminButton.primary}
              onClick={onSave}
              disabled={saving || !dirty}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {saving ? "Saving…" : dirty ? "Save section" : "Saved"}
            </button>
            {dirty ? (
              <span className="text-[0.78rem] text-subtle">
                Changes are not live until you save.
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </li>
  );
}

/** Small wrapper so the toolbar's four one-click posts stay readable. */
function ActionForm({
  action,
  pageId,
  slug,
  id,
  extra,
  children,
}: {
  action: (form: FormData) => Promise<void>;
  pageId: string;
  slug: string;
  id: string;
  extra?: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="page_id" value={pageId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="id" value={id} />
      {Object.entries(extra ?? {}).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {children}
    </form>
  );
}
