import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useRoute } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";

const regions = [
  "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Central Ethiopia", "Dire Dawa", "Gambella", "Harari", "Oromia", "Sidama", "Somali", "South Ethiopia", "Southwest Ethiopia", "Tigray",
];
const services = ["Meals & prepared food", "Groceries & household goods", "Market shopping", "Farm produce", "Pharmacy & health items", "Documents & parcels", "Other / not sure yet"];
const frequencies = ["Daily", "Several times a week", "About once a week", "A few times a month", "Occasionally", "Not sure yet"];
const vehicleTypes = ["Motorbike", "Bicycle", "Bajaj / three-wheeler", "Car or pickup", "Van", "Other"];
const ownershipTypes = ["Personally owned", "Family-owned", "Leased or rented", "Company-provided", "Other"];
const availabilityOptions = ["Weekdays", "Weekends", "Evenings", "Flexible", "Not decided yet"];
const businessCategories = ["Grocery / mini-market", "Restaurant / café", "Farm / producer", "Pharmacy / health", "Retail shop", "Marketplace / cooperative", "Other"];

const formInfo = {
  customer: { label: "Customer waitlist", heading: "Tell us what your area needs.", intro: "No account. No order. Just a quick way to help us understand the deliveries people want near them." },
  driver: { label: "Driver application", heading: "Let’s get to know your route.", intro: "Share a few details about where you work, your vehicle, and when you’re available. Applications are reviewed manually." },
  business: { label: "Business partnership", heading: "Let’s help your business reach further.", intro: "Tell us what you sell and what delivery could make possible for your customers." },
};
type Kind = keyof typeof formInfo;

function TextField({ label, name, placeholder, type = "text", required = true, autoComplete, maxLength }: { label: string; name: string; placeholder?: string; type?: string; required?: boolean; autoComplete?: string; maxLength?: number }) {
  return <label className="form-field" htmlFor={name}><span className="field-label">{label}{required && <b aria-hidden="true">*</b>}</span><input id={name} name={name} type={type} placeholder={placeholder} required={required} autoComplete={autoComplete} maxLength={maxLength} /></label>;
}
function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <label className="form-field" htmlFor={name}><span className="field-label">{label}<b aria-hidden="true">*</b></span><select id={name} name={name} defaultValue="" required><option value="" disabled>Select one</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>;
}
function AreaField({ label = "Region" }: { label?: string }) { return <SelectField label={label} name="region" options={regions} />; }
function AreaTextField({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) { return <TextField label={label} name={name} placeholder={placeholder} maxLength={100} />; }
function TextAreaField({ label, name, placeholder, maxLength = 1200 }: { label: string; name: string; placeholder: string; maxLength?: number }) {
  return <label className="form-field form-field--wide" htmlFor={name}><span className="field-label">{label}<b aria-hidden="true">*</b></span><textarea id={name} name={name} placeholder={placeholder} rows={4} required maxLength={maxLength} /></label>;
}

export default function Registration() {
  const [, params] = useRoute("/register/:kind");
  const selectedKind = (params?.kind ?? "customer") as Kind;
  const kind: Kind = selectedKind in formInfo ? selectedKind : "customer";
  const [startedAt] = useState(() => Date.now());
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const customerMutation = trpc.customer.register.useMutation();
  const driverMutation = trpc.driver.register.useMutation();
  const businessMutation = trpc.business.register.useMutation();
  const isPending = customerMutation.isPending || driverMutation.isPending || businessMutation.isPending;
  const info = formInfo[kind];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(false);
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const common = { website: value("website"), startedAt: Number(value("startedAt")) || startedAt };
    const phone = value("phone");
    if (kind === "customer") {
      customerMutation.mutate({ ...common, fullName: value("fullName"), phone, email: value("email"), region: value("region"), zone: value("zone"), woreda: value("woreda"), kebele: value("kebele"), preferredDeliveryService: value("preferredDeliveryService"), expectedFrequency: value("expectedFrequency") }, { onSuccess: () => setSubmitted(true), onError: () => setSubmitError(true) });
    } else if (kind === "driver") {
      driverMutation.mutate({ ...common, fullName: value("fullName"), phone, region: value("region"), operatingArea: value("operatingArea"), vehicleType: value("vehicleType"), vehicleOwnership: value("vehicleOwnership"), experience: value("experience"), licenseDetails: value("licenseDetails"), availability: value("availability"), accuracyConfirmed: data.has("accuracyConfirmed") as true, privacyConsent: data.has("privacyConsent") as true }, { onSuccess: () => setSubmitted(true), onError: () => setSubmitError(true) });
    } else {
      businessMutation.mutate({ ...common, businessName: value("businessName"), contactName: value("contactName"), phone, category: value("category"), region: value("region"), location: value("location"), productsServices: value("productsServices"), deliveryNeeds: value("deliveryNeeds") }, { onSuccess: () => setSubmitted(true), onError: () => setSubmitError(true) });
    }
  }

  return <div className="site-shell"><SiteHeader /><main className="registration-page page-frame">
    <a className="back-link" href="/"><ArrowLeft size={16} /> Back to Mela</a>
    <div className="registration-layout">
      <aside className="registration-aside">
        <span className="registration-step"><span>01</span> / 01 · {info.label.toUpperCase()}</span>
        <h1>{info.heading}</h1>
        <p>{info.intro}</p>
        <div className="aside-rule"><span /><span /><span /></div>
        <div className="aside-promise"><ShieldCheck size={19} /><p>Your details help us plan. We’ll keep them private and use them only to understand demand or follow up about Mela’s launch.</p></div>
        <div className="role-switcher"><span>Choose a different path</span><a className={kind === "customer" ? "role-link--active" : ""} href="/register/customer">Customer <ArrowRight size={14} /></a><a className={kind === "driver" ? "role-link--active" : ""} href="/register/driver">Driver <ArrowRight size={14} /></a><a className={kind === "business" ? "role-link--active" : ""} href="/register/business">Business <ArrowRight size={14} /></a></div>
      </aside>
      <section className="registration-card" aria-labelledby="registration-title">
        <div className="registration-card-head"><div><span className="form-overline">PREPARING TO LAUNCH</span><h2 id="registration-title">{submitted ? "You’re on our radar." : info.label}</h2></div><span className="form-dot" /></div>
        {submitted ? <div className="success-state"><span className="success-icon"><Check size={24} /></span><h3>Thank you for being part of what comes next.</h3><p>If this is a new registration, it has been added to the launch list. We’ll share updates as Mela prepares to reach your area.</p><a className="button button--dark" href="/">Back to Mela <ArrowRight size={16} /></a><span className="success-privacy">No ordering is open yet. See our <a href="/privacy">privacy notice</a>.</span></div> : <form className="registration-form" onSubmit={handleSubmit}>
          <input type="hidden" name="startedAt" value={startedAt} readOnly />
          <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty<input id="website" name="website" tabIndex={-1} autoComplete="off" /></label></div>
          {kind === "customer" && <>
            <div className="form-grid"><TextField label="Full name" name="fullName" placeholder="The name you go by" autoComplete="name" maxLength={120} /><TextField label="Phone number" name="phone" type="tel" placeholder="+251 9…" autoComplete="tel" maxLength={24} /></div>
            <div className="form-grid form-grid--three"><AreaField /><AreaTextField label="Zone" name="zone" placeholder="Your zone" /><AreaTextField label="Woreda" name="woreda" placeholder="Your woreda" /></div>
            <div className="form-grid"><AreaTextField label="Kebele" name="kebele" placeholder="Your kebele" /><TextField label="Email (optional)" name="email" type="email" placeholder="you@example.com" required={false} autoComplete="email" maxLength={320} /></div>
            <div className="form-grid"><SelectField label="What would you like delivered?" name="preferredDeliveryService" options={services} /><SelectField label="How often might you use delivery?" name="expectedFrequency" options={frequencies} /></div>
            <p className="inline-privacy">Joining the waitlist doesn’t place an order. Your details help us plan around your area. <a href="/privacy">Privacy notice</a></p>
          </>}
          {kind === "driver" && <>
            <div className="form-grid"><TextField label="Full name" name="fullName" placeholder="The name you go by" autoComplete="name" maxLength={120} /><TextField label="Phone number" name="phone" type="tel" placeholder="+251 9…" autoComplete="tel" maxLength={24} /></div>
            <div className="form-grid"><AreaField /><TextField label="Preferred operating area" name="operatingArea" placeholder="Town, woreda, or kebele" maxLength={180} /></div>
            <div className="form-grid"><SelectField label="Vehicle type" name="vehicleType" options={vehicleTypes} /><SelectField label="Vehicle ownership" name="vehicleOwnership" options={ownershipTypes} /></div>
            <TextAreaField label="Driving or delivery experience" name="experience" placeholder="Tell us about your experience and the routes you know." maxLength={2000} />
            <TextField label="Relevant driving-license details" name="licenseDetails" placeholder="License type and relevant details; no document upload" maxLength={300} />
            <SelectField label="Availability" name="availability" options={availabilityOptions} />
            <div className="consent-stack"><label className="check-row"><input type="checkbox" name="accuracyConfirmed" required /><span>I confirm that the information I’ve provided is accurate.</span></label><label className="check-row"><input type="checkbox" name="privacyConsent" required /><span>I have read and consent to the <a href="/privacy">privacy notice</a>.</span></label></div>
            <p className="inline-privacy">Application status is progress only; approval is not legal clearance. Please don’t upload documents.</p>
          </>}
          {kind === "business" && <>
            <div className="form-grid"><TextField label="Business name" name="businessName" placeholder="Shop or business name" maxLength={160} /><TextField label="Contact person" name="contactName" placeholder="Your name" autoComplete="name" maxLength={120} /></div>
            <div className="form-grid"><TextField label="Phone number" name="phone" type="tel" placeholder="+251 9…" autoComplete="tel" maxLength={24} /><SelectField label="Business category" name="category" options={businessCategories} /></div>
            <div className="form-grid"><AreaField /><TextField label="Business location" name="location" placeholder="Town, woreda, or kebele" maxLength={180} /></div>
            <TextAreaField label="What products or services would you deliver?" name="productsServices" placeholder="A short description of what your business offers." maxLength={2000} />
            <TextAreaField label="What delivery needs do you have?" name="deliveryNeeds" placeholder="For example: local customer orders, farm-to-market deliveries, or scheduled routes." maxLength={2000} />
            <p className="inline-privacy">Your details will be used to understand partnership needs and share relevant launch updates. <a href="/privacy">Privacy notice</a></p>
          </>}
          {submitError && <p className="form-error" role="alert">We couldn’t save your details just now. Please check your connection and try again.</p>}
          <button className="button button--clay submit-button" type="submit" disabled={isPending}>{isPending ? "Saving your details…" : kind === "driver" ? "Send driver application" : kind === "business" ? "Register business interest" : "Join the customer waitlist"}<ArrowRight size={17} /></button>
          <p className="form-required-note"><span>*</span> Required fields · No account needed</p>
        </form>}
      </section>
    </div>
    <div className="registration-bottom-note"><span className="bottom-note-line" />Mela is preparing to launch. This form is for interest only—orders aren’t open yet.<span className="bottom-note-line" /></div>
  </main><SiteFooter /></div>;
}
