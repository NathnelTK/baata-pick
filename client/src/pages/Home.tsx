import { ArrowDown, ArrowRight, ArrowUpRight, Bike, Building2, Check, ChevronDown, MapPin, PackageCheck, Route, ShieldCheck, Store, UsersRound } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const regionNames = [
  "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Central Ethiopia", "Dire Dawa", "Gambella", "Harari", "Oromia", "Sidama", "Somali", "South Ethiopia", "Southwest Ethiopia", "Tigray",
];

const faqs = [
  { question: "Is Mela delivering orders right now?", answer: "Not yet. Mela is preparing to launch. The registration forms are a waitlist and a way for us to learn where delivery is needed first—not a way to place an order." },
  { question: "Will Mela only serve Addis Ababa?", answer: "No. We’re planning for a network that can reach Ethiopia’s cities, smaller towns, and villages. Tell us your region, zone, woreda, and kebele so local demand can help shape the first routes." },
  { question: "What will I be able to send or receive?", answer: "We’re exploring useful everyday deliveries such as meals, groceries, market goods, farm produce, medicine, documents, and parcels. The services available at launch will depend on each area." },
  { question: "Do customers need to make an account?", answer: "No account or password is needed to join the customer waitlist. We’ll use the details you share to understand local needs and provide launch updates." },
  { question: "Can I apply as a driver or register my shop?", answer: "Yes. Drivers can share their experience and preferred operating area, and shops or other businesses can tell us what they need delivered. Applications are reviewed manually." },
  { question: "Do drivers need to upload documents now?", answer: "No. The first application only asks for relevant license information. Please don’t upload or send copies of identity or driving documents through this website." },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow"><span className="eyebrow-dot" />{children}</div>;
}

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="hero-section page-frame">
          <div className="hero-copy">
            <Eyebrow>PREPARING TO LAUNCH · ETHIOPIA</Eyebrow>
            <h1>Good things<br />should travel <em>everywhere.</em></h1>
            <p className="hero-lede">From busy city streets to the village road, we’re building a delivery network made for the way Ethiopia lives, works, and grows.</p>
            <div className="hero-actions">
              <a className="button button--clay" href="/register/customer">Join the customer waitlist <ArrowUpRight size={17} /></a>
              <a className="text-link" href="#how-it-works">See how it could work <ArrowDown size={15} /></a>
            </div>
            <div className="hero-footnote"><span className="route-mini" aria-hidden="true"><i /><i /><i /></span><span>For every city, small town, and village.</span></div>
          </div>
          <div className="hero-art-wrap">
            <div className="hero-art-frame">
              <img src="/manus-storage/async-images/ubkYyCzKnE6BnvbSnwWl1t/image-1.webp" alt="A courier on a red-earth road linking an Ethiopian highland village, farms, and a distant town" />
            </div>
            <div className="hero-note hero-note--top"><span className="hero-note-icon"><MapPin size={17} /></span><span><strong>Everywhere matters</strong><small>Not just the capital</small></span></div>
            <div className="hero-note hero-note--bottom"><span className="note-number">01</span><span><strong>Start with your area</strong><small>Tell us where delivery is needed</small></span><ArrowRight size={16} /></div>
            <span className="hero-orbit hero-orbit--one" aria-hidden="true" />
            <span className="hero-orbit hero-orbit--two" aria-hidden="true" />
          </div>
          <div className="hero-bottom-line"><span>Designed with local routes in mind</span><span className="hero-bottom-dash" /><span>Built around real community needs</span></div>
        </section>

        <section className="coverage-ribbon" aria-label="Intended service coverage">
          <div className="page-frame ribbon-inner"><span className="ribbon-label"><Route size={15} /> A network made for</span><div className="ribbon-places"><span>the capital</span><i /><span>regional cities</span><i /><span>small towns</span><i /><span>village roads</span></div><a href="/register/customer" className="ribbon-link">Add your area <ArrowRight size={15} /></a></div>
        </section>

        <section className="section section-how page-frame" id="how-it-works">
          <div className="section-heading split-heading">
            <div><Eyebrow>THE PLAN</Eyebrow><h2>Simple to begin.<br /><em>Made to reach further.</em></h2></div>
            <p>We’re bringing customers, local businesses, and dependable drivers into one network. Here’s the service we’re working toward—orders aren’t open yet.</p>
          </div>
          <div className="steps-row">
            <article className="step-card"><div className="step-top"><span className="step-no">01</span><span className="step-icon"><UsersRound size={22} /></span></div><h3>Tell us what your area needs</h3><p>Join the waitlist and share your kebele, the deliveries you’d use, and how often.</p><a href="/register/customer" className="step-link">Join as a customer <ArrowUpRight size={15} /></a></article>
            <span className="step-connector" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            <article className="step-card"><div className="step-top"><span className="step-no">02</span><span className="step-icon"><Bike size={23} /></span></div><h3>Build a local delivery team</h3><p>Drivers can apply for the areas they know, using the vehicle they have.</p><a href="/register/driver" className="step-link">Apply to drive <ArrowUpRight size={15} /></a></article>
            <span className="step-connector" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            <article className="step-card"><div className="step-top"><span className="step-no">03</span><span className="step-icon"><PackageCheck size={23} /></span></div><h3>Connect local shops to customers</h3><p>Shops and producers can tell us what they’d like to move and where.</p><a href="/register/business" className="step-link">Partner with Mela <ArrowUpRight size={15} /></a></article>
          </div>
          <div className="planned-note"><ShieldCheck size={17} /><span>This is a pre-launch plan, not a live delivery promise. We’ll share area availability when routes are ready.</span></div>
        </section>

        <section className="coverage-section" id="coverage">
          <div className="page-frame coverage-layout">
            <div className="coverage-copy"><Eyebrow>ROOTED IN EVERY ROUTE</Eyebrow><h2>Ethiopia is more than one city.</h2><p>Delivery should make sense beyond a single city centre. We’re listening across regions and communities to learn where people want a reliable way to move everyday goods.</p><p className="coverage-detail">Share your region, zone, woreda, and kebele. Your interest helps us understand which routes to build first.</p><a href="/register/customer" className="button button--light">Tell us your area <ArrowUpRight size={16} /></a></div>
            <div className="coverage-map-card" aria-label="Regions where Mela is collecting launch interest">
              <div className="map-card-top"><span><MapPin size={16} /> Listening across Ethiopia</span><span className="listening-status"><i /> PRE-LAUNCH</span></div>
              <div className="route-map-art" aria-hidden="true"><svg viewBox="0 0 560 230" preserveAspectRatio="xMidYMid meet"><path className="map-route map-route--one" d="M57 167 C112 151 124 107 189 122 S264 176 314 139 371 58 421 80 476 106 513 46"/><path className="map-route map-route--two" d="M97 46 C145 69 165 84 205 75 S269 34 313 66 354 119 401 130 467 156 493 189"/><path className="map-contour" d="M28 89c47-39 98-46 149-28s83 6 126-14 84-24 127 4 75 20 114-3M25 108c45-34 87-38 134-21s93 15 137-3 78-22 118 1 78 23 132 0M39 204c56-33 93-40 148-27s84 23 133 0 96-33 144-11 60 18 84 9"/><circle className="map-point map-point--large" cx="57" cy="167" r="7"/><circle className="map-point" cx="189" cy="122" r="5"/><circle className="map-point" cx="314" cy="139" r="5"/><circle className="map-point map-point--large" cx="421" cy="80" r="7"/><circle className="map-point" cx="513" cy="46" r="5"/><circle className="map-point" cx="97" cy="46" r="5"/><circle className="map-point" cx="313" cy="66" r="5"/><circle className="map-point" cx="493" cy="189" r="5"/></svg><span className="map-label map-label--left">village roads</span><span className="map-label map-label--right">city routes</span></div>
              <div className="region-chip-list">{regionNames.map(region => <span className="region-chip" key={region}>{region}</span>)}</div>
              <p className="map-caption">Areas shown are places we want to hear from—not a promise that service is already available.</p>
            </div>
          </div>
        </section>

        <section className="section audience-section page-frame" id="join">
          <div className="section-heading split-heading"><div><Eyebrow>FIND YOUR PLACE IN THE NETWORK</Eyebrow><h2>Three ways to<br /><em>get Mela moving.</em></h2></div><p>It starts with local knowledge. Choose the path that fits you, and help us shape a network that works for your community.</p></div>
          <div className="audience-cards">
            <a href="/register/customer" className="audience-card audience-card--customer"><div className="audience-card-top"><span className="audience-icon"><UsersRound size={22} /></span><ArrowUpRight size={19} className="audience-arrow" /></div><span className="audience-index">FOR HOMES & INDIVIDUALS</span><h3>Everyday needs,<br />a little closer.</h3><p>Groceries, meals, parcels—or whatever people in your area need to get moving.</p><span className="audience-cta">Join the waitlist <ArrowRight size={16} /></span><span className="audience-route" aria-hidden="true">········</span></a>
            <a href="/register/driver" className="audience-card audience-card--driver"><div className="audience-card-top"><span className="audience-icon"><Bike size={22} /></span><ArrowUpRight size={19} className="audience-arrow" /></div><span className="audience-index">FOR LOCAL DRIVERS</span><h3>Know your roads?<br />Help connect them.</h3><p>Tell us where you ride, what you drive, and when you’re available.</p><span className="audience-cta">Apply to drive <ArrowRight size={16} /></span><span className="audience-route" aria-hidden="true">········</span></a>
            <a href="/register/business" className="audience-card audience-card--business"><div className="audience-card-top"><span className="audience-icon"><Store size={22} /></span><ArrowUpRight size={19} className="audience-arrow" /></div><span className="audience-index">FOR SHOPS & BUSINESSES</span><h3>Your products,<br />within reach.</h3><p>Share what you sell and how delivery could help you serve more people.</p><span className="audience-cta">Explore partnership <ArrowRight size={16} /></span><span className="audience-route" aria-hidden="true">········</span></a>
          </div>
        </section>

        <section className="section faq-section page-frame" id="faq">
          <div className="faq-intro"><Eyebrow>GOOD TO KNOW</Eyebrow><h2>Questions,<br /><em>answered clearly.</em></h2><p>We’re still preparing, so we’ll say plainly what’s ready—and what isn’t.</p><a className="text-link" href="#contact">Have a question? <ArrowRight size={15} /></a></div>
          <div className="faq-list">{faqs.map((item, index) => <details className="faq-item" key={item.question} open={index === 0}><summary><span>{item.question}</span><ChevronDown size={18} /></summary><p>{item.answer}</p></details>)}</div>
        </section>

        <section className="final-cta page-frame"><div className="final-cta-inner"><div className="final-cta-mark"><Route size={25} /></div><div className="final-cta-copy"><span className="final-cta-kicker">YOUR COMMUNITY. YOUR ROUTE.</span><h2>Where should Mela go next?</h2><p>Join the waitlist and help us put the first routes where they matter.</p></div><a className="button button--light" href="/register/customer">Add your area <ArrowUpRight size={16} /></a><span className="cta-route-trail" aria-hidden="true">····················</span></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
