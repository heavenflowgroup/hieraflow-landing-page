import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CONSENT_KEY, CONSENT_NOTICE, readConsent, requiresConsent, saveConsent } from "@/lib/tracking-consent";
import { applyTrackingConsent, trackClick, trackPage } from "@/lib/traffic";

export const openCookieSettings = () => window.dispatchEvent(new Event("hieraflow-cookie-settings"));
export default function TrafficConsent() {
  const location = useLocation();
  const [region, setRegion] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [banner, setBanner] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    let mounted = true;
    (async () => {
      let country: string | null = null;
      try {
        const response = await fetch("/cdn-cgi/trace", { signal: controller.signal });
        if (response.ok) country = (await response.text()).match(/^loc=([A-Z]{2})$/m)?.[1] || null;
      } catch { /* Unknown location requires consent. */ }
      finally { clearTimeout(timeout); }
      if (!mounted) return;
      const record = readConsent();
      setRegion(country); setReady(true); setBanner(requiresConsent(country) && !record);
      setAnalytics(record?.analytics || false); setAdvertising(record?.advertising || false);
      applyTrackingConsent(country, record);
    })();
    return () => { mounted = false; clearTimeout(timeout); controller.abort(); };
  }, []);
  useEffect(() => {
    const open = () => {
      const record = readConsent();
      setAnalytics(record?.analytics || false); setAdvertising(record?.advertising || false); setSettings(true);
    };
    const sync = (event: StorageEvent) => {
      if (event.key !== CONSENT_KEY) return;
      const record = readConsent(); applyTrackingConsent(region, record);
      setBanner(requiresConsent(region) && !record); setAnalytics(record?.analytics || false); setAdvertising(record?.advertising || false);
    };
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("button, a, [role=button]");
      if (element) trackClick(element);
    };
    window.addEventListener("hieraflow-cookie-settings", open); window.addEventListener("storage", sync); document.addEventListener("click", click, true);
    return () => { window.removeEventListener("hieraflow-cookie-settings", open); window.removeEventListener("storage", sync); document.removeEventListener("click", click, true); };
  }, [region]);
  useEffect(() => { if (ready) trackPage(); }, [location.pathname]);
  const choose = (statistics: boolean, ads: boolean) => {
    const record = saveConsent(statistics, ads, region);
    setAnalytics(statistics); setAdvertising(ads); applyTrackingConsent(region, record); setBanner(false); setSettings(false);
  };
  return <>
    {banner && !settings && <section data-consent-ui aria-label="Choix des cookies" className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-background text-foreground shadow-elegant">
      <div className="container mx-auto p-5 flex flex-col lg:flex-row gap-5 lg:items-center">
        <div className="flex-1"><h2 className="font-bold text-lg mb-1">Vos choix de confidentialité</h2><p className="text-sm text-muted-foreground">Avec votre accord, Google Analytics mesure les visites et clics. Google Ads et Meta mesurent les campagnes publicitaires lorsqu’ils sont activés. Vous pouvez refuser ou modifier vos choix à tout moment.</p><a href="/confidentialite" className="text-sm text-primary underline">Politique de confidentialité</a></div>
        <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => choose(false, false)}>Tout refuser</Button><Button variant="outline" onClick={() => setSettings(true)}>Personnaliser</Button><Button variant="outline" onClick={() => choose(true, true)}>Tout accepter</Button></div>
      </div>
    </section>}
    <Dialog open={settings} onOpenChange={setSettings}><DialogContent data-consent-ui><DialogHeader><DialogTitle>Paramètres des cookies</DialogTitle><DialogDescription>Les cookies nécessaires restent actifs. Les autres choix sont indépendants et peuvent être retirés ici.</DialogDescription></DialogHeader>
      <div className="space-y-6">
        <div className="flex items-start gap-4"><label htmlFor="analytics-choice" className="flex-1"><span className="font-semibold">Statistiques</span><span className="block text-sm text-muted-foreground mt-1">{CONSENT_NOTICE.analytics}</span></label><Switch id="analytics-choice" checked={analytics} onCheckedChange={setAnalytics} /></div>
        <div className="flex items-start gap-4"><label htmlFor="advertising-choice" className="flex-1"><span className="font-semibold">Publicité</span><span className="block text-sm text-muted-foreground mt-1">{CONSENT_NOTICE.advertising}</span></label><Switch id="advertising-choice" checked={advertising} onCheckedChange={setAdvertising} /></div>
        <p className="text-sm text-muted-foreground">Votre décision, sa date, la région estimée, la version de cette information et un identifiant local sont conservés sur cet appareil, y compris après un retrait.</p>
        <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => choose(false, false)}>Tout refuser</Button><Button onClick={() => choose(analytics, advertising)}>Enregistrer mes choix</Button></div>
      </div>
    </DialogContent></Dialog>
  </>;
}