/**
 * ClientDashboard.jsx
 * Route: /client/dashboard
 * Stub — extend with client-specific layout and components.
 */
import { useNavigate } from "react-router-dom";
// import "./ClientDashboard.css";

export default function ClientDashboard() {
  const navigate = useNavigate();

  return (
    <div className="cd-page">
      <div className="cd-card">
        <div className="cd-logo">
          <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
            <circle cx="16" cy="16" r="16" fill="#6C63FF"/>
            <path d="M10 22 L16 8 L22 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.5 17.5 H19.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="cd-logo__text">Fashion Link</span>
        </div>

        <h1 className="cd-title">Client Portal</h1>
        <p className="cd-subtitle">Your orders and measurements, all in one place.</p>

        <div className="cd-coming-soon">
          <span>🚧</span>
          <p>Client dashboard coming soon</p>
        </div>

        <button className="cd-logout-btn" onClick={() => navigate("/login")}>
          Sign out
        </button>
      </div>
    </div>
  );
}
