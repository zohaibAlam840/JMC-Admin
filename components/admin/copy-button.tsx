"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { adminButton } from "@/components/admin/ui";

/** Copies an image address, for pasting into an article or somewhere else. */
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      className={adminButton.tiny}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          // No cleanup needed — the worst case is a setState on an unmounted
          // button, which React 19 ignores.
          setTimeout(() => setCopied(false), 1600);
        } catch {
          // Clipboard access can be refused; the address is visible either way.
        }
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      <span className="ml-1">{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}
