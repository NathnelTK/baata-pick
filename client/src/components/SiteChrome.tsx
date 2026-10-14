import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand ${compact ? "brand--compact" : ""}`} href="/" aria-label="Mela home">
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" role="img">
          <path d="M24 3.5C15.4 3.5 8.5 10.4 8.5 19c0 11.2 15.5 25.5 15.5 25.5S39.5 30.2 39.5 19C39.5 10.4 32.6 3.5 24 3.5Z" fill="currentColor" />
          <path d="M15.5 26.2v-12l8.3 7.1 8.7-7.1v12" stroke="#FFF9EE" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32.6" cy="14.2" r="2.6" fill="#E6BB62" />
        </svg>
      </span>
      <span className="brand-copy">
        <span className="brand-word">mela<span>.</span></span>
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
          <a className="button button--small button--dark nav-cta" href="/register/customer" onClick={close}>Join the waitlist <ArrowUpRight size={15} /></a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="page-frame footer-main">
        <div className="footer-brand-block">
          <BrandMark />
          <p>Thoughtfully connecting everyday needs, from the city street to the village road.</p>
        </div>
        <div className="footer-links">
          <div>
            <span className="footer-label">Join the network</span>
            <a href="/register/customer">Customer waitlist</a>
            <a href="/register/driver">Drive with Mela</a>
            <a href="/register/business">Business partners</a>
          </div>
          <div>
            <span className="footer-label">Mela</span>
            <a href="/#how-it-works">How it works</a>
            <a href="/#faq">Frequently asked</a>
            <a href="/privacy">Privacy notice</a>
          </div>
        </div>
      </div>
      <div className="page-frame footer-bottom">
        <span>© {new Date().getFullYear()} Mela. Preparing to launch across Ethiopia.</span>
        <span className="footer-contact-note">No public support line yet — register your interest and we’ll share launch updates.</span>
      </div>
    </footer>
  );
}
