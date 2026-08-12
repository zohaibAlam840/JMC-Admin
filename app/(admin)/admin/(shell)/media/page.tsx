import {
  adminButton,
  EmptyState,
  Input,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
} from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { CopyButton } from "@/components/admin/copy-button";
import { listMedia, type AdminMedia } from "@/lib/admin/data";
import { deleteMedia, updateMediaAlt } from "../../actions";

export const metadata = { title: "Images" };
export const dynamic = "force-dynamic";

export default async function MediaScreen({
  searchParams,
}: PageProps<"/admin/media">) {
  const { saved, error } = await searchParams;

  let media: AdminMedia[] = [];
  let tableMissing = false;

  try {
    media = await listMedia();
  } catch {
    tableMissing = true;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Images"
        description="Everything uploaded through the article editor. Descriptions written here are reused wherever the image appears next."
      />

      {saved ? <Notice tone="success">Description saved.</Notice> : null}
      {error ? <Notice tone="error">{String(error)}</Notice> : null}

      {tableMissing ? (
        <Notice tone="error">
          Image uploads are not set up yet. Run{" "}
          <code>supabase/migrations/003_media.sql</code> in the Supabase SQL
          editor.
        </Notice>
      ) : null}

      {!tableMissing && media.length === 0 ? (
        <EmptyState title="No images yet">
          Images are uploaded while writing — the article editor has an upload
          button in its toolbar, and the cover image field takes a drag and
          drop. Anything uploaded there shows up here.
        </EmptyState>
      ) : null}

      {media.length > 0 ? (
        <Panel>
          <PanelTitle hint="Deleting removes the file for good. Any article still pointing at it will show a broken image.">
            {media.length} image{media.length === 1 ? "" : "s"}
          </PanelTitle>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((item) => (
              <li
                key={item.id}
                className="flex flex-col overflow-hidden rounded-card border border-line bg-white"
              >
                <div className="bg-surface-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-contain"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-3">
                  <p className="truncate text-[0.8rem] font-medium text-ink-strong">
                    {item.file_name || item.path}
                  </p>
                  <p className="-mt-2 text-[0.72rem] text-subtle">
                    {item.width && item.height
                      ? `${item.width}×${item.height}`
                      : "Unknown size"}
                    {item.size_bytes
                      ? ` · ${Math.round(item.size_bytes / 1024)} KB`
                      : ""}
                  </p>

                  <form action={updateMediaAlt} className="flex flex-col gap-2">
                    <input type="hidden" name="id" value={item.id} />
                    <Input
                      name="alt"
                      defaultValue={item.alt}
                      placeholder="Describe this image"
                      className="text-[0.8rem]"
                    />
                    <button type="submit" className={adminButton.secondary}>
                      Save description
                    </button>
                  </form>

                  {!item.alt.trim() ? (
                    <p className="text-[0.72rem] font-medium text-[#7a5b00]">
                      No description — screen readers will skip this image.
                    </p>
                  ) : null}

                  <div className="mt-auto flex items-center gap-2 pt-1">
                    <CopyButton value={item.url} />
                    <form action={deleteMedia} className="ml-auto">
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="path" value={item.path} />
                      <ConfirmButton
                        className={adminButton.tiny}
                        message={`Delete "${item.file_name || item.path}" permanently? Any article using it will show a broken image.`}
                      >
                        Delete
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </div>
  );
}
