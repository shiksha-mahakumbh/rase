import IntroductionJsonLd from "@/components/seo/IntroductionJsonLd";

export default function IntroductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <IntroductionJsonLd />
      {children}
    </>
  );
}
