/**
 * Shared between the lead form and its server action.
 *
 * This cannot live in the "use server" module: every export of a server module
 * is turned into a server reference, so a plain array would arrive on the
 * client as a function stub rather than data.
 */
/*
 * Real Estate SEO is deliberately absent. The lane is cut by Page Spec 01 §2
 * and its page is unpublished, so offering it here would ask somebody to pick
 * a service that no longer exists. Enquiries already stored against it keep
 * their value: this list is only checked on submit.
 */
export const SERVICE_OPTIONS = [
  "Local SEO",
  "Traditional SEO",
  "Launch Sprint",
  "Not sure yet",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];
