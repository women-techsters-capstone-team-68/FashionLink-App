// ArtisanNetwork.jsx — /artisan/network — merged mock + real artisans, filters, infinite scroll
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate }   from "react-router-dom";
import { useAuth }       from "../../../context/AuthContext.jsx";
import { artisans, EXPERIENCE_LEVELS, COLLAB_TYPES, 
          LOCATIONS, NETWORK_CATEGORIES } from "../../../data/artisanData.js";
import { getAllArtisans } from "../../../services/store.js";
import "./ArtisanNetwork.css";

const PAGE_SIZE = 12;

// Flat category list for filter
const CATEGORY_KEYS = Object.keys(NETWORK_CATEGORIES);

function Stars({ rating }) {
  return (
    <span className="an-stars">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      {rating}
    </span>
  );
}

function ArtisanCard({ artisan, isOwn }) {
  const navigate = useNavigate();
  // For own profile, navigate to /artisan/settings since there's no static profile page
  const profileTarget = isOwn ? "/artisan/settings" : `/artisan/network/${artisan.id}`;
  const contactTarget = isOwn
    ? `/artisan/network/${artisan.id}?view=contact`
    : `/artisan/network/${artisan.id}?view=contact`;

  return (
    <div className="an-card">
      {isOwn && <span className="an-card__you-badge">You</span>}
      <div className="an-card__head">
        {artisan.avatar
          ? <img className="an-card__avatar" src={artisan.avatar} alt={artisan.name} />
          : <div className="an-card__avatar an-card__avatar--initials">{artisan.name.charAt(0)}</div>
        }
        <div>
          <p className="an-card__name">{artisan.name}</p>
          {artisan.businessName && <p className="an-card__business">{artisan.businessName}</p>}
          <p className="an-card__role">{artisan.role}</p>
        </div>
      </div>

      <div className="an-card__skills">
        {(artisan.skills ?? []).slice(0, 2).map((s) => (
          <span className="an-card__skill" key={s}>{s}</span>
        ))}
      </div>

      <div className="an-card__meta">
        <span className="an-card__location">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {artisan.location}
        </span>
        <Stars rating={artisan.rating ?? 4.5} />
      </div>

      <p className="an-card__exp">{artisan.experience} yrs Experience</p>
      <p className="an-card__bio">{artisan.bio}</p>

      <div className="an-card__actions">
        <button className="an-card__btn-primary" type="button"
          onClick={() => navigate(profileTarget)}>
          View Profile
        </button>
        <button className="an-card__btn-outline" type="button"
          onClick={() => navigate(contactTarget)}>
          Invite to Collaborate
        </button>
      </div>
    </div>
  );
}

function FilterDrawer({ open, onClose, filters, onApply }) {
  const [local, setLocal] = useState(filters);
  const drawerRef = useRef(null);

  useEffect(() => { if (open) setLocal(filters); }, [open, filters]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, onClose]);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const toggle = (k, v) => setLocal((p) => ({ ...p, [k]: p[k] === v ? "" : v }));
  const clear  = () => setLocal({ category: "", country: "", experience: "", collab: "" });
  const apply  = () => { onApply(local); onClose(); };

  return (
    <>
      <div className={`an-drawer-backdrop ${open ? "an-drawer-backdrop--open" : ""}`} onClick={onClose} aria-hidden="true" />
      <div className={`an-drawer ${open ? "an-drawer--open" : ""}`} ref={drawerRef} role="dialog" aria-modal="true">
        <div className="an-drawer__header">
          <p className="an-drawer__title">Filters</p>
          <button className="an-drawer__close" type="button" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="an-drawer__body">
          <div className="an-drawer__section">
            <p className="an-drawer__section-title">Category</p>
            {CATEGORY_KEYS.map((cat) => (
              <button key={cat} type="button"
                className={`an-drawer__cat-item ${local.category === cat ? "an-drawer__cat-item--active" : ""}`}
                onClick={() => toggle("category", cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className="an-drawer__section">
            <p className="an-drawer__section-title">Location (Country)</p>
            {LOCATIONS.map(({ country }) => (
              <button key={country} type="button"
                className={`an-drawer__cat-item ${local.country === country ? "an-drawer__cat-item--active" : ""}`}
                onClick={() => toggle("country", country)}>
                {country}
              </button>
            ))}
          </div>

          <div className="an-drawer__section">
            <p className="an-drawer__section-title">Experience Level</p>
            {EXPERIENCE_LEVELS.map((lvl) => (
              <label key={lvl.id} className="an-drawer__radio-row">
                <div className={`an-drawer__radio ${local.experience === lvl.id ? "an-drawer__radio--checked" : ""}`}
                  onClick={() => toggle("experience", lvl.id)} role="radio"
                  aria-checked={local.experience === lvl.id} tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggle("experience", lvl.id)} />
                <span>{lvl.label}</span>
              </label>
            ))}
          </div>

          <div className="an-drawer__section">
            <p className="an-drawer__section-title">Collaboration Type</p>
            {COLLAB_TYPES.map((ct) => (
              <label key={ct.id} className="an-drawer__radio-row">
                <div className={`an-drawer__radio ${local.collab === ct.id ? "an-drawer__radio--checked" : ""}`}
                  onClick={() => toggle("collab", ct.id)} role="radio"
                  aria-checked={local.collab === ct.id} tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggle("collab", ct.id)} />
                <span>{ct.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="an-drawer__footer">
          <button className="an-drawer__clear" type="button" onClick={clear}>Clear Filters</button>
          <button className="an-drawer__apply" type="button" onClick={apply}>Apply Filters</button>
        </div>
      </div>
    </>
  );
}

const SORT_OPTS = [
  { id: "newest",  label: "Newest"           },
  { id: "rating",  label: "Top Rated"        },
  { id: "exp",     label: "Most Experienced" },
  { id: "alpha",   label: "A → Z"            },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const label = SORT_OPTS.find((o) => o.id === value)?.label ?? "Newest";
  return (
    <div className="an-sort" ref={ref}>
      <button className="an-sort__btn" type="button" onClick={() => setOpen((v) => !v)}>
        {label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <ul className="an-sort__menu">
          {SORT_OPTS.map((o) => (
            <li key={o.id} className={`an-sort__item ${value === o.id ? "an-sort__item--active" : ""}`}
              onClick={() => { onChange(o.id); setOpen(false); }}>
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ArtisanNetwork() {
  const { user } = useAuth();
  const [query,      setQuery]      = useState("");
  const [sort,       setSort]       = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters,    setFilters]    = useState({ category: "", country: "", experience: "", collab: "" });
  const [page,       setPage]       = useState(1);
  const loaderRef = useRef(null);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Merged pool: real signed-up artisans + mock data (deduped by id)
  const pool = useMemo(() => getAllArtisans(artisans), []);

  // Own profile from Settings (shown as normal card)
  const ownId = user?.id ?? user?.email ?? null;
  const ownProfile = user && (user.fullName || user.firstName) ? {
    id:              ownId ?? "own",
    name:            user.fullName ?? user.firstName ?? "You",
    businessName:    user.businessName ?? "",
    role:            "Fashion Artisan",
    category:        (user.categories ?? [])[0] ?? "",
    location:        user.location ?? [user.city, user.state, user.country].filter(Boolean).join(", "),
    country:         user.country ?? "",
    experience:      user.yearsExp ?? 0,
    experienceLevel: user.expLevel ?? "beginner",
    collabTypes:     user.collabTypes ?? [],
    skills:          user.skills ?? [],
    bio:             user.bio ?? "Your profile — edit in Settings.",
    avatar:          user.avatar ?? null,
    rating:          5.0,
    isRealUser:      true,
  } : null;

  useEffect(() => { setPage(1); }, [query, filters, sort]);

  const processed = useMemo(() => {
    const q = query.toLowerCase().trim();
    return pool
      .filter((a) => {
        const matchSearch  = !q ||
          (a.name         ?? "").toLowerCase().includes(q) ||
          (a.businessName ?? "").toLowerCase().includes(q);
        const matchCat     = !filters.category   || a.category === filters.category;
        const matchCountry = !filters.country    || a.country  === filters.country;
        const matchExp     = !filters.experience || a.experienceLevel === filters.experience;
        const matchCollab  = !filters.collab     || (a.collabTypes ?? []).includes(filters.collab);
        return matchSearch && matchCat && matchCountry && matchExp && matchCollab;
      })
      .sort((a, b) => {
        if (sort === "rating") return (b.rating ?? 0)     - (a.rating ?? 0);
        if (sort === "exp")    return (b.experience ?? 0) - (a.experience ?? 0);
        if (sort === "alpha")  return a.name.localeCompare(b.name);
        return 0;
      });
  }, [pool, query, filters, sort]);

  const displayed = processed.slice(0, page * PAGE_SIZE);
  const hasMore   = displayed.length < processed.length;

  const handleObserver = useCallback((entries) => {
    if (entries[0].isIntersecting && hasMore) setPage((p) => p + 1);
  }, [hasMore]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.unobserve(el);
  }, [handleObserver]);

  const closeFilter = useCallback(() => setFilterOpen(false), []);

  return (
    <div className="an">
      <div className="an__toolbar">
        <div className="an__search-wrap">
          <svg className="an__search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="an__search" type="search" placeholder="Search by name or business"
            value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <button className={`an__filter-btn ${activeFilterCount > 0 ? "an__filter-btn--active" : ""}`}
          type="button" onClick={() => setFilterOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
            <circle cx="4"  cy="6"  r="2" fill="currentColor" stroke="none"/>
            <circle cx="8"  cy="12" r="2" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="18" r="2" fill="currentColor" stroke="none"/>
          </svg>
          Filter
          {activeFilterCount > 0 && <span className="an__filter-badge">{activeFilterCount}</span>}
        </button>

        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {(query || activeFilterCount > 0) && (
        <p className="an__results-meta">
          {processed.length} artisan{processed.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Own profile card — rendered as a normal grid card */}
      {ownProfile && (
        <div className="an__grid">
          <ArtisanCard artisan={ownProfile} isOwn={true} />
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="an__empty"><p>No artisans match your search or filters.</p></div>
      ) : (
        <div className="an__grid">
          {displayed.map((a) => (
            <ArtisanCard key={a.id} artisan={a} />
          ))}
        </div>
      )}

      <div ref={loaderRef} className="an__loader">
        {hasMore && <span className="an__loader-text">Loading more…</span>}
      </div>

      <FilterDrawer open={filterOpen} onClose={closeFilter} filters={filters} onApply={setFilters} />
    </div>
  );
}
