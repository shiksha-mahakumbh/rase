import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { openGraphLocale } from "../../src/lib/seo/locale";

describe("openGraphLocale", () => {
  it("maps Hindi to hi_IN", () => {
    assert.equal(openGraphLocale("hi"), "hi_IN");
  });

  it("defaults other locales to en_IN", () => {
    assert.equal(openGraphLocale("en"), "en_IN");
    assert.equal(openGraphLocale(""), "en_IN");
  });
});
