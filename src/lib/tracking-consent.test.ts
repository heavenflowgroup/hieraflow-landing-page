import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { permission, requiresConsent, type ConsentRecord } from "./tracking-consent";
const choice: ConsentRecord = { visitor: "test", at: "2026-10-20", version: "2026-10-20", region: "FR", analytics: true, advertising: false };
describe("regional tracking permission", () => {
  test("French visitors require consent", () => { assert.equal(requiresConsent("FR"), true); assert.equal(permission("analytics", "FR", null), false); });
  test("unresolved region blocks tracking", () => { assert.equal(permission("analytics", null, null), false); assert.equal(requiresConsent("XX"), true); });
  test("analytics acceptance does not authorize advertising", () => { assert.equal(permission("analytics", "FR", choice), true); assert.equal(permission("advertising", "FR", choice), false); });
  test("explicit refusal overrides a permitted region", () => { assert.equal(permission("advertising", "US", choice), false); assert.equal(permission("analytics", "US", null), true); });
  test("opt out overrides acceptance", () => { assert.equal(permission("analytics", "US", choice, true), false); });
});