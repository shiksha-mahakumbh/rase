import { createPageMetadata } from "@/lib/seo/metadata";
import LegalPageShell from "@/components/layouts/LegalPageShell";

export const metadata = createPageMetadata({
  title: "Disclaimer",
  description: "Disclaimer for Shiksha Mahakumbh Abhiyan website content and event information.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPageShell title="Disclaimer">
      <p>
        Information on this website is published by the Shiksha Mahakumbh organizing
        team in good faith. Schedules, venues, and programmes may change; official
        announcements on this site supersede informal communications.
      </p>
      <p>
        External links are provided for convenience; we do not endorse third-party
        content. Google AdSense and other partners may display advertisements
        subject to their own policies.
      </p>
    </LegalPageShell>
  );
}
