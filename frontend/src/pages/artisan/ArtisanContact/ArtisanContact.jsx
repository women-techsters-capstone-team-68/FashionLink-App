import { useNavigate } from "react-router-dom";
import { useAuth }                from "../../../context/AuthContext.jsx";
import { artisans }               from "../../../data/artisanData.js";
import "./ArtisanContact.css";

const SOCIAL_ICONS = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  pinterest: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.74 1.23-5.22 1.23-5.22s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.58 2.26-.87 3.51-.25 1.05.52 1.9 1.54 1.9 1.85 0 3.09-2.36 3.09-5.15 0-2.12-1.43-3.61-3.47-3.61-2.36 0-3.75 1.77-3.75 3.6 0 .71.27 1.48.61 1.9.07.08.08.15.06.23-.06.25-.2.8-.23.91-.04.14-.12.17-.28.1-1.03-.48-1.67-1.98-1.67-3.18 0-2.59 1.88-4.97 5.42-4.97 2.85 0 5.06 2.03 5.06 4.74 0 2.83-1.78 5.1-4.25 5.1-.83 0-1.61-.43-1.88-.94l-.51 1.9c-.18.71-.68 1.6-1.02 2.14.77.24 1.58.37 2.42.37 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
    </svg>
  ),
  tiktok: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
    </svg>
  ),
};

function SocialLink({ platform, url }) {
  if (!url) return null;
  const href = url.startsWith("http") ? url : `https://${url}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="ac-contact__social-link">
      <span className="ac-contact__social-icon">{SOCIAL_ICONS[platform] ?? "🔗"}</span>
      <span className="ac-contact__social-label">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
      <span className="ac-contact__social-arrow">→</span>
    </a>
  );
}

export default function ArtisanContact({ artisanId, artisanData }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const id = artisanId;

  // Use passed prop first, then search dataset, then build own-profile fallback
  let artisan = artisanData ?? artisans.find((a) => a.id === id);

  // If viewing own profile (id === "own" or user is artisan with matching id)
  if (!artisan && user) {
    artisan = {
      id:           "own",
      name:         user.fullName  ?? user.firstName ?? "You",
      businessName: user.businessName ?? "",
      role:         "Fashion Artisan",
      bio:          user.bio ?? "",
      avatar:       user.avatar ?? null,
      location:     user.location ?? [user.city, user.state, user.country].filter(Boolean).join(", "),
      experience:   user.yearsExp ?? 0,
      phones:       user.phones ?? (user.phone ? [user.phone] : []),
      socials:      user.socials ?? {},
      skills:       user.skills ?? [],
      collabTypes:  user.collabTypes ?? [],
    };
  }

  if (!artisan) {
    return (
      <div className="ac-contact ac-contact--notfound">
        <p>Artisan not found.</p>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  // Normalise phones — support both old string and new array
  const phones = artisan.phones ?? (artisan.phone ? [artisan.phone] : []);
  const socials = artisan.socials ?? {};

  return (
    <div className="ac-contact">
      <button className="ac-contact__back" onClick={() => navigate(-1)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Back
      </button>

      {/* Hero */}
      <div className="ac-contact__hero">
        <div className="ac-contact__avatar-wrap">
          {artisan.avatar
            ? <img src={artisan.avatar} alt={artisan.name} className="ac-contact__avatar" />
            : <div className="ac-contact__avatar-init">{artisan.name.charAt(0)}</div>
          }
        </div>
        <div className="ac-contact__hero-info">
          <h1 className="ac-contact__name">{artisan.name}</h1>
          {artisan.businessName && <p className="ac-contact__biz">{artisan.businessName}</p>}
          <p className="ac-contact__role">{artisan.role}</p>
          {artisan.location && (
            <p className="ac-contact__location">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {artisan.location}
            </p>
          )}
          {artisan.rating && (
            <p className="ac-contact__rating">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {artisan.rating} · {artisan.experience} years experience
            </p>
          )}
        </div>
      </div>

      {/* Contact details card */}
      <div className="ac-contact__card">
        <p className="ac-contact__section-title">Contact Information</p>

        {/* Phone numbers */}
        {phones.length > 0 ? (
          <div className="ac-contact__phones">
            {phones.map((ph, i) => (
              <a key={i} href={`tel:${ph.replace(/\s/g,"")}`} className="ac-contact__phone-row">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.27-.84a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>{ph}</span>
              </a>
            ))}
          </div>
        ) : (
          <p className="ac-contact__empty-field">No phone number listed</p>
        )}
      </div>

      {/* Social media card */}
      {Object.keys(socials).some((k) => socials[k]) && (
        <div className="ac-contact__card">
          <p className="ac-contact__section-title">Social Media</p>
          <div className="ac-contact__socials">
            {["instagram","facebook","pinterest","youtube","tiktok"].map((platform) =>
              socials[platform] ? (
                <SocialLink key={platform} platform={platform} url={socials[platform]} />
              ) : null
            )}
            {socials.other && <SocialLink platform="other" url={socials.other} />}
          </div>
        </div>
      )}

      {/* Bio */}
      {artisan.bio && (
        <div className="ac-contact__card">
          <p className="ac-contact__section-title">About</p>
          <p className="ac-contact__bio">{artisan.bio}</p>
        </div>
      )}

      {/* Skills */}
      {(artisan.skills ?? []).length > 0 && (
        <div className="ac-contact__card">
          <p className="ac-contact__section-title">Skills</p>
          <div className="ac-contact__tags">
            {artisan.skills.map((s) => (
              <span key={s} className="ac-contact__tag">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* CTA buttons */}
      <div className="ac-contact__actions">
        <button className="ac-contact__btn-primary" onClick={() => navigate(`/artisan/network/${id}`)}>
          View Full Profile
        </button>
        <button className="ac-contact__btn-outline" onClick={() => navigate("/artisan/coming-soon")}>
          ✉️ Message Artisan
        </button>
      </div>
    </div>
  );
}
