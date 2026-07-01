import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  globalSearch,
  MAX_SEARCH_QUERY_LENGTH,
  searchEcosystem,
} from "../../src/lib/ecosystem/search";

describe("ecosystem search", () => {
  it("returns no results for blank queries", () => {
    assert.deepEqual(globalSearch(""), []);
    assert.deepEqual(globalSearch("   "), []);
  });

  it("caps query length without throwing", () => {
    const longQuery = "education ".repeat(Math.ceil(MAX_SEARCH_QUERY_LENGTH / 10));
    assert.doesNotThrow(() => globalSearch(longQuery));
    assert.doesNotThrow(() => searchEcosystem({ q: longQuery }));
  });

  it("finds known ecosystem content", () => {
    const results = globalSearch("Shiksha");
    assert.ok(results.length > 0);
  });
});
