import { ArrowDownRight, ArrowLeft, ArrowRight, Building2, Clock3, LogOut, MapPin, RefreshCw, ShieldCheck, Store, Tags, Truck, UsersRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const regions = ["Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Central Ethiopia", "Dire Dawa", "Gambella", "Harari", "Oromia", "Sidama", "Somali", "South Ethiopia", "Southwest Ethiopia", "Tigray"];
const statusOptions = ["Pending", "Under Review", "Approved", "Rejected"] as const;
type DriverStatus = (typeof statusOptions)[number];
type DashboardTab = "customers" | "drivers" | "businesses";

function formatDate(value: Date | string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-ET", { day: "numeric", month: "short", year: "numeric" });
}
function StatusBadge({ status }: { status: string }) { return <span className={`status-badge status-badge--${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>; }
function LoadingPanel({ label }: { label: string }) { return <div className="admin-empty"><span className="loading-dot" />Loading {label}…</div>; }
function CountBar({ label, total, max }: { label: string; total: number; max: number }) {
  return <div className="demand-row" key={label}><span className="demand-region">{label}</span><span className="demand-track"><i style={{ width: `${Math.max(4, (total / max) * 100)}%` }} /></span><strong>{total}</strong></div>;
}

export default function Admin() {
  const auth = useAuth();
  const isAdmin = auth.isAuthenticated && auth.user?.role === "admin";
  const [tab, setTab] = useState<DashboardTab>("customers");
  const [region, setRegion] = useState("");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const utils = trpc.useUtils();
  const overview = trpc.admin.overview.useQuery(undefined, { enabled: isAdmin, retry: false });
  const customers = trpc.admin.customers.useQuery({ region, search }, { enabled: isAdmin, retry: false });
  const drivers = trpc.admin.drivers.useQuery(undefined, { enabled: isAdmin, retry: false });
  const businesses = trpc.admin.businesses.useQuery(undefined, { enabled: isAdmin, retry: false });
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async result => {
      if (result.ok) {
        setPassword("");
        setLoginError("");
        await auth.refresh();
      } else setLoginError(result.message);
    },
    onError: () => setLoginError("Sign-in failed. Please try again."),
  });
  const statusMutation = trpc.admin.updateDriverStatus.useMutation({
    onSuccess: async () => { await Promise.all([utils.admin.drivers.invalidate(), utils.admin.overview.invalidate()]); },
  });

  if (auth.loading) return <main className="admin-gate page-frame"><span className="loading-dot" /><p>Checking your sign-in…</p></main>;
  if (!auth.isAuthenticated) {
    const submitLogin = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoginError("");
      loginMutation.mutate({ email, password });
    };
    return <main className="admin-gate page-frame"><a className="back-link" href="/"><ArrowLeft size={16} /> Back to BAATA</a><div className="gate-card"><span className="gate-icon"><ShieldCheck size={24} /></span><span className="form-overline">ADMINISTRATOR SIGN-IN</span><h1>Sign in to the launch desk.</h1><p>This dashboard is for authorized BAATA administrators only. Customer, driver, and business registrations are private.</p><form className="owner-claim-form" onSubmit={submitLogin}><label className="form-field" htmlFor="admin-email"><span className="field-label">Email<b aria-hidden="true">*</b></span><input id="admin-email" type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} placeholder="admin@example.com" /></label><label className="form-field" htmlFor="admin-password"><span className="field-label">Password<b aria-hidden="true">*</b></span><input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} placeholder="Your password" /></label>{loginError && <p className="form-error" role="alert">{loginError}</p>}<button className="button button--dark" type="submit" disabled={loginMutation.isPending}>{loginMutation.isPending ? "Signing in…" : "Sign in"} <ArrowRight size={16} /></button></form></div></main>;
  }
  if (!isAdmin) return <main className="admin-gate page-frame"><a className="back-link" href="/"><ArrowLeft size={16} /> Back to BAATA</a><div className="gate-card"><span className="gate-icon gate-icon--muted"><ShieldCheck size={24} /></span><span className="form-overline">ACCESS RESTRICTED</span><h1>You don’t have admin access.</h1><p>This dashboard is only available to the BAATA owner account.</p><button className="button button--clay" onClick={() => { void auth.logout().catch(() => undefined); }}><LogOut size={16} /> Sign out</button></div></main>;

  const counts = overview.data?.totals;
  const highestDemand = Math.max(1, ...(overview.data?.demandByRegion.map(area => area.total) ?? [1]));
  const highestService = Math.max(1, ...(overview.data?.customersByService.map(item => item.total) ?? [1]));
  const highestCategory = Math.max(1, ...(overview.data?.businessesByCategory.map(item => item.total) ?? [1]));
  return <main className="admin-page">
    <header className="admin-topbar"><a className="admin-brand" href="/"><img className="admin-brand-logo" src="/baata-logo.png" alt="" /><span>baata<span>.</span> <small>LAUNCH DESK</small></span></a><div className="admin-top-actions"><span className="admin-owner"><span className="owner-avatar">{(auth.user?.name || "B").slice(0, 1).toUpperCase()}</span><span>{auth.user?.name || "BAATA owner"}<small>Administrator</small></span></span><button className="admin-logout" onClick={() => { void auth.logout().catch(() => undefined); }}><LogOut size={15} /> Sign out</button></div></header>
    <div className="admin-content page-frame">
      <a className="back-link admin-back" href="/"><ArrowLeft size={15} /> Public site</a>
      <div className="admin-heading-row"><div><span className="form-overline">PRE-LAUNCH OVERVIEW</span><h1>Your launch desk.</h1><p>A quiet view of the people and places helping BAATA get ready.</p></div><div className="admin-live-note"><span className="eyebrow-dot" /> Registration data is private</div></div>
      <div className="admin-stats">
        <article className="admin-stat"><span className="admin-stat-icon"><UsersRound size={19} /></span><span className="admin-stat-label">CUSTOMER WAITLIST</span><strong>{overview.isLoading ? "—" : counts?.customers ?? 0}</strong><small>People sharing local demand</small></article>
        <article className="admin-stat"><span className="admin-stat-icon admin-stat-icon--clay"><Truck size={19} /></span><span className="admin-stat-label">DRIVER APPLICATIONS</span><strong>{overview.isLoading ? "—" : counts?.drivers ?? 0}</strong><small>{counts?.pendingDrivers ?? 0} awaiting review</small></article>
        <article className="admin-stat"><span className="admin-stat-icon admin-stat-icon--gold"><Store size={19} /></span><span className="admin-stat-label">BUSINESS INTEREST</span><strong>{overview.isLoading ? "—" : counts?.businesses ?? 0}</strong><small>Potential partners</small></article>
      </div>
      <div className="admin-main-grid">
        <section className="admin-panel demand-panel"><div className="panel-heading"><div><span className="admin-section-kicker">WHERE INTEREST IS GROWING</span><h2>Demand by region</h2></div><span className="panel-icon"><MapPin size={18} /></span></div>{overview.isLoading ? <LoadingPanel label="area demand" /> : overview.isError ? <p className="admin-error">Couldn’t load the area overview. Refresh and try again.</p> : (overview.data?.demandByRegion.length ?? 0) === 0 ? <div className="admin-empty">No customer waitlist registrations yet. Area demand will appear here as people sign up.</div> : <div className="demand-bars">{overview.data?.demandByRegion.map(area => <CountBar key={area.region} label={area.region} total={area.total} max={highestDemand} />)}</div>}<p className="panel-footnote">Counts reflect customer waitlist interest—not confirmed service coverage.</p></section>
        <section className="admin-panel launch-note-panel"><div className="panel-heading"><div><span className="admin-section-kicker">NEXT STEP</span><h2>Build from the ground up.</h2></div><span className="panel-icon panel-icon--clay"><ArrowDownRight size={18} /></span></div><p>Use the area filters to understand where people want delivery first. Review driver applications manually and follow up with businesses as plans take shape.</p><div className="launch-note-divider" /><div className="launch-note-status"><Clock3 size={17} /><span><strong>Still preparing to launch</strong><small>Application status is review progress, not legal clearance.</small></span></div></section>
      </div>
      <section className="admin-panel categories-panel">
        <div className="panel-heading"><div><span className="admin-section-kicker">WHAT PEOPLE SIGNED UP FOR</span><h2>Registrations by category</h2></div><span className="panel-icon"><Tags size={18} /></span></div>
        <div className="category-columns">
          <div className="category-column"><h3>Customer delivery services</h3>{overview.isLoading ? <LoadingPanel label="service demand" /> : (overview.data?.customersByService.length ?? 0) === 0 ? <div className="admin-empty">No customer registrations yet.</div> : <div className="demand-bars">{overview.data?.customersByService.map(item => <CountBar key={item.service} label={item.service} total={item.total} max={highestService} />)}</div>}</div>
          <div className="category-column"><h3>Business categories</h3>{overview.isLoading ? <LoadingPanel label="business categories" /> : (overview.data?.businessesByCategory.length ?? 0) === 0 ? <div className="admin-empty">No business registrations yet.</div> : <div className="demand-bars">{overview.data?.businessesByCategory.map(item => <CountBar key={item.category} label={item.category} total={item.total} max={highestCategory} />)}</div>}</div>
        </div>
      </section>
      <section className="admin-panel records-panel">
        <div className="panel-heading records-heading"><div><span className="admin-section-kicker">REGISTRATION RECORDS</span><h2>People behind the routes</h2></div><button className="refresh-button" onClick={() => { void Promise.all([utils.admin.overview.invalidate(), utils.admin.customers.invalidate(), utils.admin.drivers.invalidate(), utils.admin.businesses.invalidate()]); }}><RefreshCw size={15} /> Refresh</button></div>
        <div className="admin-tabs" role="tablist" aria-label="Registration type">{([ ["customers", "Customer waitlist", counts?.customers], ["drivers", "Drivers", counts?.drivers], ["businesses", "Businesses", counts?.businesses] ] as const).map(([id, label, amount]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "admin-tab admin-tab--active" : "admin-tab"} onClick={() => setTab(id)}>{label}<span>{amount ?? 0}</span></button>)}</div>
        {tab === "customers" && <div className="records-content"><div className="record-filters"><label><span className="sr-only">Filter by region</span><select value={region} onChange={event => setRegion(event.target.value)}><option value="">All regions</option>{regions.map(item => <option value={item} key={item}>{item}</option>)}</select></label><label className="record-search"><MapPin size={16} /><span className="sr-only">Search name, zone, woreda, or kebele</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, zone, woreda, or kebele" /></label></div>{customers.isLoading ? <LoadingPanel label="customer registrations" /> : customers.isError ? <p className="admin-error">Couldn’t load customers. Refresh and try again.</p> : !customers.data?.length ? <div className="admin-empty">No customer registrations match this area yet.</div> : <div className="table-scroll"><table className="admin-table"><thead><tr><th>Customer</th><th>Area</th><th>Delivery interest</th><th>Frequency</th><th>Joined</th></tr></thead><tbody>{customers.data.map(item => <tr key={item.id}><td><strong>{item.fullName}</strong><small>{item.phone}{item.email ? ` · ${item.email}` : ""}</small></td><td>{item.region}<small>{item.zone} · {item.woreda} · {item.kebele}</small></td><td>{item.preferredDeliveryService}</td><td>{item.expectedFrequency}</td><td>{formatDate(item.createdAt)}</td></tr>)}</tbody></table></div>}</div>}
        {tab === "drivers" && <div className="records-content">{drivers.isLoading ? <LoadingPanel label="driver applications" /> : drivers.isError ? <p className="admin-error">Couldn’t load driver applications. Refresh and try again.</p> : !drivers.data?.length ? <div className="admin-empty">No driver applications yet. New applications will appear here for review.</div> : <div className="table-scroll"><table className="admin-table"><thead><tr><th>Applicant</th><th>Preferred area</th><th>Vehicle</th><th>Availability</th><th>Application status</th></tr></thead><tbody>{drivers.data.map(item => <tr key={item.id}><td><strong>{item.fullName}</strong><small>{item.phone}</small></td><td>{item.region}<small>{item.operatingArea}</small></td><td>{item.vehicleType}<small>{item.vehicleOwnership}</small></td><td>{item.availability}</td><td><label className="status-control"><span className="sr-only">Update application status for {item.fullName}</span><select value={item.status} disabled={statusMutation.isPending} onChange={event => statusMutation.mutate({ id: item.id, status: event.target.value as DriverStatus })}>{statusOptions.map(option => <option key={option} value={option}>{option}</option>)}</select><StatusBadge status={item.status} /></label></td></tr>)}</tbody></table><p className="status-disclaimer">Status reflects application review progress only; it is not a guarantee of legal clearance to operate.</p></div>}</div>}
        {tab === "businesses" && <div className="records-content">{businesses.isLoading ? <LoadingPanel label="business interest" /> : businesses.isError ? <p className="admin-error">Couldn’t load business registrations. Refresh and try again.</p> : !businesses.data?.length ? <div className="admin-empty">No business registrations yet. Interested partners will appear here.</div> : <div className="business-list">{businesses.data.map(item => <article className="business-record" key={item.id}><div className="business-record-icon"><Building2 size={19} /></div><div className="business-record-main"><div className="business-record-title"><strong>{item.businessName}</strong><StatusBadge status="Under Review" /></div><span>{item.category} · {item.region} · {item.location}</span><p><b>Products:</b> {item.productsServices}</p><p><b>Delivery needs:</b> {item.deliveryNeeds}</p><small>Contact: {item.contactName} · {item.phone} · Registered {formatDate(item.createdAt)}</small></div></article>)}</div>}</div>}
      </section>
      <p className="admin-privacy-note"><ShieldCheck size={15} /> Authorized access only. Keep personal registration details private and use them only for BAATA’s pre-launch planning.</p>
    </div>
  </main>;
}
