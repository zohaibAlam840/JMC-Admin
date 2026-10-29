"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { submitAudit, type LeadState } from "@/app/actions/lead";
import { Input, Label } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { LEAD_LIMITS } from "@/lib/leads/validation";

/**
 * The five fields of the Free Visibility Audit — Page Spec 04 §4.
 *
 * Fixed in code rather than driven from the section data. The form posts to a
 * Server Action that has to know exactly what it is receiving, and §4 caps the
 * form at five fields with no message box to protect the conversion rate. A
 * client who could add a sixth field from the admin would be able to undo the
 * one decision this section exists to enforce.
 *
 * It sits on the solid ink band, so inputs are white-filled with an ink text
 * colour rather than the transparent treatment the review form uses on white.
 */
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="group mt-1 w-full"
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
    <p id={id} role="alert" className="text-[0.8rem] font-medium text-[#ffb4a8]">
      {message}
    </p>
  );
}

export function AuditFormFields({
  submitLabel,
  profileHelp,
  formToken,
}: {
  submitLabel: string;
  profileHelp?: string;
  formToken: string;
}) {
  const [state, action, pending] = useActionState<LeadState, FormData>(
    submitAudit,
    {}
  );
  const v = state.values ?? {};
  const e = state.errors ?? {};

  return (
    <form action={action} className="flex flex-col gap-5" aria-busy={pending}>
      <input type="hidden" name="formToken" value={formToken} />

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="audit-company-website">Company website</label>
        <input
          id="audit-company-website"
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {e.form ? (
        <p
          role="alert"
          className="rounded-card border border-[#ffb4a8]/40 bg-[#ffb4a8]/10 px-4 py-3 text-[0.9rem] text-[#ffd4cc]"
        >
          {e.form}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="audit-business" className="text-white">
          Business name
        </Label>
        <Input
          id="audit-business"
          name="business"
          required
          autoComplete="organization"
          maxLength={LEAD_LIMITS.business}
          defaultValue={v.business}
          aria-invalid={Boolean(e.business)}
          aria-describedby={e.business ? "audit-business-error" : undefined}
        />
        <FieldError id="audit-business-error" message={e.business} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="audit-website" className="text-white">
          Website
        </Label>
        <Input
          id="audit-website"
          name="website"
          type="url"
          inputMode="url"
          placeholder="https://"
          required
          autoComplete="url"
          maxLength={LEAD_LIMITS.url}
          defaultValue={v.website}
          aria-invalid={Boolean(e.website)}
          aria-describedby={e.website ? "audit-website-error" : undefined}
        />
        <FieldError id="audit-website-error" message={e.website} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="audit-profile" className="text-white">
          Google Business Profile{" "}
          <span className="font-normal normal-case tracking-normal text-white/55">
            optional
          </span>
        </Label>
        <Input
          id="audit-profile"
          name="profile"
          type="url"
          inputMode="url"
          autoComplete="url"
          maxLength={LEAD_LIMITS.url}
          defaultValue={v.profile}
          aria-invalid={Boolean(e.profile)}
          aria-describedby={
            [
              profileHelp ? "audit-profile-help" : "",
              e.profile ? "audit-profile-error" : "",
            ]
              .filter(Boolean)
              .join(" ") || undefined
          }
        />
        {profileHelp ? (
          <p id="audit-profile-help" className="text-[0.8rem] text-white/60">
            {profileHelp}
          </p>
        ) : null}
        <FieldError id="audit-profile-error" message={e.profile} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="audit-email" className="text-white">
            Email
          </Label>
          <Input
            id="audit-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={LEAD_LIMITS.email}
            defaultValue={v.email}
            aria-invalid={Boolean(e.email)}
            aria-describedby={e.email ? "audit-email-error" : undefined}
          />
          <FieldError id="audit-email-error" message={e.email} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="audit-phone" className="text-white">
            Phone{" "}
            <span className="font-normal normal-case tracking-normal text-white/55">
              optional
            </span>
          </Label>
          <Input
            id="audit-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={LEAD_LIMITS.phone}
            defaultValue={v.phone}
            aria-invalid={Boolean(e.phone)}
            aria-describedby={e.phone ? "audit-phone-error" : undefined}
          />
          <FieldError id="audit-phone-error" message={e.phone} />
        </div>
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
