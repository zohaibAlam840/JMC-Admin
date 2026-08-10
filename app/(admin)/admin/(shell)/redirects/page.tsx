import {
  adminButton,
  Checkbox,
  EmptyState,
  Field,
  Input,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Pill,
} from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { listRedirects } from "@/lib/admin/data";
import { deleteRedirect, saveRedirect } from "../../actions";

export const metadata = { title: "Redirects" };
export const dynamic = "force-dynamic";

export default async function RedirectsScreen({
  searchParams,
}: PageProps<"/admin/redirects">) {
  const { saved, error } = await searchParams;
  const redirects = await listRedirects();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Redirects"
        description="Send an old address to a new one. Use this whenever a page's address changes, so the ranking and any existing links follow it."
      />

      {saved ? <Notice tone="success">Redirect saved.</Notice> : null}
      {error ? <Notice tone="error">{String(error)}</Notice> : null}

      <Notice>
        Redirects take effect within five minutes of saving. Permanent tells
        search engines the move is final and passes the old page&rsquo;s ranking
        across — that is what you want in almost every case.
      </Notice>

      {redirects.length === 0 ? (
        <EmptyState title="No redirects yet">
          Add one whenever an address changes, or when you find an old URL from
          the previous site that now returns a 404.
        </EmptyState>
      ) : (
        <Panel className="p-0">
          <ul className="divide-y divide-line">
            {redirects.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-3 text-[0.85rem]"
              >
                <code className="text-ink-strong">{r.source}</code>
                <span className="text-subtle">&rarr;</span>
                <code className="text-ink-strong">{r.destination}</code>
                <Pill tone={r.permanent ? "live" : "draft"}>
                  {r.permanent ? "Permanent" : "Temporary"}
                </Pill>
                <form action={deleteRedirect} className="ml-auto">
                  <input type="hidden" name="id" value={r.id} />
                  <ConfirmButton
                    className={adminButton.tiny}
                    message={`Remove the redirect from ${r.source}? That address will start returning a 404.`}
                  >
                    Remove
                  </ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel>
        <PanelTitle hint="Saving a source that already exists updates it rather than adding a duplicate.">
          Add a redirect
        </PanelTitle>

        <form action={saveRedirect} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Old address" hint="The path only — /old-page, not the full URL.">
              <Input name="source" required placeholder="/seo-packages-pricing" />
            </Field>
            <Field label="New address">
              <Input name="destination" required placeholder="/seo-packages" />
            </Field>
          </div>

          <Checkbox
            name="permanent"
            label="Permanent"
            hint="Leave ticked unless the move is genuinely temporary."
            defaultChecked
          />

          <button type="submit" className={adminButton.primary + " self-start"}>
            Add redirect
          </button>
        </form>
      </Panel>
    </div>
  );
}
