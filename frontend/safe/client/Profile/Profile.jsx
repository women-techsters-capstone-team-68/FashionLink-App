import { useState } from 'react';
import './Profile.css';

const femaleMeasurements = [
  { label: 'Chest/Bust', key: 'bust' },
  { label: 'Waist', key: 'waist' },
  { label: 'Hip', key: 'hip' },
  { label: 'Shoulder Width', key: 'shoulder' },
  { label: 'Sleeve Length', key: 'sleeve' },
  { label: 'Dress Length', key: 'dressLength' },
  { label: 'Round Neck', key: 'roundNeck' },
  { label: 'Under Bust', key: 'underBust' },
  { label: 'Thigh', key: 'thigh' },
  { label: 'Trouser Length', key: 'trouserLength' },
];

const maleMeasurements = [
  { label: 'Chest', key: 'chest' },
  { label: 'Waist', key: 'waist' },
  { label: 'Hip', key: 'hip' },
  { label: 'Shoulder Width', key: 'shoulder' },
  { label: 'Sleeve Length', key: 'sleeve' },
  { label: 'Trouser Length', key: 'trouserLength' },
  { label: 'Round Neck', key: 'roundNeck' },
  { label: 'Thigh', key: 'thigh' },
  { label: 'Shirt Length', key: 'shirtLength' },
  { label: 'Wrist', key: 'wrist' },
];

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
        <span className={`settings-chevron ${open ? 'open' : ''}`}>⌄</span>
      </button>
      {open && <div className="settings-section-body">{children}</div>}
    </div>
  );
}

export default function Profile({ gender, setGender }) {
  const [view, setView] = useState('profile');
  const [orderStatus, setOrderStatus] = useState(true);
  const [deliveryReminder, setDeliveryReminder] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const measurements = gender === 'female' ? femaleMeasurements : maleMeasurements;

  if (view === 'settings') {
    return (
      <div className="page-wrapper">

        <div className="settings-content">
          <button className="back-btn" onClick={() => setView('profile')}>
            ← Back to Profile
          </button>

          <div className="settings-list">
            <ExpandableSection icon="🔔" title="Notification Preferences" sub="Choose how you want to be notified">
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Order Status</div>
                  <div className="toggle-sub">Get notified when your order status changes</div>
                </div>
                <button className={`toggle ${orderStatus ? 'on' : ''}`} onClick={() => setOrderStatus(!orderStatus)}>
                  <div className="toggle-thumb" />
                </button>
              </div>
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Delivery Reminder</div>
                  <div className="toggle-sub">Receive reminders before your delivery date</div>
                </div>
                <button className={`toggle ${deliveryReminder ? 'on' : ''}`} onClick={() => setDeliveryReminder(!deliveryReminder)}>
                  <div className="toggle-thumb" />
                </button>
              </div>
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Email Notifications</div>
                  <div className="toggle-sub">Also send notification via email</div>
                </div>
                <button className={`toggle ${emailNotif ? 'on' : ''}`} onClick={() => setEmailNotif(!emailNotif)}>
                  <div className="toggle-thumb" />
                </button>
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
                <div>
                  <div className="toggle-label">Two Factor Authentication</div>
                  <div className="toggle-sub">Add extra security to your account</div>
                </div>
                <button className={`toggle ${twoFA ? 'on' : ''}`} onClick={() => setTwoFA(!twoFA)}>
                  <div className="toggle-thumb" />
                </button>
              </div>
            </ExpandableSection>

            <ExpandableSection icon="⚠️" title="Danger Zone" sub="Irreversible account actions">
              <p className="danger-text">
                Deleting your account is permanent and cannot be undone. All your data will be lost.
              </p>
              <button className="danger-btn">🗑️ Delete Account</button>
            </ExpandableSection>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">

      <div className="profile-content">
        <div className="profile-card">

          <div className="profile-section-label">Profile</div>
          <div className="profile-user-row">
            <div className="profile-avatar">EH</div>
            <div>
              <div className="profile-user-name">Emmanuel Happiness</div>
              <div className="profile-user-role">Client</div>
            </div>
          </div>

          <div className="profile-field-group">
            <label className="profile-field-label">Full Name</label>
            <input className="profile-field-input" defaultValue="Emmanuel Happiness" />
          </div>

          <div className="profile-field-group">
            <label className="profile-field-label">Email</label>
            <input className="profile-field-input" placeholder="Client@example.com" type="email" />
          </div>

          <div className="profile-field-group">
            <label className="profile-field-label">Phone Number</label>
            <div className="phone-input-wrap">
              <span className="phone-flag">🇳🇬 +</span>
              <input className="profile-field-input phone-input" placeholder="+234 00000 000000" />
            </div>
          </div>

          <div className="profile-field-group">
            <label className="profile-field-label">Gender</label>
            <div className="gender-selector">
              <button
                className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
                onClick={() => setGender('male')}
              >
                👨 Male
              </button>
              <button
                className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender('female')}
              >
                👩 Female
              </button>
            </div>
          </div>

          <div className="measurements-header">
            <div className="profile-section-label">
              📏 My Measurements ({gender === 'female' ? 'Female' : 'Male'})
            </div>
            <button className="download-measurement-btn">⬇️ Download</button>
          </div>

          <div className="measurements-grid">
            {measurements.map((m) => (
              <div key={m.key} className="measurement-item">
                <div className="measurement-label">{m.label}</div>
                <input className="measurement-input" placeholder="inches" />
              </div>
            ))}
          </div>

          <div className="profile-settings-link">
            <button className="go-to-settings-btn" onClick={() => setView('settings')}>
              ⚙️ Go to Settings →
            </button>
          </div>

          <div className="profile-save-row">
            <button className="profile-save-btn">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}