import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Education", path: "/education" },
          { name: "Publications", path: "/publications" },
        ]}
      />
      {children}
    </>
  );
}
