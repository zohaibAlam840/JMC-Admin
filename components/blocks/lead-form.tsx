"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { submitLead, type LeadState } from "@/app/actions/lead";
import { Input, Label, Textarea } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { LEAD_LIMITS } from "@/lib/leads/validation";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="group mt-2 w-full sm:w-auto"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          Sending&hellip;
        </>
      ) : (
        <>
          {label}
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
          />
        </>
      )}
    </Button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-[0.8rem] font-medium text-destructive">
      {message}
    </p>
  );
}

/**
 * The Visibility Review form — Page Spec 12 §2.
 *
 * Six visible fields and no more. The set is fixed by the spec rather than by
 * what would be convenient to have in the CRM: every extra field costs
 * completions, and this form is the site's only conversion path.
 *
 * Website URL is optional deliberately. A business with no site, or one
 * mid-rebuild, is still a lead, and requiring it would turn away exactly the
 * prospects a rebuild-adjacent agency wants.
 *
 * Only `type` and `tier` come from the URL. The server derives the page and CTA
 * labels from the validated lead type so a browser cannot forge attribution.
 */
export function LeadForm({
  formToken,
  submitLabel = "Request a Visibility Review",
}: {
  formToken: string;
  submitLabel?: string;
}) {
  const params = useSearchParams();
  /*
   * Read here as well as on the server: the page renders the hero and the
   * heading from the same parameters, and the form has to post the values the
   * visitor actually arrived with rather than a copy that can drift.
   */
  const type = params.get("type") === "sprint" ? "sprint" : "";
  const tier = params.get("tier") ?? "";
  const [state, action, pending] = useActionState<LeadState, FormData>(
    submitLead,
    {}
  );
  const v = state.values ?? {};
  const e = state.errors ?? {};

  return (
    <form action={action} className="flex flex-col gap-6" aria-busy={pending}>
      {/* Signed server render time plus the one-use submission id. */}
      <input type="hidden" name="formToken" value={formToken} />
      {/*
       * Lead type. Sprint inquiries have to stay separable from Visibility
       * Reviews in the CRM, and this is also what selects the confirmation the
       * visitor lands on.
       */}
      <input type="hidden" name="type" value={type} />
      {/*
       * Pricing card CTAs arrive as ?tier=neighborhood. Build Spec §13 wants
       * that carried through for attribution.
       */}
      <input type="hidden" name="tier" value={tier} />
      {/* Honeypot. Hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="company_website">Leave this field empty</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Whole-form failure — the request could not be stored at all. */}
      {e.form ? (
        <p
          role="alert"
          className="rounded-card border border-destructive/30 bg-destructive/5 px-4 py-3 text-[0.85rem] font-medium text-destructive"
        >
          {e.form}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">
            Name <span className="text-teal-ink">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            maxLength={LEAD_LIMITS.name}
            defaultValue={v.name}
            aria-invalid={Boolean(e.name)}
            aria-describedby={e.name ? "name-error" : undefined}
          />
          <FieldError id="name-error" message={e.name} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">
            Email <span className="text-teal-ink">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={LEAD_LIMITS.email}
            defaultValue={v.email}
            aria-invalid={Boolean(e.email)}
            aria-describedby={e.email ? "email-error" : undefined}
          />
          <FieldError id="email-error" message={e.email} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={LEAD_LIMITS.phone}
            defaultValue={v.phone}
            aria-invalid={Boolean(e.phone)}
            aria-describedby={e.phone ? "phone-error" : undefined}
          />
          <FieldError id="phone-error" message={e.phone} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="business">
            Company <span className="text-teal-ink">*</span>
          </Label>
          <Input
            id="business"
            name="business"
            required
            autoComplete="organization"
            maxLength={LEAD_LIMITS.business}
            defaultValue={v.business}
            aria-invalid={Boolean(e.business)}
            aria-describedby={e.business ? "business-error" : undefined}
          />
          <FieldError id="business-error" message={e.business} />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="website">Website URL</Label>
          <Input
            id="website"
            name="website"
            type="url"
            inputMode="url"
            autoComplete="url"
            maxLength={LEAD_LIMITS.url}
            defaultValue={v.website}
            aria-invalid={Boolean(e.website)}
            aria-describedby={
              e.website ? "website-help website-error" : "website-help"
            }
          />
          {/* Helper text, not a placeholder. A placeholder is not a label and
              disappears the moment someone starts typing. */}
          <p id="website-help" className="text-[0.8rem] text-subtle">
            If there is one.
          </p>
          <FieldError id="website-error" message={e.website} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">
          What are you trying to improve?{" "}
          <span className="text-teal-ink">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          maxLength={LEAD_LIMITS.message}
          defaultValue={v.message}
          aria-invalid={Boolean(e.message)}
          aria-describedby={e.message ? "message-error" : undefined}
        />
        <FieldError id="message-error" message={e.message} />
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
