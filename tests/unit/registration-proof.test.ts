import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  REGISTRATION_PROOF_MIN_DWELL_MS,
  createRegistrationProofToken,
  verifyRegistrationProofToken,
} from "../../src/lib/security/registration-proof";

describe("registration proof tokens", () => {
  it("issues and verifies a valid proof token", () => {
    process.env.REGISTRATION_LOOKUP_SECRET = "test-registration-proof-secret";
    const token = createRegistrationProofToken();
    const immediate = verifyRegistrationProofToken(token);
    assert.equal(immediate.ok, false);

    const future = Date.now() + REGISTRATION_PROOF_MIN_DWELL_MS + 100;
    const originalNow = Date.now;
    Date.now = () => future;
    try {
      const verified = verifyRegistrationProofToken(token);
      assert.equal(verified.ok, true);
    } finally {
      Date.now = originalNow;
    }
  });

  it("rejects expired tokens", () => {
    process.env.REGISTRATION_LOOKUP_SECRET = "test-registration-proof-secret";
    const token = createRegistrationProofToken();
    const future = Date.now() + 21 * 60 * 1000;
    const originalNow = Date.now;
    Date.now = () => future;
    try {
      const verified = verifyRegistrationProofToken(token);
      assert.equal(verified.ok, false);
    } finally {
      Date.now = originalNow;
    }
  });
});
