import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { supabaseConfigured } from "@/lib/supabase/config";
import { Notice } from "@/components/admin/ui";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="eyebrow eyebrow-dot justify-center">Jordan Marketing Consultants</p>
          <h1 className="mt-3 font-display text-3xl uppercase leading-none text-ink-strong">
            Site Admin
          </h1>
          <p className="mt-2 text-[0.85rem] text-subtle">
            Sign in to edit pages, pricing, and navigation.
          </p>
        </div>

        {supabaseConfigured ? (
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        ) : (
          <Notice tone="error">
            This site has no Supabase connection configured, so the admin cannot
            sign anyone in. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>{" "}
            and restart.
          </Notice>
        )}

        <p className="mt-6 text-center text-[0.76rem] leading-relaxed text-subtle">
          Accounts are created in the Supabase dashboard under Authentication →
          Users. The first account to sign in becomes the owner.
        </p>
      </div>
    </div>
  );
}
