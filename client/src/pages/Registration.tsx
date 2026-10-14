import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useRoute } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { useI18n } from "@/i18n";
import { trpc } from "@/lib/trpc";

type Kind = "customer" | "driver" | "business";
const kinds: Kind[] = ["customer", "driver", "business"];

function TextField({ label, name, placeholder, type = "text", required = true, autoComplete, maxLength }: { label: string; name: string; placeholder?: string; type?: string; required?: boolean; autoComplete?: string; maxLength?: number }) {
  return <label className="form-field" htmlFor={name}><span className="field-label">{label}{required && <b aria-hidden="true">*</b>}</span><input id={name} name={name} type={type} placeholder={placeholder} required={required} autoComplete={autoComplete} maxLength={maxLength} /></label>;
}
function SelectField({ label, name, options, placeholder }: { label: string; name: string; options: { value: string; label: string }[]; placeholder: string }) {
  return <label className="form-field" htmlFor={name}><span className="field-label">{label}<b aria-hidden="true">*</b></span><select id={name} name={name} defaultValue="" required><option value="" disabled>{placeholder}</option>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}
function TextAreaField({ label, name, placeholder, maxLength = 1200 }: { label: string; name: string; placeholder: string; maxLength?: number }) {
  return <label className="form-field form-field--wide" htmlFor={name}><span className="field-label">{label}<b aria-hidden="true">*</b></span><textarea id={name} name={name} placeholder={placeholder} rows={4} required maxLength={maxLength} /></label>;
}

export default function Registration() {
  const { t } = useI18n();
  const f = t.forms;
  const [, params] = useRoute("/register/:kind");
  const selectedKind = (params?.kind ?? "customer") as Kind;
  const kind: Kind = kinds.includes(selectedKind) ? selectedKind : "customer";
  const [startedAt] = useState(() => Date.now());
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const customerMutation = trpc.customer.register.useMutation();
  const driverMutation = trpc.driver.register.useMutation();
  const businessMutation = trpc.business.register.useMutation();
  const isPending = customerMutation.isPending || driverMutation.isPending || businessMutation.isPending;
  const info = f.info[kind];
  const opts = f.options;

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
    <a className="back-link" href="/"><ArrowLeft size={16} /> {t.common.backToBaata}</a>
    <div className="registration-layout">
      <aside className="registration-aside">
        <span className="registration-step"><span>01</span> / 01 · {info.label.toUpperCase()}</span>
        <h1>{info.heading}</h1>
        <p>{info.intro}</p>
        <div className="aside-rule"><span /><span /><span /></div>
        <div className="aside-promise"><ShieldCheck size={19} /><p>{f.asidePromise}</p></div>
        <div className="role-switcher"><span>{f.chooseDifferent}</span><a className={kind === "customer" ? "role-link--active" : ""} href="/register/customer">{t.common.customer} <ArrowRight size={14} /></a><a className={kind === "driver" ? "role-link--active" : ""} href="/register/driver">{t.common.driver} <ArrowRight size={14} /></a><a className={kind === "business" ? "role-link--active" : ""} href="/register/business">{t.common.business} <ArrowRight size={14} /></a></div>
      </aside>
      <section className="registration-card" aria-labelledby="registration-title">
        <div className="registration-card-head"><div><span className="form-overline">{f.overline}</span><h2 id="registration-title">{submitted ? f.submittedTitle : info.label}</h2></div><span className="form-dot" /></div>
        {submitted ? <div className="success-state"><span className="success-icon"><Check size={24} /></span><h3>{f.successTitle}</h3><p>{f.successText}</p><a className="button button--dark" href="/">{f.successBack} <ArrowRight size={16} /></a><span className="success-privacy">{f.successPrivacy} <a href="/privacy">{t.common.privacyNotice}</a>.</span></div> : <form className="registration-form" onSubmit={handleSubmit}>
          <input type="hidden" name="startedAt" value={startedAt} readOnly />
          <div className="honeypot" aria-hidden="true"><label htmlFor="website">{f.honeypot}<input id="website" name="website" tabIndex={-1} autoComplete="off" /></label></div>
          {kind === "customer" && <>
            <div className="form-grid"><TextField label={f.fullName} name="fullName" placeholder={f.fullNamePh} autoComplete="name" maxLength={120} /><TextField label={f.phone} name="phone" type="tel" placeholder={f.phonePh} autoComplete="tel" maxLength={24} /></div>
            <div className="form-grid form-grid--three"><SelectField label={f.region} name="region" options={opts.regions} placeholder={t.common.selectOne} /><TextField label={f.zone} name="zone" placeholder={f.zonePh} maxLength={100} /><TextField label={f.woreda} name="woreda" placeholder={f.woredaPh} maxLength={100} /></div>
            <div className="form-grid"><TextField label={f.kebele} name="kebele" placeholder={f.kebelePh} maxLength={100} /><TextField label={f.email} name="email" type="email" placeholder={f.emailPh} required={false} autoComplete="email" maxLength={320} /></div>
            <div className="form-grid"><SelectField label={f.serviceQuestion} name="preferredDeliveryService" options={opts.services} placeholder={t.common.selectOne} /><SelectField label={f.frequencyQuestion} name="expectedFrequency" options={opts.frequencies} placeholder={t.common.selectOne} /></div>
            <p className="inline-privacy">{f.inlinePrivacyCustomer} <a href="/privacy">{t.common.privacyNotice}</a></p>
          </>}
          {kind === "driver" && <>
            <div className="form-grid"><TextField label={f.fullName} name="fullName" placeholder={f.fullNamePh} autoComplete="name" maxLength={120} /><TextField label={f.phone} name="phone" type="tel" placeholder={f.phonePh} autoComplete="tel" maxLength={24} /></div>
            <div className="form-grid"><SelectField label={f.region} name="region" options={opts.regions} placeholder={t.common.selectOne} /><TextField label={f.operatingArea} name="operatingArea" placeholder={f.operatingAreaPh} maxLength={180} /></div>
            <div className="form-grid"><SelectField label={f.vehicleType} name="vehicleType" options={opts.vehicleTypes} placeholder={t.common.selectOne} /><SelectField label={f.vehicleOwnership} name="vehicleOwnership" options={opts.ownershipTypes} placeholder={t.common.selectOne} /></div>
            <TextAreaField label={f.experience} name="experience" placeholder={f.experiencePh} maxLength={2000} />
            <TextField label={f.license} name="licenseDetails" placeholder={f.licensePh} maxLength={300} />
            <SelectField label={f.availability} name="availability" options={opts.availabilityOptions} placeholder={t.common.selectOne} />
            <div className="consent-stack"><label className="check-row"><input type="checkbox" name="accuracyConfirmed" required /><span>{f.accuracyConfirm}</span></label><label className="check-row"><input type="checkbox" name="privacyConsent" required /><span>{f.consentConfirm} <a href="/privacy">{t.common.privacyNotice}</a>.</span></label></div>
            <p className="inline-privacy">{f.inlinePrivacyDriver}</p>
          </>}
          {kind === "business" && <>
            <div className="form-grid"><TextField label={f.businessName} name="businessName" placeholder={f.businessNamePh} maxLength={160} /><TextField label={f.contactPerson} name="contactName" placeholder={f.contactPersonPh} autoComplete="name" maxLength={120} /></div>
            <div className="form-grid"><TextField label={f.phone} name="phone" type="tel" placeholder={f.phonePh} autoComplete="tel" maxLength={24} /><SelectField label={f.businessCategory} name="category" options={opts.businessCategories} placeholder={t.common.selectOne} /></div>
            <div className="form-grid"><SelectField label={f.region} name="region" options={opts.regions} placeholder={t.common.selectOne} /><TextField label={f.businessLocation} name="location" placeholder={f.businessLocationPh} maxLength={180} /></div>
            <TextAreaField label={f.productsQuestion} name="productsServices" placeholder={f.productsPh} maxLength={2000} />
            <TextAreaField label={f.needsQuestion} name="deliveryNeeds" placeholder={f.needsPh} maxLength={2000} />
            <p className="inline-privacy">{f.inlinePrivacyBusiness} <a href="/privacy">{t.common.privacyNotice}</a></p>
          </>}
          {submitError && <p className="form-error" role="alert">{f.submitError}</p>}
          <button className="button button--clay submit-button" type="submit" disabled={isPending}>{isPending ? f.saving : kind === "driver" ? f.submitDriver : kind === "business" ? f.submitBusiness : f.submitCustomer}<ArrowRight size={17} /></button>
          <p className="form-required-note"><span>*</span> {t.common.requiredNote}</p>
        </form>}
      </section>
    </div>
    <div className="registration-bottom-note"><span className="bottom-note-line" />{f.bottomNote}<span className="bottom-note-line" /></div>
  </main><SiteFooter /></div>;
}
