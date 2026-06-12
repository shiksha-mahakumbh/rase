#!/usr/bin/env node
/**
 * Registration type mapping tests — validates TYPE_MAP / SUPPORTED_V2_TYPES parity.
 */
import fs from "node:fs";
import path from "node:path";

const results = [];
function pass(name, detail) {
  results.push({ test: name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ test: name, status: "FAIL", detail });
}

const typesFile = fs.readFileSync(
  path.resolve("src/server/lib/registration-types.ts"),
  "utf8"
);

const supportedMatch = typesFile.match(
  /export const SUPPORTED_V2_TYPES = \[([\s\S]*?)\] as const/
);
const typeMapMatch = typesFile.match(/const TYPE_MAP[^=]*=\s*\{([\s\S]*?)\};/);

if (!supportedMatch || !typeMapMatch) {
  fail("parse_registration_types", "Could not parse registration-types.ts");
} else {
  const supported = [...supportedMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  const mapped = [...typeMapMatch[1].matchAll(/(?:"([^"]+)"|(\w+)):/g)].map(
    (m) => m[1] ?? m[2]
  );

  pass("parse_registration_types", `${supported.length} supported, ${mapped.length} mapped`);

  const auditTypes = ["Bal Shodh Patrika", "Cultural Program"];
  for (const t of auditTypes) {
    if (supported.includes(t) && mapped.includes(t)) {
      pass(`type_mapped_${t.replace(/\s+/g, "_").toLowerCase()}`, `${t} in SUPPORTED_V2_TYPES and TYPE_MAP`);
    } else {
      fail(`type_mapped_${t.replace(/\s+/g, "_").toLowerCase()}`, `${t} missing from mapping`);
    }
  }

  const unmapped = supported.filter((t) => !mapped.includes(t));
  if (unmapped.length === 0) {
    pass("supported_types_all_mapped", "Every SUPPORTED_V2_TYPES entry has TYPE_MAP key");
  } else {
    fail("supported_types_all_mapped", `Unmapped: ${unmapped.join(", ")}`);
  }

  const orphanKeys = mapped.filter((t) => !supported.includes(t));
  if (orphanKeys.length === 0) {
    pass("type_map_no_orphans", "TYPE_MAP keys align with SUPPORTED_V2_TYPES");
  } else {
    fail("type_map_no_orphans", `TYPE_MAP keys not in SUPPORTED_V2_TYPES: ${orphanKeys.join(", ")}`);
  }
}

if (fs.existsSync(path.resolve("src/app/api/registration/submit/route.ts"))) {
  const submitRoute = fs.readFileSync(
    path.resolve("src/app/api/registration/submit/route.ts"),
    "utf8"
  );
  if (/isSupportedType\(registrationType\)/.test(submitRoute)) {
    pass("submit_uses_is_supported_type", "POST /api/registration/submit validates via isSupportedType");
  } else {
    fail("submit_uses_is_supported_type", "Submit route missing isSupportedType check");
  }
}

const gatewayRoute = fs.readFileSync(
  path.resolve("src/app/api/admin/gateway/[...path]/route.ts"),
  "utf8"
);
if (/unauthorizedResponse\(\)/.test(gatewayRoute) && /hasAdminCredentials/.test(gatewayRoute)) {
  pass("admin_gateway_early_401", "Admin gateway returns early 401 without credentials");
} else {
  fail("admin_gateway_early_401", "Admin gateway missing early unauthorized guard");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(JSON.stringify({ summary: `${results.length - failed.length}/${results.length} PASS`, results }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
