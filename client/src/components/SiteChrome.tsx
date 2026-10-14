import { ArrowUpRight, Facebook, Instagram, Menu, Music2, Phone, Send, X } from "lucide-react";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <div className="site-header-inner page-frame">
        <BrandMark />
        <button className="mobile-menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(value => !value)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav ${open ? "main-nav--open" : ""}`} aria-label="Main navigation">
          <a href="/#how-it-works" onClick={close}>How it works</a>
          <a href="/#coverage" onClick={close}>Where we’re going</a>
          <a href="/#faq" onClick={close}>FAQs</a>
          <a href="/privacy" onClick={close}>Privacy</a>
          <a className="button button--small button--dark nav-cta" href="/register" onClick={close}>Join the waitlist <ArrowUpRight size={15} /></a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-frame footer-main">
        <div className="footer-brand-block">
          <BrandMark />
          <p>Thoughtfully connecting everyday needs, from the city street to the village road.</p>
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
            <span className="footer-label">Join the network</span>
            <a href="/register">Join the waitlist</a>
            <a href="/register/customer">Customer waitlist</a>
            <a href="/register/driver">Drive with BAATA</a>
            <a href="/register/business">Business partners</a>
          </div>
          <div>
            <span className="footer-label">BAATA PICK</span>
            <a href="/#about">About us</a>
            <a href="/#how-it-works">How it works</a>
            <a href="/#contact">Contact us</a>
            <a href="/#faq">Frequently asked</a>
            <a href="/privacy">Privacy notice</a>
          </div>
        </div>
      </div>
      <div className="page-frame footer-bottom">
        <span>© {new Date().getFullYear()} BAATA PICK. Preparing to launch across Ethiopia.</span>
        <span className="footer-contact-note">0977739741 · t.me/BaataPic · @baata.pick · @baata_pick</span>
      </div>
    </footer>
  );
}
