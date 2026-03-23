// Settings.jsx — /artisan/settings — profile, phones, socials, categories, experience, collab, portfolio
import { useState, useRef } from "react";
import { useAuth }           from "../../../context/AuthContext.jsx";
import { NETWORK_CATEGORIES, EXPERIENCE_LEVELS, COLLAB_TYPES } from "../../../data/artisanData.js";
import "./Settings.css";

const COUNTRIES = ["Nigeria", "Ghana", "Sierra Leone", "Kenya", "Other"];

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

// Multi-select chip button
function ChipSelect({ options, selected, onChange, labelKey = "label", valueKey = "id" }) {
  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter((v) => v !== val));
    else onChange([...selected, val]);
  };
  return (
    <div className="st__chips">
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt[valueKey];
        const lbl = typeof opt === "string" ? opt : opt[labelKey];
        return (
          <button key={val} type="button"
            className={`st__chip ${selected.includes(val) ? "st__chip--on" : ""}`}
            onClick={() => toggle(val)}>
            {lbl}
          </button>
        );
      })}
    </div>
  );
}

export default function Settings() {
  const { user, updateProfile } = useAuth();

  // Basic profile
  const [name,    setName]    = useState(user?.fullName     ?? "");
  const [biz,     setBiz]     = useState(user?.businessName ?? "");
  const [country, setCountry] = useState(user?.country      ?? "");
  const [state,   setState_]  = useState(user?.state        ?? "");
  const [city,    setCity]    = useState(user?.city         ?? "");
  const [address, setAddress] = useState(user?.address      ?? "");

  // Multiple phones — stored as array
  const [phones, setPhones] = useState(
    user?.phones ?? (user?.phone ? [user.phone] : [""])
  );

  // Social media
  const [socials, setSocials] = useState(user?.socials ?? {
    instagram: "", facebook: "", pinterest: "", youtube: "", tiktok: "", other: "",
  });

  // Professional
  const [categories,  setCategories]  = useState(user?.categories  ?? []);
  const [expLevel,    setExpLevel]     = useState(user?.expLevel    ?? "");
  const [collabTypes, setCollabTypes]  = useState(user?.collabTypes ?? []);

  // Portfolio links
  const [portfolioLinks, setPortfolioLinks] = useState(user?.portfolioLinks ?? [""]);

  // Notification prefs
  const [deadlineReminders, setDeadlineReminders] = useState(user?.pref_deadline ?? false);
  const [statusUpdate,      setStatusUpdate]      = useState(user?.pref_status   ?? true);
  const [aiInsights,        setAiInsights]        = useState(user?.pref_ai       ?? true);
  const [emailNotifs,       setEmailNotifs]       = useState(user?.pref_email    ?? false);

  // Avatar
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
      updateProfile({ avatar: src });
    };
    reader.readAsDataURL(file);
  };

  // Phone array helpers
  const addPhone    = ()       => setPhones([...phones, ""]);
  const removePhone = (i)      => setPhones(phones.filter((_, idx) => idx !== i));
  const updatePhone = (i, val) => setPhones(phones.map((p, idx) => idx === i ? val : p));

  // Portfolio link helpers
  const addPortfolio    = ()       => setPortfolioLinks([...portfolioLinks, ""]);
  const removePortfolio = (i)      => setPortfolioLinks(portfolioLinks.filter((_, idx) => idx !== i));
  const updatePortfolio = (i, val) => setPortfolioLinks(portfolioLinks.map((p, idx) => idx === i ? val : p));

  const handleSave = (e) => {
    e.preventDefault();
    const parts     = name.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName  = parts.slice(1).join(" ");
    const locationParts = [city.trim(), state.trim(), country].filter(Boolean);
    const location  = locationParts.join(", ");
    const cleanPhones = phones.filter((p) => p.trim());

    updateProfile({
      fullName: name, firstName, lastName,
      businessName: biz.trim(),
      country, state: state.trim(), city: city.trim(),
      address: address.trim(), location,
      phones: cleanPhones,
      phone: cleanPhones[0] ?? "",      // keep single-phone field in sync
      socials,
      categories, expLevel, collabTypes,
      portfolioLinks: portfolioLinks.filter((l) => l.trim()),
      avatar,
      pref_deadline: deadlineReminders,
      pref_status:   statusUpdate,
      pref_ai:       aiInsights,
      pref_email:    emailNotifs,
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
                {avatar ? <img src={avatar} alt={name} className="st__avatar-img" /> : <span>{avatarLetter}</span>}
              </div>
              <div className="st__avatar-overlay">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="st__avatar-input" onChange={handleAvatarChange} />
            </div>
            <div className="st__profile-info">
              <p className="st__profile-name">{name || "Your Name"}</p>
              <p className="st__profile-role">{user?.role === "artisan" ? "Fashion Artisan" : (user?.role ?? "Fashion Artisan")}</p>
            </div>
          </div>
        </div>

        {/* ── Basic info ────────────────────────────────────── */}
        <div className="st__field-group">
          <div className="st__field">
            <label className="st__label" htmlFor="st-name">Full Name</label>
            <input id="st-name" className="st__input" type="text" value={name} placeholder="Your full name" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="st__field">
            <label className="st__label" htmlFor="st-biz">Business Name</label>
            <input id="st-biz" className="st__input" type="text" value={biz} placeholder="Your business or studio name" onChange={(e) => setBiz(e.target.value)} />
          </div>

          {/* Multiple phone numbers */}
          <div className="st__field">
            <label className="st__label">Phone Numbers</label>
            {phones.map((ph, i) => (
              <div key={i} className="st__phone-row">
                <input className="st__input st__input--phone" type="tel" value={ph}
                  placeholder="+234 800 000 0000"
                  onChange={(e) => updatePhone(i, e.target.value)} />
                {phones.length > 1 && (
                  <button type="button" className="st__remove-btn" onClick={() => removePhone(i)}>✕</button>
                )}
              </div>
            ))}
            <button type="button" className="st__add-link" onClick={addPhone}>+ Add phone number</button>
          </div>

          {/* Location */}
          <div className="st__field st__field--select">
            <label className="st__label" htmlFor="st-country">Country</label>
            <div className="st__select-wrap">
              <select id="st-country" className="st__select" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">Select Country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <svg className="st__select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div className="st__field">
            <label className="st__label" htmlFor="st-state">State / Region</label>
            <input id="st-state" className="st__input" type="text" value={state} placeholder="e.g. Lagos, Accra…" onChange={(e) => setState_(e.target.value)} />
          </div>
          <div className="st__field">
            <label className="st__label" htmlFor="st-city">City</label>
            <input id="st-city" className="st__input" type="text" value={city} placeholder="e.g. Victoria Island…" onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="st__field">
            <label className="st__label" htmlFor="st-address">Full Address</label>
            <input id="st-address" className="st__input" type="text" value={address} placeholder="Street address, building…" onChange={(e) => setAddress(e.target.value)} />
          </div>

          {(city || state || country) && (
            <div className="st__field st__location-preview">
              <p className="st__label">Location on network:</p>
              <p className="st__location-display">{[city, state, country].filter(Boolean).join(", ")}</p>
            </div>
          )}
        </div>

        {/* ── Social media ──────────────────────────────────── */}
        <div className="st__card">
          <p className="st__card-title">Social Media Links</p>
          {[
            { key: "instagram", label: "Instagram",  placeholder: "instagram.com/yourhandle" },
            { key: "facebook",  label: "Facebook",   placeholder: "facebook.com/yourpage"    },
            { key: "pinterest", label: "Pinterest",  placeholder: "pinterest.com/yourprofile"},
            { key: "youtube",   label: "YouTube",    placeholder: "youtube.com/@yourchannel" },
            { key: "tiktok",    label: "TikTok",     placeholder: "tiktok.com/@yourhandle"   },
            { key: "other",     label: "Other Link", placeholder: "yourwebsite.com"           },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="st__social-field">
              <label className="st__social-label">{label}</label>
              <input className="st__input" type="url" value={socials[key] ?? ""}
                placeholder={placeholder}
                onChange={(e) => setSocials({ ...socials, [key]: e.target.value })} />
            </div>
          ))}
        </div>

        {/* ── Professional ──────────────────────────────────── */}
        <div className="st__card">
          <p className="st__card-title">Professional Profile</p>

          <div className="st__field-group st__field-group--flat">
            <div className="st__field">
              <label className="st__label">Categories (select all that apply)</label>
              <ChipSelect options={NETWORK_CATEGORIES} selected={categories} onChange={setCategories} valueKey="label" labelKey="label" />
            </div>

            <div className="st__field st__field--select">
              <label className="st__label" htmlFor="st-exp">Experience Level</label>
              <div className="st__select-wrap">
                <select id="st-exp" className="st__select" value={expLevel} onChange={(e) => setExpLevel(e.target.value)}>
                  <option value="">Select level</option>
                  {EXPERIENCE_LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
                <svg className="st__select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <div className="st__field">
              <label className="st__label">Collaboration Types</label>
              <ChipSelect options={COLLAB_TYPES} selected={collabTypes} onChange={setCollabTypes} />
            </div>
          </div>
        </div>

        {/* ── Portfolio links ───────────────────────────────── */}
        <div className="st__card">
          <p className="st__card-title">Portfolio Links</p>
          {portfolioLinks.map((link, i) => (
            <div key={i} className="st__phone-row">
              <input className="st__input st__input--phone" type="url" value={link}
                placeholder="https://yourportfolio.com/work"
                onChange={(e) => updatePortfolio(i, e.target.value)} />
              {portfolioLinks.length > 1 && (
                <button type="button" className="st__remove-btn" onClick={() => removePortfolio(i)}>✕</button>
              )}
            </div>
          ))}
          <button type="button" className="st__add-link" onClick={addPortfolio}>+ Add portfolio link</button>
        </div>

        {/* ── Notifications ─────────────────────────────────── */}
        <div className="st__card">
          <p className="st__card-title">Notification Preferences</p>
          {[
            { label: "Deadline Reminders",  desc: "Get notified when delivery dates are approaching", val: deadlineReminders, set: setDeadlineReminders },
            { label: "Status Update",       desc: "Receive alert when order status changes",           val: statusUpdate,      set: setStatusUpdate      },
            { label: "AI Insights",         desc: "Get smart recommendations and risk alerts",         val: aiInsights,        set: setAiInsights        },
            { label: "Email Notifications", desc: "Also send notifications via email",                 val: emailNotifs,       set: setEmailNotifs       },
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
