"use client";

import * as React from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { recordUpload } from "@/app/(admin)/admin/actions";
import { Notice } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * Uploads an image to Supabase Storage.
 *
 * The file goes straight from the browser to Storage rather than through a
 * Server Action — a few megabytes through an action would be slow and would run
 * into the request body limit. Write access is still controlled: the storage
 * policy only accepts an insert into this bucket from a signed-in admin.
 *
 * Kept deliberately generic. The article's cover image and the editor's insert
 * button both use it, so there is one upload path to get right.
 */

export type UploadedImage = {
  url: string;
  path: string;
  alt: string;
  fileName: string;
  width: number | null;
  height: number | null;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

/** Reads the pixel dimensions so the library can show them and warn on huge files. */
async function readDimensions(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return { width: null, height: null };
  }
}

/** "hero-shot.JPG" → "hero-shot", used as the first guess at alt text. */
function niceName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function ImageUploader({
  onUploaded,
  compact = false,
}: {
  onUploaded: (image: UploadedImage) => void;
  compact?: boolean;
}) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError(
        "That file type is not supported. Use a JPG, PNG, WebP, AVIF, or GIF."
      );
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 5 MB — resize it and try again.`
      );
      return;
    }

    setBusy(true);

    try {
      const supabase = createClient();
      const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
      // Year folders keep the bucket browsable, and a random id means two
      // files called "photo.jpg" never overwrite each other.
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file, {
          cacheControl: "31536000",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        setError(
          uploadError.message.toLowerCase().includes("bucket")
            ? "The media bucket does not exist yet. Run supabase/migrations/003_media.sql in the SQL editor."
            : uploadError.message
        );
        setBusy(false);
        return;
      }

      const { data } = supabase.storage.from("media").getPublicUrl(path);
      const { width, height } = await readDimensions(file);
      const alt = niceName(file.name);

      const recorded = await recordUpload({
        path,
        url: data.publicUrl,
        alt,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        width,
        height,
      });

      // The file is uploaded and usable either way; a failed catalogue write
      // only means it will not appear in the media library.
      if (!recorded.ok) {
        setError(`Uploaded, but not added to the library: ${recorded.message}`);
      }

      onUploaded({ url: data.publicUrl, path, alt, fileName: file.name, width, height });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-[10px] border border-dashed text-center transition-colors",
          compact ? "gap-1.5 px-4 py-5" : "gap-2 px-6 py-8",
          dragging ? "border-teal bg-teal/5" : "border-line-strong bg-surface-2"
        )}
      >
        {busy ? (
          <>
            <Loader2 size={20} className="animate-spin text-teal-ink" />
            <p className="text-[0.85rem] text-subtle">Uploading&hellip;</p>
          </>
        ) : (
          <>
            <ImagePlus size={compact ? 18 : 22} className="text-subtle" />
            <p className="text-[0.85rem] text-ink-strong">
              Drag an image here, or{" "}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-semibold text-teal-ink underline underline-offset-2"
              >
                choose a file
              </button>
            </p>
            <p className="text-[0.75rem] text-subtle">
              JPG, PNG, WebP, AVIF or GIF &middot; up to 5 MB
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
          }}
        />
      </div>

      {error ? <Notice tone="error">{error}</Notice> : null}
    </div>
  );
}
