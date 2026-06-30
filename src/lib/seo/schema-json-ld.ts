const MAX_SCHEMA_BYTES = 50_000;
const FORBIDDEN_SCHEMA_KEYS = /"(?:@type|type)"\s*:\s*"(?:script|javascript|html)/i;

export class InvalidSchemaJsonLdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSchemaJsonLdError";
  }
}

/** Validate CMS-authored JSON-LD before persistence or inline script injection. */
export function validateSchemaJsonLd(value: unknown): Record<string, unknown> | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new InvalidSchemaJsonLdError("schemaJsonLd must be a JSON object");
  }

  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch {
    throw new InvalidSchemaJsonLdError("schemaJsonLd is not serializable");
  }

  if (serialized.length > MAX_SCHEMA_BYTES) {
    throw new InvalidSchemaJsonLdError("schemaJsonLd exceeds 50 KB limit");
  }

  if (FORBIDDEN_SCHEMA_KEYS.test(serialized) || /<\/script/i.test(serialized)) {
    throw new InvalidSchemaJsonLdError("schemaJsonLd contains disallowed content");
  }

  return value as Record<string, unknown>;
}

/** Safe string for `<script type="application/ld+json">` — escapes `<` and validates shape. */
export function safeJsonLdScriptContent(schema: unknown): string | null {
  try {
    const validated = validateSchemaJsonLd(schema);
    if (!validated) return null;
    return JSON.stringify(validated).replace(/</g, "\\u003c");
  } catch {
    return null;
  }
}
