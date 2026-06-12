#!/usr/bin/env node
/** Usage: node scripts/test-supabase-contact.mjs [baseUrl] */
const base = process.argv[2] ?? "http://localhost:3000";
const res = await fetch(`${base}/api/v2/contact`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fullName: "Test User",
    email: "test@example.com",
    message: "Phase 3 contact test",
  }),
});
console.log(res.status, await res.text());
