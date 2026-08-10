import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * shadcn/ui's class helper. tailwind-merge resolves conflicts so a `className`
 * prop can override a component's built-in utilities instead of fighting them.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
