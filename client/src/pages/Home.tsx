import { ArrowDown, ArrowRight, ArrowUpRight, Bike, ChevronDown, Facebook, Instagram, MapPin, Music2, PackageCheck, Phone, Route, Send, ShieldCheck, Store, UsersRound } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { useI18n } from "@/i18n";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow"><span className="eyebrow-dot" />{children}</div>;
}

export default function Home() {
  const { t } = useI18n();
  const h = t.home;
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="hero-section page-frame">
          <div className="hero-copy">
            <Eyebrow>{h.eyebrow}</Eyebrow>
            <h1>{h.heroTitle1}<br />{h.heroTitle2} <em>{h.heroTitleEm}</em></h1>
            <p className="hero-lede">{h.heroLede}</p>
            <div className="hero-actions">
              <a className="button button--clay" href="/register">{h.heroCta} <ArrowUpRight size={17} /></a>
              <a className="text-link" href="#how-it-works">{h.heroHow} <ArrowDown size={15} /></a>
            </div>
            <div className="hero-footnote"><span className="route-mini" aria-hidden="true"><i /><i /><i /></span><span>{h.heroFootnote}</span></div>
          </div>
          <div className="hero-art-wrap">
            <div className="hero-art-frame hero-art-frame--banner">
              <img src="/hero-banner.png" alt="BAATA PICK — fast and reliable delivery. A courier on a delivery scooter brings a package to your door." />
            </div>
            <span className="hero-orbit hero-orbit--one" aria-hidden="true" />
            <span className="hero-orbit hero-orbit--two" aria-hidden="true" />
          </div>
          <div className="hero-bottom-line"><span>{h.bottomLine1}</span><span className="hero-bottom-dash" /><span>{h.bottomLine2}</span></div>
        </section>

        <section className="coverage-ribbon" aria-label="Intended service coverage">
          <div className="page-frame ribbon-inner"><span className="ribbon-label"><Route size={15} /> {h.ribbonLabel}</span><div className="ribbon-places"><span>{h.ribbonPlaces[0]}</span><i /><span>{h.ribbonPlaces[1]}</span><i /><span>{h.ribbonPlaces[2]}</span><i /><span>{h.ribbonPlaces[3]}</span></div><a href="/register" className="ribbon-link">{h.ribbonLink} <ArrowRight size={15} /></a></div>
        </section>

        <section className="section section-how page-frame" id="how-it-works">
          <div className="section-heading split-heading">
            <div><Eyebrow>{h.planEyebrow}</Eyebrow><h2>{h.planTitle1}<br /><em>{h.planTitleEm}</em></h2></div>
            <p>{h.planLede}</p>
          </div>
          <div className="steps-row">
            <article className="step-card"><div className="step-top"><span className="step-no">01</span><span className="step-icon"><UsersRound size={22} /></span></div><h3>{h.step1Title}</h3><p>{h.step1Text}</p><a href="/register/customer" className="step-link">{h.step1Link} <ArrowUpRight size={15} /></a></article>
            <span className="step-connector" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            <article className="step-card"><div className="step-top"><span className="step-no">02</span><span className="step-icon"><Bike size={23} /></span></div><h3>{h.step2Title}</h3><p>{h.step2Text}</p><a href="/register/driver" className="step-link">{h.step2Link} <ArrowUpRight size={15} /></a></article>
            <span className="step-connector" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            <article className="step-card"><div className="step-top"><span className="step-no">03</span><span className="step-icon"><PackageCheck size={23} /></span></div><h3>{h.step3Title}</h3><p>{h.step3Text}</p><a href="/register/business" className="step-link">{h.step3Link} <ArrowUpRight size={15} /></a></article>
          </div>
          <div className="planned-note"><ShieldCheck size={17} /><span>{h.plannedNote}</span></div>
        </section>

        <section className="coverage-section" id="coverage">
          <div className="page-frame coverage-layout">
            <div className="coverage-copy"><Eyebrow>{h.coverageEyebrow}</Eyebrow><h2>{h.coverageTitle}</h2><p>{h.coverageText}</p><p className="coverage-detail">{h.coverageDetail}</p><a href="/register/customer" className="button button--light">{h.coverageCta} <ArrowUpRight size={16} /></a></div>
            <div className="coverage-map-card" aria-label="Regions where BAATA is collecting launch interest">
              <div className="map-card-top"><span><MapPin size={16} /> {h.listeningLabel}</span><span className="listening-status"><i /> {h.preLaunch}</span></div>
              <div className="route-map-art" aria-hidden="true"><svg viewBox="0 0 560 230" preserveAspectRatio="xMidYMid meet"><path className="map-route map-route--one" d="M57 167 C112 151 124 107 189 122 S264 176 314 139 371 58 421 80 476 106 513 46"/><path className="map-route map-route--two" d="M97 46 C145 69 165 84 205 75 S269 34 313 66 354 119 401 130 467 156 493 189"/><path className="map-contour" d="M28 89c47-39 98-46 149-28s83 6 126-14 84-24 127 4 75 20 114-3M25 108c45-34 87-38 134-21s93 15 137-3 78-22 118 1 78 23 132 0M39 204c56-33 93-40 148-27s84 23 133 0 96-33 144-11 60 18 84 9"/><circle className="map-point map-point--large" cx="57" cy="167" r="7"/><circle className="map-point" cx="189" cy="122" r="5"/><circle className="map-point" cx="314" cy="139" r="5"/><circle className="map-point map-point--large" cx="421" cy="80" r="7"/><circle className="map-point" cx="513" cy="46" r="5"/><circle className="map-point" cx="97" cy="46" r="5"/><circle className="map-point" cx="313" cy="66" r="5"/><circle className="map-point" cx="493" cy="189" r="5"/></svg><span className="map-label map-label--left">{h.mapLabelLeft}</span><span className="map-label map-label--right">{h.mapLabelRight}</span></div>
              <div className="region-chip-list">{t.forms.options.regions.map(region => <span className="region-chip" key={region.value}>{region.label}</span>)}</div>
              <p className="map-caption">{h.mapCaption}</p>
            </div>
          </div>
        </section>

        <section className="section audience-section page-frame" id="join">
          <div className="section-heading split-heading"><div><Eyebrow>{h.audienceEyebrow}</Eyebrow><h2>{h.audienceTitle1}<br /><em>{h.audienceTitleEm}</em></h2></div><p>{h.audienceLede}</p></div>
          <div className="audience-cards">
            <a href="/register/customer" className="audience-card audience-card--customer"><div className="audience-card-top"><span className="audience-icon"><UsersRound size={22} /></span><ArrowUpRight size={19} className="audience-arrow" /></div><span className="audience-index">{h.aud1Index}</span><h3>{h.aud1Title}<br /><em>{h.aud1TitleEm}</em></h3><p>{h.aud1Text}</p><span className="audience-cta">{h.aud1Cta} <ArrowRight size={16} /></span><span className="audience-route" aria-hidden="true">········</span></a>
            <a href="/register/driver" className="audience-card audience-card--driver"><div className="audience-card-top"><span className="audience-icon"><Bike size={22} /></span><ArrowUpRight size={19} className="audience-arrow" /></div><span className="audience-index">{h.aud2Index}</span><h3>{h.aud2Title}<br /><em>{h.aud2TitleEm}</em></h3><p>{h.aud2Text}</p><span className="audience-cta">{h.aud2Cta} <ArrowRight size={16} /></span><span className="audience-route" aria-hidden="true">········</span></a>
            <a href="/register/business" className="audience-card audience-card--business"><div className="audience-card-top"><span className="audience-icon"><Store size={22} /></span><ArrowUpRight size={19} className="audience-arrow" /></div><span className="audience-index">{h.aud3Index}</span><h3>{h.aud3Title}<br /><em>{h.aud3TitleEm}</em></h3><p>{h.aud3Text}</p><span className="audience-cta">{h.aud3Cta} <ArrowRight size={16} /></span><span className="audience-route" aria-hidden="true">········</span></a>
          </div>
        </section>

        <section className="section faq-section page-frame" id="faq">
          <div className="faq-intro"><Eyebrow>{h.faqEyebrow}</Eyebrow><h2>{h.faqTitle1}<br /><em>{h.faqTitleEm}</em></h2><p>{h.faqIntro}</p><a className="text-link" href="#contact">{h.faqAsk} <ArrowRight size={15} /></a></div>
          <div className="faq-list">{h.faq.map((item, index) => <details className="faq-item" key={index} open={index === 0}><summary><span>{item.question}</span><ChevronDown size={18} /></summary><p>{item.answer}</p></details>)}</div>
        </section>

        <section className="section about-section page-frame" id="about">
          <div className="section-heading split-heading">
            <div><Eyebrow>{h.aboutEyebrow}</Eyebrow><h2>{h.aboutTitle1}<br /><em>{h.aboutTitleEm}</em></h2></div>
            <p>{h.aboutLede}</p>
          </div>
          <div className="about-grid">
            <article className="about-card"><h3>{h.about1Title}</h3><p>{h.about1Text}</p></article>
            <article className="about-card"><h3>{h.about2Title}</h3><p>{h.about2Text}</p></article>
            <article className="about-card"><h3>{h.about3Title}</h3><p>{h.about3Text}</p></article>
          </div>
        </section>

        <section className="section contact-section page-frame" id="contact">
          <div className="section-heading split-heading">
            <div><Eyebrow>{h.contactEyebrow}</Eyebrow><h2>{h.contactTitle1}<br /><em>{h.contactTitleEm}</em></h2></div>
            <p>{h.contactLede}</p>
          </div>
          <div className="contact-grid">
            <a className="contact-card" href="tel:+251977739741"><span className="contact-icon"><Phone size={20} /></span><span className="contact-copy"><strong>{h.phone}</strong><span>0977739741</span></span><ArrowUpRight size={17} /></a>
            <a className="contact-card" href="https://t.me/BaataPic" target="_blank" rel="noreferrer"><span className="contact-icon"><Send size={20} /></span><span className="contact-copy"><strong>{h.telegram}</strong><span>t.me/BaataPic</span></span><ArrowUpRight size={17} /></a>
            <a className="contact-card" href="https://www.tiktok.com/@baata.pick" target="_blank" rel="noreferrer"><span className="contact-icon"><Music2 size={20} /></span><span className="contact-copy"><strong>{h.tiktok}</strong><span>@baata.pick</span></span><ArrowUpRight size={17} /></a>
            <a className="contact-card" href="https://instagram.com/baata_pick" target="_blank" rel="noreferrer"><span className="contact-icon"><Instagram size={20} /></span><span className="contact-copy"><strong>{h.instagram}</strong><span>@baata_pick</span></span><ArrowUpRight size={17} /></a>
            <a className="contact-card" href="https://www.facebook.com/profile.php?id=61595362771726" target="_blank" rel="noreferrer"><span className="contact-icon"><Facebook size={20} /></span><span className="contact-copy"><strong>{h.facebook}</strong><span>BAATA PICK</span></span><ArrowUpRight size={17} /></a>
          </div>
        </section>

        <section className="final-cta page-frame"><div className="final-cta-inner"><div className="final-cta-mark"><Route size={25} /></div><div className="final-cta-copy"><span className="final-cta-kicker">{h.finalKicker}</span><h2>{h.finalTitle}</h2><p>{h.finalText}</p></div><a className="button button--light" href="/register">{h.finalButton} <ArrowUpRight size={16} /></a><span className="cta-route-trail" aria-hidden="true">····················</span></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
