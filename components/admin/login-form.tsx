"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { claimFirstAdmin } from "@/app/(admin)/admin/actions";
import { adminButton, Field, Input, Notice } from "@/components/admin/ui";

/**
 * Sign-in.
 *
 * Auth runs in the browser so the Supabase client owns the token refresh and
 * writes the session cookie itself; proxy.ts keeps that cookie alive from then
 * on. After a successful sign-in we call claim_admin() once — it makes the very
 * first account the owner and is a no-op for everyone afterwards.
 */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setPending(false);
      return;
    }

    await claimFirstAdmin();
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error ? <Notice tone="error">{error}</Notice> : null}

      <Field label="Email">
        <Input
          type="email"
          name="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>

      <Field label="Password">
        <Input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>

      <button type="submit" className={adminButton.primary} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
