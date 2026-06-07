import JsonLd from "./JsonLd";
import BreadcrumbJsonLd from "./BreadcrumbJsonLd";
import {
  buildEducationalOrganizationJsonLd,
} from "@/lib/seo/schemas";
import { ORGANIZATION_SCHEMA } from "@/config/site";

export default function IntroductionJsonLd() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Introduction", path: "/introduction" },
        ]}
      />
      <JsonLd data={ORGANIZATION_SCHEMA} />
      <JsonLd data={buildEducationalOrganizationJsonLd()} />
    </>
  );
}
