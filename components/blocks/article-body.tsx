import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Renders an article's markdown.
 *
 * react-markdown produces React elements rather than an HTML string, so there
 * is no dangerouslySetInnerHTML anywhere in this path and raw HTML inside a
 * post is escaped rather than executed. That matters even though only admins
 * can write posts — a compromised admin account should not become script
 * execution on every visitor's browser.
 *
 * Styling lives in the .article-body rules in globals.css; only the handful of
 * elements that need behaviour rather than looks are overridden here.
 */
export function ArticleBody({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) {
  return (
    <div className={cn("article-body", className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children, ...props }) {
            const target = href ?? "";
            const internal = target.startsWith("/") || target.startsWith("#");

            // Internal links go through next/link so they navigate without a
            // full page load; external ones get the usual safety attributes.
            return internal ? (
              <Link href={target} {...props}>
                {children}
              </Link>
            ) : (
              <a href={target} target="_blank" rel="noreferrer noopener" {...props}>
                {children}
              </a>
            );
          },

          table({ children, ...props }) {
            return (
              <div className="table-scroll">
                <table {...props}>{children}</table>
              </div>
            );
          },

          // Markdown wraps a lone image in a paragraph; the extra block would
          // add margins around what should read as a full-width figure.
          img({ src, alt, ...props }) {
            if (typeof src !== "string") return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt ?? ""}
                loading="lazy"
                decoding="async"
                {...props}
              />
            );
          },
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
