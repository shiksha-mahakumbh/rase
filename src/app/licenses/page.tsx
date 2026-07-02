import Link from "next/link";
import LegalPageShell from "@/components/layouts/LegalPageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return createPageMetadata({
    title: "Open Source Licenses",
    description:
      "Proprietary application license and third-party open source attributions for the Shiksha Mahakumbh platform.",
    path: "/licenses",
  });
}

export default function LicensesPage() {
  return (
    <LegalPageShell title="Open Source Licenses" path="/licenses">
      <p>Last updated: July 2026</p>

      <h2>Application license</h2>
      <p>
        The Shiksha Mahakumbh web platform source code is proprietary software
        owned by the organizing team. See the repository{" "}
        <code>LICENSE</code> file for terms. You may not copy or redistribute
        application code without written permission.
      </p>

      <h2>Third-party components</h2>
      <p>
        This site is built with open source libraries (Next.js, React, Prisma,
        Supabase client, Razorpay SDK, Sentry, and others). Each package is
        distributed under its own license (typically MIT or Apache-2.0).
      </p>
      <p>
        A maintained summary lives in{" "}
        <code>docs/legal/THIRD_PARTY_LICENSES.md</code> in the project repository.
      </p>

      <h2>Major dependencies</h2>
      <ul>
        <li>Next.js — MIT</li>
        <li>React — MIT</li>
        <li>Prisma — Apache-2.0</li>
        <li>Supabase JavaScript client — MIT</li>
        <li>Zod — MIT</li>
        <li>Razorpay Node SDK — MIT</li>
        <li>Sentry Next.js SDK — MIT</li>
      </ul>

      <h2>Trademarks</h2>
      <p>
        Partner and technology names (Google, Razorpay, Meta, Microsoft, Vercel,
        etc.) are trademarks of their respective owners. This page does not grant
        any rights to those marks.
      </p>

      <h2>Questions</h2>
      <p>
        Contact{" "}
        <a href="mailto:academics@shikshamahakumbh.com">academics@shikshamahakumbh.com</a>{" "}
        for licensing inquiries. See also our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
        <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>.
      </p>
    </LegalPageShell>
  );
}
