import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertHoneypotEmpty } from "../../src/lib/security/honeypot";
import { ServiceError } from "../../src/server/lib/errors";

describe("assertHoneypotEmpty", () => {
  it("accepts empty honeypot values", () => {
    assert.doesNotThrow(() => assertHoneypotEmpty(undefined));
    assert.doesNotThrow(() => assertHoneypotEmpty(null));
    assert.doesNotThrow(() => assertHoneypotEmpty(""));
    assert.doesNotThrow(() => assertHoneypotEmpty("   "));
  });

  it("rejects bot submissions", () => {
    assert.throws(() => assertHoneypotEmpty("spam@bot.com"), (error: unknown) => {
      assert.ok(error instanceof ServiceError);
      assert.equal((error as ServiceError).code, "SPAM");
      assert.equal((error as ServiceError).status, 400);
      return true;
    });
  });
});
