import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  adminButton,
  EmptyState,
  Field,
  Input,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
} from "@/components/admin/ui";
import { listPosts } from "@/lib/admin/data";
import { createPost } from "../../actions";

export const metadata = { title: "Articles" };
export const dynamic = "force-dynamic";

export default async function ArticlesScreen({
  searchParams,
}: PageProps<"/admin/articles">) {
  const { error } = await searchParams;

  let posts: Awaited<ReturnType<typeof listPosts>> = [];
  let tableMissing = false;

  try {
    posts = await listPosts();
  } catch {
    tableMissing = true;
  }

  const drafts = posts.filter((p) => !p.published);
  const live = posts.filter((p) => p.published);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Articles"
        description="The Resources hub. Articles publish to jordanmarketingconsultants.com/resources/…"
      />

      {error ? <Notice tone="error">{String(error)}</Notice> : null}

      {tableMissing ? (
        <Notice tone="error">
          The articles table does not exist yet. Open the Supabase SQL editor and
          run <code>supabase/migrations/002_posts.sql</code>, then reload this
          page.
        </Notice>
      ) : null}

      {!tableMissing && posts.length === 0 ? (
        <EmptyState title="No articles yet">
          Write the first one below. It stays a draft until you tick Published,
          so you can work on it over several sittings.
        </EmptyState>
      ) : null}

      {drafts.length > 0 ? (
        <Panel className="p-0">
          <div className="border-b border-line px-5 py-3">
            <h2 className="font-display text-[1rem] uppercase leading-none text-ink-strong">
              Drafts
            </h2>
          </div>
          <ul className="divide-y divide-line">
            {drafts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </ul>
        </Panel>
      ) : null}

      {live.length > 0 ? (
        <Panel className="p-0">
          <div className="border-b border-line px-5 py-3">
            <h2 className="font-display text-[1rem] uppercase leading-none text-ink-strong">
              Published
            </h2>
          </div>
          <ul className="divide-y divide-line">
            {live.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </ul>
        </Panel>
      ) : null}

      <Panel>
        <PanelTitle hint="Just the title to start with — everything else is on the next screen.">
          Write a new article
        </PanelTitle>

        <form action={createPost} className="flex flex-col gap-4">
          <Field label="Title">
            <Input
              name="title"
              required
              placeholder="How Local SEO Actually Works for a Service Business"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Address" hint="Leave blank to build one from the title.">
              <Input name="slug" placeholder="how-local-seo-works" />
            </Field>
            <Field label="Category" hint="e.g. Local Search">
              <Input name="category" />
            </Field>
            <Field label="Author">
              <Input name="author" defaultValue="Wendell Jordan" />
            </Field>
          </div>

          <button type="submit" className={adminButton.primary + " self-start"}>
            Start writing
          </button>
        </form>
      </Panel>
    </div>
  );
}

function PostRow({
  post,
}: {
  post: Awaited<ReturnType<typeof listPosts>>[number];
}) {
  const words = post.body.trim() ? post.body.trim().split(/\s+/).length : 0;
  const scheduled =
    post.published &&
    post.published_at !== null &&
    new Date(post.published_at) > new Date();

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
      <Link href={`/admin/articles/${post.id}`} className="group min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="truncate font-display text-[1.05rem] uppercase leading-none text-ink-strong transition-colors group-hover:text-teal-ink">
            {post.title}
          </span>
          {scheduled ? (
            <Pill tone="draft">Scheduled</Pill>
          ) : post.published ? (
            <Pill tone="live">Live</Pill>
          ) : (
            <Pill tone="draft">Draft</Pill>
          )}
          {post.category ? <Pill>{post.category}</Pill> : null}
        </span>
        <span className="mt-1 block truncate text-[0.78rem] text-subtle">
          /resources/{post.slug}
          {date ? ` · ${date}` : ""} · {words.toLocaleString()} words
        </span>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        {post.published && !scheduled ? (
          <a
            href={`/resources/${post.slug}`}
            target="_blank"
            rel="noreferrer"
            className={adminButton.ghost}
          >
            View <ArrowUpRight size={13} />
          </a>
        ) : null}
        <Link
          href={`/admin/articles/${post.id}`}
          className={adminButton.secondary}
        >
          Edit
        </Link>
      </div>
    </li>
  );
}
