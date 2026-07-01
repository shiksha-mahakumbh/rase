#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const unitDir = path.join(process.cwd(), "tests/unit");
const files = fs
  .readdirSync(unitDir)
  .filter((name) => name.endsWith(".test.ts"))
  .map((name) => path.join("tests/unit", name));

if (files.length === 0) {
  console.error("No unit test files found in tests/unit");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--import", "tsx", "--test", ...files], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
