/**
 * LoginPage.jsx  —  route: /login
 * Split-screen: image + features left | form right.
 * Matches SIGN_IN.png design.
 */
import { useState }          from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth }           from "../../context/AuthContext.jsx";
import "./LoginPage.css";

const FEATURES = [
  "Order Management",
  "Measurement Uploads",
  "Availability & Lead Time",
  "Custom Order Flow",
  "Order Tracking",
];

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function LoginPage() {
  const navigate       = useNavigate();
  const { login }      = useAuth();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email and password are required."); return; }
    setLoading(true);
    setTimeout(() => {
      const result = login({ email, password });
      setLoading(false);
      if (!result.ok) { setError(result.error); return; }
      navigate(result.redirectTo, { replace: true });
    }, 400);
  };

  return (
    <div className="lgi">

      {/* ── LEFT — image panel ─────────────────────────────────── */}
      <div className="lgi__panel">
        <div className="lgi__panel-overlay" />

        <div className="lgi__panel-logo">
          <svg viewBox="0 0 32 32" fill="none" width="38" height="38">
            <circle cx="16" cy="16" r="16" fill="#6C63FF"/>
            <path d="M10 22 L16 8 L22 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.5 17.5 H19.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="lgi__panel-logo-text">Fashion Link</span>
        </div>

        <div className="lgi__panel-content">
          <blockquote className="lgi__quote">
            "Built for Fashion,<br/>Designed for Confidence."
          </blockquote>
          <p className="lgi__quote-sub">
            "FashionLink is a fashion-tech marketplace that connects designers, tailors, and buyers, making custom fashion faster, more transparent, and more accessible."
          </p>

          <ul className="lgi__features">
            {FEATURES.map((f) => (
              <li key={f} className="lgi__feature">
                <span className="lgi__feature-check"><CheckIcon /></span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── RIGHT — form panel ─────────────────────────────────── */}
      <div className="lgi__form-panel">
        <div className="lgi__form-inner">
          <h1 className="lgi__title">Welcome back</h1>
          <p className="lgi__subtitle">Sign in to your account to continue .</p>

          {/* Demo hint */}
          <div className="lgi__demo-hint">
            <strong>Demo:</strong> artisan@demo.com or client@demo.com · password: <code>password</code>
          </div>

          <form className="lgi__form" onSubmit={handleSubmit} noValidate>
            <div className="lgi__field">
              <label className="lgi__label" htmlFor="lgi-email">Email</label>
              <input
                id="lgi-email"
                className="lgi__input"
                type="email"
                placeholder="artisan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="lgi__field">
              <label className="lgi__label" htmlFor="lgi-password">Password</label>
              <div className="lgi__input-wrap">
                <input
                  id="lgi-password"
                  className="lgi__input lgi__input--padded-right"
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lgi__eye-btn"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
              {/* Forgot password link — right-aligned under field */}
              <div className="lgi__forgot-row">
                <Link className="lgi__forgot-link" to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && <p className="lgi__error">{error}</p>}

            <button className="lgi__submit" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="lgi__switch">
            Don't have an account?{" "}
            <Link className="lgi__switch-link" to="/signup">Create account</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
