import { useState, useEffect, useRef } from "react";
import { clients } from "../../../data/mockData.js";
import "./AddOrderModal.css";

const EMPTY_FORM = {
  clientId:     "",
  description:  "",
  deliveryDate: "",
  notes:        "",
};

export default function AddOrderModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [errors, setErrors]   = useState({});
  const firstInputRef         = useRef(null);

  // Focus trap — focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
      setTimeout(() => firstInputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  /* ── Field helpers ──────────────────────────────────────────── */
  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.clientId)          errs.clientId     = "Please select a client.";
    if (!form.description.trim()) errs.description = "Please describe the style.";
    if (!form.deliveryDate)       errs.deliveryDate = "Please set a delivery date.";
    return errs;
  };

  /* ── Submit ─────────────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const client = clients.find((c) => c.id === form.clientId);

    // TODO: POST /api/orders — replace alert with real API call
    onSubmit?.({
      clientId:     form.clientId,
      clientName:   client?.name ?? "",
      description:  form.description.trim(),
      deliveryDate: form.deliveryDate,
      notes:        form.notes.trim(),
      status:       "Assigned",
    });

    onClose();
  };

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    /* Backdrop — click outside to close */
    <div
      className="aom-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="aom-title"
    >
      <div className="aom">

        {/* Header */}
        <div className="aom__header">
          <div>
            <h2 className="aom__title" id="aom-title">New Order</h2>
            <p className="aom__subtitle">Fill in the details below to create a new client order</p>
          </div>
          <button className="aom__close-btn" onClick={onClose} aria-label="Close modal" type="button">
            {/* Inline X — explicit 18x18 */}
            <svg className="aom__close-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6"  x2="6"  y2="18"/>
              <line x1="6"  y1="6"  x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form className="aom__form" onSubmit={handleSubmit} noValidate>

          {/* Client Name */}
          <div className="aom__field">
            <label className="aom__label" htmlFor="aom-client">Client Name</label>
            <div className="aom__select-wrap">
              <select
                id="aom-client"
                className={`aom__select ${errors.clientId ? "aom__select--error" : ""}`}
                value={form.clientId}
                onChange={set("clientId")}
                ref={firstInputRef}
              >
                <option value="" disabled>Select a client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {/* Chevron icon — explicit 16x16 */}
              <svg className="aom__select-chevron" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            {errors.clientId && <span className="aom__error">{errors.clientId}</span>}
          </div>

          {/* Style Description */}
          <div className="aom__field">
            <label className="aom__label" htmlFor="aom-desc">Style Description</label>
            <textarea
              id="aom-desc"
              className={`aom__textarea ${errors.description ? "aom__textarea--error" : ""}`}
              placeholder="Describe the style, fabric, and any specific details…"
              rows={3}
              value={form.description}
              onChange={set("description")}
            />
            {errors.description && <span className="aom__error">{errors.description}</span>}
          </div>

          {/* Delivery Date */}
          <div className="aom__field">
            <label className="aom__label" htmlFor="aom-date">Delivery Date</label>
            <div className="aom__date-wrap">
              <input
                id="aom-date"
                className={`aom__input ${errors.deliveryDate ? "aom__input--error" : ""}`}
                type="date"
                value={form.deliveryDate}
                onChange={set("deliveryDate")}
              />
              {/* Calendar icon — explicit 16x16 */}
              <svg className="aom__date-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            {errors.deliveryDate && <span className="aom__error">{errors.deliveryDate}</span>}
          </div>

          {/* Notes (optional) */}
          <div className="aom__field">
            <label className="aom__label" htmlFor="aom-notes">
              Notes <span className="aom__optional">(optional)</span>
            </label>
            <textarea
              id="aom-notes"
              className="aom__textarea"
              placeholder="Any additional notes for this order…"
              rows={2}
              value={form.notes}
              onChange={set("notes")}
            />
          </div>

          {/* Footer actions */}
          <div className="aom__footer">
            <button type="button" className="aom__cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="aom__submit-btn">
              Create Order
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
