import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Band, Container } from "@/components/ui/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ArticleBody } from "@/components/blocks/article-body";
import { PostCard, formatPostDate } from "@/components/blocks/post-card";
import {
  JsonLd,
  articleSchema,
  breadcrumbSchema,
} from "@/components/seo/json-ld";
import { getPost, getPosts, getPublishedPostSlugs, getSiteConfig } from "@/lib/content";

/**
 * An article.
 *
 * Sits under /resources rather than /blog because the approved IA and the
 * keyword page map both target the Resources hub. This folder takes precedence
 * over the (site)/[...slug] catch-all, so a page and an article can never
 * collide on the same address.
 */

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPublishedPostSlugs();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.seoTitle,
    description: post.metaDescription,
    alternates: { canonical: `/resources/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seoTitle,
      description: post.metaDescription,
      url: `/resources/${post.slug}`,
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
      modifiedTime: post.updatedAt,
      ...(post.coverImageUrl ? { images: [post.coverImageUrl] } : {}),
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/resources/[slug]">) {
  const { slug } = await params;

  const [post, { site }] = await Promise.all([getPost(slug), getSiteConfig()]);
  if (!post) notFound();

  const related = await getPosts({ limit: 3, excludeSlug: post.slug });
  const date = formatPostDate(post.publishedAt);
  const url = `/resources/${post.slug}`;

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.metaDescription,
          url,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          author: post.author,
          imageUrl: post.coverImageUrl,
          site,
        })}
      />
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: "Home", url: "/" },
            { name: "Resources", url: "/resources" },
            { name: post.title, url },
          ],
          site
        )}
      />

      {/* ----------------------------------------------------------- head -- */}
      <section className="border-b border-line bg-surface-2 py-14 sm:py-18">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-subtle transition-colors hover:text-teal-ink"
            >
              <ArrowLeft size={14} aria-hidden="true" /> All resources
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {post.category ? (
                <Badge variant="soft" size="md">
                  {post.category}
                </Badge>
              ) : null}
              {date ? (
                <time
                  dateTime={post.publishedAt ?? undefined}
                  className="text-[0.85rem] text-subtle"
                >
                  {date}
                </time>
              ) : null}
              {post.author ? (
                <span className="text-[0.85rem] text-subtle">
                  &middot; {post.author}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-[2.3rem] uppercase leading-[0.98] sm:text-[3rem]">
              {post.title}
            </h1>

            {post.excerpt ? (
              <p className="mt-5 text-[1.08rem] leading-relaxed text-subtle">
                {post.excerpt}
              </p>
            ) : null}
          </div>
        </Container>
      </section>

      {/* ----------------------------------------------------------- body -- */}
      <section className="py-14 sm:py-18">
        <Container>
          <div className="mx-auto max-w-3xl">
            {post.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverImageUrl}
                alt={post.coverImageAlt ?? ""}
                className="mb-12 aspect-[16/9] w-full rounded-bento object-cover"
              />
            ) : null}

            <ArticleBody markdown={post.body} />

            {post.tags.length > 0 ? (
              <div className="mt-14 flex flex-wrap items-center gap-2 border-t border-line pt-6">
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-subtle">
                  Topics
                </span>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="soft" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------ cta -- */}
      <section className="gradient-brand relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="grid-backdrop pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]"
        />
        <Container className="relative py-16 sm:py-20">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <h2 className="text-[1.9rem] uppercase leading-[0.98] text-brand-black sm:text-[2.4rem]">
              Want This Looked At For Your Business?
            </h2>
            <p className="text-[1rem] leading-relaxed text-brand-black/80">
              A Visibility Review covers where you show up in search today, the
              gaps worth caring about, and what to prioritize first.
            </p>
            <div className="mt-2">
              <Button href="/contact" variant="dark" size="lg">
                Request a Visibility Review
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* -------------------------------------------------------- related -- */}
      {related.length > 0 ? (
        <Band tone="white">
          <h2 className="text-[1.7rem] uppercase leading-tight sm:text-[2.1rem]">
            Keep Reading
          </h2>
          <Stagger className="mt-10 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <StaggerItem key={item.slug} className="h-full">
                <PostCard post={item} />
              </StaggerItem>
            ))}
          </Stagger>
        </Band>
      ) : null}
    </>
  );
}
