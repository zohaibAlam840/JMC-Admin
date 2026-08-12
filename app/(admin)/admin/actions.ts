"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { adminClient, requireAdmin } from "@/lib/admin/guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { tags } from "@/lib/supabase/rest";
import { getSectionSchema } from "@/lib/section-schema";
import { filePages, servicePageSlugs, systemPageSlugs } from "@/content/pages";
import { packages as filePackages } from "@/content/packages";
import {
  footerNav as fileFooterNav,
  mainNav as fileMainNav,
  primaryCta as filePrimaryCta,
  site as fileSite,
} from "@/content/site";

/**
 * Every admin write.
 *
 * A "use server" module may only export async functions, so shared helpers here
 * stay module-private. Each action re-checks the caller against the `admins`
 * table — a Server Action is a public HTTP endpoint, and the proxy check is not
 * a substitute for authorising the write itself.
 */

export type ActionResult = { ok: boolean; message?: string };

/* --------------------------------------------------------------- helpers -- */

/**
 * Drops the cached copies of whatever just changed. `updateTag` expires
 * immediately rather than serving stale content, which is what an editor
 * expects after pressing Save.
 */
function bust(...names: string[]) {
  for (const name of names) updateTag(name);
}

/**
 * Turns a write into a pass/fail answer.
 *
 * PostgREST returns 204 with no error both when a write succeeds and when row
 * level security filtered every row out of it, so an update issued without
 * `.select()` cannot tell "saved" from "silently refused" — it reports success
 * either way and the edit vanishes. Every write below therefore asks for the
 * affected ids back, and this checks that at least one came.
 */
function writeFailure(result: {
  data: unknown[] | null;
  error: { message: string } | null;
}): string | null {
  if (result.error) return result.error.message;
  if (!result.data || result.data.length === 0) {
    return (
      "Nothing was saved — the database refused the change. This normally " +
      "means your account is not in the admins table. Sign out and back in, " +
      "and if it keeps happening check that table in Supabase."
    );
  }
  return null;
}

function slugify(input: string): string {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/\/+/g, "/");
  if (!cleaned || cleaned === "/") return "/";
  return `/${cleaned.replace(/^\/|\/$/g, "")}`;
}

/** Section anchors end up in URLs (#includes), so they get the same treatment. */
function keyify(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "section"
  );
}

function text(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function bool(form: FormData, key: string): boolean {
  return form.get(key) === "on" || form.get(key) === "true";
}

function lines(form: FormData, key: string): string[] {
  return text(form, key)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ auth -- */

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/**
 * Called once from the login screen. Claims owner for the first account to
 * sign in; a no-op for everyone after that, enforced in Postgres.
 */
export async function claimFirstAdmin(): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("claim_admin");
  if (error) return { ok: false, message: error.message };
  return { ok: Boolean(data) };
}

/* ----------------------------------------------------------------- pages -- */

export async function createPage(form: FormData): Promise<void> {
  const supabase = await adminClient();

  const label = text(form, "label") || "Untitled page";
  const slug = slugify(text(form, "slug") || label);

  const { data, error } = await supabase
    .from("pages")
    .insert({
      slug,
      label,
      seo_title: text(form, "seo_title") || label,
      meta_description: text(form, "meta_description"),
      published: false,
      is_service: bool(form, "is_service"),
      position: 999,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/admin/pages?error=${encodeURIComponent(error?.message ?? "Could not create the page.")}`);
  }

  // A page with no sections renders as a blank white screen, which reads as a
  // bug. New pages start with a hero and a closing CTA.
  const hero = getSectionSchema("heroCentered");
  const cta = getSectionSchema("finalCta");
  await supabase.from("sections").insert([
    { page_id: data.id, key: "hero", type: "heroCentered", data: hero?.defaults ?? {}, position: 0 },
    { page_id: data.id, key: "final-cta", type: "finalCta", data: cta?.defaults ?? {}, position: 1 },
  ]);

  bust(tags.pages);
  redirect(`/admin/pages/${data.id}`);
}

export async function updatePage(form: FormData): Promise<void> {
  const supabase = await adminClient();
  const id = text(form, "id");
  const previousSlug = text(form, "previous_slug");
  const isSystem = bool(form, "system");

  const patch: Record<string, unknown> = {
    label: text(form, "label"),
    seo_title: text(form, "seo_title"),
    meta_description: text(form, "meta_description"),
    is_service: bool(form, "is_service"),
    published: bool(form, "published"),
  };

  // A system page's route is hand-built, so changing its slug would 404 it.
  if (!isSystem) patch.slug = slugify(text(form, "slug"));

  const failure = writeFailure(
    await supabase.from("pages").update(patch).eq("id", id).select("id")
  );

  if (failure) {
    redirect(`/admin/pages/${id}?error=${encodeURIComponent(failure)}`);
  }

  bust(tags.pages, tags.page(previousSlug));
  if (typeof patch.slug === "string") bust(tags.page(patch.slug));
  revalidatePath("/", "layout");

  redirect(`/admin/pages/${id}?saved=1`);
}

export async function deletePage(form: FormData): Promise<void> {
  const supabase = await adminClient();
  const id = text(form, "id");
  const slug = text(form, "slug");

  // Sections cascade with the page.
  await supabase.from("pages").delete().eq("id", id).eq("system", false);

  bust(tags.pages, tags.page(slug));
  revalidatePath("/", "layout");
  redirect("/admin/pages");
}

/* -------------------------------------------------------------- sections -- */

export async function addSection(form: FormData): Promise<void> {
  const supabase = await adminClient();
  const pageId = text(form, "page_id");
  const slug = text(form, "slug");
  const type = text(form, "type");

  const schema = getSectionSchema(type);
  if (!schema) redirect(`/admin/pages/${pageId}?error=Unknown+section+type`);

  const { data: existing } = await supabase
    .from("sections")
    .select("key,position")
    .eq("page_id", pageId);

  const used = new Set((existing ?? []).map((s) => s.key));
  let key = keyify(schema.label);
  let n = 2;
  while (used.has(key)) key = `${keyify(schema.label)}-${n++}`;

  const position = (existing ?? []).reduce((max, s) => Math.max(max, s.position), -1) + 1;

  const { data, error } = await supabase
    .from("sections")
    .insert({
      page_id: pageId,
      key,
      type,
      tone: schema.supportsTone ? "white" : null,
      data: schema.defaults,
      position,
    })
    .select("id")
    .single();

  bust(tags.pages, tags.page(slug));
  redirect(
    error || !data
      ? `/admin/pages/${pageId}?error=${encodeURIComponent(error?.message ?? "Could not add the section.")}`
      : `/admin/pages/${pageId}?section=${data.id}`
  );
}

/**
 * Saves one section.
 *
 * `data` arrives as a plain object from the editor rather than as FormData —
 * sections nest (cards inside a grid, stats inside a showcase card) and
 * flattening that into form fields loses the structure. The type and the page
 * are not editable here, so a malformed payload can only damage the section
 * being edited.
 */
export async function saveSection(payload: {
  id: string;
  pageSlug: string;
  key: string;
  tone: "white" | "surface" | null;
  data: Record<string, unknown>;
}): Promise<ActionResult> {
  const supabase = await adminClient();

  const failure = writeFailure(
    await supabase
      .from("sections")
      .update({
        key: keyify(payload.key),
        tone: payload.tone,
        data: payload.data,
      })
      .eq("id", payload.id)
      .select("id")
  );

  if (failure) return { ok: false, message: failure };

  bust(tags.pages, tags.page(payload.pageSlug));
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteSection(form: FormData): Promise<void> {
  const supabase = await adminClient();
  const pageId = text(form, "page_id");
  await supabase.from("sections").delete().eq("id", text(form, "id"));

  bust(tags.pages, tags.page(text(form, "slug")));
  revalidatePath("/", "layout");
  redirect(`/admin/pages/${pageId}`);
}

export async function setSectionVisible(form: FormData): Promise<void> {
  const supabase = await adminClient();
  const pageId = text(form, "page_id");

  const failure = writeFailure(
    await supabase
      .from("sections")
      .update({ visible: bool(form, "visible") })
      .eq("id", text(form, "id"))
      .select("id")
  );

  if (failure) {
    redirect(`/admin/pages/${pageId}?error=${encodeURIComponent(failure)}`);
  }

  bust(tags.pages, tags.page(text(form, "slug")));
  revalidatePath("/", "layout");
  redirect(`/admin/pages/${pageId}`);
}

export async function moveSection(form: FormData): Promise<void> {
  const supabase = await adminClient();
  const pageId = text(form, "page_id");
  const id = text(form, "id");
  const direction = text(form, "direction");

  const { data: rows } = await supabase
    .from("sections")
    .select("id,position")
    .eq("page_id", pageId)
    .order("position", { ascending: true });

  if (rows) {
    const index = rows.findIndex((r) => r.id === id);
    const target = direction === "up" ? index - 1 : index + 1;

    if (index >= 0 && target >= 0 && target < rows.length) {
      // Rewrite the whole run rather than swapping two values: positions seeded
      // from a previous ordering can contain duplicates, and a swap would then
      // silently do nothing.
      const reordered = [...rows];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

      await Promise.all(
        reordered.map((row, i) =>
          supabase.from("sections").update({ position: i }).eq("id", row.id)
        )
      );
    }
  }

  bust(tags.pages, tags.page(text(form, "slug")));
  revalidatePath("/", "layout");
  redirect(`/admin/pages/${pageId}`);
}

/* -------------------------------------------------------------- packages -- */

export async function savePackage(form: FormData): Promise<void> {
  const supabase = await adminClient();
  const id = text(form, "id");

  const row: Record<string, unknown> = {
    id,
    group_key: text(form, "group_key"),
    name: text(form, "name"),
    price: text(form, "price"),
    price_unit: text(form, "price_unit") || null,
    onboarding_fee: text(form, "onboarding_fee") || null,
    timeline: text(form, "timeline") || null,
    best_fit: text(form, "best_fit"),
    deliverables: lines(form, "deliverables"),
    cta_label: text(form, "cta_label"),
    cta_href: text(form, "cta_href") || "/contact",
    featured: bool(form, "featured"),
    visible: bool(form, "visible"),
    pricing_pending: bool(form, "pricing_pending"),
    position: Number(text(form, "position") || 0),
  };

  const failure = writeFailure(
    await supabase.from("packages").upsert(row).select("id")
  );

  if (failure) {
    redirect(`/admin/packages?error=${encodeURIComponent(failure)}`);
  }

  bust(tags.packages);
  revalidatePath("/", "layout");
  redirect(`/admin/packages?saved=${encodeURIComponent(id)}`);
}

export async function deletePackage(form: FormData): Promise<void> {
  const supabase = await adminClient();
  await supabase.from("packages").delete().eq("id", text(form, "id"));
  bust(tags.packages);
  revalidatePath("/", "layout");
  redirect("/admin/packages");
}

/* ------------------------------------------------------------ navigation -- */

export async function saveNavItem(form: FormData): Promise<void> {
  const supabase = await adminClient();
  const id = text(form, "id");

  const row = {
    location: text(form, "location") || "main",
    parent_id: text(form, "parent_id") || null,
    label: text(form, "label"),
    href: text(form, "href"),
    position: Number(text(form, "position") || 0),
  };

  const failure = writeFailure(
    id
      ? await supabase.from("nav_items").update(row).eq("id", id).select("id")
      : await supabase.from("nav_items").insert(row).select("id")
  );

  if (failure) {
    redirect(`/admin/navigation?error=${encodeURIComponent(failure)}`);
  }

  bust(tags.nav);
  revalidatePath("/", "layout");
  redirect("/admin/navigation?saved=1");
}

export async function deleteNavItem(form: FormData): Promise<void> {
  const supabase = await adminClient();
  // Children cascade — deleting "SEO Services" takes its dropdown with it.
  await supabase.from("nav_items").delete().eq("id", text(form, "id"));
  bust(tags.nav);
  revalidatePath("/", "layout");
  redirect("/admin/navigation");
}

/* -------------------------------------------------------------- settings -- */

export async function saveSettings(form: FormData): Promise<void> {
  const supabase = await adminClient();

  const failure = writeFailure(
    await supabase.from("site_settings").upsert({
    id: true,
    name: text(form, "name"),
    short_name: text(form, "short_name"),
    url: text(form, "url"),
    email: text(form, "email"),
    phone: text(form, "phone"),
    phone_href: text(form, "phone_href"),
    locality: text(form, "locality"),
    region: text(form, "region"),
    positioning: text(form, "positioning"),
    footer_blurb: text(form, "footer_blurb"),
    primary_cta_label: text(form, "primary_cta_label"),
    primary_cta_href: text(form, "primary_cta_href") || "/contact",
    }).select("id")
  );

  if (failure) {
    redirect(`/admin/settings?error=${encodeURIComponent(failure)}`);
  }

  bust(tags.settings);
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

/* ------------------------------------------------------------- redirects -- */

export async function saveRedirect(form: FormData): Promise<void> {
  const supabase = await adminClient();

  const failure = writeFailure(
    await supabase
      .from("redirects")
      .upsert(
        {
          source: slugify(text(form, "source")),
          destination: text(form, "destination"),
          permanent: bool(form, "permanent"),
        },
        { onConflict: "source" }
      )
      .select("id")
  );

  redirect(
    failure
      ? `/admin/redirects?error=${encodeURIComponent(failure)}`
      : "/admin/redirects?saved=1"
  );
}

export async function deleteRedirect(form: FormData): Promise<void> {
  const supabase = await adminClient();
  await supabase.from("redirects").delete().eq("id", text(form, "id"));
  redirect("/admin/redirects");
}

/* -------------------------------------------------------------- articles -- */

export async function createPost(form: FormData): Promise<void> {
  const supabase = await adminClient();

  const title = text(form, "title") || "Untitled article";
  // Slugs are permanent-ish — a published article's address should not move —
  // so it is derived once here and then only changed deliberately.
  const slug = keyify(text(form, "slug") || title);

  const { data, error } = await supabase
    .from("posts")
    .insert({
      slug,
      title,
      author: text(form, "author"),
      category: text(form, "category"),
      published: false,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(
      `/admin/articles?error=${encodeURIComponent(
        error?.code === "23505"
          ? "An article already uses that address. Pick a different one."
          : (error?.message ?? "Could not create the article.")
      )}`
    );
  }

  bust(tags.posts);
  redirect(`/admin/articles/${data.id}`);
}

export async function savePost(form: FormData): Promise<void> {
  const supabase = await adminClient();
  const id = text(form, "id");
  const previousSlug = text(form, "previous_slug");
  const slug = keyify(text(form, "slug"));

  const publishedAt = text(form, "published_at");

  const patch = {
    slug,
    title: text(form, "title"),
    excerpt: text(form, "excerpt"),
    body: (form.get("body") as string | null) ?? "",
    category: text(form, "category"),
    tags: text(form, "tags")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    author: text(form, "author"),
    cover_image_url: text(form, "cover_image_url") || null,
    cover_image_alt: text(form, "cover_image_alt") || null,
    seo_title: text(form, "seo_title"),
    meta_description: text(form, "meta_description"),
    published: bool(form, "published"),
    // Blank hands the date back to the database trigger, which stamps it the
    // first time the article goes live.
    ...(publishedAt ? { published_at: new Date(publishedAt).toISOString() } : {}),
  };

  const { data, error } = await supabase
    .from("posts")
    .update(patch)
    .eq("id", id)
    .select("id");

  const failure =
    error?.code === "23505"
      ? "Another article already uses that address. Pick a different one."
      : writeFailure({ data, error });

  if (failure) {
    redirect(`/admin/articles/${id}?error=${encodeURIComponent(failure)}`);
  }

  bust(tags.posts, tags.post(previousSlug), tags.post(slug));
  revalidatePath("/", "layout");
  redirect(`/admin/articles/${id}?saved=1`);
}

export async function deletePost(form: FormData): Promise<void> {
  const supabase = await adminClient();
  const slug = text(form, "slug");

  await supabase.from("posts").delete().eq("id", text(form, "id"));

  bust(tags.posts, tags.post(slug));
  revalidatePath("/", "layout");
  redirect("/admin/articles");
}

/* ----------------------------------------------------------------- media -- */

/**
 * Files are uploaded straight from the browser to Supabase Storage — routing
 * megabytes through a Server Action would be slower and would hit the body
 * size limit. This records the result afterwards so the media library has
 * something to list, and so alt text written once is offered again on reuse.
 */
export async function recordUpload(file: {
  path: string;
  url: string;
  alt: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
}): Promise<ActionResult> {
  const supabase = await adminClient();

  const { error } = await supabase.from("media").upsert(
    {
      path: file.path,
      url: file.url,
      alt: file.alt,
      file_name: file.fileName,
      mime_type: file.mimeType,
      size_bytes: file.sizeBytes,
      width: file.width,
      height: file.height,
    },
    { onConflict: "path" }
  );

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function updateMediaAlt(form: FormData): Promise<void> {
  const supabase = await adminClient();
  await supabase
    .from("media")
    .update({ alt: text(form, "alt") })
    .eq("id", text(form, "id"));
  redirect("/admin/media?saved=1");
}

export async function deleteMedia(form: FormData): Promise<void> {
  const supabase = await adminClient();
  const path = text(form, "path");

  // Storage first. If the row went first and this failed, the file would be
  // orphaned in the bucket with nothing left pointing at it.
  const { error } = await supabase.storage.from("media").remove([path]);
  if (error) {
    redirect(`/admin/media?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("media").delete().eq("id", text(form, "id"));
  redirect("/admin/media");
}

/* ----------------------------------------------------------------- leads -- */

export async function setLeadStatus(form: FormData): Promise<void> {
  const supabase = await adminClient();
  await supabase
    .from("leads")
    .update({ status: text(form, "status") })
    .eq("id", text(form, "id"));
  redirect("/admin/leads");
}

export async function deleteLead(form: FormData): Promise<void> {
  const supabase = await adminClient();
  await supabase.from("leads").delete().eq("id", text(form, "id"));
  redirect("/admin/leads");
}

/* ------------------------------------------------------------------ seed -- */

/**
 * Copies the approved launch content out of content/ and into Postgres.
 *
 * Written to be safe to run twice: pages are matched on slug and their sections
 * are replaced wholesale, packages and nav are upserted. It will overwrite
 * edits made in /admin for the pages it touches, which is why the setup screen
 * asks for confirmation and reports what already exists.
 */
export async function seedFromCode(): Promise<void> {
  const supabase = await adminClient();

  /* pages + sections */
  for (const [index, page] of filePages.entries()) {
    const { data: row, error } = await supabase
      .from("pages")
      .upsert(
        {
          slug: page.slug,
          label: page.label,
          seo_title: page.seoTitle,
          meta_description: page.metaDescription,
          published: true,
          is_service: servicePageSlugs.has(page.slug),
          system: systemPageSlugs.has(page.slug),
          position: index,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (error || !row) continue;

    await supabase.from("sections").delete().eq("page_id", row.id);

    await supabase.from("sections").insert(
      page.sections.map((section, position) => {
        const { id, type, tone, ...data } = section as typeof section & {
          tone?: "white" | "surface";
        };
        return {
          page_id: row.id,
          key: id,
          type,
          tone: tone ?? null,
          data,
          position,
        };
      })
    );
  }

  /* packages */
  await supabase.from("packages").upsert(
    filePackages.map((pkg, position) => ({
      id: pkg.id,
      group_key: pkg.group,
      name: pkg.name,
      price: pkg.price,
      price_unit: pkg.priceUnit ?? null,
      onboarding_fee: pkg.onboardingFee ?? null,
      timeline: pkg.timeline ?? null,
      best_fit: pkg.bestFit,
      deliverables: pkg.deliverables,
      cta_label: pkg.cta.label,
      cta_href: pkg.cta.href,
      featured: pkg.featured ?? false,
      visible: pkg.visible !== false,
      pricing_pending: pkg.pricingPending ?? false,
      position,
    }))
  );

  /* navigation — rebuilt rather than merged, so ordering stays exact */
  await supabase.from("nav_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  for (const [i, item] of fileMainNav.entries()) {
    const { data: parent } = await supabase
      .from("nav_items")
      .insert({ location: "main", label: item.label, href: item.href, position: i })
      .select("id")
      .single();

    if (parent && item.children?.length) {
      await supabase.from("nav_items").insert(
        item.children.map((child, ci) => ({
          location: "main",
          parent_id: parent.id,
          label: child.label,
          href: child.href,
          position: ci,
        }))
      );
    }
  }

  for (const [i, group] of fileFooterNav.entries()) {
    const { data: parent } = await supabase
      .from("nav_items")
      .insert({ location: "footer", label: group.heading, href: "", position: i })
      .select("id")
      .single();

    if (parent) {
      await supabase.from("nav_items").insert(
        group.links.map((link, li) => ({
          location: "footer",
          parent_id: parent.id,
          label: link.label,
          href: link.href,
          position: li,
        }))
      );
    }
  }

  /* settings */
  await supabase.from("site_settings").upsert({
    id: true,
    name: fileSite.name,
    short_name: fileSite.shortName,
    url: fileSite.url,
    email: fileSite.email,
    phone: fileSite.phone,
    phone_href: fileSite.phoneHref,
    locality: fileSite.locality,
    region: fileSite.region,
    positioning: fileSite.positioning,
    footer_blurb: fileSite.footerBlurb,
    primary_cta_label: filePrimaryCta.label,
    primary_cta_href: filePrimaryCta.href,
  });

  await requireAdmin();
  bust(tags.pages, tags.packages, tags.nav, tags.settings);
  revalidatePath("/", "layout");
  redirect("/admin?seeded=1");
}
