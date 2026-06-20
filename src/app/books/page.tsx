import PublicPageShell from "@/components/layouts/PublicPageShell";
import Books from "@/components/content/Books";
import { brandPageHero } from "@/lib/page-heroes";

export default function BooksPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Books",
        "Published works from Shiksha Mahakumbh programmes and partners.",
        "Publications"
      )}
    >
      <Books />
    </PublicPageShell>
  );
}
