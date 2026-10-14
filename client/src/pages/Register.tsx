import { ArrowLeft, ArrowRight, ArrowUpRight, Bike, Store, UsersRound } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const options = [
  {
    href: "/register/customer",
    icon: <UsersRound size={24} />,
    index: "FOR HOMES & INDIVIDUALS",
    title: "Customer",
    description: "Join the waitlist and tell us what you’d like delivered in your area.",
    cta: "Join the customer waitlist",
    className: "chooser-card--customer",
  },
  {
    href: "/register/driver",
    icon: <Bike size={24} />,
    index: "FOR LOCAL DRIVERS",
    title: "Driver",
    description: "Apply to drive with BAATA using the vehicle you have and the routes you know.",
    cta: "Apply to drive",
    className: "chooser-card--driver",
  },
  {
    href: "/register/business",
    icon: <Store size={24} />,
    index: "FOR SHOPS & BUSINESSES",
    title: "Business owner",
    description: "Register your business interest and tell us what delivery could unlock for you.",
    cta: "Register business interest",
    className: "chooser-card--business",
  },
];

export default function RegisterChooser() {
  return <div className="site-shell">
    <SiteHeader />
    <main className="chooser-page page-frame">
      <a className="back-link" href="/"><ArrowLeft size={16} /> Back to BAATA</a>
      <div className="chooser-head">
        <span className="form-overline">JOIN THE WAITLIST</span>
        <h1>How do you want to register?</h1>
        <p>Choose the path that fits you. Each form takes a few minutes, and your details help us plan the first routes.</p>
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
      <div className="registration-bottom-note"><span className="bottom-note-line" />BAATA is preparing to launch. Registration is for interest only—orders aren’t open yet.<span className="bottom-note-line" /></div>
    </main>
    <SiteFooter />
  </div>;
}
