import LegalPageShell from "@/components/layouts/LegalPageShell";
import {
  generateLegalPageMetadata,
  renderLegalPage,
} from "@/lib/cms/legal-page-loader";

export async function generateMetadata() {
  return generateLegalPageMetadata("cookie-policy", {
    title: "Cookie Policy",
    description:
      "How Shiksha Mahakumbh Abhiyan uses cookies, analytics, and your consent choices.",
    path: "/cookie-policy",
  });
}

export default async function CookiePolicyPage() {
  return renderLegalPage(
    "cookie-policy",
    <LegalPageShell title="Cookie Policy" path="/cookie-policy">
      <p>Last updated: May 2026</p>
      <section>
        <h2>What are cookies?</h2>
        <p>
          Cookies are small files stored on your device to help the site function,
          remember preferences, and—only with your consent—understand how visitors
          use the platform.
        </p>
      </section>
      <section>
        <h2>Essential cookies</h2>
        <p>
          Required for security, session management (including admin access where
          applicable), and core registration functionality. These cannot be
          disabled while using the service.
        </p>
      </section>
      <section>
        <h2>Analytics cookies (optional)</h2>
        <p>
          With your consent, we may load Google Tag Manager, Google Analytics,
          Microsoft Clarity, or Meta Pixel to improve the website. These scripts are
          <strong> not loaded</strong> until you choose &quot;Accept all&quot; on the
          cookie banner.
        </p>
      </section>
      <section>
        <h2>Managing consent</h2>
        <p>
          Use the cookie banner on first visit, or clear site data in your browser
          to reset your choice. Contact{" "}
          <a href="mailto:academics@shikshamahakumbh.com">academics@shikshamahakumbh.com</a>{" "}
          for questions.
        </p>
      </section>
    </LegalPageShell>
  );
}
