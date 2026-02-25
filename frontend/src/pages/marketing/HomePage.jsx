import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./HomePage.css";

/* ── SVG icons ────────────────────────────────────────────────── */
const Logo = () => (
  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
    <circle cx="16" cy="16" r="16" fill="#6C63FF"/>
    <path d="M10 22 L16 8 L22 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.5 17.5 H19.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconOrders = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconRuler = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.3 8.7L8.7 21.3a1 1 0 0 1-1.4 0l-6.6-6.6a1 1 0 0 1 0-1.4L13.3 2.7a1 1 0 0 1 1.4 0l6.6 6.6a1 1 0 0 1 0 1.4z"/>
    <path d="M7.5 10.5l2 2"/><path d="M10.5 7.5l2 2"/><path d="M13.5 4.5l2 2"/><path d="M4.5 13.5l2 2"/>
  </svg>
);
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconChevron = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s ease" }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconLayout = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
  </svg>
);

/* ── FAQ data ─────────────────────────────────────────────────── */
const FAQS = [
  { q: "How do I start?", a: "Sign up takes minutes. Create your account, add your first client, and start building orders. We walk you through everything." },
  { q: "Is my data secure?", a: "Yes. Fashion Link uses industry-standard encryption and security practices. Your client data and order details are protected." },
  { q: "Can clients see everything?", a: "No. Clients see only their own order on a shared tracking page. They cannot access other orders or your internal notes." },
  { q: "What if I need help?", a: "We offer email support for all plans and priority support for Professional and Enterprise users. Onboarding help is included." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel your subscription at any time with no penalties. Your data remains accessible for 30 days after cancellation." },
];

/* ── FAQ Item ─────────────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`hp-faq__item ${open ? "hp-faq__item--open" : ""}`}>
      <button className="hp-faq__q" onClick={() => setOpen(!open)} type="button" aria-expanded={open}>
        <span>{q}</span>
        <IconChevron open={open} />
      </button>
      <div className="hp-faq__a-wrap" style={{ maxHeight: open ? "200px" : "0" }}>
        <p className="hp-faq__a">{a}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <div className="hp">

      {/* ── 1. NAV ────────────────────────────────────────────── */}
      <nav className="hp-nav">
        <div className="hp-nav__inner">
          <Link to="/" className="hp-nav__logo">
            <Logo />
            <span className="hp-nav__logo-text">Fashion Link</span>
          </Link>
          <div className="hp-nav__links">
            <a href="#features" className="hp-nav__link">Features</a>
            <a href="#pricing" className="hp-nav__link">Pricing</a>
            <a href="#blog" className="hp-nav__link">Blog</a>
            <a href="#resources" className="hp-nav__link">Resources</a>
          </div>
          <div className="hp-nav__actions">
            <Link to="/login"  className="hp-nav__signin">Sign in</Link>
            <Link to="/signup" className="hp-nav__cta">Sign up</Link>
          </div>
        </div>
      </nav>

      {/* ── 2. HERO ───────────────────────────────────────────── */}
      <section className="hp-hero">
        <div className="hp-hero__inner">
          <div className="hp-hero__text">
            <h1 className="hp-hero__title">Order management built for artisans</h1>
            <p className="hp-hero__sub">
              Fashion Link brings clarity to your craft. Track orders, manage deadlines, and work smarter with AI-powered insights designed for tailors and designers.
            </p>
            <div className="hp-hero__ctas">
              <Link to="/signup" className="hp-hero__btn-primary">Start</Link>
              <a href="#features" className="hp-hero__btn-ghost">Learn</a>
            </div>
          </div>
          <div className="hp-hero__image-wrap">
            <img
              className="hp-hero__image"
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80"
              alt="Artisan at work"
            />
          </div>
        </div>
      </section>

      {/* ── 3. CORE FEATURES ──────────────────────────────────── */}
      <section className="hp-core" id="features">
        <div className="hp-core__inner">
          <p className="hp-core__eyebrow">Core</p>
          <h2 className="hp-core__title">What Fashion Link does</h2>
          <p className="hp-core__sub">Everything you need to run your business</p>

          <div className="hp-core__grid">
            {[
              {
                icon: <IconOrders />,
                label: "Orders",
                title: "Create and manage orders",
                desc: "Build each project from intake to completion with full control",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop&q=80",
              },
              {
                icon: <IconRuler />,
                label: "Measurements",
                title: "Validate measurements with precision",
                desc: "AI catches errors before they become problems in production",
                img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=300&fit=crop&q=80",
              },
              {
                icon: <IconUsers />,
                label: "Client tracking",
                title: "Keep clients informed and confident",
                desc: "Share a simple tracking page so clients see status without asking",
                img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=300&fit=crop&q=80",
              },
            ].map((c) => (
              <div className="hp-core__card" key={c.label}>
                <img className="hp-core__card-img" src={c.img} alt={c.title} />
                <div className="hp-core__card-body">
                  <div className="hp-core__card-label">
                    <span className="hp-core__card-icon">{c.icon}</span>
                    {c.label}
                  </div>
                  <h3 className="hp-core__card-title">{c.title}</h3>
                  <p className="hp-core__card-desc">{c.desc}</p>
                  <button className="hp-core__card-link" type="button" onClick={() => navigate("/signup")}>
                    Explore <IconArrow />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. AI INTELLIGENCE ────────────────────────────────── */}
      <section className="hp-ai">
        <div className="hp-ai__inner">
          <div className="hp-ai__text">
            <p className="hp-ai__eyebrow">Intelligence</p>
            <h2 className="hp-ai__title">AI that understands your deadlines</h2>
            <p className="hp-ai__desc">
              Fashion Link watches your workload and alerts you to risk. Know which orders need attention before they slip.
            </p>
            <div className="hp-ai__points">
              <div className="hp-ai__point">
                <span className="hp-ai__point-icon"><IconBell /></span>
                <div>
                  <p className="hp-ai__point-title">Risk alerts</p>
                  <p className="hp-ai__point-desc">See which orders are at risk of missing their deadline</p>
                </div>
              </div>
              <div className="hp-ai__point">
                <span className="hp-ai__point-icon"><IconLayout /></span>
                <div>
                  <p className="hp-ai__point-title">Workload insight</p>
                  <p className="hp-ai__point-desc">Understand how many orders are due and when they're needed</p>
                </div>
              </div>
            </div>
            <div className="hp-ai__links">
              <button className="hp-ai__btn-outline" onClick={() => navigate("/signup")} type="button">Learn more</button>
              <button className="hp-ai__btn-ghost" onClick={() => navigate("/signup")} type="button">Explore <IconArrow /></button>
            </div>
          </div>
          <div className="hp-ai__image-wrap">
            <img
              className="hp-ai__image"
              src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=700&h=560&fit=crop&q=80"
              alt="AI insights"
            />
          </div>
        </div>
      </section>

      {/* ── 5. SIMPLE TRACKING ────────────────────────────────── */}
      <section className="hp-track">
        <div className="hp-track__inner">
          <div className="hp-track__image-wrap">
            <img
              className="hp-track__image"
              src="https://images.unsplash.com/photo-1594938298603-a5e0b68a1a73?w=700&h=560&fit=crop&q=80"
              alt="Client tracking"
            />
          </div>
          <div className="hp-track__text">
            <h2 className="hp-track__title">Simple tracking</h2>
            <p className="hp-track__desc">Clients see their order status without needing to ask for updates.</p>
            <div className="hp-track__points">
              {[
                { title: "Real-time updates", desc: "Every status change reaches your clients instantly and keeps them informed." },
                { title: "Transparent timeline", desc: "A clear view of when their order will be ready builds confidence and trust." },
              ].map((p) => (
                <div className="hp-track__point" key={p.title}>
                  <span className="hp-track__check"><IconCheck /></span>
                  <div>
                    <p className="hp-track__point-title">{p.title}</p>
                    <p className="hp-track__point-desc">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hp-track__links">
              <button className="hp-track__btn-primary" onClick={() => navigate("/signup")} type="button">Discover</button>
              <button className="hp-track__btn-ghost" onClick={() => navigate("/signup")} type="button">Explore <IconArrow /></button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. EFFICIENCY BENTO ───────────────────────────────── */}
      <section className="hp-bento">
        <div className="hp-bento__inner">
          <div className="hp-bento__left">
            <p className="hp-bento__eyebrow">Efficiency</p>
            <h2 className="hp-bento__title">Work faster with less friction</h2>
            <p className="hp-bento__desc">
              Stop juggling spreadsheets and scattered notes. Fashion Link centralizes everything you need to run your business in one place.
            </p>
            <button className="hp-bento__btn" onClick={() => navigate("/signup")} type="button">Explore <IconArrow /></button>
          </div>
          <div className="hp-bento__right">
            <div className="hp-bento__image-tall">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop&q=80" alt="Efficiency" />
              <div className="hp-bento__image-label">
                <p className="hp-bento__image-eyebrow">Learn</p>
                <p className="hp-bento__image-tag">Organization</p>
                <p className="hp-bento__image-text">Every Order has its place</p>
                <p className="hp-bento__image-desc">Measurements, deadlines, style references, and client details live together. Nothing gets lost. Nothing gets forgotten.</p>
                <div className="hp-bento__image-actions">
                  <button type="button" onClick={() => navigate("/signup")}>Explore</button>
                  <button type="button" onClick={() => navigate("/signup")}>Learn</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transparency row */}
        <div className="hp-bento__transparency">
          <div className="hp-bento__trans-image">
            <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=400&fit=crop&q=80" alt="Transparency" />
          </div>
          <div className="hp-bento__trans-text">
            <p className="hp-bento__eyebrow">Transparency</p>
            <h3 className="hp-bento__trans-title">Clients trust what they can see</h3>
            <p className="hp-bento__trans-desc">A shared tracking page means fewer questions and more confidence. Your clients know exactly where their order stands.</p>
            <div className="hp-bento__trans-actions">
              <button type="button" onClick={() => navigate("/signup")}>Explore <IconArrow /></button>
              <button type="button" onClick={() => navigate("/signup")}>Learn <IconArrow /></button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. MISSION ────────────────────────────────────────── */}
      <section className="hp-mission">
        <div className="hp-mission__inner">
          <div className="hp-mission__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <p className="hp-mission__eyebrow">Mission</p>
          <h2 className="hp-mission__title">Built for the people who make things</h2>
          <p className="hp-mission__desc">
            Fashion Link exists because tailors and designers deserve tools that respect their craft. We built this for you, not for a generic business.
          </p>
          <div className="hp-mission__links">
            <button className="hp-mission__btn-outline" onClick={() => navigate("/signup")} type="button">Learn more</button>
            <button className="hp-mission__btn-ghost" onClick={() => navigate("/signup")} type="button">Explore <IconArrow /></button>
          </div>
        </div>
      </section>

      {/* ── 8. TESTIMONIALS ───────────────────────────────────── */}
      <section className="hp-testimonials">
        <div className="hp-testimonials__inner">
          <p className="hp-testimonials__eyebrow">Real voices</p>
          <h2 className="hp-testimonials__title">Hear from artisans and clients using Fashion Link</h2>
          <div className="hp-testimonials__card">
            <div className="hp-testimonials__stars">
              {[...Array(5)].map((_, i) => <IconStar key={i} />)}
            </div>
            <blockquote className="hp-testimonials__quote">
              "Fashion Link took the chaos out of my orders. I know what's due, when it's due, and my clients stop asking me for updates."
            </blockquote>
            <div className="hp-testimonials__author">
              <div className="hp-testimonials__avatar">AO</div>
              <div>
                <p className="hp-testimonials__name">Amara Okafor</p>
                <p className="hp-testimonials__role">Tailor, Lagos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. CTA BANNER ─────────────────────────────────────── */}
      <section className="hp-cta">
        <div className="hp-cta__inner">
          <div className="hp-cta__text">
            <h2 className="hp-cta__title">Ready to begin</h2>
            <p className="hp-cta__sub">Start free today and see how Fashion Link transforms your workflow.</p>
            <div className="hp-cta__btns">
              <Link to="/signup" className="hp-cta__btn-primary">Start</Link>
              <Link to="/login"  className="hp-cta__btn-ghost">Demo</Link>
            </div>
          </div>
          <div className="hp-cta__image-wrap">
            <img src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=700&h=500&fit=crop&q=80" alt="Get started" />
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ───────────────────────────────────────────── */}
      <section className="hp-faq" id="faq">
        <div className="hp-faq__inner">
          <h2 className="hp-faq__title">Questions</h2>
          <p className="hp-faq__sub">Find answers about Fashion Link and how it works for your business.</p>
          <div className="hp-faq__list">
            {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
          <div className="hp-faq__help">
            <p>Need more help?</p>
            <Link to="/login" className="hp-faq__help-link">Reach out to our team anytime. Contact</Link>
          </div>
        </div>
      </section>

      {/* ── 11. NEWSLETTER ────────────────────────────────────── */}
      <section className="hp-newsletter">
        <div className="hp-newsletter__inner">
          <div className="hp-newsletter__left">
            <h3 className="hp-newsletter__title">Stay in the loop</h3>
            <p className="hp-newsletter__desc">Get tips and updates on managing orders and growing your craft.</p>
            <form className="hp-newsletter__form" onSubmit={(e) => { e.preventDefault(); setEmail(""); alert("Subscribed!"); }}>
              <input
                className="hp-newsletter__input"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="hp-newsletter__btn" type="submit">Subscribe</button>
            </form>
            <p className="hp-newsletter__legal">By subscribing you agree to our Terms and Privacy Policy.</p>
          </div>
          <div className="hp-newsletter__right">
            <div className="hp-newsletter__card">
              <p className="hp-newsletter__card-title">Stay updated</p>
              <p className="hp-newsletter__card-desc">Get insights on managing orders efficiently</p>
              <form className="hp-newsletter__card-form" onSubmit={(e) => e.preventDefault()}>
                <input className="hp-newsletter__card-input" type="email" placeholder="your@email.com" />
                <button className="hp-newsletter__card-btn" type="submit">Subscribe</button>
              </form>
              <p className="hp-newsletter__card-legal">By subscribing you agree to our Privacy Policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. FOOTER ────────────────────────────────────────── */}
      <footer className="hp-footer">
        <div className="hp-footer__inner">
          <div className="hp-footer__cols">
            <div className="hp-footer__col hp-footer__col--brand">
              <Link to="/" className="hp-footer__logo">
                <Logo />
                <span>Fashion Link</span>
              </Link>
            </div>
            {[
              { heading: "Product",   links: ["Features","Pricing","Dashboard","Tracking"] },
              { heading: "Resources", links: ["Blog","Guides","Support","Documentation","API"] },
              { heading: "Company",   links: ["About","Careers","Contact","Press","Partners"] },
              { heading: "Legal",     links: ["Privacy Policy","Terms of Service","Cookie Settings","Accessibility","Sitemap","Status"] },
              { heading: "Connect",   links: ["Twitter","Instagram","LinkedIn","Facebook","YouTube"] },
            ].map((col) => (
              <div className="hp-footer__col" key={col.heading}>
                <p className="hp-footer__col-heading">{col.heading}</p>
                {col.links.map((l) => (
                  <Link key={l} to="/login" className="hp-footer__col-link">{l}</Link>
                ))}
              </div>
            ))}
          </div>
          <div className="hp-footer__bottom">
            <p>© 2025 Fashion Link. All rights reserved.</p>
            <div className="hp-footer__bottom-links">
              <Link to="/login">Privacy Policy</Link>
              <Link to="/login">Terms of Service</Link>
              <Link to="/login">Cookies Settings</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
