/**
 * CheckEmailPage.jsx  —  route: /check-email
 * Shown after submitting forgot-password form.
 * Matches RESET_PASSWORD.png design.
 */
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./CheckEmailPage.css";

const MailIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
    stroke="#6C63FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

export default function CheckEmailPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email ?? "your inbox";

  return (
    <div className="ce">

      {/* ── LEFT — dark panel ──────────────────────────────────── */}
      <div className="ce__panel">
        <div className="ce__panel-logo">
          <svg viewBox="0 0 32 32" fill="none" width="38" height="38">
            <circle cx="16" cy="16" r="16" fill="#6C63FF"/>
            <path d="M10 22 L16 8 L22 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.5 17.5 H19.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="ce__panel-logo-text">Fashion Link</span>
        </div>

        <div className="ce__panel-content">
          <h2 className="ce__panel-title">
            Professional order management for fashion creatives
          </h2>
          <p className="ce__panel-sub">
            Streamline your workflow with smart order tracking, management, and AI-powered insights designed for tailors and designers.
          </p>
        </div>

        <p className="ce__panel-footer">© 2026 Fashion Link. All rights reserved.</p>
      </div>

      {/* ── RIGHT — confirmation panel ─────────────────────────── */}
      <div className="ce__content-panel">
        <div className="ce__content-inner">
          <div className="ce__icon">
            <MailIcon />
          </div>

          <h1 className="ce__title">Check your email</h1>

          <p className="ce__subtitle">
            We've sent you a password reset link. Please check your inbox and follow the instructions.
          </p>

          <Link className="ce__back" to="/login">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to sign in
          </Link>
        </div>
      </div>

    </div>
  );
}
