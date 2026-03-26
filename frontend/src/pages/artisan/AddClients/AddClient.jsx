/**
 * AddClient.jsx — /artisan/clients/add
 *
 * Fixed:
 *  - Search registered clients (clients who signed up via client portal)
 *  - Select → autofill name, email, phone from their real profile
 *  - Autofilled data locked (email read-only) to prevent mismatch
 *  - Falls back to manual entry if no match found
 *  - Writes via DataContext.addClient() — persists to API + localStorage
 */
import { useState, useRef, useEffect } from "react";
import { useNavigate }                  from "react-router-dom";
import { useData }                      from "../../../context/DataContext.jsx";
import { getRegisteredClients }         from "../../../services/store.js";
import "./AddClient.css";

const COUNTRIES = [
  { code: "NG", flag: "🇳🇬", dial: "+234" },
  { code: "GH", flag: "🇬🇭", dial: "+233" },
  { code: "KE", flag: "🇰🇪", dial: "+254" },
  { code: "ZA", flag: "🇿🇦", dial: "+27"  },
  { code: "US", flag: "🇺🇸", dial: "+1"   },
  { code: "GB", flag: "🇬🇧", dial: "+44"  },
  { code: "AE", flag: "🇦🇪", dial: "+971" },
];

export default function AddClient() {
  const navigate      = useNavigate();
  const { addClient } = useData();

  /* ── Registered client search ────────────────────────────── */
  const [regSearch,      setRegSearch]      = useState("");
  const [regResults,     setRegResults]     = useState([]);
  const [selectedReg,    setSelectedReg]    = useState(null);
  const [showRegResults, setShowRegResults] = useState(false);
  const searchRef = useRef(null);

  const allRegistered = getRegisteredClients();

  // Filter registered clients by query
  useEffect(() => {
    const q = regSearch.trim().toLowerCase();
    if (!q) { setRegResults([]); return; }
    const matches = allRegistered.filter(
      (c) =>
        (c.fullName ?? "").toLowerCase().includes(q) ||
        (c.email    ?? "").toLowerCase().includes(q)
    );
    setRegResults(matches);
    setShowRegResults(true);
  }, [regSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowRegResults(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSelectRegistered = (reg) => {
    setSelectedReg(reg);
    setName(reg.fullName   ?? "");
    setEmail(reg.email      ?? "");
    setPhone(reg.phone      ?? "");
    setRegSearch(reg.fullName ?? reg.email ?? "");
    setShowRegResults(false);
  };

  const handleClearSelected = () => {
    setSelectedReg(null);
    setName(""); setEmail(""); setPhone(""); setRegSearch("");
  };

  /* ── Manual form fields ──────────────────────────────────── */
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [phone,      setPhone]      = useState("");
  const [country,    setCountry]    = useState(COUNTRIES[0]);
  const [showDrop,   setShowDrop]   = useState(false);
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim())  { setError("Full name is required."); return; }
    if (!email.trim()) { setError("Email is required.");     return; }

    setSubmitting(true);
    const { ok } = await addClient({
      name:         name.trim(),
      email:        email.trim(),
      phone:        phone || "",
      measurements: {},
    });
    setSubmitting(false);
    if (ok) navigate("/artisan/clients");
    else    setError("Failed to add client. Please try again.");
  };

  return (
    <div className="ac">
      <div className="ac__card">
        <div className="ac__header">
          <h1 className="ac__title">Add New Client</h1>
          <button className="ac__close" type="button" onClick={() => navigate("/artisan/clients")} aria-label="Cancel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form className="ac__form" onSubmit={handleSubmit} noValidate>

          {/* ── Registered client search ───────────────────── */}
          <div className="ac__search-section" ref={searchRef}>
            <label className="ac__label">Search Registered Clients</label>
            <div className="ac__search-wrap">
              <svg className="ac__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="ac__search-input"
                type="text"
                placeholder="Search by name or email…"
                value={regSearch}
                onChange={(e) => { setRegSearch(e.target.value); if (selectedReg) handleClearSelected(); }}
                onFocus={() => regResults.length > 0 && setShowRegResults(true)}
              />
              {selectedReg && (
                <button type="button" className="ac__search-clear" onClick={handleClearSelected} aria-label="Clear">✕</button>
              )}
            </div>

            {/* Dropdown results */}
            {showRegResults && regResults.length > 0 && (
              <div className="ac__search-results">
                {regResults.map((reg) => (
                  <button key={reg.email} type="button"
                    className="ac__search-result-item"
                    onClick={() => handleSelectRegistered(reg)}>
                    <div className="ac__result-avatar">
                      {(reg.fullName ?? reg.email ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="ac__result-info">
                      <p className="ac__result-name">{reg.fullName}</p>
                      <p className="ac__result-email">{reg.email}</p>
                    </div>
                    <span className="ac__result-badge">Registered</span>
                  </button>
                ))}
              </div>
            )}

            {showRegResults && regResults.length === 0 && regSearch.trim() && (
              <div className="ac__search-empty">
                No registered clients match "{regSearch}". Fill in manually below.
              </div>
            )}

            {/* Selected badge */}
            {selectedReg && (
              <div className="ac__selected-client">
                <span className="ac__selected-icon">✓</span>
                <span>Autofilled from <strong>{selectedReg.fullName}</strong>'s registered profile</span>
              </div>
            )}

            <div className="ac__search-divider">
              <span>or add manually</span>
            </div>
          </div>

          {/* ── Manual fields ─────────────────────────────── */}
          <div className="ac__field-group">

            <div className="ac__field">
              <label className="ac__label" htmlFor="ac-name">Full Name</label>
              <input id="ac-name" className="ac__input" type="text" placeholder="Enter client name"
                value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
            </div>

            <div className="ac__field">
              <label className="ac__label" htmlFor="ac-email">Email</label>
              <input id="ac-email" className={`ac__input ${selectedReg ? "ac__input--locked" : ""}`}
                type="email" placeholder="client@example.com"
                value={email} onChange={(e) => !selectedReg && setEmail(e.target.value)}
                readOnly={!!selectedReg} autoComplete="off" />
              {selectedReg && <p className="ac__input-hint">Email locked to registered account</p>}
            </div>

            <div className="ac__field">
              <label className="ac__label" htmlFor="ac-phone">Phone Number</label>
              <div className="ac__phone-wrap">
                <div className="ac__country-selector">
                  <button type="button" className="ac__country-btn"
                    onClick={() => setShowDrop((v) => !v)} aria-label="Select country code">
                    <span className="ac__country-flag">{country.flag}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {showDrop && (
                    <div className="ac__country-drop">
                      {COUNTRIES.map((c) => (
                        <button key={c.code} type="button"
                          className={`ac__country-opt ${c.code === country.code ? "ac__country-opt--active" : ""}`}
                          onClick={() => { setCountry(c); setShowDrop(false); }}>
                          <span>{c.flag}</span><span>{c.dial}</span>
                          <span className="ac__country-name">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ac__phone-divider" />
                <span className="ac__phone-dial">{country.dial}</span>
                <input id="ac-phone" className="ac__phone-input" type="tel" placeholder="80000 000000"
                  value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
          </div>

          {error && <p className="ac__error">{error}</p>}

          <div className="ac__actions">
            <button type="button" className="ac__cancel" onClick={() => navigate("/artisan/clients")}>Cancel</button>
            <button type="submit" className="ac__submit" disabled={submitting}>
              {submitting ? "Adding…" : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
