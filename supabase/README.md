# Database setup

## A brand new project — two files

1. **Structure.** SQL Editor → New query → paste all of
   [`setup.sql`](./setup.sql) → Run.
2. **Content.** New query → paste all of [`seed.sql`](./seed.sql) → Run.

Then create an account (step 2 below) and sign in. That is the whole thing.

`setup.sql` is generated from `schema.sql` plus every migration, so it is always
the current structure in one paste. Regenerate it after changing either:

```bash
npm run sql:bundle      # rebuilds setup.sql
npm run seed:generate   # rebuilds seed.sql from content/
```

## An existing project — run the pieces

Use these when the database already has content you do not want to disturb.
Each is safe to run more than once.

| File | Adds |
| --- | --- |
| [`schema.sql`](./schema.sql) | Tables, enums, row level security, `is_admin`, `claim_admin` |
| [`migrations/002_posts.sql`](./migrations/002_posts.sql) | Articles for the Resources hub, plus the "Latest articles" block type |
| [`migrations/003_media.sql`](./migrations/003_media.sql) | Image uploads — the Storage bucket, its access rules, and the image catalogue |
| [`migrations/004_link_stack.sql`](./migrations/004_link_stack.sql) | The "Link hub" block type, for the link-in-bio page |
| [`migrations/005_reporting_block.sql`](./migrations/005_reporting_block.sql) | The "Monthly Recap" block type, Build Spec §12 |
| [`migrations/006_industry_grid.sql`](./migrations/006_industry_grid.sql) | The bucketed "Industries" block type, Page Spec 01 §5 |

### One-off installers

| File | When |
| --- | --- |
| [`add-link-hub.sql`](./add-link-hub.sql) | Adds the `/links` page to a database seeded before the link hub existed. Run **after** `004`, in a separate run — Postgres will not use a new enum value in the transaction that added it. |
| [`apply-page-spec-01.sql`](./apply-page-spec-01.sql) | Rebuilds the homepage to the ten sections of Page Spec 01, in its order. Run **after** `005` and `006`, each in its own run. Replaces the homepage sections wholesale; touches nothing else. |
| [`apply-page-meta.sql`](./apply-page-meta.sql) | Updates every page title and meta description to the §14 lengths. Sections untouched, so it cannot disturb admin edits. |

## 2. Create the first admin account

Supabase dashboard → **Authentication** → **Users** → **Add user**.

Use "Create new user" with an email and password, and tick **Auto Confirm User**
so no confirmation email is needed.

## 3. Sign in and claim ownership

Go to `/admin/login` and sign in with that account. The first account to sign in
calls `claim_admin()` and becomes the owner. Every account after that can sign in
but sees nothing until an owner adds a row to `public.admins` for them:

```sql
insert into public.admins (user_id, email, role)
select id, email, 'editor' from auth.users where email = 'someone@example.com';
```

## 4. Import the launch content

Either route loads the same thing: 8 pages, 70 sections, 12 packages, 39 menu
items, the site details, and the three known legacy redirects.

**From the admin** — `/admin` offers an **Import launch content** button while
the database is empty.

**From the SQL editor** — paste [`seed.sql`](./seed.sql) and run it. This one
works before any account exists, which makes it the way out if the login is
giving you trouble. Regenerate it after changing anything in `content/`:

```bash
npm run seed:generate
```

Both are safe to re-run, and both are a **reset, not a merge**: pages are matched
on their address and their sections replaced wholesale. Re-running after the
client has started editing will overwrite their work.

After the import, `/admin` is the source of truth and the files in `content/`
become the fallback the site serves if the database is ever unreachable.

---

## What the environment needs

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

There is deliberately **no service role key**. Every admin write runs as the
signed-in user and is bounded by row level security, so a leaked key from the
browser bundle cannot be used to edit the site.

## What the publishable key can do

| Role | Read | Write |
| --- | --- | --- |
| Anonymous visitor | Published pages, visible sections, visible packages, navigation, site details | Insert a lead — nothing else |
| Signed in, not in `admins` | Same as anonymous | Nothing |
| Signed in, in `admins` | Everything, including drafts and enquiries | Everything |

Leads have no public read policy at all, so a submitted enquiry cannot be read
back with the browser key.
