import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CANONICAL_SITE_URL,
  toCanonicalSiteUrl,
} from "../../src/config/site";

describe("toCanonicalSiteUrl", () => {
  it("rewrites legacy shikshamahakumbh.com URLs", () => {
    assert.equal(
      toCanonicalSiteUrl("https://www.shikshamahakumbh.com/registration"),
      `${CANONICAL_SITE_URL}/registration`
    );
  });

  it("preserves rase.co.in URLs", () => {
    assert.equal(
      toCanonicalSiteUrl("https://www.rase.co.in/faq"),
      "https://www.rase.co.in/faq"
    );
  });
});
