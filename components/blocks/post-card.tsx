import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { PostSummary } from "@/lib/types";

/** Articles live under the Resources hub, per the approved IA. */
export function postHref(slug: string) {
  return `/resources/${slug}`;
}

export function formatPostDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: PostSummary }) {
  const date = formatPostDate(post.publishedAt);

  return (
    <Link
      href={postHref(post.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-bento border border-line bg-white transition-all duration-300 ease-out-soft hover:-translate-y-1.5 hover:border-teal/50 hover:shadow-lift"
    >
      {post.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImageUrl}
          alt={post.coverImageAlt ?? ""}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          {post.category ? (
            <Badge variant="soft" size="sm">
              {post.category}
            </Badge>
          ) : null}
          {date ? (
            <time
              dateTime={post.publishedAt ?? undefined}
              className="text-[0.78rem] text-subtle"
            >
              {date}
            </time>
          ) : null}
        </div>

        <h3 className="mt-3 text-[1.2rem] leading-tight transition-colors group-hover:text-teal-ink">
          {post.title}
        </h3>

        {post.excerpt ? (
          <p className="mt-2.5 text-[0.9rem] leading-relaxed text-subtle">
            {post.excerpt}
          </p>
        ) : null}

        <span className="mt-auto pt-5 font-body text-[0.95rem] font-semibold text-teal-ink">
          Read article{" "}
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  );
}
