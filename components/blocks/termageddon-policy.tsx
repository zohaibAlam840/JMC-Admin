"use client";

import * as React from "react";

const TERMAGEDDON_POLICY_API =
  "https://policies.termageddon.com/api/policy/";

/**
 * Loads one auto-updating Termageddon policy in a client-routed Next app.
 *
 * Termageddon's ordinary embed waits for window.load, which does not run again
 * after an App Router navigation. Their React guidance uses the policy API
 * instead. The returned markup is trusted third-party legal content from the
 * configured policy key; React owns the insertion so later state updates do
 * not wipe out DOM that was added imperatively.
 */
export function TermageddonPolicy({
  policyKey,
  contactEmail,
}: {
  policyKey: string;
  contactEmail: string;
}) {
  const [html, setHtml] = React.useState("");
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({
      "no-title": "true",
      "h-align": "left",
      "h-depth": "3",
      "table-style": "accordion",
    });

    void fetch(
      `${TERMAGEDDON_POLICY_API}${encodeURIComponent(policyKey)}?${query}`,
      { cache: "no-store", signal: controller.signal }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Policy request failed with ${response.status}.`);
        }
        return response.text();
      })
      .then((policyHtml) => {
        if (!policyHtml.trim()) throw new Error("The policy response was empty.");
        setHtml(policyHtml);
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }
        setError(true);
      });

    return () => controller.abort();
  }, [policyKey]);

  return (
    <div aria-live="polite">
      {!html && !error ? (
        <p className="text-[0.95rem] text-subtle">Loading policy&hellip;</p>
      ) : null}

      {error ? (
        <p role="alert" className="text-[0.95rem] leading-relaxed text-subtle">
          This policy could not be loaded. Refresh the page or email{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="font-semibold text-teal-ink hover:underline"
          >
            {contactEmail}
          </a>
          .
        </p>
      ) : null}

      <div
        id="policy"
        className="legal-body"
        aria-busy={!html && !error}
        // Termageddon's official API returns the maintained policy as HTML.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
