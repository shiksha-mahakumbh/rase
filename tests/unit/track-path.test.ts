import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldTrackAnalytics } from "../../src/lib/analytics/track-path";

describe("shouldTrackAnalytics", () => {
  it("tracks public marketing paths", () => {
    assert.equal(shouldTrackAnalytics("/introduction"), true);
    assert.equal(shouldTrackAnalytics("/registration"), true);
  });

  it("excludes admin and API paths", () => {
    assert.equal(shouldTrackAnalytics("/admin"), false);
    assert.equal(shouldTrackAnalytics("/admin/registrations"), false);
    assert.equal(shouldTrackAnalytics("/api/v2/health"), false);
  });

  it("excludes internal data segments", () => {
    assert.equal(shouldTrackAnalytics("/noticeboarddata"), false);
    assert.equal(shouldTrackAnalytics("/reports/datadekh/summary"), false);
  });

  it("rejects empty paths", () => {
    assert.equal(shouldTrackAnalytics(null), false);
    assert.equal(shouldTrackAnalytics(""), false);
  });
});
