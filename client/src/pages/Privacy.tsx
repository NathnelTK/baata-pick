import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { useI18n } from "@/i18n";

export default function Privacy() {
  const { t } = useI18n();
  const p = t.privacy;
  return <div className="site-shell"><SiteHeader /><main className="privacy-page page-frame">
    <a className="back-link" href="/"><ArrowLeft size={16} /> {t.common.backToBaata}</a>
    <div className="privacy-header"><span className="privacy-icon"><LockKeyhole size={24} /></span><span className="form-overline">{p.overline}</span><h1>{p.title}</h1><p>{p.intro}</p></div>
    <div className="privacy-content">
      <section><h2>{p.collectTitle}</h2><p>{p.collectText}</p></section>
      <section><h2>{p.useTitle}</h2><p>{p.useText}</p></section>
      <section><h2>{p.whoTitle}</h2><p>{p.whoText}</p></section>
      <section><h2>{p.driverTitle}</h2><p>{p.driverText}</p></section>
      <section><h2>{p.protectTitle}</h2><p>{p.protectText}</p></section>
      <section><h2>{p.choicesTitle}</h2><p>{p.choicesText}</p></section>
      <aside className="privacy-callout"><ShieldCheck size={20} /><p><strong>{p.calloutStrong}</strong> {p.calloutText}</p></aside>
    </div>
    <p className="privacy-updated">{p.updated}</p>
  </main><SiteFooter /></div>;
}
