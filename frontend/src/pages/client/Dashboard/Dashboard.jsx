import { useState, useMemo } from "react";
import { useNavigate }       from "react-router-dom";
import { useAuth }           from "../../../context/AuthContext.jsx";
import { artisans }          from "../../../data/artisanData.js";
import { getClientOrders, getAllArtisans } from "../../../services/store.js";
import "./Dashboard.css";

function StatusBadge({ status = "" }) {
  const cls = { "in progress": "inprogress", "assigned": "assigned", "completed": "completed", "delayed": "delayed", "pending": "assigned" }[status.toLowerCase()] ?? "assigned";
  return <span className={`badge ${cls}`}>● {status}</span>;
}

function ArtisanCard({ artisan }) {
  const navigate = useNavigate();
  return (
    <div className="artisan-card">
      <div className="artisan-card-top">
        <div className="artisan-info-row">
          <div className="artisan-avatar" style={{ background: "#6b5ce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {artisan.avatar
              ? <img src={artisan.avatar} alt={artisan.name} style={{ width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%" }} />
              : artisan.name.slice(0, 2).toUpperCase()
            }
          </div>
          <div className="artisan-name-col">
            <div className="artisan-name">{artisan.name}</div>
            <div className="artisan-specialty">{artisan.role}</div>
          </div>
          <span className="artisan-badge purple">
            {artisan.category ?? "Artisan"}
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
        <button className="view-profile-btn"
          onClick={() => navigate(`/client/artisans/${artisan.id}`)}>
          View Profile
        </button>
        {/* Contact Artisan replaces Message */}
        <button className="message-artisan-btn"
          onClick={() => navigate(`/client/artisans/${artisan.id}/contact`)}>
          Contact Artisan
        </button>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const clientEmail = user?.email ?? null;
  const [searchQuery, setSearchQuery] = useState("");

  const myOrders = clientEmail ? getClientOrders(clientEmail) : [];

  // Same merged pool as ArtisanNetwork
  const pool = useMemo(() => getAllArtisans(artisans), []);

  const q = searchQuery.trim().toLowerCase();
  const filteredArtisans = useMemo(() => {
    if (!q) return pool;
    return pool.filter((a) =>
      (a.name         ?? "").toLowerCase().includes(q) ||
      (a.businessName ?? "").toLowerCase().includes(q) ||
      (a.role         ?? "").toLowerCase().includes(q) ||
      (a.category     ?? "").toLowerCase().includes(q) ||
      (a.skills ?? []).some((s) => s.toLowerCase().includes(q))
    );
  }, [q, pool]);

  const topRated  = useMemo(() => [...filteredArtisans].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)), [filteredArtisans]);
  const displayed = topRated.slice(0, 4);

  return (
    <div className="page-wrapper">
      <div className="dashboard-content">

        {/* Search */}
        <div className="dashboard-search-wrap">
          <span className="dashboard-search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input className="dashboard-search-input"
            placeholder="Search tailors, weavers, embroiderers, shoemakers…"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        {/* Top Rated */}
        <div className="dashboard-section-header">
          <div className="dashboard-section-title">
            {q ? `Results for "${searchQuery}" (${filteredArtisans.length})` : "Top Rated Artisans"}
          </div>
          <button className="see-all-btn" onClick={() => navigate("/client/artisans")}>
            See all →
          </button>
        </div>

        {displayed.length === 0 ? (
          <div className="dashboard-card" style={{ padding: 32, textAlign: "center", color: "#9a9ab0" }}>
            No artisans match your search.
          </div>
        ) : (
          <div className="artisans-grid">
            {displayed.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        )}

        {/* Orders */}
        <div className="dashboard-section-header">
          <div className="dashboard-section-title">All Orders</div>
          <button className="see-all-btn" onClick={() => navigate("/client/orders")}>View all →</button>
        </div>

        <div className="dashboard-card">
          {myOrders.length === 0 ? (
            <div style={{ padding: "28px 20px", textAlign: "center", color: "#9a9ab0", fontSize: 14 }}>
              <p>No orders yet.</p>
              <p style={{ marginTop: 6, fontSize: 12 }}>Orders your artisan creates will appear here.</p>
            </div>
          ) : (
            <div className="all-orders-list">
              {myOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="all-order-item" onClick={() => navigate("/client/orders")}>
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
    </div>
  );
}
