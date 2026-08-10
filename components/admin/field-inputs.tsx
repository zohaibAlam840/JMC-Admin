"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import {
  adminButton,
  Checkbox,
  Field as FieldShell,
  Input,
  Select,
  Textarea,
} from "@/components/admin/ui";
import { ICON_NAMES, type Field } from "@/lib/section-schema";

/**
 * Renders one field from the block library's schema.
 *
 * Everything here is driven by lib/section-schema.ts, so a section type gets
 * exactly the inputs its renderer reads — the client cannot invent a field the
 * site would ignore, or leave out one it needs.
 */

export type PackageOption = { id: string; name: string; visible: boolean };

type Ctx = { packages: PackageOption[] };

export function FieldInput({
  field,
  value,
  onChange,
  ctx,
}: {
  field: Field;
  value: unknown;
  onChange: (next: unknown) => void;
  ctx: Ctx;
}) {
  switch (field.kind) {
    case "textarea":
      return (
        <FieldShell label={field.label} hint={field.help}>
          <Textarea
            rows={4}
            value={asString(value)}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </FieldShell>
      );

    case "select":
      return (
        <FieldShell label={field.label} hint={field.help}>
          <Select
            value={asString(value)}
            onChange={(e) =>
              onChange(field.numeric ? Number(e.target.value) : e.target.value)
            }
          >
            {field.optional ? <option value="">—</option> : null}
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FieldShell>
      );

    case "icon":
      return (
        <FieldShell label={field.label} hint={field.help}>
          <Select
            value={asString(value)}
            onChange={(e) => onChange(e.target.value || undefined)}
          >
            <option value="">No icon</option>
            {ICON_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </FieldShell>
      );

    case "boolean":
      return (
        <Checkbox
          label={field.label}
          hint={field.help}
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
      );

    case "stringList":
      return (
        <FieldShell label={field.label} hint={field.help ?? "One per line."}>
          <Textarea
            rows={Math.min(10, Math.max(3, asStringArray(value).length + 1))}
            value={asStringArray(value).join("\n")}
            onChange={(e) =>
              onChange(
                e.target.value
                  .split("\n")
                  .map((line) => line.replace(/^\s+/, ""))
                  // Blank lines are kept while typing and stripped on save by
                  // the editor, so pressing Enter does not delete the line.
                  .filter((line, i, all) => line !== "" || i === all.length - 1)
              )
            }
          />
        </FieldShell>
      );

    case "cta":
      return <CtaField field={field} value={value} onChange={onChange} />;

    case "packages":
      return (
        <PackagesField
          field={field}
          value={asStringArray(value)}
          onChange={onChange}
          ctx={ctx}
        />
      );

    case "repeater":
      return (
        <Repeater field={field} value={asRecordArray(value)} onChange={onChange} ctx={ctx} />
      );

    case "text":
    default:
      return (
        <FieldShell label={field.label} hint={field.help}>
          <Input
            value={asString(value)}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </FieldShell>
      );
  }
}

/* -------------------------------------------------------------------- cta -- */

function CtaField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const cta = (value ?? null) as { label?: string; href?: string } | null;

  if (!cta && field.optional) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-subtle">
          {field.label}
        </span>
        <button
          type="button"
          className={adminButton.secondary + " self-start"}
          onClick={() =>
            onChange({ label: "Request a Visibility Review", href: "/contact" })
          }
        >
          <Plus size={14} /> Add button
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-line bg-surface-2 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-subtle">
          {field.label}
        </span>
        {field.optional ? (
          <button
            type="button"
            className={adminButton.tiny}
            onClick={() => onChange(undefined)}
          >
            Remove
          </button>
        ) : null}
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <FieldShell label="Button text">
          <Input
            value={cta?.label ?? ""}
            onChange={(e) => onChange({ ...cta, label: e.target.value })}
          />
        </FieldShell>
        <FieldShell label="Links to" hint="A path like /contact, or #section-name.">
          <Input
            value={cta?.href ?? ""}
            onChange={(e) => onChange({ ...cta, href: e.target.value })}
          />
        </FieldShell>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- packages -- */

function PackagesField({
  field,
  value,
  onChange,
  ctx,
}: {
  field: Field;
  value: string[];
  onChange: (next: unknown) => void;
  ctx: Ctx;
}) {
  const byId = new Map(ctx.packages.map((p) => [p.id, p]));
  const unused = ctx.packages.filter((p) => !value.includes(p.id));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-subtle">
        {field.label}
      </span>
      {field.help ? (
        <span className="-mt-1 text-[0.76rem] text-subtle">{field.help}</span>
      ) : null}

      {value.length === 0 ? (
        <p className="rounded-[10px] border border-dashed border-line-strong px-3 py-4 text-center text-[0.8rem] text-subtle">
          No packages selected — this section will render empty.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {value.map((id, i) => {
            const pkg = byId.get(id);
            return (
              <li
                key={id}
                className="flex items-center gap-2 rounded-[10px] border border-line bg-white px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-[0.85rem] text-ink-strong">
                  {pkg ? pkg.name : id}
                  {pkg && !pkg.visible ? (
                    <span className="ml-2 text-[0.72rem] text-subtle">
                      (hidden — will not appear)
                    </span>
                  ) : null}
                  {!pkg ? (
                    <span className="ml-2 text-[0.72rem] text-destructive">
                      (no longer exists)
                    </span>
                  ) : null}
                </span>
                <button type="button" className={adminButton.tiny} onClick={() => move(i, -1)}>
                  <ChevronUp size={13} />
                </button>
                <button type="button" className={adminButton.tiny} onClick={() => move(i, 1)}>
                  <ChevronDown size={13} />
                </button>
                <button
                  type="button"
                  className={adminButton.tiny}
                  onClick={() => onChange(value.filter((v) => v !== id))}
                >
                  <Trash2 size={13} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {unused.length > 0 ? (
        <Select
          value=""
          onChange={(e) => {
            if (e.target.value) onChange([...value, e.target.value]);
          }}
        >
          <option value="">Add a package…</option>
          {unused.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.visible ? "" : " (hidden)"}
            </option>
          ))}
        </Select>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- repeater -- */

function Repeater({
  field,
  value,
  onChange,
  ctx,
}: {
  field: Field;
  value: Record<string, unknown>[];
  onChange: (next: unknown) => void;
  ctx: Ctx;
}) {
  const items = value;
  const atMax = field.max !== undefined && items.length >= field.max;

  const update = (index: number, next: Record<string, unknown>) => {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };

  const add = () => {
    const blank: Record<string, unknown> = {};
    for (const f of field.fields ?? []) {
      if (f.kind === "select" && f.options?.length) {
        blank[f.name] = f.numeric ? Number(f.options[0].value) : f.options[0].value;
      } else if (f.kind === "repeater" || f.kind === "stringList") {
        blank[f.name] = [];
      } else if (f.kind !== "cta" && f.kind !== "icon" && f.kind !== "boolean") {
        blank[f.name] = "";
      }
    }
    // Variant fields for whichever variant the defaults land on.
    if (field.variantField) {
      const variant = String(blank[field.variantField] ?? "");
      for (const f of field.variants?.[variant] ?? []) {
        blank[f.name] = f.kind === "repeater" || f.kind === "stringList" ? [] : "";
      }
    }
    onChange([...items, blank]);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-subtle">
          {field.label}
        </span>
        <span className="text-[0.72rem] text-subtle">
          {items.length}
          {field.max ? ` / ${field.max}` : ""}
        </span>
      </div>
      {field.help ? (
        <span className="-mt-1.5 text-[0.76rem] leading-snug text-subtle">
          {field.help}
        </span>
      ) : null}

      <ul className="flex flex-col gap-2.5">
        {items.map((item, i) => {
          const variant = field.variantField
            ? String(item[field.variantField] ?? "")
            : null;
          const extra = variant ? (field.variants?.[variant] ?? []) : [];

          return (
            <li
              key={i}
              className="rounded-[10px] border border-line bg-surface-2 p-3"
            >
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-subtle">
                  {field.itemLabel ?? "Item"} {i + 1}
                </span>
                <div className="flex gap-1">
                  <button type="button" className={adminButton.tiny} onClick={() => move(i, -1)} disabled={i === 0}>
                    <ChevronUp size={13} />
                  </button>
                  <button
                    type="button"
                    className={adminButton.tiny}
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                  >
                    <ChevronDown size={13} />
                  </button>
                  <button
                    type="button"
                    className={adminButton.tiny}
                    onClick={() => onChange(items.filter((_, j) => j !== i))}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {[...(field.fields ?? []), ...extra].map((sub) => (
                  <FieldInput
                    key={sub.name}
                    field={sub}
                    value={item[sub.name]}
                    ctx={ctx}
                    onChange={(next) => {
                      const merged = { ...item, [sub.name]: next };
                      // Switching a variant leaves the previous variant's
                      // fields behind, which would silently ship dead data.
                      if (field.variantField && sub.name === field.variantField) {
                        for (const [key, fields] of Object.entries(field.variants ?? {})) {
                          if (key === String(next)) continue;
                          for (const f of fields) delete merged[f.name];
                        }
                        for (const f of field.variants?.[String(next)] ?? []) {
                          if (merged[f.name] === undefined) merged[f.name] = [];
                        }
                      }
                      update(i, merged);
                    }}
                  />
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={adminButton.secondary + " self-start"}
        onClick={add}
        disabled={atMax}
      >
        <Plus size={14} /> Add {(field.itemLabel ?? "item").toLowerCase()}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- coercion -- */

function asString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

function asRecordArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? (value.filter((v) => v && typeof v === "object") as Record<string, unknown>[])
    : [];
}
