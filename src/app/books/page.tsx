import BooksJsonLd from "@/components/books/BooksJsonLd";
import BooksShowcase from "@/components/books/BooksShowcase";
import PublicPageShell from "@/components/layouts/PublicPageShell";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Publications", path: "/publications" },
  { name: "Books", path: "/books" },
];

export default function BooksPage() {
  return (
    <PublicPageShell
      showHero={false}
      showCta={false}
      breadcrumbs={BREADCRUMBS}
      relatedPath="/books"
      skipContainer
    >
      <BooksJsonLd />
      <BooksShowcase />
    </PublicPageShell>
  );
}
