import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  adminButton,
  Checkbox,
  Field,
  Input,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Textarea,
} from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { getPost, listPostCategories } from "@/lib/admin/data";
import { deletePost, savePost } from "../../../actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/admin/articles/[id]">) {
  const { id } = await params;
  const post = await getPost(id);
  return { title: post?.title ?? "Article" };
}

/** datetime-local wants "YYYY-MM-DDTHH:mm" in the viewer's own clock. */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default async function ArticleEditor({
  params,
  searchParams,
}: PageProps<"/admin/articles/[id]">) {
  const { id } = await params;
  const { saved, error } = await searchParams;

  const [post, categories] = await Promise.all([
    getPost(id),
    listPostCategories(),
  ]);

  if (!post) notFound();

  const scheduled =
    post.published &&
    post.published_at !== null &&
    new Date(post.published_at) > new Date();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-subtle transition-colors hover:text-ink-strong"
        >
          <ArrowLeft size={14} /> All articles
        </Link>
      </div>

      <PageHeader
        title={post.title}
        description={`/resources/${post.slug}`}
        actions={
          post.published ? (
            <a
              href={`/resources/${post.slug}`}
              target="_blank"
              rel="noreferrer"
              className={adminButton.secondary}
            >
              View <ArrowUpRight size={13} />
            </a>
          ) : undefined
        }
      />

      {saved ? <Notice tone="success">Article saved.</Notice> : null}
      {error ? <Notice tone="error">{String(error)}</Notice> : null}
      {scheduled ? (
        <Notice tone="warning">
          This article is set to publish on{" "}
          {new Date(post.published_at!).toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          })}
          . It stays invisible to visitors and search engines until then.
        </Notice>
      ) : null}

      {/*
       * One form covering the whole screen. An article is a single document —
       * splitting the body from its own title and publish state into separate
       * forms is what makes people lose work.
       */}
      <form action={savePost} className="flex flex-col gap-6">
        <input type="hidden" name="id" value={post.id} />
        <input type="hidden" name="previous_slug" value={post.slug} />

        <Panel>
          <div className="flex flex-col gap-4">
            <Field label="Title">
              <Input name="title" defaultValue={post.title} required />
            </Field>

            <Field
              label="Summary"
              hint="One or two sentences. Shown on cards, in search results, and in the feed."
            >
              <Textarea name="excerpt" rows={2} defaultValue={post.excerpt} />
            </Field>
          </div>
        </Panel>

        <Panel>
          <MarkdownEditor name="body" defaultValue={post.body} />
        </Panel>

        <Panel>
          <PanelTitle>Details</PanelTitle>
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Address"
                hint="Changing this on a published article breaks its existing links — add a redirect if you do."
              >
                <Input name="slug" defaultValue={post.slug} required />
              </Field>
              <Field label="Author">
                <Input name="author" defaultValue={post.author} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" hint="Groups articles and drives the category filter.">
                <Input
                  name="category"
                  defaultValue={post.category}
                  list="post-categories"
                />
              </Field>
              <Field label="Topics" hint="Comma separated. Shown at the foot of the article.">
                <Input name="tags" defaultValue={post.tags.join(", ")} />
              </Field>
            </div>

            <datalist id="post-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>

            <div className="border-t border-line pt-4">
              <CoverImageField
                defaultUrl={post.cover_image_url ?? ""}
                defaultAlt={post.cover_image_alt ?? ""}
              />
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelTitle hint="Leave these blank and the title and summary above are used.">
            Search engines
          </PanelTitle>
          <div className="flex flex-col gap-4">
            <Field label="Search engine title" hint="Roughly 60 characters.">
              <Input name="seo_title" defaultValue={post.seo_title} />
            </Field>
            <Field label="Search engine description" hint="Roughly 155 characters.">
              <Textarea
                name="meta_description"
                rows={2}
                defaultValue={post.meta_description}
              />
            </Field>
          </div>
        </Panel>

        <Panel>
          <PanelTitle>Publishing</PanelTitle>
          <div className="flex flex-col gap-4">
            <Checkbox
              name="published"
              label="Published"
              hint="Unpublished articles are invisible to visitors and search engines."
              defaultChecked={post.published}
            />

            <Field
              label="Publish date"
              hint="Set a future date and time to schedule it. Leave blank and it is stamped the moment you first publish."
            >
              <Input
                name="published_at"
                type="datetime-local"
                defaultValue={toLocalInput(post.published_at)}
              />
            </Field>
          </div>
        </Panel>

        <button type="submit" className={adminButton.primary + " self-start"}>
          Save article
        </button>
      </form>

      <Panel className="border-destructive/25">
        <PanelTitle hint="The article and its address are gone for good. If it has been live, add a redirect so its links do not 404.">
          Delete this article
        </PanelTitle>
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <input type="hidden" name="slug" value={post.slug} />
          <ConfirmButton
            className={adminButton.danger}
            message={`Delete "${post.title}"? This cannot be undone.`}
          >
            Delete article
          </ConfirmButton>
        </form>
      </Panel>
    </div>
  );
}
