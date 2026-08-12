# Jordan Marketing Consultants

Marketing site plus the admin the client edits it from. Next.js 16 (App Router,
Turbopack), Tailwind v4, Supabase.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

Database setup — schema, first admin account, importing the launch content — is
in [`supabase/README.md`](./supabase/README.md). Until that is done the site
serves the approved launch content straight from `content/`, so it works with no
database at all.

## How the site is put together

A page is **an ordered list of typed sections**, never HTML. That single decision
is what makes the page builder safe: the client picks a section type from a fixed
library and fills in its fields, so they can restructure a page without being
able to break the design.

```
lib/types.ts               the section union — the contract
lib/section-schema.ts      the same library described as data; generates the admin forms
components/blocks/         one renderer per section type
content/pages/*.ts         the approved launch content, and the fallback
lib/content.ts             reads Supabase, falls back to the files
```

Articles are the exception: they live in their own `posts` table because they
are one body of long-form writing, not a stack of layout sections. The body is
markdown, rendered to React elements by `react-markdown` — there is no
`dangerouslySetInnerHTML` on that path, so raw HTML inside a post is escaped
rather than executed.

Adding a section type is three edits: the union in `lib/types.ts`, a renderer in
`components/blocks/sections.tsx` (the switch has an exhaustiveness check, so a
missing renderer is a compile error), and an entry in `lib/section-schema.ts`.

## Routes

| Path | What it is |
| --- | --- |
| `app/(site)/page.tsx` | Home. Its content is the page with slug `/`. |
| `app/(site)/[...slug]/` | Every other content page, resolved from the database. |
| `app/(site)/resources/[slug]` | Articles. Takes precedence over the catch-all, so a page and an article can't collide. |
| `app/(site)/resources/feed.xml` | RSS for the Resources hub. |
| `app/(site)/contact`, `/thank-you` | Hand-built — they do more than render sections. |
| `app/(admin)/admin/` | The admin. Excluded in `robots.ts` and `noindex` in its layout. |

There is no route folder per marketing page on purpose: the client can create a
page in `/admin` and it has to work without a deploy.

## Security model

There is no service role key. Admin writes run as the signed-in user and are
bounded by row level security in Postgres, so the key in the browser bundle
cannot edit anything. `proxy.ts` gates `/admin` optimistically for the sake of a
clean redirect; `requireAdmin()` and RLS are what actually enforce it.

## Still open

- Copy on five pages is draft and needs Wendell's approval.
- Real Estate SEO pricing does not exist yet — those two packages ship flagged
  as "pricing not set" and read "Contact for pricing".
- Lead notification email (Resend) and GA4 / GTM.
- The full inventory of legacy URLs from the old site, for the redirect map.
