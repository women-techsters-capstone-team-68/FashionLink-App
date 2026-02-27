/**
 * ForgotPasswordPage.jsx  —  route: /forgot-password
 * Split-screen: dark panel left | form right.
 * Matches Forgot_password.png design.
 * On submit → navigates to /check-email
 */
import { useState }          from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ForgotPasswordPage.css";

export default function ForgotPasswordPage() {
  const navigate        = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address."); return; }

    setLoading(true);
    /* TODO: replace with real API call:
       await fetch("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }) */
    setTimeout(() => {
      setLoading(false);
      navigate("/check-email", { state: { email } });
    }, 500);
  };

  return (
    <div className="fp">

      {/* ── LEFT — dark panel ──────────────────────────────────── */}
      <div className="fp__panel">
        <div className="fp__panel-logo">
          <svg viewBox="0 0 32 32" fill="none" width="38" height="38">
            <circle cx="16" cy="16" r="16" fill="#6C63FF"/>
            <path d="M10 22 L16 8 L22 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.5 17.5 H19.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="fp__panel-logo-text">Fashion Link</span>
        </div>

        <div className="fp__panel-content">
          <h2 className="fp__panel-title">
            Professional order management for fashion creatives
          </h2>
          <p className="fp__panel-sub">
            Streamline your workflow with smart order tracking, management, and AI-powered insights designed for tailors and designers.
          </p>
        </div>

        <p className="fp__panel-footer">© 2026 Fashion Link. All rights reserved.</p>
      </div>

      {/* ── RIGHT — form panel ─────────────────────────────────── */}
      <div className="fp__form-panel">
        <div className="fp__form-inner">
          <h1 className="fp__title">Forgot password?</h1>
          <p className="fp__subtitle">Enter your email address and we'll send you a reset link.</p>

          <form className="fp__form" onSubmit={handleSubmit} noValidate>
            <div className="fp__field">
              <label className="fp__label" htmlFor="fp-email">Email</label>
              <input
                id="fp-email"
                className="fp__input"
                type="email"
                placeholder="artisan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>

            {error && <p className="fp__error">{error}</p>}

            <button className="fp__submit" type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </button>

            <Link className="fp__back" to="/login">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to sign in
            </Link>
          </form>
        </div>
      </div>

    </div>
  );
}
