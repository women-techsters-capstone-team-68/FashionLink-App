import { useState }    from "react";
import { useNavigate } from "react-router-dom";
import { useData }     from "../../../context/DataContext.jsx";
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
  const navigate           = useNavigate();
  const { addClient }      = useData();

  const [name,       setName]     = useState("");
  const [email,      setEmail]    = useState("");
  const [phone,      setPhone]    = useState("");
  const [country,    setCountry]  = useState(COUNTRIES[0]);
  const [showDrop,   setShowDrop] = useState(false);
  const [error,      setError]    = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim())  { setError("Full name is required."); return; }
    if (!email.trim()) { setError("Email is required."); return; }

    setSubmitting(true);
    const { ok } = await addClient({
      name:  name.trim(),
      email: email.trim(),
      phone: phone ? `${country.dial} ${phone}` : "",
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
          <div className="ac__field-group">

            {/* Full Name */}
            <div className="ac__field">
              <label className="ac__label" htmlFor="ac-name">Full Name</label>
              <input id="ac-name" className="ac__input" type="text" placeholder="Enter client name"
                value={name} onChange={(e) => setName(e.target.value)} autoFocus autoComplete="off" />
            </div>

            {/* Email */}
            <div className="ac__field">
              <label className="ac__label" htmlFor="ac-email">Email</label>
              <input id="ac-email" className="ac__input" type="email" placeholder="client@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
            </div>

            {/* Phone */}
            <div className="ac__field">
              <label className="ac__label" htmlFor="ac-phone">Phone Number</label>
              <div className="ac__phone-wrap">
                <div className="ac__country-selector">
                  <button type="button" className="ac__country-btn" onClick={() => setShowDrop((v) => !v)} aria-label="Select country code">
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
                          onClick={() => { setCountry(c); setShowDrop(false); }}
                        >
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
