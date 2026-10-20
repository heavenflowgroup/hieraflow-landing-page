export const CONSENT_KEY = "hieraflow-tracking-consent-v1";
export const NOTICE_VERSION = "2026-10-20";
export const CONSENT_NOTICE = {
  analytics: "Google Analytics : pages consultées, clics, appareil et origine du trafic, avec identifiants de cookies, pour mesurer la fréquentation.",
  advertising: "Google Ads et Meta (Facebook/Instagram) : pages consultées et identifiants publicitaires, pour mesurer les campagnes et permettre leur optimisation. Aucun contenu de formulaire n’est transmis par ce suivi.",
};
const regulated = new Set("AT BE BG HR CY CZ DK EE FI FR DE GR HU IS IE IT LV LI LT LU MT NL NO PL PT RO SK SI ES SE GB CH BR CA".split(" "));
export type ConsentRecord = {
  visitor: string; at: string; version: string; region: string | null;
  analytics: boolean; advertising: boolean;
};
export function requiresConsent(region: string | null) {
  return !region || !/^[A-Z]{2}$/.test(region) || region === "XX" || region === "T1" || regulated.has(region);
}
export function permission(kind: "analytics" | "advertising", region: string | null, record: ConsentRecord | null, optOut = false) {
  if (optOut) return false;
  if (record) return record[kind] === true;
  return !requiresConsent(region);
}
export function readConsent(): ConsentRecord | null {
  try {
    const records: ConsentRecord[] = JSON.parse(localStorage.getItem(CONSENT_KEY) || "[]");
    const record = records[records.length - 1];
    if (!record || record.version !== NOTICE_VERSION || typeof record.analytics !== "boolean" || typeof record.advertising !== "boolean") return null;
    return record;
  } catch { return null; }
}
export function saveConsent(analytics: boolean, advertising: boolean, region: string | null) {
  const previous = readConsent();
  const record: ConsentRecord = { visitor: previous?.visitor || crypto.randomUUID(), at: new Date().toISOString(), version: NOTICE_VERSION, region, analytics, advertising };
  try {
    const records = JSON.parse(localStorage.getItem(CONSENT_KEY) || "[]");
    localStorage.setItem(CONSENT_KEY, JSON.stringify([...records, record]));
  } catch { /* Storage unavailable: apply this choice only for the current page. */ }
  return record;
}