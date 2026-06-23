import JsonLd from "@/components/seo/JsonLd";
import {
  BOOK_CATALOG,
  BOOKS_PAGE_HERO,
  bookPageUrl,
} from "@/data/books-hub";
import {
  buildBookSchema,
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
} from "@/lib/seo/schema";

export default function BooksJsonLd() {
  const collection = buildCollectionPageSchema({
    name: BOOKS_PAGE_HERO.title,
    description: BOOKS_PAGE_HERO.subtitle,
    path: "/books",
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Publications", path: "/publications" },
    { name: "Books", path: "/books" },
  ]);

  const itemList = buildItemListSchema({
    name: "Shiksha Mahakumbh Books",
    items: BOOK_CATALOG.map((book) => ({
      name: book.title,
      url: bookPageUrl(book.id),
    })),
  });

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={itemList} />
      {BOOK_CATALOG.map((book) => (
        <JsonLd
          key={book.id}
          data={buildBookSchema({
            id: book.id,
            name: book.title,
            description: book.description,
            pagePath: "/books",
            image: book.coverSrc,
            datePublished: book.year,
            edition: book.edition,
            purchasePath: book.purchaseHref,
          })}
        />
      ))}
    </>
  );
}
