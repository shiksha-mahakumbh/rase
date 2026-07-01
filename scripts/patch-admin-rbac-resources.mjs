#!/usr/bin/env node
/**
 * One-shot patcher: adds adminResource to v2 admin routes based on path.
 * Run: node scripts/patch-admin-rbac-resources.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adminApiRoot = path.join(__dirname, "../src/app/api/v2/admin");

const MUTATION_ADMIN_ROLES = new Set([
  path.normalize("payment-recovery/route.ts"),
  path.normalize("webhooks/[id]/retry/route.ts"),
  path.normalize("donations/[donationId]/resend-receipt/route.ts"),
  path.normalize("email-logs/[id]/resend/route.ts"),
]);

function resourceForRelPath(relPath) {
  const p = relPath.replace(/\\/g, "/");
  if (
    p.includes("registrations") ||
    p.includes("attendees") ||
    p.includes("accommodation") ||
    p.includes("checkin")
  ) {
    return "registrations";
  }
  if (p.includes("committees")) return "committees";
  if (
    p.includes("payments") ||
    p.includes("donations") ||
    p.includes("webhooks") ||
    p.includes("payment-audit") ||
    p.includes("payment-recovery")
  ) {
    return "payments";
  }
  if (
    p.includes("audit-logs") ||
    p.includes("email-logs") ||
    p.includes("whatsapp-logs") ||
    p.includes("newsletter") ||
    p.includes("communications") ||
    p.includes("/analytics/") ||
    p.includes("executive-dashboard") ||
    p.includes("ai-insights") ||
    p.includes("/dashboard/") ||
    p.endsWith("dashboard/route.ts") ||
    p.includes("lifecycle-analytics")
  ) {
    return "audit_logs";
  }
  if (p.includes("settings")) return "settings";
  if (p.includes("contact")) return "contact";
  if (p.includes("feedback")) return "feedback";
  if (p.includes("users")) return "users";
  return "media";
}

function patchFile(absPath, relPath) {
  let content = fs.readFileSync(absPath, "utf8");
  const original = content;
  const resource = resourceForRelPath(relPath);
  const normRel = path.normalize(relPath);
  const needsMutationRoles = MUTATION_ADMIN_ROLES.has(normRel);

  // Remove legacy adminRoles imports/usages where we use adminResource
  content = content.replace(
    /import\s*\{([^}]*)\}\s*from\s*"@\/server\/lib\/admin-rbac";?\n/g,
    (match, imports) => {
      const cleaned = imports
        .split(",")
        .map((s) => s.trim())
        .filter(
          (s) =>
            s &&
            !s.startsWith("ADMIN_MANAGE_ROLES") &&
            !s.startsWith("ADMIN_SENSITIVE_READ_ROLES") &&
            !s.startsWith("ADMIN_CHECKIN_ROLES") &&
            !s.startsWith("ADMIN_REGISTRATION_UPDATE_ROLES") &&
            !s.startsWith("ADMIN_EXPORT_ROLES")
        )
        .join(", ");
      if (!cleaned.trim()) return "";
      return `import { ${cleaned} } from "@/server/lib/admin-rbac";\n`;
    }
  );

  content = content.replace(
    /\{\s*requireAdmin:\s*true,\s*adminRoles:\s*ADMIN_[A-Z_]+,\s*/g,
    "{ requireAdmin: true, "
  );
  content = content.replace(
    /\{\s*requireAdmin:\s*true,\s*adminRoles:\s*ADMIN_[A-Z_]+\s*\}/g,
    `{ requireAdmin: true, adminResource: "${resource}" }`
  );

  content = content.replace(
    /requireAdmin:\s*true(?![^}]*adminResource)(?![^}]*permission)/g,
    (match, offset) => {
      const slice = content.slice(offset, offset + 200);
      if (slice.includes("adminResource:")) return match;
      return `requireAdmin: true, adminResource: "${resource}"`;
    }
  );

  if (needsMutationRoles) {
    if (!content.includes("ADMIN_MANAGE_ROLES")) {
      const importLine = `import { ADMIN_MANAGE_ROLES } from "@/server/lib/admin-rbac";\n`;
      content = importLine + content;
    }
    content = content.replace(
      /(\{ requireAdmin: true, adminResource: "payments", rateLimitKey: "admin-payment-recovery-action"[^}]*\})/,
      `{ requireAdmin: true, adminRoles: ADMIN_MANAGE_ROLES, rateLimitKey: "admin-payment-recovery-action", limit: 30 }`
    );
    content = content.replace(
      /(\{ requireAdmin: true, adminResource: "[^"]+", rateLimitKey: "admin-webhook-retry"[^}]*\})/,
      `{ requireAdmin: true, adminRoles: ADMIN_MANAGE_ROLES, rateLimitKey: "admin-webhook-retry", limit: 20 }`
    );
    content = content.replace(
      /(\{ requireAdmin: true, adminResource: "[^"]+", rateLimitKey: "admin-donation-resend-receipt"[^}]*\})/,
      `{ requireAdmin: true, adminRoles: ADMIN_MANAGE_ROLES, rateLimitKey: "admin-donation-resend-receipt", limit: 30 }`
    );
    content = content.replace(
      /(\{ requireAdmin: true, adminResource: "[^"]+", rateLimitKey: "admin-email-resend"[^}]*\})/,
      `{ requireAdmin: true, adminRoles: ADMIN_MANAGE_ROLES, rateLimitKey: "admin-email-resend", limit: 20 }`
    );
  }

  if (content !== original) {
    fs.writeFileSync(absPath, content);
    return true;
  }
  return false;
}

function walk(dir, base = "") {
  let patched = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      patched += walk(abs, rel);
    } else if (entry.name === "route.ts") {
      if (patchFile(abs, rel)) {
        console.log("patched", rel);
        patched += 1;
      }
    }
  }
  return patched;
}

const count = walk(adminApiRoot);
console.log(`Done. Patched ${count} route files.`);
