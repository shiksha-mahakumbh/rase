import Link from "next/link";
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
      <p>Last updated: July 2026</p>

      <section>
        <h2>What are cookies?</h2>
        <p>
          Cookies and similar technologies (localStorage entries) help the site
          function, remember preferences, and—only with your consent—understand how
          visitors use the platform.
        </p>
      </section>

      <section>
        <h2>Essential cookies &amp; storage</h2>
        <p>
          Required for security, admin session management (where applicable),
          registration drafts, and core functionality. These cannot be disabled
          while using the service.
        </p>
        <table>
          <thead>
            <tr>
              <th>Name / key</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>smk_cookie_consent</code>
              </td>
              <td>Stores your analytics/marketing consent choice</td>
              <td>Until cleared</td>
            </tr>
            <tr>
              <td>Admin session cookie</td>
              <td>Signed HttpOnly session for authorized administrators</td>
              <td>Session / expiry set server-side</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Analytics &amp; marketing (optional)</h2>
        <p>
          With your consent, we may load Google Tag Manager, Google Analytics,
          Microsoft Clarity, Meta Pixel, and Google AdSense. These scripts are{" "}
          <strong>not loaded</strong> until you choose &quot;Accept all&quot; on the
          cookie banner. We use Google Consent Mode v2 defaults until you accept.
        </p>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Google Analytics / GTM</td>
              <td>Traffic measurement and campaign attribution</td>
            </tr>
            <tr>
              <td>Microsoft Clarity</td>
              <td>Session replay and heatmaps (when configured)</td>
            </tr>
            <tr>
              <td>Meta Pixel</td>
              <td>Advertising attribution (when configured)</td>
            </tr>
            <tr>
              <td>Google AdSense</td>
              <td>Contextual advertising when enabled and consented</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Managing consent</h2>
        <p>
          Use the cookie banner on first visit, the floating &quot;Cookie
          preferences&quot; control, or clear site data in your browser to reset
          your choice. See our <Link href="/privacy-policy">Privacy Policy</Link>{" "}
          for data retention and processor details.
        </p>
        <p>
          Questions:{" "}
          <a href="mailto:academics@shikshamahakumbh.com">academics@shikshamahakumbh.com</a>
        </p>
      </section>
    </LegalPageShell>
  );
}
