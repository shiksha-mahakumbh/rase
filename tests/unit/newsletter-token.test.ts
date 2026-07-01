import assert from "node:assert/strict";
import { before, describe, it } from "node:test";

describe("newsletter token helpers", () => {
  before(() => {
    process.env.REGISTRATION_LOOKUP_SECRET = "phase11-unit-test-secret";
  });

  it("round-trips confirm tokens", async () => {
    const {
      createNewsletterConfirmToken,
      verifyNewsletterConfirmToken,
      newsletterTokensEnabled,
    } = await import("../../src/lib/security/newsletter-token");

    assert.equal(newsletterTokensEnabled(), true);
    const token = createNewsletterConfirmToken("User@Example.com");
    const verified = verifyNewsletterConfirmToken(token);
    assert.deepEqual(verified, { email: "user@example.com" });
  });

  it("round-trips unsubscribe tokens", async () => {
    const {
      createNewsletterUnsubscribeToken,
      verifyNewsletterUnsubscribeToken,
    } = await import("../../src/lib/security/newsletter-token");

    const email = "subscriber@example.com";
    const token = createNewsletterUnsubscribeToken(email);
    assert.equal(verifyNewsletterUnsubscribeToken(token, email), true);
    assert.equal(verifyNewsletterUnsubscribeToken(token, "other@example.com"), false);
  });
});
