import {
  adminButton,
  EmptyState,
  Field,
  Input,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
} from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { listNavItems, type AdminNavItem } from "@/lib/admin/data";
import { deleteNavItem, saveNavItem } from "../../actions";

export const metadata = { title: "Navigation" };
export const dynamic = "force-dynamic";

/**
 * Menus.
 *
 * One table drives both. A top-level row in the header is a menu item, and its
 * children become its dropdown; a top-level row in the footer is a column
 * heading, and its children are that column's links.
 */
export default async function NavigationScreen({
  searchParams,
}: PageProps<"/admin/navigation">) {
  const { saved } = await searchParams;
  const items = await listNavItems();

  const groups = (location: "main" | "footer") => {
    const scoped = items
      .filter((i) => i.location === location)
      .sort((a, b) => a.position - b.position);
    return scoped
      .filter((i) => !i.parent_id)
      .map((parent) => ({
        parent,
        children: scoped.filter((i) => i.parent_id === parent.id),
      }));
  };

  const main = groups("main");
  const footer = groups("footer");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Navigation"
        description="The header menu and the footer columns. Changes appear on every page immediately."
      />

      {saved ? <Notice tone="success">Navigation saved.</Notice> : null}

      {items.length === 0 ? (
        <EmptyState title="No menu items yet">
          Import the launch content from the Overview screen to load the
          approved navigation.
        </EmptyState>
      ) : null}

      <NavSection
        title="Header menu"
        hint="Top-level items appear across the header. Anything nested under one becomes its dropdown."
        location="main"
        groups={main}
      />

      <NavSection
        title="Footer columns"
        hint="Top-level items here are column headings, so their address is ignored. The links under them are what visitors click."
        location="footer"
        groups={footer}
      />
    </div>
  );
}

function NavSection({
  title,
  hint,
  location,
  groups,
}: {
  title: string;
  hint: string;
  location: "main" | "footer";
  groups: { parent: AdminNavItem; children: AdminNavItem[] }[];
}) {
  return (
    <Panel>
      <PanelTitle hint={hint}>{title}</PanelTitle>

      <div className="flex flex-col gap-3">
        {groups.map(({ parent, children }) => (
          <div
            key={parent.id}
            className="rounded-[10px] border border-line bg-surface-2 p-3"
          >
            <NavItemForm item={parent} location={location} />

            {children.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-2 border-l-2 border-line pl-3">
                {children.map((child) => (
                  <li key={child.id}>
                    <NavItemForm item={child} location={location} parentId={parent.id} />
                  </li>
                ))}
              </ul>
            ) : null}

            <details className="mt-3 pl-3">
              <summary className="cursor-pointer text-[0.78rem] font-semibold text-subtle hover:text-ink-strong">
                Add a link under “{parent.label}”
              </summary>
              <div className="pt-2">
                <NavItemForm location={location} parentId={parent.id} />
              </div>
            </details>
          </div>
        ))}
      </div>

      <details className="mt-4 border-t border-line pt-4">
        <summary className="cursor-pointer text-[0.82rem] font-semibold text-ink-strong">
          {location === "main" ? "Add a top-level menu item" : "Add a footer column"}
        </summary>
        <div className="pt-3">
          <NavItemForm location={location} />
        </div>
      </details>
    </Panel>
  );
}

function NavItemForm({
  item,
  location,
  parentId,
}: {
  item?: AdminNavItem;
  location: "main" | "footer";
  parentId?: string;
}) {
  const isHeading = location === "footer" && !parentId && !item?.parent_id;

  return (
    <div className="flex flex-wrap items-end gap-2">
      <form
        action={saveNavItem}
        className="flex flex-1 flex-wrap items-end gap-2"
      >
        {item ? <input type="hidden" name="id" value={item.id} /> : null}
        <input type="hidden" name="location" value={location} />
        <input
          type="hidden"
          name="parent_id"
          value={parentId ?? item?.parent_id ?? ""}
        />

        <Field label="Label" className="min-w-[10rem] flex-1">
          <Input name="label" defaultValue={item?.label} required />
        </Field>

        {isHeading ? (
          <input type="hidden" name="href" value="" />
        ) : (
          <Field label="Links to" className="min-w-[12rem] flex-1">
            <Input name="href" defaultValue={item?.href} placeholder="/monthly-seo-packages" />
          </Field>
        )}

        <Field label="Order" className="w-20">
          <Input
            name="position"
            type="number"
            defaultValue={item?.position ?? 99}
          />
        </Field>

        <button type="submit" className={adminButton.secondary}>
          {item ? "Save" : "Add"}
        </button>
      </form>

      {item ? (
        <form action={deleteNavItem}>
          <input type="hidden" name="id" value={item.id} />
          <ConfirmButton
            className={adminButton.tiny + " h-[38px] px-3"}
            message={`Remove "${item.label}" from the menu? Anything nested under it is removed too.`}
          >
            Remove
          </ConfirmButton>
        </form>
      ) : null}
    </div>
  );
}
