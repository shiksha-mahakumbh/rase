#!/usr/bin/env node
/**
 * Security checklist items 99–104 — Feedback, newsletter, search, validation, spam, notifications.
 */
import fs from "node:fs";
import path from "node:path";

const repo = path.resolve(".");
const src = path.join(repo, "src");
const results = [];

function pass(name, detail) {
  results.push({ test: name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ test: name, status: "FAIL", detail });
}

function readSrc(rel) {
  return fs.readFileSync(path.join(src, rel), "utf8");
}

function readRepo(rel) {
  return fs.readFileSync(path.join(repo, rel), "utf8");
}

function existsRepo(rel) {
  return fs.existsSync(path.join(repo, rel));
}

// 99 Feedback forms
if (
  existsRepo("src/app/feedback/page.tsx") &&
  readSrc("app/api/v2/feedback/route.ts").includes("feedbackSubmitSchema")
) {
  pass("feedback_forms_validated", "Feedback page and Zod-validated API route present");
} else {
  fail("feedback_forms_validated", "Feedback validation gaps");
}

// 100 Newsletter
if (
  readSrc("server/services/newsletter.service.ts").includes("pendingConfirmation") &&
  existsRepo("src/app/newsletter/confirm/page.tsx")
) {
  pass("newsletter_double_opt_in", "Newsletter pending flow and confirm page wired");
} else {
  fail("newsletter_double_opt_in", "Newsletter double opt-in incomplete");
}

if (readSrc("app/api/v2/newsletter/subscribe/route.ts").includes('verifyRecaptchaToken(body.captchaToken, "newsletter")')) {
  pass("newsletter_captcha", "Newsletter subscribe protected by reCAPTCHA");
} else {
  fail("newsletter_captcha", "Newsletter captcha missing");
}

// 101 Search
if (
  readSrc("lib/ecosystem/search.ts").includes("MAX_SEARCH_QUERY_LENGTH") &&
  readSrc("components/search/GlobalSearchInner.tsx").includes("MAX_SEARCH_QUERY_LENGTH")
) {
  pass("search_query_limits", "Global search caps query length client-side");
} else {
  fail("search_query_limits", "Search query limits missing");
}

// 102 Validation
if (
  existsRepo("src/lib/schemas/contactSchema.ts") &&
  existsRepo("src/lib/schemas/feedbackSchema.ts") &&
  existsRepo("src/lib/schemas/newsletterSchema.ts") &&
  readSrc("lib/validation/parse-body.ts").includes("safeParse")
) {
  pass("validation_zod_public_forms", "Shared Zod schemas and parseBody helper for public forms");
} else {
  fail("validation_zod_public_forms", "Public form validation incomplete");
}

// 103 Spam protection
if (
  readSrc("lib/security/honeypot.ts").includes("assertHoneypotEmpty") &&
  readSrc("app/api/v2/contact/route.ts").includes("assertSameOrigin") &&
  readSrc("app/api/v2/feedback/route.ts").includes("assertHoneypotEmpty")
) {
  pass("spam_honeypot_same_origin", "Honeypot and same-origin checks on public mutations");
} else {
  fail("spam_honeypot_same_origin", "Spam protection gaps on public forms");
}

if (
  readSrc("app/api/v2/newsletter/unsubscribe/route.ts").includes("newsletter_unsubscribe") &&
  readSrc("lib/security/newsletter-token.ts").includes("verifyNewsletterUnsubscribeToken")
) {
  pass("spam_newsletter_unsub_tokens", "Signed unsubscribe tokens or captcha fallback");
} else {
  fail("spam_newsletter_unsub_tokens", "Newsletter unsubscribe protection incomplete");
}

// 104 Notifications
if (
  readSrc("server/services/contact.service.ts").includes("sendAdminAlert") &&
  readSrc("server/services/feedback.service.ts").includes("sendAdminAlert") &&
  readSrc("server/services/contact.service.ts").includes("sendContactReplyEmail")
) {
  pass("notifications_admin_and_replies", "Admin alerts and reply emails on contact/feedback");
} else {
  fail("notifications_admin_and_replies", "Notification gaps on contact/feedback flows");
}

if (
  readSrc("server/services/email.service.ts").includes("newsletter_confirm") &&
  readSrc("server/services/email.service.ts").includes("newsletter_welcome")
) {
  pass("notifications_newsletter_emails", "Newsletter confirmation and welcome email templates");
} else {
  fail("notifications_newsletter_emails", "Newsletter email notifications missing");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(`\nPhase 8 user feature checks: ${results.length - failed.length}/${results.length} passed\n`);
for (const r of results) {
  console.log(`${r.status === "PASS" ? "✓" : "✗"} ${r.test}: ${r.detail}`);
}
if (failed.length > 0) {
  process.exit(1);
}
