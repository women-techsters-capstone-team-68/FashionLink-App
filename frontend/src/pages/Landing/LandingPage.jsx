import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

/* ── Inline SVG icons ─────────────────────────────────────────── */
const Logo = () => (
  <svg viewBox="0 0 32 32" fill="none" width="36" height="36" aria-hidden="true">
    <circle cx="16" cy="16" r="16" fill="#6C63FF"/>
    <path d="M10 22 L16 8 L22 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.5 17.5 H19.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconBar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const FEATURES = [
  { icon: <IconBox />,    title: "Order Management", desc: "Efficiently manage all your client orders with intuitive tools and real-time tracking." },
  { icon: <IconStar />,   title: "AI Insights",       desc: "Get intelligent deadline alerts, workload insights, and measurement validation." },
  { icon: <IconUsers />,  title: "Client Portal",     desc: "Provide clients with transparent order tracking and seamless communication." },
  { icon: <IconBar />,    title: "Analytics",         desc: "Track performance metrics, completion rates, and revenue trends." },
  { icon: <IconShield />, title: "Secure & Reliable", desc: "Your data is protected with enterprise-grade security and regular backups." },
  { icon: <IconZap />,    title: "Fast & Responsive", desc: "Built for speed with a responsive design that works on all devices." },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="lp">

      {/* ── Nav ───────────────────────────────────────────────── */}
      <nav className="lp__nav">
        <div className="lp__nav-inner">
          <button className="lp__nav-logo" onClick={() => navigate("/")} type="button" aria-label="Fashion Link home">
            <Logo />
            <span className="lp__nav-logo-text">Fashion Link</span>
          </button>
          <div className="lp__nav-actions">
            <button className="lp__btn-ghost" onClick={() => navigate("/login")} type="button">
              Sign in
            </button>
            <button className="lp__btn-primary" onClick={() => navigate("/signup")} type="button">
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="lp__hero">
        <div className="lp__hero-inner">
          <div className="lp__pill">
            <IconSparkle />
            AI-Powered Order Management
          </div>

          <h1 className="lp__hero-title">
            Empower Your Fashion Business
          </h1>

          <p className="lp__hero-sub">
            Smart order management and tracking platform built for fashion artisans and their clients.<br />
            Streamline your workflow, track deadlines, and deliver excellence.
          </p>

          <div className="lp__hero-ctas">
            <button className="lp__btn-primary lp__btn-lg" onClick={() => navigate("/signup")} type="button">
              Start
            </button>
            <button className="lp__btn-outline lp__btn-lg" onClick={() => navigate("/home")} type="button">
              Learn
            </button>
          </div>
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────── */}
      <section className="lp__features">
        <div className="lp__features-inner">
          <div className="lp__features-grid">
            {FEATURES.map((f) => (
              <div className="lp__feature-card" key={f.title}>
                <div className="lp__feature-icon">{f.icon}</div>
                <h3 className="lp__feature-title">{f.title}</h3>
                <p className="lp__feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="lp__cta">
        <div className="lp__cta-inner">
          <h2 className="lp__cta-title">Ready to Transform Your Workflow?</h2>
          <p className="lp__cta-sub">Join hundreds of fashion artisans managing their orders efficiently</p>
          <button className="lp__btn-white lp__btn-lg" onClick={() => navigate("/signup")} type="button">
            Get started today
          </button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="lp__footer">
        <p>© 2026 Fashion Link. Empowering artisans and clients.</p>
      </footer>

    </div>
  );
}
