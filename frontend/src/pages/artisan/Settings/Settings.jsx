/**
 * Settings.jsx — /artisan/settings
 *
 * Fixes:
 *  - businessName has no default — user must type their own
 *  - Country list: Nigeria, Ghana, Sierra Leone, Kenya, Other
 *  - Added state and city inputs (stored in user session)
 *  - All data persists via AuthContext.updateProfile → localStorage
 *  - Avatar persists after refresh (stored as base64 in localStorage)
 *  - fullName seeded from signup (not hardcoded)
 *  - Profile data flows to Artisan Network via user session
 */
import { useState, useRef } from "react";
import { useAuth }           from "../../../context/AuthContext.jsx";
import "./Settings.css";

const COUNTRIES = [
  "Nigeria", "Ghana", "Sierra Leone", "Kenya", "Other",
];

const DIALS = [
  { code: "NG", flag: "🇳🇬", dial: "+234" },
  { code: "GH", flag: "🇬🇭", dial: "+233" },
  { code: "SL", flag: "🇸🇱", dial: "+232" },
  { code: "KE", flag: "🇰🇪", dial: "+254" },
  { code: "ZA", flag: "🇿🇦", dial: "+27"  },
  { code: "US", flag: "🇺🇸", dial: "+1"   },
  { code: "GB", flag: "🇬🇧", dial: "+44"  },
  { code: "AE", flag: "🇦🇪", dial: "+971" },
];

function Toggle({ on, onChange }) {
  return (
    <button type="button" className={`st-toggle ${on ? "st-toggle--on" : ""}`}
      onClick={() => onChange(!on)} role="switch" aria-checked={on}>
      <span className="st-toggle__thumb" />
    </button>
  );
}

export default function Settings() {
  const { user, updateProfile } = useAuth();

  /* ── Profile fields (seeded from saved session) ──────────── */
  const [name,     setName]     = useState(user?.fullName     ?? "");
  const [biz,      setBiz]      = useState(user?.businessName ?? "");   // no default
  const [phone,    setPhone]    = useState(user?.phone        ?? "");
  const [dialCode, setDialCode] = useState(DIALS[0]);
  const [country,  setCountry]  = useState(user?.country      ?? "");
  const [state,    setState_]   = useState(user?.state        ?? "");
  const [city,     setCity]     = useState(user?.city         ?? "");
  const [showDial, setShowDial] = useState(false);

  /* ── Notification prefs ──────────────────────────────────── */
  const [deadlineReminders, setDeadlineReminders] = useState(user?.pref_deadline ?? false);
  const [statusUpdate,      setStatusUpdate]      = useState(user?.pref_status   ?? true);
  const [aiInsights,        setAiInsights]        = useState(user?.pref_ai       ?? true);
  const [emailNotifs,       setEmailNotifs]       = useState(user?.pref_email    ?? false);

  /* ── Avatar ──────────────────────────────────────────────── */
  const fileRef  = useRef(null);
  const [avatar, setAvatar] = useState(user?.avatar ?? null);
  const [saved,  setSaved]  = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target.result;
      setAvatar(src);
      updateProfile({ avatar: src });   // persist immediately so Header updates
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const parts     = name.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName  = parts.slice(1).join(" ");

    // Build full location string for ArtisanNetwork display
    const locationParts = [city.trim(), state.trim(), country].filter(Boolean);
    const location = locationParts.join(", ");

    updateProfile({
      fullName:       name,
      firstName,
      lastName,
      businessName:   biz.trim(),
      phone:          phone ? `${dialCode.dial} ${phone}` : "",
      country,
      state:          state.trim(),
      city:           city.trim(),
      location,       // used by ArtisanNetwork card
      avatar,
      pref_deadline:  deadlineReminders,
      pref_status:    statusUpdate,
      pref_ai:        aiInsights,
      pref_email:     emailNotifs,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const avatarLetter = (user?.firstName ?? name ?? "?").charAt(0).toUpperCase();

  return (
    <div className="st">
      <form className="st__form" onSubmit={handleSave} noValidate>

        {/* ── Profile card ─────────────────────────────────── */}
        <div className="st__card">
          <p className="st__card-title">Profile</p>

          <div className="st__profile-row">
            <div className="st__avatar-wrap" onClick={() => fileRef.current?.click()}
              role="button" tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
              aria-label="Upload profile picture">
              <div className="st__avatar">
                {avatar
                  ? <img src={avatar} alt={name} className="st__avatar-img" />
                  : <span>{avatarLetter}</span>
                }
              </div>
              <div className="st__avatar-overlay">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <input ref={fileRef} type="file" accept="image/*"
                className="st__avatar-input" onChange={handleAvatarChange}
                aria-label="Choose profile photo" />
            </div>

            <div className="st__profile-info">
              <p className="st__profile-name">{name || "Your Name"}</p>
              <p className="st__profile-role">
                {user?.role === "artisan" ? "Fashion Artisan" : (user?.role ?? "Fashion Artisan")}
              </p>
            </div>
          </div>
        </div>

        {/* ── Profile fields ────────────────────────────────── */}
        <div className="st__field-group">

          {/* Full Name */}
          <div className="st__field">
            <label className="st__label" htmlFor="st-name">Full Name</label>
            <input id="st-name" className="st__input" type="text" value={name}
              placeholder="Your full name"
              onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Business Name — no default */}
          <div className="st__field">
            <label className="st__label" htmlFor="st-biz">Business Name</label>
            <input id="st-biz" className="st__input" type="text" value={biz}
              placeholder="Your business or studio name"
              onChange={(e) => setBiz(e.target.value)} />
          </div>

          {/* Phone Number */}
          <div className="st__field">
            <label className="st__label" htmlFor="st-phone">Phone Number</label>
            <div className="st__phone-wrap">
              <div className="st__dial-wrap">
                <button type="button" className="st__dial-btn" onClick={() => setShowDial((v) => !v)}>
                  <span className="st__dial-flag">{dialCode.flag}</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {showDial && (
                  <div className="st__dial-dropdown">
                    {DIALS.map((d) => (
                      <button key={d.code} type="button"
                        className={`st__dial-opt ${d.code === dialCode.code ? "st__dial-opt--active" : ""}`}
                        onClick={() => { setDialCode(d); setShowDial(false); }}>
                        <span>{d.flag}</span><span>{d.dial}</span>
                        <span className="st__dial-code">{d.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="st__phone-divider" />
              <span className="st__dial-label">{dialCode.dial}</span>
              <input id="st-phone" className="st__phone-input" type="tel"
                placeholder="800 000 0000" value={phone}
                onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          {/* Country */}
          <div className="st__field st__field--select">
            <label className="st__label" htmlFor="st-country">Country</label>
            <div className="st__select-wrap">
              <select id="st-country" className="st__select" value={country}
                onChange={(e) => setCountry(e.target.value)}>
                <option value="">Select Country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <svg className="st__select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>

          {/* State */}
          <div className="st__field">
            <label className="st__label" htmlFor="st-state">State / Region</label>
            <input id="st-state" className="st__input" type="text" value={state}
              placeholder="e.g. Lagos, Accra, Freetown…"
              onChange={(e) => setState_(e.target.value)} />
          </div>

          {/* City */}
          <div className="st__field">
            <label className="st__label" htmlFor="st-city">City</label>
            <input id="st-city" className="st__input" type="text" value={city}
              placeholder="e.g. Victoria Island, Kumasi…"
              onChange={(e) => setCity(e.target.value)} />
          </div>

          {/* Full location preview */}
          {(city || state || country) && (
            <div className="st__field st__location-preview">
              <p className="st__label">Your location will appear as:</p>
              <p className="st__location-display">
                {[city, state, country].filter(Boolean).join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* ── Notification Preferences ──────────────────────── */}
        <div className="st__card">
          <p className="st__card-title">Notification Preferences</p>

          {[
            { label: "Deadline Reminders", desc: "Get notified when delivery dates are approaching", val: deadlineReminders, set: setDeadlineReminders },
            { label: "Status Update",      desc: "Receive alert when order status changes",          val: statusUpdate,      set: setStatusUpdate      },
            { label: "AI Insights",        desc: "Get smart recommendations and risk alerts",        val: aiInsights,        set: setAiInsights        },
            { label: "Email Notifications",desc: "Also send notifications via email",                val: emailNotifs,       set: setEmailNotifs       },
          ].map((pref) => (
            <div className="st__pref-row" key={pref.label}>
              <div className="st__pref-text">
                <p className="st__pref-label">{pref.label}</p>
                <p className="st__pref-desc">{pref.desc}</p>
              </div>
              <Toggle on={pref.val} onChange={pref.set} />
            </div>
          ))}

          <div className="st__save-row">
            <button type="submit" className={`st__save-btn ${saved ? "st__save-btn--saved" : ""}`}>
              {saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
