# Database setup

One-time, in this order.

## 1. Create the schema

Open the Supabase project → **SQL Editor** → **New query**. Paste the whole of
[`schema.sql`](./schema.sql) and run it.

It creates the tables, the enums, the row level security policies, and two
functions (`is_admin`, `claim_admin`). It is safe to run more than once — every
object is created conditionally, and it never drops content.

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

Either route loads the same thing: 8 pages, 69 sections, 12 packages, 39 menu
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
