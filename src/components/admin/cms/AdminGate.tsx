"use client";

import { ReactNode, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAdmin } from "@/lib/adminAuth";
import { isSafeAdminRedirectPath } from "@/lib/admin/safe-redirect";

function AdminGateFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-600">Loading admin session…</p>
    </div>
  );
}

function AdminGateContent({ children }: { children: ReactNode }) {
  const { user, role, loading, login, isAdmin } = useAdmin();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <AdminGateFallback />;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-center text-xl font-bold text-brand-navy">Admin Sign In</h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Sign in with your admin email and password.
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              try {
                await login(email, password);
                const next = searchParams.get("next");
                if (next && isSafeAdminRedirectPath(next)) {
                  window.location.assign(next);
                }
              } catch (error) {
                toast.error(
                  error instanceof Error ? error.message : "Login failed"
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-navy px-4 py-3 text-sm font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
          {user && !role && (
            <p className="mt-4 text-center text-sm text-red-600">
              {user.email} is not authorized for admin access.
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminGate({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AdminGateFallback />}>
      <AdminGateContent>{children}</AdminGateContent>
    </Suspense>
  );
}
