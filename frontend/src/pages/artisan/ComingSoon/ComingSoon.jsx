/**
 * ComingSoon.jsx  —  route: /artisan/coming-soon
 * Placeholder for Invite to Collaborate & Message Artisan features.
 */
import { useNavigate } from "react-router-dom";
import "./ComingSoon.css";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="cs">
      <div className="cs__inner">
        <div className="cs__icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <h1 className="cs__title">Coming Soon</h1>
        <p className="cs__desc">
          This feature is currently in development. We're working hard to bring you collaboration and messaging tools. Stay tuned!
        </p>
        <div className="cs__actions">
          <button className="cs__btn-primary" type="button" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
          <button className="cs__btn-ghost" type="button" onClick={() => navigate("/artisan/network")}>
            Browse Artisans
          </button>
        </div>
      </div>
    </div>
  );
}
