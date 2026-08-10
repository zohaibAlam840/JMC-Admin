"use client";

import * as React from "react";

/**
 * Submit button that asks first. Used for the handful of admin actions that
 * cannot be undone — deleting a page, a package, or an enquiry.
 */
export function ConfirmButton({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
