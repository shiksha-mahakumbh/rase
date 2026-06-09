#!/usr/bin/env node
const BASE = "https://www.rase.co.in";
const html = await (await fetch(`${BASE}/registration`)).text();
const scripts = [...html.matchAll(/src="(\/_next\/static\/[^"]+)"/g)].map((m) => m[1]);
let recaptcha = false;
let razorpay = false;
for (const s of scripts.slice(0, 20)) {
  const t = await (await fetch(`${BASE}${s}`)).text();
  if (/recaptcha|RECAPTCHA/.test(t)) recaptcha = true;
  if (/razorpay|Razorpay|RZP/.test(t)) razorpay = true;
}
console.log(JSON.stringify({ scriptCount: scripts.length, recaptchaInBundles: recaptcha, razorpayInBundles: razorpay }));
