import { SITE_URL } from "@/config/site";
import {
  BOOK_CATALOG,
  BOOKS_CANONICAL_URL,
  BOOKS_PAGE_HERO,
} from "@/data/books-hub";

export default function BooksJsonLd() {
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: BOOKS_PAGE_HERO.title,
    description: BOOKS_PAGE_HERO.subtitle,
    url: BOOKS_CANONICAL_URL,
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      name: "Shiksha Mahakumbh Abhiyan",
      url: SITE_URL,
    },
  };

  const books = BOOK_CATALOG.map((book) => ({
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: book.description,
    image: `${SITE_URL}${book.coverSrc}`,
    url: BOOKS_CANONICAL_URL,
    inLanguage: "en-IN",
    datePublished: book.year,
    about: {
      "@type": "Event",
      name: `Shiksha Mahakumbh ${book.edition}`,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}${book.purchaseHref}`,
      availability: "https://schema.org/InStock",
      description: "Contact Department of Holistic Education to request a copy.",
    },
  }));

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Shiksha Mahakumbh Books",
    numberOfItems: BOOK_CATALOG.length,
    itemListElement: BOOK_CATALOG.map((book, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Book",
        name: book.title,
        url: BOOKS_CANONICAL_URL,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Publications", item: `${SITE_URL}/publications` },
      { "@type": "ListItem", position: 3, name: "Books", item: BOOKS_CANONICAL_URL },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      {books.map((book) => (
        <script
          key={book.name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(book) }}
        />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
