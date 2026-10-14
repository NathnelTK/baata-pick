import { ArrowLeft, ArrowRight, ArrowUpRight, Bike, Store, UsersRound } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { useI18n } from "@/i18n";

export default function RegisterChooser() {
  const { t } = useI18n();
  const c = t.chooser;
  const options = [
    {
      href: "/register/customer",
      icon: <UsersRound size={24} />,
      index: c.customerIndex,
      title: c.customerTitle,
      description: c.customerDescription,
      cta: c.customerCta,
      className: "chooser-card--customer",
    },
    {
      href: "/register/driver",
      icon: <Bike size={24} />,
      index: c.driverIndex,
      title: c.driverTitle,
      description: c.driverDescription,
      cta: c.driverCta,
      className: "chooser-card--driver",
    },
    {
      href: "/register/business",
      icon: <Store size={24} />,
      index: c.businessIndex,
      title: c.businessTitle,
      description: c.businessDescription,
      cta: c.businessCta,
      className: "chooser-card--business",
    },
  ];
  return <div className="site-shell">
    <SiteHeader />
    <main className="chooser-page page-frame">
      <a className="back-link" href="/"><ArrowLeft size={16} /> {t.common.backToBaata}</a>
      <div className="chooser-head">
        <span className="form-overline">{c.overline}</span>
        <h1>{c.heading}</h1>
        <p>{c.intro}</p>
      </div>
      <div className="chooser-cards">
        {options.map(option => (
          <a className={`chooser-card ${option.className}`} href={option.href} key={option.title}>
            <div className="chooser-card-top"><span className="chooser-icon">{option.icon}</span><ArrowUpRight size={19} className="chooser-arrow" /></div>
            <span className="chooser-index">{option.index}</span>
            <h2>{option.title}</h2>
            <p>{option.description}</p>
            <span className="chooser-cta">{option.cta} <ArrowRight size={16} /></span>
          </a>
        ))}
      </div>
      <div className="registration-bottom-note"><span className="bottom-note-line" />{c.bottomNote}<span className="bottom-note-line" /></div>
    </main>
    <SiteFooter />
  </div>;
}
