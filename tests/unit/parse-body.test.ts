import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { z } from "zod";
import { parseBody } from "../../src/lib/validation/parse-body";
import { ServiceError } from "../../src/server/lib/errors";

describe("parseBody", () => {
  const schema = z.object({
    email: z.string().email("Invalid email"),
  });

  it("returns parsed data for valid input", () => {
    const result = parseBody(schema, { email: "user@example.com" });
    assert.deepEqual(result, { email: "user@example.com" });
  });

  it("throws ServiceError for invalid input", () => {
    assert.throws(() => parseBody(schema, { email: "not-an-email" }), (error: unknown) => {
      assert.ok(error instanceof ServiceError);
      assert.equal((error as ServiceError).code, "VALIDATION");
      assert.equal((error as ServiceError).status, 400);
      return true;
    });
  });
});
