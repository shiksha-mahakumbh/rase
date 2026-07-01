#!/usr/bin/env node
/** Remove unused ADMIN_SENSITIVE_READ_ROLES imports from admin routes. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/app/api/v2/admin");

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs);
    else if (entry.name === "route.ts") cleanFile(abs);
  }
}

function cleanFile(absPath) {
  let content = fs.readFileSync(absPath, "utf8");
  const original = content;

  if (!content.includes("ADMIN_SENSITIVE_READ_ROLES")) return;

  content = content.replace(
    /import\s*\{([^}]*)\}\s*from\s*"@\/server\/lib\/admin-rbac";\n/g,
    (match, imports) => {
      const cleaned = imports
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s && s !== "ADMIN_SENSITIVE_READ_ROLES")
        .join(", ");
      if (!cleaned) return "";
      return `import { ${cleaned} } from "@/server/lib/admin-rbac";\n`;
    }
  );

  if (content !== original) {
    fs.writeFileSync(absPath, content);
    console.log("cleaned", path.relative(root, absPath));
  }
}

walk(root);
