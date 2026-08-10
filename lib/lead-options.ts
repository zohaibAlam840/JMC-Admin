/**
 * Shared between the lead form and its server action.
 *
 * This cannot live in the "use server" module: every export of a server module
 * is turned into a server reference, so a plain array would arrive on the
 * client as a function stub rather than data.
 */
export const SERVICE_OPTIONS = [
  "Local SEO",
  "Traditional SEO",
  "Real Estate SEO",
  "Launch Sprint",
  "Not sure yet",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];
