"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Field, Input, Notice } from "@/components/admin/ui";

/**
 * The article's cover image.
 *
 * Posts the two values the form expects as hidden inputs, so the surrounding
 * Server Action keeps working unchanged whether the image was uploaded here or
 * pasted in as a link.
 *
 * The alt warning is not decoration. An image with no description is invisible
 * to a screen reader and contributes nothing to search — on an SEO agency's own
 * site that is the kind of thing a prospect notices.
 */
export function CoverImageField({
  name = "cover_image_url",
  altName = "cover_image_alt",
  defaultUrl = "",
  defaultAlt = "",
}: {
  name?: string;
  altName?: string;
  defaultUrl?: string;
  defaultAlt?: string;
}) {
  const [url, setUrl] = React.useState(defaultUrl);
  const [alt, setAlt] = React.useState(defaultAlt);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-subtle">
        Cover image
      </span>

      <input type="hidden" name={name} value={url} />
      <input type="hidden" name={altName} value={alt} />

      {url ? (
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-card border border-line bg-surface-2">
            {/* Plain img rather than next/image: the URL can point anywhere,
                including a host that is not in the image config. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={alt}
              className="aspect-[16/9] w-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setUrl("");
                setAlt("");
              }}
              className="absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-[8px] bg-white/95 px-2.5 py-1.5 text-[0.75rem] font-semibold text-ink-strong shadow-soft transition-colors hover:text-destructive"
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>

          <Field
            label="Image description (alt text)"
            hint="Describe what the image shows, as you would to someone who cannot see it. Not “photo of” — just the content."
          >
            <Input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="A Google Business Profile dashboard showing a review reply"
            />
          </Field>

          {!alt.trim() ? (
            <Notice tone="warning">
              This image has no description. Screen readers will skip it, and
              search engines get nothing from it.
            </Notice>
          ) : null}

          <details>
            <summary className="cursor-pointer text-[0.78rem] text-subtle hover:text-ink-strong">
              Replace the image
            </summary>
            <div className="pt-3">
              <ImageUploader
                compact
                onUploaded={(image) => {
                  setUrl(image.url);
                  // Only fill the description from the filename when there is
                  // nothing there — never overwrite something already written.
                  setAlt((current) => current || image.alt);
                }}
              />
            </div>
          </details>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <ImageUploader
            onUploaded={(image) => {
              setUrl(image.url);
              setAlt((current) => current || image.alt);
            }}
          />

          <Field
            label="Or paste an image address"
            hint="Only needed for an image already hosted somewhere else."
          >
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
            />
          </Field>

          <p className="text-[0.78rem] leading-relaxed text-subtle">
            Usually left empty — the brand guidelines rule out stock
            photography. Use a real screenshot, chart, or photograph, or nothing.
          </p>
        </div>
      )}
    </div>
  );
}
