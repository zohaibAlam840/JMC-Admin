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
  Select,
  Textarea,
} from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { listPackages, type AdminPackage } from "@/lib/admin/data";
import { deletePackage, savePackage } from "../../actions";

export const metadata = { title: "Packages & pricing" };
export const dynamic = "force-dynamic";

const GROUPS = [
  { value: "local", label: "Local SEO" },
  { value: "traditional", label: "Traditional SEO" },
  { value: "realEstate", label: "Real Estate SEO" },
  { value: "sprint", label: "Launch Sprint" },
];

export default async function PackagesScreen({
  searchParams,
}: PageProps<"/admin/packages">) {
  const { saved, error } = await searchParams;
  const packages = await listPackages();

  const pending = packages.filter((p) => p.pricing_pending);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Packages & pricing"
        description="Prices live here once and are pulled into every page that shows them. Editing a price updates the whole site."
      />

      {saved ? <Notice tone="success">Saved “{String(saved)}”.</Notice> : null}
      {error ? <Notice tone="error">{String(error)}</Notice> : null}

      {pending.length > 0 ? (
        <Notice tone="warning">
          {pending.length === 1 ? "One package has" : `${pending.length} packages have`}{" "}
          no real price yet and currently reads “Contact for pricing” on the
          site: {pending.map((p) => p.name).join(", ")}. Set a price and untick
          “Pricing not set yet” to publish it.
        </Notice>
      ) : null}

      {packages.length === 0 ? (
        <EmptyState title="No packages yet">
          Import the launch content from the Overview screen to load the
          approved pricing.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}

      <Panel>
        <PanelTitle hint="Add a tier that does not exist yet. The reference is a permanent internal id — lowercase, no spaces — and cannot be changed later.">
          Add a package
        </PanelTitle>
        <PackageForm />
      </Panel>
    </div>
  );
}

function PackageCard({ pkg }: { pkg: AdminPackage }) {
  return (
    <details className="rounded-card border border-line bg-white shadow-soft">
      <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-2 px-5 py-4">
        <span className="font-display text-[1.05rem] uppercase leading-none text-ink-strong">
          {pkg.name}
        </span>
        <span className="text-[0.85rem] font-semibold text-ink-strong">
          {pkg.price}
          {pkg.price_unit ? (
            <span className="font-normal text-subtle"> {pkg.price_unit}</span>
          ) : null}
        </span>
        <span className="flex flex-1 flex-wrap items-center justify-end gap-1.5">
          {pkg.featured ? <Pill tone="live">Most chosen</Pill> : null}
          {pkg.pricing_pending ? <Pill tone="draft">Pricing not set</Pill> : null}
          {pkg.visible ? null : <Pill tone="hidden">Hidden</Pill>}
        </span>
      </summary>

      <div className="flex flex-col gap-4 border-t border-line p-5">
        <PackageForm pkg={pkg} />

        {/* Sibling rather than a button inside the form above — forms cannot
            nest, and this posts to a different action. */}
        <form action={deletePackage} className="border-t border-line pt-4">
          <input type="hidden" name="id" value={pkg.id} />
          <ConfirmButton
            className={adminButton.danger}
            message={`Delete "${pkg.name}"? Any pricing section pointing at it will simply stop showing it.`}
          >
            Delete this package
          </ConfirmButton>
        </form>
      </div>
    </details>
  );
}

function PackageForm({ pkg }: { pkg?: AdminPackage }) {
  return (
    <form action={savePackage} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Reference"
          hint={pkg ? "Fixed — pages point at this." : "Lowercase, hyphenated. Cannot be changed later."}
        >
          <Input
            name="id"
            defaultValue={pkg?.id}
            readOnly={Boolean(pkg)}
            required
            placeholder="local-neighborhood"
          />
        </Field>

        <Field label="Group">
          <Select name="group_key" defaultValue={pkg?.group_key ?? "local"}>
            {GROUPS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Name">
        <Input name="name" defaultValue={pkg?.name} required placeholder="Neighborhood" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price" hint="Written exactly as it should appear — “$875” or “Contact for pricing”.">
          <Input name="price" defaultValue={pkg?.price} required />
        </Field>
        <Field label="Price unit" hint="“/month” or “one-time”. Leave blank for none.">
          <Input name="price_unit" defaultValue={pkg?.price_unit ?? ""} />
        </Field>
      </div>

      <Field
        label="Positioning line"
        hint="A short line under the name, e.g. “Local Foundation”. It is what makes three tiers read as an arc rather than as three prices."
      >
        <Input name="positioning" defaultValue={pkg?.positioning ?? ""} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Onboarding fee" hint="Monthly packages only. e.g. “$349 one-time”.">
          <Input name="onboarding_fee" defaultValue={pkg?.onboarding_fee ?? ""} />
        </Field>
        <Field label="Sprint window" hint="Sprints only. e.g. “30 days”.">
          <Input name="timeline" defaultValue={pkg?.timeline ?? ""} />
        </Field>
      </div>

      <Field
        label="Term"
        hint="Monthly packages only. Keep the second half — “12-month term, then month to month” is a much easier thing to accept than the first half alone, and it is true."
      >
        <Input name="term" defaultValue={pkg?.term ?? ""} />
      </Field>

      <Field label="Who it is for" hint="One or two sentences. Shown under the price.">
        <Textarea name="best_fit" defaultValue={pkg?.best_fit} rows={3} />
      </Field>

      <Field label="What is included" hint="One item per line.">
        <Textarea
          name="deliverables"
          rows={8}
          defaultValue={(pkg?.deliverables ?? []).join("\n")}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Button text">
          <Input
            name="cta_label"
            defaultValue={pkg?.cta_label ?? "Request a Visibility Review"}
          />
        </Field>
        <Field label="Button links to">
          <Input name="cta_href" defaultValue={pkg?.cta_href ?? "/contact"} />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Checkbox
          name="visible"
          label="Show on the site"
          hint="Unticking hides this tier everywhere without deleting it."
          defaultChecked={pkg ? pkg.visible : true}
        />
        <Checkbox
          name="featured"
          label="Highlight as “Most chosen”"
          hint="One per group. More than one and the row loses its emphasis."
          defaultChecked={pkg?.featured ?? false}
        />
        <Checkbox
          name="pricing_pending"
          label="Pricing not set yet"
          hint="Shows the price smaller, for a “Contact for pricing” placeholder."
          defaultChecked={pkg?.pricing_pending ?? false}
        />
        <Field label="Order" hint="Lower numbers come first within a group.">
          <Input
            name="position"
            type="number"
            defaultValue={pkg?.position ?? 100}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={adminButton.primary}>
          {pkg ? "Save package" : "Add package"}
        </button>
      </div>
    </form>
  );
}
