/**
 * SignupPage.jsx  —  route: /signup
 * Split-screen layout: image panel left, form right.
 * Uses AuthContext.signup() — swap for real API when backend ready.
 */
import { useState }           from "react";
import { useNavigate, Link }  from "react-router-dom";
import { useAuth }            from "../../context/AuthContext.jsx";
import "./SignupPage.css";

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

export default function SignupPage() {
  const navigate    = useNavigate();
  const { signup }  = useAuth();

  const [role, setRole]           = useState("artisan");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!firstName.trim()) { setError("First name is required."); return; }
    if (!lastName.trim())  { setError("Last name is required."); return; }
    if (!email)            { setError("Email is required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setTimeout(() => {
      const result = signup({ name: `${firstName.trim()} ${lastName.trim()}`, email, password, role });
      setLoading(false);
      if (!result.ok) { setError(result.error); return; }
      navigate(result.redirectTo, { replace: true });
    }, 400);
  };

  return (
    <div className="sp">

      {/* ── LEFT — image panel ─────────────────────────────────── */}
      <div className="sp__panel">
        {/* Logo overlay */}
        <div className="sp__panel-logo">
          <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
            <circle cx="16" cy="16" r="16" fill="#6C63FF"/>
            <path d="M10 22 L16 8 L22 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.5 17.5 H19.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="sp__panel-logo-text">Fashion Link</span>
        </div>

        {/* Gradient overlay for readability */}
        <div className="sp__panel-overlay" />

        {/* Hero quote */}
        <div className="sp__panel-content">
          <blockquote className="sp__quote">
            "Built for Fashion,<br />Designed for Confidence."
          </blockquote>
          <p className="sp__quote-sub">
            "FashionLink is a fashion-tech marketplace that connects designers, tailors, and buyers, making custom fashion faster, more transparent, and more accessible."
          </p>

          {/* Feature list */}
          <ul className="sp__features">
            {FEATURES.map((f) => (
              <li key={f} className="sp__feature">
                <span className="sp__feature-check"><CheckIcon /></span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── RIGHT — form panel ─────────────────────────────────── */}
      <div className="sp__form-panel">
        <div className="sp__form-inner">
          <h1 className="sp__title">Lets get you registered first</h1>

          <form className="sp__form" onSubmit={handleSubmit} noValidate>

            {/* Role toggle */}
            <div className="sp__role-section">
              <p className="sp__role-label">I am a</p>
              <div className="sp__role-group">
                <button
                  type="button"
                  className={`sp__role-btn ${role === "artisan" ? "sp__role-btn--active" : ""}`}
                  onClick={() => setRole("artisan")}
                >
                  Fashion Artisan
                </button>
                <button
                  type="button"
                  className={`sp__role-btn ${role === "client" ? "sp__role-btn--active" : ""}`}
                  onClick={() => setRole("client")}
                >
                  Client
                </button>
              </div>
            </div>

            {/* First name */}
            <div className="sp__field">
              <label className="sp__label" htmlFor="sp-first">First Name</label>
              <input
                id="sp-first"
                className="sp__input"
                type="text"
                placeholder="Placeholder"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                autoFocus
              />
            </div>

            {/* Last name */}
            <div className="sp__field">
              <label className="sp__label" htmlFor="sp-last">Last Name</label>
              <input
                id="sp-last"
                className="sp__input"
                type="text"
                placeholder="Placeholder"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>

            {/* Email */}
            <div className="sp__field">
              <label className="sp__label" htmlFor="sp-email">Email</label>
              <input
                id="sp-email"
                className="sp__input"
                type="email"
                placeholder="Placeholder"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="sp__field">
              <label className="sp__label" htmlFor="sp-password">Password</label>
              <input
                id="sp-password"
                className="sp__input"
                type="password"
                placeholder="Placeholder"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {error && <p className="sp__error">{error}</p>}

            <button className="sp__submit" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="sp__switch">
            Already have an account?{" "}
            <Link className="sp__switch-link" to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
