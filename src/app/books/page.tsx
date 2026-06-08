import PublicPageShell from "@/components/layouts/PublicPageShell";
import Books from "../component/Books";

const PAGE_HERO = {
  eyebrow: "Publications",
  title: "Books",
  subtitle: "Published works from Shiksha Mahakumbh programmes and partners.",
  accent: "navy" as const,
};

export default function BooksPage() {
  return (
    <PublicPageShell hero={PAGE_HERO}>
      <Books />
    </PublicPageShell>
  );
}
