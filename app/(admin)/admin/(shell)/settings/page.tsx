import {
  adminButton,
  Field,
  Input,
  Notice,
  PageHeader,
  Panel,
  PanelTitle,
  Textarea,
} from "@/components/admin/ui";
import { getSettings } from "@/lib/admin/data";
import { site as fileSite, primaryCta as filePrimaryCta } from "@/content/site";
import { saveSettings } from "../../actions";

export const metadata = { title: "Site details" };
export const dynamic = "force-dynamic";

export default async function SettingsScreen({
  searchParams,
}: PageProps<"/admin/settings">) {
  const { saved, error } = await searchParams;
  const s = await getSettings();

  // Falls back to the approved values so the form is never blank on a database
  // that has not been seeded yet.
  const v = {
    name: s?.name ?? fileSite.name,
    short_name: s?.short_name ?? fileSite.shortName,
    url: s?.url ?? fileSite.url,
    email: s?.email ?? fileSite.email,
    phone: s?.phone ?? fileSite.phone,
    phone_href: s?.phone_href ?? fileSite.phoneHref,
    locality: s?.locality ?? fileSite.locality,
    region: s?.region ?? fileSite.region,
    positioning: s?.positioning ?? fileSite.positioning,
    footer_blurb: s?.footer_blurb ?? fileSite.footerBlurb,
    primary_cta_label: s?.primary_cta_label ?? filePrimaryCta.label,
    primary_cta_href: s?.primary_cta_href ?? filePrimaryCta.href,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Site details"
        description="Contact details, the footer blurb, and the button that appears in the header on every page."
      />

      {saved ? <Notice tone="success">Site details saved.</Notice> : null}
      {error ? <Notice tone="error">{String(error)}</Notice> : null}

      <form action={saveSettings} className="flex flex-col gap-6">
        <Panel>
          <PanelTitle>Business</PanelTitle>
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Business name">
                <Input name="name" defaultValue={v.name} />
              </Field>
              <Field label="Short name" hint="Used where the full name will not fit.">
                <Input name="short_name" defaultValue={v.short_name} />
              </Field>
            </div>

            <Field
              label="Website address"
              hint="Used for canonical links and the sitemap. Include https://."
            >
              <Input name="url" defaultValue={v.url} />
            </Field>
          </div>
        </Panel>

        <Panel>
          <PanelTitle hint="Shown in the footer and on the contact page.">
            Contact
          </PanelTitle>
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <Input name="email" type="email" defaultValue={v.email} />
              </Field>
              <Field label="Phone, as displayed">
                <Input name="phone" defaultValue={v.phone} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Phone, as dialled"
                hint="What tapping the number calls. Format: tel:+12819890468"
              >
                <Input name="phone_href" defaultValue={v.phone_href} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City">
                  <Input name="locality" defaultValue={v.locality} />
                </Field>
                <Field label="State">
                  <Input name="region" defaultValue={v.region} />
                </Field>
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelTitle hint="Wording approved in the Master Brief. Worth keeping consistent wherever it appears.">
            Positioning
          </PanelTitle>
          <div className="flex flex-col gap-4">
            <Field
              label="Positioning statement"
              hint="Used in structured data, so search engines read it as the description of the business."
            >
              <Textarea name="positioning" rows={4} defaultValue={v.positioning} />
            </Field>
            <Field label="Footer blurb" hint="The short paragraph under the logo in the footer.">
              <Textarea name="footer_blurb" rows={3} defaultValue={v.footer_blurb} />
            </Field>
          </div>
        </Panel>

        <Panel>
          <PanelTitle hint="The button in the top right of every page.">
            Header button
          </PanelTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button text">
              <Input name="primary_cta_label" defaultValue={v.primary_cta_label} />
            </Field>
            <Field label="Button links to">
              <Input name="primary_cta_href" defaultValue={v.primary_cta_href} />
            </Field>
          </div>
        </Panel>

        <button type="submit" className={adminButton.primary + " self-start"}>
          Save site details
        </button>
      </form>
    </div>
  );
}
