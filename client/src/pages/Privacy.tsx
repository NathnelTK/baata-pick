import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function Privacy() {
  return <div className="site-shell"><SiteHeader /><main className="privacy-page page-frame">
    <a className="back-link" href="/"><ArrowLeft size={16} /> Back to Mela</a>
    <div className="privacy-header"><span className="privacy-icon"><LockKeyhole size={24} /></span><span className="form-overline">YOUR INFORMATION, EXPLAINED</span><h1>Privacy, in plain language.</h1><p>We’re preparing to launch. These forms help us understand local demand and plan responsibly.</p></div>
    <div className="privacy-content">
      <section><h2>What we collect</h2><p>Depending on the form, Mela collects your name, phone number, location, and the delivery interests you describe. Customers may add an email address. Driver applicants provide vehicle, experience, availability, and relevant license details. Businesses share their category, location, products or services, and delivery needs.</p></section>
      <section><h2>Why we use it</h2><p>We use registration information to understand demand by area, review driver applications and business interest, plan the service, and contact people about relevant launch updates. Joining the waitlist does not create an account or place an order.</p></section>
      <section><h2>Who can see it</h2><p>Registration records are available only to authorized Mela administrators for these purposes. They are not shown publicly. We do not sell your personal information. We may use aggregated area counts to understand where interest is growing.</p></section>
      <section><h2>Driver applications</h2><p>Driver application statuses—Pending, Under Review, Approved, or Rejected—describe review progress only. They do not confirm legal clearance to operate. Please do not upload identity documents or send copies of your license through this website.</p></section>
      <section><h2>How we protect it</h2><p>Registration data is submitted over the site, validated by the server, and stored in the site's protected database. Basic anti-spam controls are applied. No website can promise zero risk, so please share only the information requested on the form.</p></section>
      <section><h2>Your choices and questions</h2><p>Submitting a form is optional. No public support email or phone number has been provided yet; Mela will publish its contact and data-request channel before a public service launch. You may wait to submit until those details are available.</p></section>
      <aside className="privacy-callout"><ShieldCheck size={20} /><p><strong>Only share what’s needed.</strong> The registration forms are for pre-launch interest. They do not request passwords, payment information, or document uploads.</p></aside>
    </div>
    <p className="privacy-updated">This notice is for the Mela pre-launch registration website. It should be reviewed and updated with the operator’s legal identity, contact details, and retention policy before public launch.</p>
  </main><SiteFooter /></div>;
}
