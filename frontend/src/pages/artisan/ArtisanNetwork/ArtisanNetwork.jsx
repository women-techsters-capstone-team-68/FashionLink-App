/**
 * ArtisanNetwork.jsx  —  route: /artisan/network
 * 2-column artisan card grid.
 * Filter button → slide-in drawer (FILTERS.png)
 * Newest sort dropdown top-right
 * View Profile → /artisan/network/:id
 * Invite to Collaborate → /artisan/coming-soon
 */
import { useState, useEffect, useRef } from "react";
import { useNavigate }                 from "react-router-dom";
import {
  artisans,
  NETWORK_CATEGORIES,
  NIGERIAN_STATES,
  EXPERIENCE_LEVELS,
  COLLAB_TYPES,
} from "../../../data/artisanData";
import "./ArtisanNetwork.css";

/* ── Stars ───────────────────────────────────────────────────── */
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

/* ── Single artisan card ─────────────────────────────────────── */
function ArtisanCard({ artisan }) {
  const navigate = useNavigate();

  return (
    <div className="an-card">
      {/* Header */}
      <div className="an-card__head">
        <img className="an-card__avatar" src={artisan.avatar} alt={artisan.name} />
        <div>
          <p className="an-card__name">{artisan.name}</p>
          <p className="an-card__role">{artisan.role}</p>
        </div>
      </div>

      {/* Skills chips */}
      <div className="an-card__skills">
        {artisan.skills.map((s) => (
          <span className="an-card__skill" key={s}>{s}</span>
        ))}
      </div>

      {/* Meta row */}
      <div className="an-card__meta">
        <span className="an-card__location">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {artisan.location}
        </span>
        <Stars rating={artisan.rating} />
      </div>

      <p className="an-card__exp">{artisan.experience} years Experience</p>
      <p className="an-card__bio">{artisan.bio}</p>

      {/* Actions */}
      <div className="an-card__actions">
        <button
          className="an-card__btn-primary"
          type="button"
          onClick={() => navigate(`/artisan/network/${artisan.id}`)}
        >
          View Profile
        </button>
        <button
          className="an-card__btn-outline"
          type="button"
          onClick={() => navigate("/artisan/coming-soon")}
        >
          Invite to Collaborate
        </button>
      </div>
    </div>
  );
}

/* ── Filter Drawer ───────────────────────────────────────────── */
function FilterDrawer({ open, onClose, filters, onApply }) {
  const [local, setLocal] = useState(filters);
  const drawerRef = useRef(null);

  /* Sync when drawer opens */
  useEffect(() => { if (open) setLocal(filters); }, [open, filters]);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const toggle = (key, val) =>
    setLocal((prev) => ({ ...prev, [key]: prev[key] === val ? "" : val }));

  const clear = () => setLocal({ category: "", state: "", experience: "", collab: "" });

  const apply = () => { onApply(local); onClose(); };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`an-drawer-backdrop ${open ? "an-drawer-backdrop--open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`an-drawer ${open ? "an-drawer--open" : ""}`}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="an-drawer__header">
          <p className="an-drawer__title">Filters</p>
          <button className="an-drawer__close" type="button" onClick={onClose} aria-label="Close filters">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="an-drawer__body">

          {/* Category */}
          <div className="an-drawer__section">
            <p className="an-drawer__section-title">Category</p>
            {NETWORK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`an-drawer__cat-item ${local.category === cat ? "an-drawer__cat-item--active" : ""}`}
                onClick={() => toggle("category", cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Location */}
          <div className="an-drawer__section">
            <p className="an-drawer__section-title">Location</p>
            <div className="an-drawer__select-wrap">
              <select
                className="an-drawer__select"
                value={local.state}
                onChange={(e) => setLocal((p) => ({ ...p, state: e.target.value }))}
              >
                <option value="">Select State</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <svg className="an-drawer__select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>

          {/* Experience Level */}
          <div className="an-drawer__section">
            <p className="an-drawer__section-title">Experience Level</p>
            {EXPERIENCE_LEVELS.map((lvl) => (
              <label key={lvl.id} className="an-drawer__radio-row">
                <div
                  className={`an-drawer__radio ${local.experience === lvl.id ? "an-drawer__radio--checked" : ""}`}
                  onClick={() => toggle("experience", lvl.id)}
                  role="radio"
                  aria-checked={local.experience === lvl.id}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggle("experience", lvl.id)}
                />
                <span>{lvl.label}</span>
              </label>
            ))}
          </div>

          {/* Collaboration Type */}
          <div className="an-drawer__section">
            <p className="an-drawer__section-title">Collaboration Type</p>
            {COLLAB_TYPES.map((ct) => (
              <label key={ct.id} className="an-drawer__radio-row">
                <div
                  className={`an-drawer__radio ${local.collab === ct.id ? "an-drawer__radio--checked" : ""}`}
                  onClick={() => toggle("collab", ct.id)}
                  role="radio"
                  aria-checked={local.collab === ct.id}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggle("collab", ct.id)}
                />
                <span>{ct.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="an-drawer__footer">
          <button className="an-drawer__clear" type="button" onClick={clear}>
            Clear Filters
          </button>
          <button className="an-drawer__apply" type="button" onClick={apply}>
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Sort dropdown ───────────────────────────────────────────── */
const SORT_OPTS = [
  { id: "newest",  label: "Newest"      },
  { id: "rating",  label: "Top Rated"   },
  { id: "exp",     label: "Most Experienced" },
  { id: "alpha",   label: "A → Z"       },
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
            <li
              key={o.id}
              className={`an-sort__item ${value === o.id ? "an-sort__item--active" : ""}`}
              onClick={() => { onChange(o.id); setOpen(false); }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function ArtisanNetwork() {
  const [query,       setQuery]       = useState("");
  const [sort,        setSort]        = useState("newest");
  const [filterOpen,  setFilterOpen]  = useState(false);
  const [filters,     setFilters]     = useState({ category: "", state: "", experience: "", collab: "" });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const displayed = artisans
    .filter((a) => {
      const q = query.toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || a.skills.some((s) => s.toLowerCase().includes(q));
      const matchCat  = !filters.category   || a.category === filters.category;
      const matchExp  = !filters.experience || a.experienceLevel === filters.experience;
      const matchCollab = !filters.collab   || a.collabTypes.includes(filters.collab);
      const matchState = !filters.state     || a.location.toLowerCase().includes(filters.state.toLowerCase());
      return matchSearch && matchCat && matchExp && matchCollab && matchState;
    })
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "exp")    return b.experience - a.experience;
      if (sort === "alpha")  return a.name.localeCompare(b.name);
      return 0; // newest = default order
    });

  return (
    <div className="an">

      {/* Toolbar */}
      <div className="an__toolbar">
        {/* Search */}
        <div className="an__search-wrap">
          <svg className="an__search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="an__search"
            type="search"
            placeholder="Search by name or skill"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filter button */}
        <button
          className={`an__filter-btn ${activeFilterCount > 0 ? "an__filter-btn--active" : ""}`}
          type="button"
          onClick={() => setFilterOpen(true)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="20" y2="12"/>
            <line x1="12" y1="18" x2="20" y2="18"/>
            <circle cx="4"  cy="6"  r="2" fill="currentColor" stroke="none"/>
            <circle cx="8"  cy="12" r="2" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="18" r="2" fill="currentColor" stroke="none"/>
          </svg>
          Filter
          {activeFilterCount > 0 && (
            <span className="an__filter-badge">{activeFilterCount}</span>
          )}
        </button>

        {/* Sort */}
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {/* Grid */}
      {displayed.length === 0 ? (
        <div className="an__empty">
          <p>No artisans match your search or filters.</p>
        </div>
      ) : (
        <div className="an__grid">
          {displayed.map((a) => (
            <ArtisanCard key={a.id} artisan={a} />
          ))}
        </div>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  );
}
