"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react";
import { submitLead, type LeadState } from "@/app/actions/lead";
import { Input, Label, Select, Textarea } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { SERVICE_OPTIONS } from "@/lib/lead-options";

function SubmitButton() {
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
          Request My Visibility Review
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

export function LeadForm({
  sourceCta = "Request a Visibility Review",
}: {
  sourceCta?: string;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const tier = params.get("tier") ?? "";
  /*
   * Launch Sprint CTAs arrive as ?type=sprint. Page Spec 07 needs sprint
   * enquiries separable from Visibility Review and Free Audit leads, and the
   * service field already carries exactly that distinction, so it preselects
   * rather than earning a column of its own.
   */
  const preselectedService =
    params.get("type") === "sprint" ? "Launch Sprint" : "";
  // Captured once on mount rather than read at submit time, so the value is
  // the moment the form appeared rather than the moment it was sent.
  const [renderedAt] = React.useState(() => String(Date.now()));
  const [state, action] = useActionState<LeadState, FormData>(submitLead, {});
  const v = state.values ?? {};
  const e = state.errors ?? {};

  return (
    <form action={action} className="flex flex-col gap-6">
      {/* Attribution — which CTA and page produced this request. */}
      <input type="hidden" name="sourceCta" value={sourceCta} />
      <input type="hidden" name="sourcePage" value={pathname} />
      {/*
       * Pricing card CTAs arrive as ?tier=neighborhood. Build Spec §13 wants
       * that carried through for attribution.
       */}
      <input type="hidden" name="tier" value={tier} />
      {/*
       * Paired with the honeypot, per §13: a form completed in under three
       * seconds was not filled in by a person. No CAPTCHA.
       */}
      <input type="hidden" name="renderedAt" value={renderedAt} />

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
            defaultValue={v.phone}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="business">Business name</Label>
          <Input
            id="business"
            name="business"
            autoComplete="organization"
            defaultValue={v.business}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            inputMode="url"
            placeholder="https://"
            autoComplete="url"
            defaultValue={v.website}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="service">
            What are you interested in?
          </Label>
          <div className="relative">
            <Select
              id="service"
              name="service"
              defaultValue={v.service ?? preselectedService}
              aria-invalid={Boolean(e.service)}
            >
              <option value="">Select one</option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
            <ChevronDown
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-subtle"
            />
          </div>
          <FieldError id="service-error" message={e.service} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">What are you trying to improve?</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          defaultValue={v.message}
          placeholder="Markets you serve, what you sell, and where visibility feels weak."
        />
      </div>

      <SubmitButton />

      <p className="text-[0.8rem] leading-relaxed text-subtle">
        We reply within one business day. No automated sales sequence, and your
        details are not shared.
      </p>
    </form>
  );
}
