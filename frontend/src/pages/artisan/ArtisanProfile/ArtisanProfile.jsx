/**
 * ArtisanProfile.jsx  —  route: /artisan/network/:id
 * Shows artisan header, about/skills/collab prefs, portfolio, reviews.
 * Matches PROFILE.png design exactly.
 */
import { useParams, useNavigate } from "react-router-dom";
import { artisans }               from "../../../data/artisanData";
import "./ArtisanProfile.css";

function StarRow({ rating }) {
  return (
    <div className="apr-stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? "#f59e0b" : "#e0e3ee"}
          stroke={i < Math.round(rating) ? "#f59e0b" : "#e0e3ee"}
          strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function ArtisanProfile() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const artisan = artisans.find((a) => a.id === id);

  if (!artisan) {
    return (
      <div className="apr apr--not-found">
        <p>Artisan not found.</p>
        <button onClick={() => navigate("/artisan/network")} type="button">← Back to Browse</button>
      </div>
    );
  }

  const COLLAB_LABEL = { project: "Project Base", longterm: "Long Term Partnership", contract: "Contract Work", onetime: "One-time gig" };

  return (
    <div className="apr">

      {/* ── Back ──────────────────────────────────────────────── */}
      <button className="apr__back" onClick={() => navigate("/artisan/network")} type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Browse
      </button>

      {/* ── Hero card ─────────────────────────────────────────── */}
      <div className="apr__hero-card">
        <div className="apr__hero-left">
          <img className="apr__avatar" src={artisan.avatar} alt={artisan.name} />
          <div className="apr__hero-info">
            <h1 className="apr__name">{artisan.name}</h1>
            <p className="apr__role">{artisan.role}</p>
            <div className="apr__skills-row">
              {artisan.skills.map((s) => (
                <span className="apr__skill-tag" key={s}>{s}</span>
              ))}
            </div>
            <div className="apr__meta-row">
              <span className="apr__location">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {artisan.location}
              </span>
              <span className="apr__rating">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {artisan.rating}
              </span>
              <span className="apr__exp">{artisan.experience} years Experience</span>
            </div>
          </div>
        </div>

        <div className="apr__hero-actions">
          <button
            className="apr__btn-primary"
            type="button"
            onClick={() => navigate("/artisan/coming-soon")}
          >
            Invite to Collaborate
          </button>
          <button
            className="apr__btn-outline"
            type="button"
            onClick={() => navigate("/artisan/coming-soon")}
          >
            Message Artisan
          </button>
        </div>
      </div>

      {/* ── About card ────────────────────────────────────────── */}
      <div className="apr__section-card">
        <p className="apr__section-label">About</p>
        <p className="apr__about-text">{artisan.bio}</p>

        <p className="apr__subsection-label">Areas of Expertise</p>
        <div className="apr__tags">
          {artisan.skills.map((s) => (
            <span className="apr__tag" key={s}>{s}</span>
          ))}
        </div>

        <p className="apr__subsection-label">Collaboration Preferences</p>
        <div className="apr__tags">
          {artisan.collabTypes.map((ct) => (
            <span className="apr__tag" key={ct}>{COLLAB_LABEL[ct] ?? ct}</span>
          ))}
        </div>
      </div>

      {/* ── Portfolio card ────────────────────────────────────── */}
      <div className="apr__section-card">
        <p className="apr__section-label">Portfolio</p>
        <div className="apr__portfolio-grid">
          {artisan.portfolio.map((p, i) => (
            <div className="apr__portfolio-item" key={i}>
              <img className="apr__portfolio-img" src={p.img} alt={p.caption} />
              <p className="apr__portfolio-caption">{p.caption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Reviews card ──────────────────────────────────────── */}
      <div className="apr__section-card">
        <div className="apr__reviews-head">
          <p className="apr__section-label">Reviews</p>
          <span className="apr__reviews-summary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {artisan.rating} ({artisan.reviews.length} Reviews)
          </span>
        </div>

        <div className="apr__reviews-list">
          {artisan.reviews.map((r, i) => (
            <div className="apr__review" key={i}>
              <p className="apr__review-name">{r.name}</p>
              <StarRow rating={r.rating} />
              <p className="apr__review-text">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
