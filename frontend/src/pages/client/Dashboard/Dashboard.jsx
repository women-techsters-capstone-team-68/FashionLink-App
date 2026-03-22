import { useState, useMemo } from "react";
import { useNavigate }       from "react-router-dom";
import { useAuth }           from "../../../context/AuthContext.jsx";
import { artisans }          from "../../../data/artisanData.js";
import { getClientOrders }   from "../../../services/store.js";
import "./Dashboard.css";

/* ── Badge helper ─────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    "in progress": "inprogress", "inprogress": "inprogress",
    "assigned": "assigned", "completed": "completed",
    "delayed": "delayed", "pending": "assigned",
  };
  const cls = map[(status ?? "").toLowerCase()] ?? "assigned";
  return <span className={`badge ${cls}`}>● {status}</span>;
}

/* ── Artisan Card ─────────────────────────────────────────────── */
function ArtisanCard({ artisan, onViewProfile, onMessage }) {
  return (
    <div className="artisan-card">
      <div className="artisan-card-top">
        <div className="artisan-info-row">
          <div className="artisan-avatar" style={{ background: artisan.avatarColor ?? "#6b5ce7" }}>
            {artisan.avatar
              ? <img src={artisan.avatar} alt={artisan.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              : artisan.name.slice(0, 2).toUpperCase()
            }
          </div>
          <div className="artisan-name-col">
            <div className="artisan-name">{artisan.name}</div>
            <div className="artisan-specialty">{artisan.role}</div>
          </div>
          <span className={`artisan-badge ${artisan.badgeColor ?? "purple"}`}>
            {artisan.category?.split(" ")[0] ?? "Artisan"}
          </span>
        </div>

        <div className="artisan-skills-row">
          {(artisan.skills ?? []).slice(0, 2).map((s, i) => (
            <div key={i} className="artisan-skill">{s}</div>
          ))}
        </div>

        <div className="artisan-meta-row">
          <span className="artisan-location">📍 {artisan.location}</span>
          <span className="artisan-rating">⭐ {artisan.rating ?? "4.5"}</span>
        </div>

        <div className="artisan-experience">{artisan.experience} years Experience</div>
        <div className="artisan-bio">{artisan.bio}</div>
      </div>

      <div className="artisan-card-actions">
        <button className="view-profile-btn" onClick={() => onViewProfile(artisan)}>
          View Profile
        </button>
        <button className="message-artisan-btn" onClick={() => onMessage(artisan)}>
          Message
        </button>
      </div>
    </div>
  );
}

/* ── Artisan Contact Modal ────────────────────────────────────── */
function ArtisanContactModal({ artisan, onClose }) {
  if (!artisan) return null;
  return (
    <div className="cl-modal-backdrop" onClick={onClose}>
      <div className="cl-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cl-modal-close" onClick={onClose}>✕</button>

        <div className="cl-modal-header">
          <div className="artisan-avatar" style={{ width: 64, height: 64, fontSize: 20, background: "#6b5ce7" }}>
            {artisan.avatar
              ? <img src={artisan.avatar} alt={artisan.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              : artisan.name.slice(0, 2).toUpperCase()
            }
          </div>
          <div>
            <h2 className="cl-modal-name">{artisan.name}</h2>
            {artisan.businessName && <p className="cl-modal-biz">{artisan.businessName}</p>}
            <p className="cl-modal-role">{artisan.role}</p>
          </div>
        </div>

        <div className="cl-modal-body">
          <div className="cl-contact-row">
            <span className="cl-contact-label">📍 Location</span>
            <span className="cl-contact-value">{artisan.location}</span>
          </div>
          <div className="cl-contact-row">
            <span className="cl-contact-label">⭐ Rating</span>
            <span className="cl-contact-value">{artisan.rating ?? "4.5"} / 5</span>
          </div>
          <div className="cl-contact-row">
            <span className="cl-contact-label">🕐 Experience</span>
            <span className="cl-contact-value">{artisan.experience} years</span>
          </div>
          <div className="cl-contact-row">
            <span className="cl-contact-label">🤝 Collab</span>
            <span className="cl-contact-value">
              {(artisan.collabTypes ?? []).join(", ") || "Project-based"}
            </span>
          </div>

          <div className="cl-modal-bio">{artisan.bio}</div>

          <div className="cl-modal-skills">
            {(artisan.skills ?? []).map((s, i) => (
              <span key={i} className="cl-skill-tag">{s}</span>
            ))}
          </div>
        </div>

        <div className="cl-modal-footer">
          <button className="cl-invite-btn" onClick={onClose}>
            ✉️ Send Collaboration Request
          </button>
          <p className="cl-coming-soon-note">Messaging coming soon</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function ClientDashboard() {
  const navigate           = useNavigate();
  const { user }           = useAuth();
  const userId             = user?.id ?? user?.email ?? null;

  const [searchQuery, setSearchQuery] = useState("");
  const [showAllArtisans, setShowAllArtisans] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);

  // Load client's orders from localStorage
  const myOrders = userId ? getClientOrders(userId) : [];

  // Filter artisans by search query
  const q = searchQuery.trim().toLowerCase();
  const filteredArtisans = useMemo(() => {
    if (!q) return artisans;
    return artisans.filter((a) =>
      (a.name         ?? "").toLowerCase().includes(q) ||
      (a.businessName ?? "").toLowerCase().includes(q) ||
      (a.role         ?? "").toLowerCase().includes(q) ||
      (a.category     ?? "").toLowerCase().includes(q) ||
      (a.skills ?? []).some((s) => s.toLowerCase().includes(q))
    );
  }, [q]);

  // Top rated = highest rating, limit 4 unless "See All"
  const topRated = useMemo(() =>
    [...filteredArtisans].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
    [filteredArtisans]
  );
  const displayed = showAllArtisans ? topRated : topRated.slice(0, 4);

  const handleMessage = () => navigate("/client/messages");

  return (
    <div className="page-wrapper">
      <div className="dashboard-content">

        {/* SEARCH */}
        <div className="dashboard-search-wrap">
          <span className="dashboard-search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            className="dashboard-search-input"
            placeholder="Search for tailors, weavers, embroiderers, shoemakers…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* TOP RATED ARTISANS */}
        <div className="dashboard-section-header">
          <div className="dashboard-section-title">
            {q ? `Results for "${searchQuery}" (${filteredArtisans.length})` : "Top Rated Artisans"}
          </div>
          <button className="see-all-btn" onClick={() => setShowAllArtisans((v) => !v)}>
            {showAllArtisans ? "Show less ↑" : `See all (${topRated.length}) →`}
          </button>
        </div>

        {displayed.length === 0 ? (
          <div className="dashboard-card" style={{ padding: "32px", textAlign: "center", color: "#9a9ab0" }}>
            No artisans match your search.
          </div>
        ) : (
          <div className="artisans-grid">
            {displayed.map((artisan) => (
              <ArtisanCard
                key={artisan.id}
                artisan={artisan}
                onViewProfile={setSelectedArtisan}
                onMessage={handleMessage}
              />
            ))}
          </div>
        )}

        {/* ALL ORDERS */}
        <div className="dashboard-section-header">
          <div className="dashboard-section-title">All Orders</div>
          <button className="see-all-btn" onClick={() => navigate("/client/orders")}>View all →</button>
        </div>

        <div className="dashboard-card">
          {myOrders.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "#9a9ab0", fontSize: "14px" }}>
              <p>No orders yet.</p>
              <p style={{ marginTop: 6, fontSize: 12 }}>Your artisan's orders for you will appear here.</p>
            </div>
          ) : (
            <div className="all-orders-list">
              {myOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="all-order-item"
                  onClick={() => navigate("/client/orders")}>
                  <div className="all-order-left">
                    <div className="all-order-id-row">
                      <span className="order-id-text">{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="all-order-desc">{order.description}</div>
                    <div className="all-order-date">📅 Due {order.delivery}</div>
                  </div>
                  <span className="all-order-arrow">→</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Artisan Contact Modal */}
      {selectedArtisan && (
        <ArtisanContactModal
          artisan={selectedArtisan}
          onClose={() => setSelectedArtisan(null)}
        />
      )}
    </div>
  );
}
