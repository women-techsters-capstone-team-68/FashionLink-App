/**
 * Profile.jsx — /client/profile
 *
 * Phase 3:
 *  - Full name from signup session (AuthContext.user)
 *  - Gender selector changes measurement fields shown
 *  - All measurements editable and persist to localStorage
 *  - Avatar upload persists
 *  - Settings sub-view (notifications, change password, security, danger zone)
 */
import { useState, useRef }  from "react";
import { useAuth }            from "../../../context/AuthContext.jsx";
import { getMeasurements, saveMeasurements, saveClientProfile, getClientProfile, registerClient } from "../../../services/store.js";
import "./Profile.css";

const FEMALE_MEAS = [
  { label: "Chest/Bust",     key: "bust"          },
  { label: "Waist",          key: "waist"          },
  { label: "Hip",            key: "hip"            },
  { label: "Shoulder Width", key: "shoulder"       },
  { label: "Sleeve Length",  key: "sleeve"         },
  { label: "Dress Length",   key: "dressLength"    },
  { label: "Round Neck",     key: "roundNeck"      },
  { label: "Under Bust",     key: "underBust"      },
  { label: "Thigh",          key: "thigh"          },
  { label: "Trouser Length", key: "trouserLength"  },
];

const MALE_MEAS = [
  { label: "Chest",          key: "chest"         },
  { label: "Waist",          key: "waist"         },
  { label: "Hip",            key: "hip"           },
  { label: "Shoulder Width", key: "shoulder"      },
  { label: "Sleeve Length",  key: "sleeve"        },
  { label: "Trouser Length", key: "trouserLength" },
  { label: "Round Neck",     key: "roundNeck"     },
  { label: "Thigh",          key: "thigh"         },
  { label: "Shirt Length",   key: "shirtLength"   },
  { label: "Wrist",          key: "wrist"         },
];

function Toggle({ on, onChange }) {
  return (
    <button type="button" className={`toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)}>
      <div className="toggle-thumb" />
    </button>
  );
}

function ExpandableSection({ icon, title, sub, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="settings-section">
      <button className="settings-section-header" onClick={() => setOpen(!open)}>
        <div className="settings-section-left">
          <div className="settings-section-icon">{icon}</div>
          <div>
            <div className="settings-section-title">{title}</div>
            <div className="settings-section-sub">{sub}</div>
          </div>
        </div>
        <span className={`settings-chevron ${open ? "open" : ""}`}>⌄</span>
      </button>
      {open && <div className="settings-section-body">{children}</div>}
    </div>
  );
}

export default function Profile({ gender, setGender }) {
  const { user, updateProfile } = useAuth();
  const userId = user?.id ?? user?.email ?? null;

  // Load saved profile from localStorage
  const saved = userId ? (getClientProfile(userId) ?? {}) : {};

  const [view,   setView]  = useState("profile");
  const [name,   setName]  = useState(saved.name   ?? user?.fullName  ?? "");
  const [email,  setEmail] = useState(saved.email  ?? user?.email     ?? "");
  const [phone,  setPhone] = useState(saved.phone  ?? user?.phone     ?? "");
  const [avatar, setAvatar]= useState(saved.avatar ?? user?.avatar    ?? null);
  const [saved_, setSaved] = useState(false);

  // Measurements
  const storedMeas = userId ? getMeasurements(userId) : {};
  const [meas, setMeas] = useState(storedMeas);

  // Notification toggles
  const [orderStatus,      setOrderStatus]      = useState(true);
  const [deliveryReminder, setDeliveryReminder] = useState(true);
  const [emailNotif,       setEmailNotif]       = useState(false);
  const [twoFA,            setTwoFA]            = useState(false);

  const fileRef = useRef(null);

  const measurementFields = gender === "female" ? FEMALE_MEAS : MALE_MEAS;

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

  const handleSave = () => {
    const profileData = { name, email, phone, avatar, gender };
    if (userId) saveClientProfile(userId, profileData);
    if (userId) saveMeasurements(userId, meas);
    // Register in global registry so artisans can find this client
    const userEmail = user?.email ?? "";
    if (userEmail) {
      registerClient({ id: userId, email: userEmail, fullName: name.trim(), firstName: name.trim().split(/\s+/)[0], phone: phone.trim() });
    }
    // Also update AuthContext session so Header shows new name/avatar
    const parts = name.trim().split(/\s+/);
    updateProfile({ fullName: name, firstName: parts[0] ?? "", lastName: parts.slice(1).join(" "), avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = (name || user?.fullName || "U").charAt(0).toUpperCase();

  /* ── Settings view ──────────────────────────────────────── */
  if (view === "settings") {
    return (
      <div className="page-wrapper">
        <div className="settings-content">
          <button className="back-btn" onClick={() => setView("profile")}>← Back to Profile</button>
          <div className="settings-list">
            <ExpandableSection icon="🔔" title="Notification Preferences" sub="Choose how you want to be notified">
              <div className="toggle-row">
                <div><div className="toggle-label">Order Status</div><div className="toggle-sub">Get notified when your order status changes</div></div>
                <Toggle on={orderStatus} onChange={setOrderStatus} />
              </div>
              <div className="toggle-row">
                <div><div className="toggle-label">Delivery Reminder</div><div className="toggle-sub">Receive reminders before your delivery date</div></div>
                <Toggle on={deliveryReminder} onChange={setDeliveryReminder} />
              </div>
              <div className="toggle-row">
                <div><div className="toggle-label">Email Notifications</div><div className="toggle-sub">Also send notifications via email</div></div>
                <Toggle on={emailNotif} onChange={setEmailNotif} />
              </div>
            </ExpandableSection>

            <ExpandableSection icon="🔒" title="Change Password" sub="Update your account password">
              <div className="settings-field-group">
                <label className="settings-field-label">Current Password</label>
                <input className="settings-field-input" type="password" placeholder="Enter current password" />
              </div>
              <div className="settings-field-group">
                <label className="settings-field-label">New Password</label>
                <input className="settings-field-input" type="password" placeholder="Enter new password" />
              </div>
              <div className="settings-field-group">
                <label className="settings-field-label">Confirm New Password</label>
                <input className="settings-field-input" type="password" placeholder="Confirm new password" />
              </div>
              <button className="settings-save-btn">Update Password</button>
            </ExpandableSection>

            <ExpandableSection icon="🔐" title="Security" sub="Manage your account security">
              <div className="toggle-row">
                <div><div className="toggle-label">Two Factor Authentication</div><div className="toggle-sub">Add extra security to your account</div></div>
                <Toggle on={twoFA} onChange={setTwoFA} />
              </div>
            </ExpandableSection>

            <ExpandableSection icon="⚠️" title="Danger Zone" sub="Irreversible account actions">
              <p className="danger-text">Deleting your account is permanent and cannot be undone.</p>
              <button className="danger-btn">🗑️ Delete Account</button>
            </ExpandableSection>
          </div>
        </div>
      </div>
    );
  }

  /* ── Profile view ───────────────────────────────────────── */
  return (
    <div className="page-wrapper">
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-section-label">Profile</div>

          {/* Avatar */}
          <div className="profile-user-row">
            <div className="profile-avatar" onClick={() => fileRef.current?.click()}
              style={{ cursor: "pointer", position: "relative" }}>
              {avatar
                ? <img src={avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                : initials
              }
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
            </div>
            <div>
              <div className="profile-user-name">{name || user?.fullName || "Your Name"}</div>
              <div className="profile-user-role">Client</div>
            </div>
          </div>

          {/* Fields */}
          <div className="profile-field-group">
            <label className="profile-field-label">Full Name</label>
            <input className="profile-field-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="profile-field-group">
            <label className="profile-field-label">Email</label>
            <input className="profile-field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@example.com" />
          </div>

          <div className="profile-field-group">
            <label className="profile-field-label">Phone Number</label>
            <div className="phone-input-wrap">
              <span className="phone-flag">🇳🇬 +</span>
              <input className="profile-field-input phone-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 00000 000000" />
            </div>
          </div>

          {/* Gender selector */}
          <div className="profile-field-group">
            <label className="profile-field-label">Gender</label>
            <div className="gender-selector">
              <button className={`gender-btn ${gender === "male" ? "active" : ""}`} onClick={() => setGender("male")}>👨 Male</button>
              <button className={`gender-btn ${gender === "female" ? "active" : ""}`} onClick={() => setGender("female")}>👩 Female</button>
            </div>
          </div>

          {/* Measurements */}
          <div className="measurements-header">
            <div className="profile-section-label">
              📏 My Measurements ({gender === "female" ? "Female" : "Male"})
            </div>
            <button className="download-measurement-btn">⬇️ Download</button>
          </div>

          <div className="measurements-grid">
            {measurementFields.map((m) => (
              <div key={m.key} className="measurement-item">
                <div className="measurement-label">{m.label}</div>
                <input
                  className="measurement-input"
                  placeholder="inches"
                  value={meas[m.key] ?? ""}
                  onChange={(e) => setMeas((prev) => ({ ...prev, [m.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div className="profile-settings-link">
            <button className="go-to-settings-btn" onClick={() => setView("settings")}>⚙️ Go to Settings →</button>
          </div>

          <div className="profile-save-row">
            <button className="profile-save-btn" onClick={handleSave}>
              {saved_ ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
