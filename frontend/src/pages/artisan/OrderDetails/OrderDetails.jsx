import { useState }                  from "react";
import { useParams, useNavigate }     from "react-router-dom";
import { allOrders, clients }         from "../../../data/mockData.js";
import StatusBadge                    from "../../../components/artisan/StatusBadge/StatusBadge.jsx";
import "./OrderDetails.css";

/* Status progression steps */
const STATUS_STEPS = ["Order Assigned", "Work in Progress", "Order Completed"];
const STATUS_STEP_MAP = {
  "Assigned":    0,
  "In Progress": 1,
  "Completed":   2,
  "Delayed":     0,
};

/* Generate AI summary from order data */
function buildAISummary(order) {
  return `${order.description} for ${order.client}. This order was placed on ${formatDate(order.placedDate)} with a delivery date of ${order.delivery}. ${order.notes ? order.notes + "." : ""}`;
}

/* Generate AI client message */
function buildAIMessage(order) {
  return `Hi ${order.client.split(" ")[0]}, your order (${order.id}) is progressing well! Current status: ${order.status}. Expected delivery: ${order.delivery}.`;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/* ── Inline icons ─────────────────────────────────────────────── */
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconBack = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconCal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconDesc = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const IconNotes = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconRuler = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.3 8.7L8.7 21.3a1 1 0 0 1-1.4 0l-6.6-6.6a1 1 0 0 1 0-1.4L13.3 2.7a1 1 0 0 1 1.4 0l6.6 6.6a1 1 0 0 1 0 1.4z"/>
    <path d="M7.5 10.5l2 2"/><path d="M10.5 7.5l2 2"/><path d="M13.5 4.5l2 2"/><path d="M4.5 13.5l2 2"/>
  </svg>
);
const IconChat = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════ */
export default function OrderDetails() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const order  = allOrders.find((o) => o.id === id);
  const client = order ? clients.find((c) => c.id === order.clientId) : null;

  const [copied, setCopied]         = useState(false);
  const [statusValue, setStatusValue] = useState(order?.status ?? "In Progress");

  if (!order) {
    return (
      <div className="od-notfound">
        <span>🔍</span>
        <p>Order <strong>{id}</strong> not found.</p>
        <button className="od-notfound__btn" onClick={() => navigate("/artisan/orders")}>
          <IconBack /> Back to orders
        </button>
      </div>
    );
  }

  const activeStep = STATUS_STEP_MAP[statusValue] ?? 0;
  const aiSummary  = buildAISummary(order);
  const aiMessage  = buildAIMessage({ ...order, status: statusValue });

  const handleCopy = () => {
    navigator.clipboard?.writeText(aiMessage).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* Measurements from matched client (falls back to dashes) */
  const M = client?.measurements ?? {};

  return (
    <div className="od">

      {/* ── Top header row ─────────────────────────────────────── */}
      <div className="od__topbar">
        <div className="od__topbar-left">
          <h1 className="od__order-id">{order.id}</h1>
          <p className="od__topbar-client">{order.client}</p>
        </div>
        <div className="od__topbar-actions">
          <button className="od__btn-edit" type="button" onClick={() => alert(`Edit ${order.id}`)}>
            <IconEdit /> Edit
          </button>
          <button className="od__btn-delete" type="button" onClick={() => { alert(`Deleted ${order.id}`); navigate("/artisan/orders"); }}>
            <IconTrash /> Delete
          </button>
        </div>
      </div>

      {/* Back link */}
      <button className="od__back" type="button" onClick={() => navigate("/artisan/orders")}>
        <IconBack /> Back to orders
      </button>

      {/* ── Two-column body ────────────────────────────────────── */}
      <div className="od__body">

        {/* ── LEFT COLUMN ──────────────────────────────────────── */}
        <div className="od__left">

          {/* Smart Order Summary */}
          <div className="od__ai-card">
            <div className="od__ai-card-header">
              <span className="od__ai-icon"><IconStar /></span>
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
                <span className="od__detail-label"><IconUser /> CLIENT</span>
                <span className="od__detail-value od__detail-value--link">{order.client}</span>
              </div>
              <div className="od__detail-cell">
                <span className="od__detail-label"><IconCal /> DELIVERY DATE</span>
                <span className="od__detail-value">{order.delivery}</span>
              </div>
              <div className="od__detail-cell od__detail-cell--wide">
                <span className="od__detail-label"><IconDesc /> DESCRIPTION</span>
                <span className="od__detail-value">{order.description}</span>
              </div>
              <div className="od__detail-cell od__detail-cell--wide">
                <span className="od__detail-label"><IconNotes /> NOTES</span>
                <span className="od__detail-value">{order.notes || "—"}</span>
              </div>
            </div>
          </section>

          {/* Measurements */}
          <section className="od__section">
            <h2 className="od__section-title">
              <IconRuler /> Measurement (inches)
            </h2>
            <div className="od__meas-grid">
              {[
                { label: "Chest",    value: M.chest    },
                { label: "Waist",    value: M.waist    },
                { label: "Hip",      value: M.hip      },
                { label: "Shoulder", value: M.shoulder },
                { label: "Sleeve",   value: M.sleeve   },
                { label: "Length",   value: M.length   },
              ].map(({ label, value }) => (
                <div className="od__meas-field" key={label}>
                  <span className="od__meas-label">{label}</span>
                  <div className="od__meas-value">{value ?? "—"}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Client Update */}
          <section className="od__section">
            <h2 className="od__section-title">
              <IconChat /> Client Update
            </h2>
            <div className="od__ai-card od__ai-card--message">
              <div className="od__ai-card-header">
                <span className="od__ai-icon"><IconStar /></span>
                <h3 className="od__ai-title">AI suggested message</h3>
              </div>
              <p className="od__ai-body">{aiMessage}</p>
            </div>
            <button className="od__copy-btn" type="button" onClick={handleCopy}>
              <IconCopy />
              {copied ? "Copied!" : "Copy Message"}
            </button>
          </section>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────── */}
        <div className="od__right">

          {/* Status panel */}
          <div className="od__status-card">
            <h3 className="od__status-card-title">Status</h3>

            {/* Status dropdown */}
            <div className="od__status-select-wrap">
              <select
                className="od__status-select"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
              >
                <option>Assigned</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Delayed</option>
              </select>
              <span className="od__status-select-chevron"><IconChevron /></span>
            </div>

            {/* Current badge */}
            <div className="od__status-badge-row">
              <StatusBadge status={statusValue} />
            </div>

            {/* Progress steps */}
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
              ? <img className="od__style-img" src={order.image} alt={`${order.client} style reference`} />
              : <div className="od__style-empty">No image uploaded</div>
            }
          </div>

          {/* Quick Links */}
          <div className="od__quick-links">
            <h3 className="od__quick-title">Quick Links</h3>
            <button className="od__quick-link" type="button" onClick={() => alert("View client profile")}>
              View Clients Profile
            </button>
            <button className="od__quick-link" type="button" onClick={() => alert("Click tracking link")}>
              Click Tracking Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
