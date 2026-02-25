import { useState }          from "react";
import { useNavigate }       from "react-router-dom";
import { clients }           from "../../../data/mockData";
import Icon                  from "../../../components/Icon.jsx";
import "./Clients.css";

/* ── Avatar initials helper ─────────────────────────────────── */
function initials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

/* ── Single client card ──────────────────────────────────────── */
function ClientCard({ client }) {
  const navigate = useNavigate();
  const go = () => navigate(`/artisan/clients/${client.id}`);

  return (
    <div
      className="cc"
      onClick={go}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && go()}
      aria-label={`View profile for ${client.name}`}
    >
      {/* Hover overlay */}
      <div className="cc__overlay">
        <span className="cc__overlay-btn">View Profile</span>
      </div>

      {/* Card header */}
      <div className="cc__head">
        <div className="cc__avatar">{initials(client.name)}</div>
        <div className="cc__name-wrap">
          <p className="cc__name">{client.name}</p>
          <p className="cc__id">{client.clientId}</p>
        </div>
        {/* Arrow always visible top-right */}
        <span className="cc__arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </span>
      </div>

      {/* Contact info */}
      <div className="cc__contact">
        <span className="cc__contact-row">
          <Icon name="bell" className="cc__contact-icon" />
          <span className="cc__contact-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </span>
          {client.email}
        </span>
        <span className="cc__contact-row">
          <span className="cc__contact-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.27-.84a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
          {client.phone}
        </span>
      </div>

      {/* Divider */}
      <div className="cc__divider" />

      {/* Footer stats */}
      <div className="cc__footer">
        <span className="cc__footer-stat">
          <span className="cc__footer-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </span>
          {client.orderCount} {client.orderCount === 1 ? "order" : "orders"}
        </span>
        <span className="cc__footer-last">Last : {client.lastOrderShort}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function Clients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="clients-page">

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="clients-page__toolbar">
        <div className="clients-page__search-wrap">
          <span className="clients-page__search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            className="clients-page__search"
            type="search"
            placeholder="Search Clients"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="clients-page__add-btn"
          type="button"
          onClick={() => navigate("/artisan/clients/add")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Client
        </button>
      </div>

      {/* ── Grid ────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="clients-page__empty">
          <p>No clients match your search.</p>
        </div>
      ) : (
        <div className="clients-page__grid">
          {filtered.map((c) => (
            <ClientCard key={c.id} client={c} />
          ))}
        </div>
      )}
    </div>
  );
}
