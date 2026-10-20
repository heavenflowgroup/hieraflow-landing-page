import { permission, readConsent, type ConsentRecord } from "./tracking-consent";
type Pixel = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; push?: Pixel; loaded: boolean; version: string };
declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; fbq?: Pixel; _fbq?: Pixel; }
}
const ga = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY;
const ads = import.meta.env.VITE_GOOGLE_ADS_TAG_ID;
const pixel = import.meta.env.VITE_META_PIXEL_ID;
let region: string | null = null;
let current: ConsentRecord | null = null;
let googleLoaded = false;
let metaLoaded = false;
let analyticsAllowed = false;
let advertisingAllowed = false;
let currentPath = "/";
const path = () => location.pathname.startsWith("/livre-blanc/") ? "/livre-blanc" : ["/", "/qui-sommes-nous", "/accessibilite", "/confidentialite"].includes(location.pathname) ? location.pathname : "/autre";
function optOut() { return navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true; }
function allowed(kind: "analytics" | "advertising") { return permission(kind, region, readConsent() || current, optOut()); }
function script(id: string, src: string) {
  if (document.getElementById(id)) return;
  const element = document.createElement("script"); element.id = id; element.async = true; element.src = src; document.head.appendChild(element);
}
export function applyTrackingConsent(nextRegion: string | null, record: ConsentRecord | null) {
  region = nextRegion; current = record;
  const analytics = allowed("analytics"), advertising = allowed("advertising");
  if (ga) (window as unknown as Record<string, unknown>)[`ga-disable-${ga}`] = !analytics;
  window.dataLayer ||= [];
  window.gtag ||= function (..._args: unknown[]) { window.dataLayer?.push(arguments); };
  window.gtag("consent", googleLoaded ? "update" : "default", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: advertising ? "granted" : "denied",
    ad_user_data: "denied", ad_personalization: advertising ? "granted" : "denied",
  });
  if ((analytics && ga) || (advertising && ads)) {
    if (!googleLoaded) {
      googleLoaded = true;
      window.gtag("set", "developer_id.dZjgwMW", true);
      window.gtag("js", new Date());
      script("hieraflow-google-tag", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga || ads)}`);
    }
    if (analytics && ga && !analyticsAllowed) window.gtag("config", ga, { send_page_view: false, page_location: `${location.origin}${path()}`, page_referrer: "", page_title: "Hieraflow", allow_google_signals: false, allow_ad_personalization_signals: false });
    if (advertising && ads && !advertisingAllowed) window.gtag("config", ads, { send_page_view: false });
  }
  if (advertising && pixel && !metaLoaded) {
    const fbq: Pixel = Object.assign(function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, args); else fbq.queue.push(args);
    }, { queue: [] as unknown[][], loaded: true, version: "2.0" });
    fbq.push = fbq; window.fbq = fbq; window._fbq = fbq;
    fbq("set", "autoConfig", false, pixel);
    fbq("init", pixel, {}, { agent: "lovable" });
    metaLoaded = true;
    script("hieraflow-meta-pixel", "https://connect.facebook.net/en_US/fbevents.js");
  }
  if (metaLoaded) window.fbq?.("consent", advertising ? "grant" : "revoke");
  const newlyAllowed = (analytics && !analyticsAllowed) || (advertising && !advertisingAllowed);
  analyticsAllowed = analytics; advertisingAllowed = advertising;
  if (newlyAllowed) trackPage();
}
export function trackPage() {
  currentPath = path();
  const pageLocation = `${location.origin}${currentPath}`;
  if (ga && allowed("analytics")) window.gtag?.("event", "page_view", { send_to: ga, page_path: currentPath, page_location: pageLocation, page_title: "Hieraflow", page_referrer: "" });
  if (ads && allowed("advertising")) window.gtag?.("event", "page_view", { send_to: ads, page_location: pageLocation, page_title: "Hieraflow", page_referrer: "" });
  // Meta reads the current URL itself: do not send pages containing query parameters or an unknown path.
  if (pixel && allowed("advertising") && !location.search && path() === location.pathname) window.fbq?.("track", "PageView");
}
export function trackClick(element: HTMLElement) {
  if (!ga || !allowed("analytics") || element.closest("[data-consent-ui]")) return;
  const section = element.closest("section[id]")?.id || (element.closest("header") ? "navigation" : element.closest("footer") ? "footer" : "page");
  const peers = Array.from(document.querySelectorAll("button, a, [role=button]"));
  window.gtag?.("event", "button_click", { send_to: ga, page_location: `${location.origin}${currentPath}`, page_referrer: "", section, button_id: element.dataset.track || element.id || `${section}_${element.tagName.toLowerCase()}_${peers.indexOf(element)}`, interaction_type: element.tagName.toLowerCase() });
}