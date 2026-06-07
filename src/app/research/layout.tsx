import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Education", path: "/education" },
          { name: "Research", path: "/research" },
        ]}
      />
      {children}
    </>
  );
}
