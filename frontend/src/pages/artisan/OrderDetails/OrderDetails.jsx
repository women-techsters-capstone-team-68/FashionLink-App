import { useState }              from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData }               from "../../../context/DataContext.jsx";
import StatusBadge               from "../../../components/artisan/StatusBadge/StatusBadge.jsx";
import "./OrderDetails.css";

/* ── Status progression ──────────────────────────────────────── */
const STATUS_STEPS  = ["Order Assigned", "Work in Progress", "Order Completed"];
const STATUS_STEP_MAP = { "Assigned": 0, "Pending": 0, "In Progress": 1, "Completed": 2, "Delayed": 0 };

/* ── AI copy helpers ─────────────────────────────────────────── */
function buildAISummary(order) {
  return `${order.description} for ${order.client || "client"}. Placed on ${formatDate(order.placedDate)} with delivery ${order.delivery}. ${order.notes ? order.notes + "." : ""}`.trim();
}
function buildAIMessage(order) {
  const first = (order.client || "there").split(" ")[0];
  return `Hi ${first}, your order (${order.id}) is progressing well! Status: ${order.status}. Expected delivery: ${order.delivery || "TBC"}.`;
}
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/* ── SVG icons ───────────────────────────────────────────────── */
const Ico = {
  Edit:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Back:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Star:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  User:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Cal:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Desc:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Notes: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Ruler: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 8.7L8.7 21.3a1 1 0 0 1-1.4 0l-6.6-6.6a1 1 0 0 1 0-1.4L13.3 2.7a1 1 0 0 1 1.4 0l6.6 6.6a1 1 0 0 1 0 1.4z"/><path d="M7.5 10.5l2 2"/><path d="M10.5 7.5l2 2"/><path d="M13.5 4.5l2 2"/></svg>,
  Chat:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Copy:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Chev:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Track: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Save:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
};

/* ── Inline Tracking overlay (no route change needed) ────────── */
function TrackingOverlay({ order, onClose }) {
  const activeStep = STATUS_STEP_MAP[order.status] ?? 0;
  const meas = order.measurements ?? {};
  const measFields = Object.entries(meas).filter(([, v]) => v !== "" && v != null);

  const copyLink = () => {
    const link = `${window.location.origin}/artisan/orders/${order.id}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    alert("Tracking link copied to clipboard!");
  };

  return (
    <div className="od__overlay-backdrop" onClick={onClose}>
      <div className="od__tracking-panel" onClick={(e) => e.stopPropagation()}>
        <div className="od__tracking-header">
          <div>
            <h2 className="od__tracking-title">Order Tracking</h2>
            <p className="od__tracking-subtitle">{order.id} · {order.client}</p>
          </div>
          <button className="od__tracking-close" onClick={onClose}><Ico.Close /></button>
        </div>

        {/* Status badge + delivery */}
        <div className="od__tracking-hero">
          <StatusBadge status={order.status} />
          {order.delivery && (
            <span className="od__tracking-delivery">📅 Due {order.delivery}</span>
          )}
        </div>

        {/* AI summary */}
        <div className="od__tracking-ai">
          <span className="od__ai-icon" style={{ color: "#f59e0b" }}><Ico.Star /></span>
          <p className="od__tracking-ai-text">{buildAISummary(order)}</p>
        </div>

        {/* Timeline */}
        <div className="od__steps od__steps--tracking">
          {STATUS_STEPS.map((step, i) => {
            const done    = i <= activeStep;
            const delayed = order.status === "Delayed" && i === 0;
            return (
              <div key={step} className={`od__step ${done ? "od__step--done" : ""}`}>
                <div className="od__step-dot">{done ? (delayed ? "!" : "✓") : ""}</div>
                {i < STATUS_STEPS.length - 1 && <div className="od__step-line" />}
                <span className="od__step-label">
                  {step}
                  {delayed && i === 0 && <span className="od__step-warning"> (Delayed)</span>}
                </span>
              </div>
            );
          })}
        </div>

        {/* Measurements */}
        {measFields.length > 0 && (
          <>
            <p className="od__tracking-section-label">Measurements (inches)</p>
            <div className="od__meas-grid" style={{ marginTop: 0 }}>
              {measFields.map(([label, value]) => (
                <div className="od__meas-field" key={label}>
                  <span className="od__meas-label" style={{ textTransform: "capitalize" }}>{label}</span>
                  <div className="od__meas-value">{value}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="od__tracking-copy-btn" onClick={copyLink}>
          <Ico.Copy /> Copy Tracking Link
        </button>
      </div>
    </div>
  );
}

/* ── Inline Edit panel for measurements ──────────────────────── */
const MEAS_FIELDS = [
  { key: "chest",    label: "Chest"    },
  { key: "waist",    label: "Waist"    },
  { key: "hip",      label: "Hip"      },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeve",   label: "Sleeve"   },
  { key: "length",   label: "Length"   },
];

function EditMeasurementsPanel({ order, onSave, onCancel }) {
  const [meas, setMeas] = useState({
    chest:    order.measurements?.chest    ?? "",
    waist:    order.measurements?.waist    ?? "",
    hip:      order.measurements?.hip      ?? "",
    shoulder: order.measurements?.shoulder ?? "",
    sleeve:   order.measurements?.sleeve   ?? "",
    length:   order.measurements?.length   ?? "",
  });
  const [saving, setSaving] = useState(false);

  const change = (k, v) => {
    if (v === "" || /^\d*\.?\d*$/.test(v)) setMeas((p) => ({ ...p, [k]: v }));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ measurements: meas });
    setSaving(false);
  };

  return (
    <div className="od__edit-panel">
      <div className="od__edit-panel-header">
        <h3 className="od__edit-panel-title"><Ico.Ruler /> Edit Measurements (inches)</h3>
        <button className="od__edit-panel-close" onClick={onCancel}><Ico.Close /></button>
      </div>
      <div className="od__meas-grid od__meas-grid--edit">
        {MEAS_FIELDS.map(({ key, label }) => (
          <div className="od__meas-field" key={key}>
            <span className="od__meas-label">{label}</span>
            <input
              className="od__meas-input"
              type="text"
              inputMode="decimal"
              value={meas[key]}
              placeholder="0"
              onChange={(e) => change(key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="od__edit-panel-actions">
        <button className="od__edit-save-btn" onClick={handleSave} disabled={saving}>
          <Ico.Save /> {saving ? "Saving…" : "Save Measurements"}
        </button>
        <button className="od__edit-cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function OrderDetails() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { orders, clients, updateOrder, deleteOrder } = useData();

  const order  = orders.find((o) => o.id === id);
  const client = order
    ? (clients.find((c) => c.id === order.clientId) ?? clients.find((c) => c.apiId === order.clientId) ?? null)
    : null;

  const [copied,       setCopied]       = useState(false);
  const [statusValue,  setStatusValue]  = useState(order?.status ?? "In Progress");
  const [showEdit,     setShowEdit]     = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [editSaved,    setEditSaved]    = useState(false);

  if (!order) {
    return (
      <div className="od-notfound">
        <span>🔍</span>
        <p>Order <strong>{id}</strong> not found.</p>
        <button className="od-notfound__btn" onClick={() => navigate("/artisan/orders")}>
          <Ico.Back /> Back to orders
        </button>
      </div>
    );
  }

  const activeStep = STATUS_STEP_MAP[statusValue] ?? 0;
  const aiSummary  = buildAISummary(order);
  const aiMessage  = buildAIMessage({ ...order, status: statusValue });

  /* Measurements: from order first, fall back to matched client */
  const M = {
    chest:    order.measurements?.chest    || client?.measurements?.chest    || "",
    waist:    order.measurements?.waist    || client?.measurements?.waist    || "",
    hip:      order.measurements?.hip      || client?.measurements?.hip      || "",
    shoulder: order.measurements?.shoulder || client?.measurements?.shoulder || "",
    sleeve:   order.measurements?.sleeve   || client?.measurements?.sleeve   || "",
    length:   order.measurements?.length   || client?.measurements?.length   || "",
  };

  const handleCopyMessage = () => {
    navigator.clipboard?.writeText(aiMessage).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveMeasurements = async (patch) => {
    await updateOrder(order.id, patch);
    setShowEdit(false);
    setEditSaved(true);
    setTimeout(() => setEditSaved(false), 2500);
  };

  /* View Client Profile — navigate to real profile, or fallback page */
  const handleViewClientProfile = () => {
    if (client) {
      navigate(`/artisan/clients/${client.id}`);
    } else if (order.clientId) {
      navigate(`/artisan/clients/${order.clientId}`);
    } else {
      /* Last resort: go to clients list */
      navigate("/artisan/clients");
    }
  };

  return (
    <div className="od">

      {/* Tracking overlay */}
      {showTracking && (
        <TrackingOverlay
          order={{ ...order, measurements: M, status: statusValue }}
          onClose={() => setShowTracking(false)}
        />
      )}

      {/* ── Top bar ──────────────────────────────────────────── */}
      <div className="od__topbar">
        <div className="od__topbar-left">
          <h1 className="od__order-id">{order.id}</h1>
          <p className="od__topbar-client">{order.client}</p>
        </div>
        <div className="od__topbar-actions">
          <button className="od__btn-edit" type="button" onClick={() => setShowEdit((v) => !v)}>
            <Ico.Edit /> {showEdit ? "Cancel Edit" : "Edit"}
          </button>
          <button className="od__btn-delete" type="button" onClick={async () => {
            await deleteOrder(order.id);
            navigate("/artisan/orders");
          }}>
            <Ico.Trash /> Delete
          </button>
        </div>
      </div>

      {/* Back link */}
      <button className="od__back" type="button" onClick={() => navigate("/artisan/orders")}>
        <Ico.Back /> Back to orders
      </button>

      {/* Inline edit panel */}
      {showEdit && (
        <EditMeasurementsPanel
          order={{ ...order, measurements: M }}
          onSave={handleSaveMeasurements}
          onCancel={() => setShowEdit(false)}
        />
      )}
      {editSaved && (
        <div className="od__save-toast">✓ Measurements saved</div>
      )}

      {/* ── Two-column body ──────────────────────────────────── */}
      <div className="od__body">

        {/* ── LEFT ─────────────────────────────────────────── */}
        <div className="od__left">

          {/* Smart Order Summary */}
          <div className="od__ai-card">
            <div className="od__ai-card-header">
              <span className="od__ai-icon"><Ico.Star /></span>
              <h2 className="od__ai-title">Smart Order Summary</h2>
              <span className="od__ai-badge">AI</span>
            </div>
            <p className="od__ai-body">{aiSummary}</p>
          </div>

          {/* Order Details */}
          <section className="od__section">
            <h2 className="od__section-title">Order Details</h2>
            <div className="od__details-grid">
              <div className="od__detail-cell">
                <span className="od__detail-label"><Ico.User /> CLIENT</span>
                <span className="od__detail-value">{order.client}</span>
              </div>
              <div className="od__detail-cell">
                <span className="od__detail-label"><Ico.Cal /> DELIVERY DATE</span>
                <span className="od__detail-value">{order.delivery || "—"}</span>
              </div>
              <div className="od__detail-cell od__detail-cell--wide">
                <span className="od__detail-label"><Ico.Desc /> DESCRIPTION</span>
                <span className="od__detail-value">{order.description}</span>
              </div>
              <div className="od__detail-cell od__detail-cell--wide">
                <span className="od__detail-label"><Ico.Notes /> NOTES</span>
                <span className="od__detail-value">{order.notes || "—"}</span>
              </div>
            </div>
          </section>

          {/* Measurements */}
          <section className="od__section">
            <h2 className="od__section-title"><Ico.Ruler /> Measurement (inches)</h2>
            <div className="od__meas-grid">
              {MEAS_FIELDS.map(({ key, label }) => (
                <div className="od__meas-field" key={key}>
                  <span className="od__meas-label">{label}</span>
                  <div className="od__meas-value">{M[key] || "—"}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Client Update (AI message) */}
          <section className="od__section">
            <h2 className="od__section-title"><Ico.Chat /> Client Update</h2>
            <div className="od__ai-card od__ai-card--message">
              <div className="od__ai-card-header">
                <span className="od__ai-icon"><Ico.Star /></span>
                <h3 className="od__ai-title">AI suggested message</h3>
              </div>
              <p className="od__ai-body">{aiMessage}</p>
            </div>
            <button className="od__copy-btn" type="button" onClick={handleCopyMessage}>
              <Ico.Copy /> {copied ? "Copied!" : "Copy Message"}
            </button>
          </section>
        </div>

        {/* ── RIGHT ────────────────────────────────────────── */}
        <div className="od__right">

          {/* Status panel */}
          <div className="od__status-card">
            <h3 className="od__status-card-title">Status</h3>
            <div className="od__status-select-wrap">
              <select className="od__status-select" value={statusValue}
                onChange={async (e) => {
                  const s = e.target.value;
                  setStatusValue(s);
                  await updateOrder(order.id, { status: s });
                }}>
                <option>Assigned</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Delayed</option>
              </select>
              <span className="od__status-select-chevron"><Ico.Chev /></span>
            </div>
            <div className="od__status-badge-row">
              <StatusBadge status={statusValue} />
            </div>
            <div className="od__steps">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className={`od__step ${i <= activeStep ? "od__step--done" : ""}`}>
                  <div className="od__step-dot" />
                  {i < STATUS_STEPS.length - 1 && <div className="od__step-line" />}
                  <span className="od__step-label">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Style Reference */}
          <div className="od__style-card">
            <h3 className="od__style-title">Style Reference</h3>
            {order.image
              ? <img className="od__style-img" src={order.image} alt="Style Reference" />
              : <div className="od__style-empty">No image uploaded</div>
            }
          </div>

          {/* Quick Links — both now functional */}
          <div className="od__quick-links">
            <h3 className="od__quick-title">Quick Links</h3>
            <button className="od__quick-link" type="button" onClick={handleViewClientProfile}>
              <Ico.User /> View Client Profile
            </button>
            <button className="od__quick-link" type="button" onClick={() => setShowTracking(true)}>
              <Ico.Track /> View Order Tracking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
