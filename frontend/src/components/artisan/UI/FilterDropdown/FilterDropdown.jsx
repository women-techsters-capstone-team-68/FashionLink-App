import { useState, useEffect, useRef } from "react";
import "./FilterDropdown.css";

// Sort/filter options — extend when backend supports real query params
export const SORT_OPTIONS = [
  { id: "delivery-asc",  label: "Delivery Date (Soonest)" },
  { id: "delivery-desc", label: "Delivery Date (Latest)"  },
  { id: "client-asc",    label: "Client Name (A → Z)"     },
  { id: "client-desc",   label: "Client Name (Z → A)"     },
  { id: "id-asc",        label: "Order ID (Ascending)"    },
  { id: "id-desc",       label: "Order ID (Descending)"   },
];

export default function FilterDropdown({ activeSort, onSortChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const activeLabel = SORT_OPTIONS.find((o) => o.id === activeSort)?.label ?? "Filter";
  const isFiltered  = Boolean(activeSort);

  return (
    <div className="fd" ref={ref}>
      <button
        className={`fd__trigger ${isFiltered ? "fd__trigger--active" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        {/* Inline sliders SVG — explicit 16x16 */}
        <svg className="fd__icon" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4"  y1="6"  x2="20" y2="6"  />
          <line x1="8"  y1="12" x2="20" y2="12" />
          <line x1="12" y1="18" x2="20" y2="18" />
          <circle cx="4"  cy="6"  r="2" fill="currentColor" stroke="none"/>
          <circle cx="8"  cy="12" r="2" fill="currentColor" stroke="none"/>
          <circle cx="12" cy="18" r="2" fill="currentColor" stroke="none"/>
        </svg>
        {isFiltered ? activeLabel : "Filter"}
        {isFiltered && (
          <span
            className="fd__clear"
            role="button"
            tabIndex={0}
            aria-label="Clear filter"
            onClick={(e) => { e.stopPropagation(); onSortChange(null); }}
            onKeyDown={(e) => e.key === "Enter" && (e.stopPropagation(), onSortChange(null))}
          >
            {/* Inline X icon — explicit 12x12 */}
            <svg className="fd__clear-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6"  x2="6"  y2="18"/>
              <line x1="6"  y1="6"  x2="18" y2="18"/>
            </svg>
          </span>
        )}
      </button>

      {open && (
        <ul className="fd__menu" role="listbox" aria-label="Sort orders by">
          <li className="fd__menu-label">Sort by</li>
          {SORT_OPTIONS.map((opt) => (
            <li
              key={opt.id}
              role="option"
              aria-selected={activeSort === opt.id}
              className={`fd__item ${activeSort === opt.id ? "fd__item--selected" : ""}`}
              onClick={() => { onSortChange(opt.id); setOpen(false); }}
            >
              {activeSort === opt.id && (
                <svg className="fd__item-check" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
