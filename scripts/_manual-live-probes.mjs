#!/usr/bin/env node
/** Fresh live security, SEO, payment create-order probes — read-only */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

if (process.env.DIRECT_URL) process.env.DATABASE_URL = process.env.DIRECT_URL;
const p = new PrismaClient();
const BASE = "https://www.shikshamahakumbh.com";
const OUT = path.resolve("docs/go-live/_manual-proof-artifacts");

async function dbSnapshot() {
  const counters = await p.registrationCounter.findMany();
  const count = await p.registration.count();
  const latest = await p.registration.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      registrationId: true,
      email: true,
      registrationType: true,
      createdAt: true,
      emailDeliveryStatus: true,
      paymentStatus: true,
      razorpayOrderId: true,
      razorpayPaymentId: true,
    },
  });
  return {
    checkedAt: new Date().toISOString(),
    count,
    counters,
    emailLogs: await p.emailLog.count(),
    payments: await p.paymentRecord.count(),
    webhooks: await p.webhookEvent.count(),
    latest,
  };
}

async function liveProbes() {
  const results = { checkedAt: new Date().toISOString() };

  const balSubmit = await fetch(`${BASE}/api/registration/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registrationType: "Bal Shodh Patrika", captchaToken: "invalid" }),
  });
  results.balShodhTypeGate = {
    status: balSubmit.status,
    body: await balSubmit.json().catch(() => null),
  };

  const lookup = await fetch(`${BASE}/api/registration/SMK2026-000001`);
  results.lookup = { status: lookup.status, body: await lookup.json().catch(() => null) };

  const gw = await fetch(`${BASE}/api/admin/gateway/registrations`);
  results.gateway = { status: gw.status, body: await gw.json().catch(() => null) };

  const wh = await fetch(`${BASE}/api/payments/razorpay-webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  results.webhookUnsigned = { status: wh.status, body: await wh.json().catch(() => null) };

  const burst = [];
  for (let i = 0; i < 20; i++) {
    const r = await fetch(`${BASE}/api/registration/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    burst.push(r.status);
  }
  results.rateLimit = { statuses: [...new Set(burst)], triggered429: burst.includes(429) };

  const home = await fetch(`${BASE}/`).then((r) => r.text());
  results.seo = {
    canonical: home.match(/rel="canonical"\s+href="([^"]+)"/i)?.[1],
    ogUrl: home.match(/property="og:url"\s+content="([^"]+)"/i)?.[1],
    raseCoInRefs: (home.match(/rase\.co\.in/g) || []).length,
  };
  const sitemap = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
  const robots = await fetch(`${BASE}/robots.txt`).then((r) => r.text());
  results.seo.sitemapLocCount = (sitemap.match(/<loc>/g) || []).length;
  results.seo.sitemapComRefs = (sitemap.match(/shikshamahakumbh\.com/g) || []).length;
  results.seo.sitemapRaseRefs = (sitemap.match(/rase\.co\.in/g) || []).length;
  results.seo.robotsSitemap = robots.match(/Sitemap:\s*(.+)/)?.[1]?.trim();

  const orderRes = await fetch(`${BASE}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      registrationType: "Delegate Registration",
      amount: 500,
      currency: "INR",
      participantName: "Manual Proof Auditor",
      participantEmail: `payment-probe-${Date.now()}@audit.shikshamahakumbh.test`,
      participantPhone: "9876501234",
    }),
  });
  results.createOrder = {
    status: orderRes.status,
    body: await orderRes.json().catch(() => null),
  };

  return results;
}

const db = await dbSnapshot();
const live = await liveProbes();
const payload = { db, live };
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "live-probes.json"), JSON.stringify(payload, null, 2));
console.log(JSON.stringify(payload, null, 2));
await p.$disconnect();
