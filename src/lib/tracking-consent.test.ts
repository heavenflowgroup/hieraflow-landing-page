import { describe, test, expect } from "bun:test";
import { permission, requiresConsent, type ConsentRecord } from "./tracking-consent";
const choice: ConsentRecord = { visitor: "test", at: "2026-10-20", version: "2026-10-20", region: "FR", analytics: true, advertising: false };
describe("regional tracking permission", () => {
  test("French visitors require consent", () => { expect(requiresConsent("FR")).toBe(true); expect(permission("analytics", "FR", null)).toBe(false); });
  test("unresolved region blocks tracking", () => { expect(permission("analytics", null, null)).toBe(false); expect(requiresConsent("XX")).toBe(true); });
  test("analytics acceptance does not authorize advertising", () => { expect(permission("analytics", "FR", choice)).toBe(true); expect(permission("advertising", "FR", choice)).toBe(false); });
  test("explicit refusal overrides a permitted region", () => { expect(permission("advertising", "US", choice)).toBe(false); expect(permission("analytics", "US", null)).toBe(true); });
  test("opt out overrides acceptance", () => { expect(permission("analytics", "US", choice, true)).toBe(false); });
});