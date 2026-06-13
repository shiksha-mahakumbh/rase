#!/usr/bin/env node
const BASE = "https://www.shikshamahakumbh.com";

const reg = await fetch(`${BASE}/registration`).then((r) => r.text());
const siteKeyMatch = reg.match(/recaptcha\/api\.js\?render=([^&"']+)/);
console.log("siteKeyInHtml:", siteKeyMatch?.[1] ?? "NOT FOUND");

const verify = await fetch(`${BASE}/api/registration/verify-captcha`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token: "invalid-token-12345", action: "registration" }),
});
console.log("verify-captcha:", verify.status, await verify.text());

// Check if secret is configured by response type
const verify2 = await fetch(`${BASE}/api/registration/verify-captcha`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token: "", action: "registration" }),
});
console.log("verify-empty:", verify2.status, await verify2.text());
