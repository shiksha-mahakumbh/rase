import JsonLd from "./JsonLd";
import {
  buildEducationalOrganizationJsonLd,
  buildRegistrationEventJsonLd,
  buildRegistrationFaqJsonLd,
} from "@/lib/seo/schemas";
import { ORGANIZATION_SCHEMA } from "@/config/site";

/** Registration page structured data — server-only, no client hydration. */
export default function RegistrationJsonLd() {
  return (
    <>
      <JsonLd data={ORGANIZATION_SCHEMA} />
      <JsonLd data={buildEducationalOrganizationJsonLd()} />
      <JsonLd data={buildRegistrationEventJsonLd()} />
      <JsonLd data={buildRegistrationFaqJsonLd()} />
    </>
  );
}
