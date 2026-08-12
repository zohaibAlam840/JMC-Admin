"use client";

import * as React from "react";
import {
  Bold,
  Eye,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pencil,
  Quote,
  X,
} from "lucide-react";
import { ArticleBody } from "@/components/blocks/article-body";
import { ImageUploader } from "@/components/admin/image-uploader";
import { adminButton, Field, Input, Notice } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * The article body editor.
 *
 * Markdown rather than a WYSIWYG on purpose: the stored value stays plain text
 * that can be diffed, searched, and moved somewhere else later, and there is no
 * pasted-from-Word markup to sanitise. The toolbar is what makes that
 * acceptable for someone who does not know markdown — nobody has to remember
 * that ## means a heading.
 *
 * Edits go through execCommand("insertText") where it is available. It is a
 * deprecated API, but it is the only way to change a textarea's value while
 * keeping the browser's native undo stack — without it, Ctrl+Z after clicking
 * Bold wipes out the paragraph the writer just typed.
 */

type Tool = {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  /** Wraps the selection. */
  wrap?: [string, string];
  /** Prefixes each selected line. */
  linePrefix?: string;
  /** Inserted as its own block. */
  block?: string;
  placeholder?: string;
};

const TOOLS: Tool[][] = [
  [
    { icon: Bold, label: "Bold", wrap: ["**", "**"], placeholder: "bold text" },
    { icon: Italic, label: "Italic", wrap: ["*", "*"], placeholder: "italic text" },
    { icon: Link2, label: "Link", wrap: ["[", "](https://)"], placeholder: "link text" },
  ],
  [
    { icon: Heading2, label: "Heading", linePrefix: "## ", placeholder: "Section heading" },
    { icon: Heading3, label: "Sub-heading", linePrefix: "### ", placeholder: "Sub-heading" },
  ],
  [
    { icon: List, label: "Bullet list", linePrefix: "- ", placeholder: "List item" },
    { icon: ListOrdered, label: "Numbered list", linePrefix: "1. ", placeholder: "List item" },
    { icon: Quote, label: "Quote", linePrefix: "> ", placeholder: "Quoted line" },
  ],
  [{ icon: Minus, label: "Divider", block: "\n---\n" }],
];

export function MarkdownEditor({
  name,
  defaultValue = "",
  onDirty,
}: {
  name: string;
  defaultValue?: string;
  onDirty?: () => void;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = React.useState(defaultValue);
  const [preview, setPreview] = React.useState(false);

  // Image insertion is a two-step job — upload, then describe — so it gets a
  // panel rather than a toolbar button that fires immediately.
  const [imagePanel, setImagePanel] = React.useState(false);
  const [pendingImage, setPendingImage] = React.useState<{
    url: string;
    alt: string;
  } | null>(null);
  // Where the caret was before focus moved to the panel.
  const caret = React.useRef<number | null>(null);

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  // 220 wpm is the usual figure for screen reading of this kind of prose.
  const minutes = Math.max(1, Math.round(words / 220));

  /** Replaces the current selection, preserving the browser's undo history. */
  function replaceSelection(text: string, selectFrom: number, selectTo: number) {
    const el = ref.current;
    if (!el) return;

    el.focus();
    const ok =
      typeof document.execCommand === "function" &&
      document.execCommand("insertText", false, text);

    if (!ok) {
      const next =
        el.value.slice(0, el.selectionStart) + text + el.value.slice(el.selectionEnd);
      el.value = next;
    }

    el.setSelectionRange(selectFrom, selectTo);
    setValue(el.value);
    onDirty?.();
  }

  function apply(tool: Tool) {
    const el = ref.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.slice(start, end);

    if (tool.block) {
      replaceSelection(tool.block, start + tool.block.length, start + tool.block.length);
      return;
    }

    if (tool.wrap) {
      const [before, after] = tool.wrap;
      const inner = selected || tool.placeholder || "";
      const text = `${before}${inner}${after}`;
      // With nothing selected, drop the caret onto the placeholder so typing
      // replaces it rather than landing after the closing marker.
      replaceSelection(
        text,
        start + before.length,
        start + before.length + inner.length
      );
      return;
    }

    if (tool.linePrefix) {
      // Grow the selection to whole lines, so prefixing a partial selection
      // does not insert "## " into the middle of a sentence.
      const lineStart = el.value.lastIndexOf("\n", start - 1) + 1;
      const lineEndIndex = el.value.indexOf("\n", end);
      const lineEnd = lineEndIndex === -1 ? el.value.length : lineEndIndex;

      el.setSelectionRange(lineStart, lineEnd);
      const block = el.value.slice(lineStart, lineEnd) || tool.placeholder || "";

      const text = block
        .split("\n")
        .map((line) =>
          line.startsWith(tool.linePrefix!)
            ? line.slice(tool.linePrefix!.length)
            : tool.linePrefix + line
        )
        .join("\n");

      replaceSelection(text, lineStart, lineStart + text.length);
    }
  }

  /** Drops the finished markdown image at wherever the caret last was. */
  function insertImage() {
    if (!pendingImage) return;
    const el = ref.current;
    if (!el) return;

    const at = caret.current ?? el.value.length;
    const needsBreakBefore = at > 0 && !el.value.slice(0, at).endsWith("\n\n");
    const markdown =
      (needsBreakBefore ? "\n\n" : "") +
      `![${pendingImage.alt.replace(/[[\]]/g, "")}](${pendingImage.url})` +
      "\n\n";

    el.focus();
    el.setSelectionRange(at, at);
    replaceSelection(markdown, at + markdown.length, at + markdown.length);

    setPendingImage(null);
    setImagePanel(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-subtle">
          Article
        </span>
        <span className="text-[0.75rem] text-subtle">
          {words.toLocaleString()} words &middot; {minutes} min read
        </span>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-line-strong bg-white">
        {/* ------------------------------------------------------ toolbar -- */}
        <div className="flex flex-wrap items-center gap-1 border-b border-line bg-surface-2 px-2 py-1.5">
          {TOOLS.map((group, gi) => (
            <React.Fragment key={gi}>
              {gi > 0 ? (
                <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />
              ) : null}
              {group.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.label}
                    type="button"
                    title={tool.label}
                    aria-label={tool.label}
                    disabled={preview}
                    onClick={() => apply(tool)}
                    className="rounded-[7px] p-1.5 text-subtle transition-colors hover:bg-white hover:text-ink-strong disabled:opacity-40"
                  >
                    <Icon size={15} />
                  </button>
                );
              })}
            </React.Fragment>
          ))}

          <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />
          <button
            type="button"
            title="Insert an image"
            aria-label="Insert an image"
            disabled={preview}
            onClick={() => {
              caret.current = ref.current?.selectionStart ?? null;
              setImagePanel((v) => !v);
            }}
            className={cn(
              "rounded-[7px] p-1.5 transition-colors disabled:opacity-40",
              imagePanel
                ? "bg-brand-black text-white"
                : "text-subtle hover:bg-white hover:text-ink-strong"
            )}
          >
            <ImagePlus size={15} />
          </button>

          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            className={cn(
              "ml-auto inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[0.78rem] font-semibold transition-colors",
              preview
                ? "bg-brand-black text-white"
                : "text-subtle hover:bg-white hover:text-ink-strong"
            )}
          >
            {preview ? <Pencil size={13} /> : <Eye size={13} />}
            {preview ? "Back to editing" : "Preview"}
          </button>
        </div>

        {/* --------------------------------------------------- image panel -- */}
        {imagePanel && !preview ? (
          <div className="flex flex-col gap-3 border-b border-line bg-surface-2 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-subtle">
                Insert an image
              </span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => {
                  setImagePanel(false);
                  setPendingImage(null);
                }}
                className="rounded-[7px] p-1 text-subtle hover:bg-white hover:text-ink-strong"
              >
                <X size={15} />
              </button>
            </div>

            {pendingImage ? (
              <div className="flex flex-col gap-3">
                <div className="overflow-hidden rounded-card border border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pendingImage.url}
                    alt={pendingImage.alt}
                    className="max-h-56 w-full object-contain"
                  />
                </div>

                <Field
                  label="Image description (alt text)"
                  hint="What the image shows, for anyone who cannot see it. This is also what search engines read."
                >
                  <Input
                    autoFocus
                    value={pendingImage.alt}
                    onChange={(e) =>
                      setPendingImage({ ...pendingImage, alt: e.target.value })
                    }
                    placeholder="A local search grid showing rankings across a service area"
                  />
                </Field>

                {!pendingImage.alt.trim() ? (
                  <Notice tone="warning">
                    Without a description this image is invisible to screen
                    readers and worth nothing in search.
                  </Notice>
                ) : null}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={adminButton.primary}
                    onClick={insertImage}
                  >
                    Insert into the article
                  </button>
                  <button
                    type="button"
                    className={adminButton.ghost}
                    onClick={() => setPendingImage(null)}
                  >
                    Choose a different image
                  </button>
                </div>
              </div>
            ) : (
              <ImageUploader
                compact
                onUploaded={(image) =>
                  setPendingImage({ url: image.url, alt: image.alt })
                }
              />
            )}
          </div>
        ) : null}

        {/* --------------------------------------------------------- body -- */}
        {preview ? (
          <div className="min-h-[28rem] px-5 py-6">
            {value.trim() ? (
              <ArticleBody markdown={value} />
            ) : (
              <p className="text-[0.88rem] text-subtle">
                Nothing written yet.
              </p>
            )}
          </div>
        ) : (
          <textarea
            ref={ref}
            name={name}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onDirty?.();
            }}
            spellCheck
            className="min-h-[28rem] w-full resize-y bg-white px-4 py-3 font-mono text-[0.9rem] leading-relaxed text-ink-strong outline-none placeholder:text-subtle/70"
            placeholder={
              "Write the article here.\n\n" +
              "Use the buttons above for headings, lists, and links — or type markdown directly:\n\n" +
              "## A section heading\n\n" +
              "A paragraph of plain text. Leave a blank line between paragraphs.\n\n" +
              "- A bullet\n- Another bullet\n\n" +
              "[A link](https://example.com)"
            }
          />
        )}
      </div>

      {/* Preview swaps the textarea out of the DOM, which would drop the field
          from the submitted form. This keeps the value posting either way. */}
      {preview ? <input type="hidden" name={name} value={value} /> : null}
    </div>
  );
}
