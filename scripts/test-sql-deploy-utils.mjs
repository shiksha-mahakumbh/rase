#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { splitSqlStatements } from "./lib/sql-split.mjs";
import { isAnonRolesAccessBlocked } from "./lib/anon-roles-probe.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const rbac = readFileSync(path.join(root, "supabase/policies/rbac-tiered.sql"), "utf8");
const rbacStatements = splitSqlStatements(rbac);
assert.ok(rbacStatements.length > 1, "rbac-tiered.sql should split into multiple statements");
assert.ok(
  rbacStatements[0].includes("CREATE OR REPLACE FUNCTION public.has_permission"),
  "first statement should be has_permission function"
);

assert.equal(isAnonRolesAccessBlocked(200, "[]"), true);
assert.equal(isAnonRolesAccessBlocked(200, '[{"slug":"admin"}]'), false);
assert.equal(isAnonRolesAccessBlocked(403, "permission denied"), true);

console.log("PASS sql-split and anon-roles-probe tests");
