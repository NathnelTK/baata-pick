import { ArrowUpRight, Facebook, Instagram, Menu, Music2, Phone, Send, X } from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher, useI18n } from "@/i18n";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand ${compact ? "brand--compact" : ""}`} href="/" aria-label="BAATA PICK home">
      <span className="brand-symbol brand-symbol--logo" aria-hidden="true">
        <img src="/baata-logo.png" alt="" />
      </span>
      <span className="brand-copy">
        <span className="brand-word">baata<span>.</span></span>
        {!compact && <span className="brand-caption">ETHIOPIA DELIVERY NETWORK</span>}
      </span>
    </a>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const links = [
    { href: "/#how-it-works", label: t.nav.howItWorks },
    { href: "/#coverage", label: t.nav.coverage },
    { href: "/#join", label: t.nav.join },
    { href: "/#faq", label: t.nav.faq },
    { href: "/#about", label: t.nav.about },
    { href: "/#contact", label: t.nav.contact },
  ];
  return (
    <header className="site-header">
      <div className="site-header-inner page-frame">
        <BrandMark />
        <button className="mobile-menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(value => !value)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav ${open ? "main-nav--open" : ""}`} aria-label="Main navigation">
          {links.map(link => <a key={link.href} href={link.href} onClick={close}>{link.label}</a>)}
          <a href="/privacy" onClick={close}>{t.footer.privacyNotice}</a>
          <LanguageSwitcher compact />
          <a className="button button--small button--dark nav-cta" href="/register" onClick={close}>{t.common.joinWaitlist} <ArrowUpRight size={15} /></a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="page-frame footer-main">
        <div className="footer-brand-block">
          <BrandMark />
          <p>{t.footer.tagline}</p>
          <div className="footer-social">
            <a href="tel:+251977739741" aria-label="Call BAATA PICK on 0977739741"><Phone size={17} /></a>
            <a href="https://t.me/BaataPic" target="_blank" rel="noreferrer" aria-label="BAATA PICK on Telegram"><Send size={17} /></a>
            <a href="https://www.tiktok.com/@baata.pick" target="_blank" rel="noreferrer" aria-label="BAATA PICK on TikTok"><Music2 size={17} /></a>
            <a href="https://instagram.com/baata_pick" target="_blank" rel="noreferrer" aria-label="BAATA PICK on Instagram"><Instagram size={17} /></a>
            <a href="https://www.facebook.com/profile.php?id=61595362771726" target="_blank" rel="noreferrer" aria-label="BAATA PICK on Facebook"><Facebook size={17} /></a>
          </div>
        </div>
        <div className="footer-links">
          <div>
            <span className="footer-label">{t.footer.joinNetwork}</span>
            <a href="/register">{t.common.joinWaitlist}</a>
            <a href="/register/customer">{t.footer.customerWaitlist}</a>
            <a href="/register/driver">{t.footer.driveWithBaata}</a>
            <a href="/register/business">{t.footer.businessPartners}</a>
          </div>
          <div>
            <span className="footer-label">{t.footer.baataPick}</span>
            <a href="/#about">{t.footer.aboutUs}</a>
            <a href="/#how-it-works">{t.footer.howItWorks}</a>
            <a href="/#contact">{t.footer.contactUs}</a>
            <a href="/#faq">{t.footer.faq}</a>
            <a href="/privacy">{t.footer.privacyNotice}</a>
          </div>
        </div>
      </div>
      <div className="page-frame footer-bottom">
        <span>© {new Date().getFullYear()} BAATA PICK. {t.footer.copyright}</span>
        <span className="footer-contact-note">0977739741 · t.me/BaataPic · @baata.pick · @baata_pick</span>
      </div>
    </footer>
  );
}
