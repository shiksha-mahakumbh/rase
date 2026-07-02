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
    const token = createRegistrationProofToken("127.0.0.1");
    const immediate = verifyRegistrationProofToken(token, "127.0.0.1");
    assert.equal(immediate.ok, false);

    const future = Date.now() + REGISTRATION_PROOF_MIN_DWELL_MS + 100;
    const originalNow = Date.now;
    Date.now = () => future;
    try {
      const verified = verifyRegistrationProofToken(token, "127.0.0.1");
      assert.equal(verified.ok, true);
    } finally {
      Date.now = originalNow;
    }
  });

  it("rejects tokens from a different IP", () => {
    process.env.REGISTRATION_LOOKUP_SECRET = "test-registration-proof-secret";
    const token = createRegistrationProofToken("10.0.0.1");
    const future = Date.now() + REGISTRATION_PROOF_MIN_DWELL_MS + 100;
    const originalNow = Date.now;
    Date.now = () => future;
    try {
      const verified = verifyRegistrationProofToken(token, "10.0.0.2");
      assert.equal(verified.ok, false);
    } finally {
      Date.now = originalNow;
    }
  });
});
