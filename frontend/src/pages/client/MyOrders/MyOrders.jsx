/**
 * MyOrders.jsx — /client/orders
 *
 * Fixed:
 *  - getClientOrders() now keyed by user.email (matches artisan pushOrderToClient)
 *  - Search works across client name, artisan name, description, status
 *  - Hover shows "View Order Details" overlay
 *  - Click → inline OrderDetails view
 *  - Orders also tried from API (GET /api/orders?mine=1) and merged
 *  - Tracking opens inline overlay (same TrackingView used in artisan portal)
 */
import { useState, useEffect, useMemo } from "react";
import { useAuth }                       from "../../../context/AuthContext.jsx";
import { getClientOrders, saveClientOrders } from "../../../services/store.js";
import { ordersApi }                     from "../../../services/api.js";
import "./MyOrders.css";

const FILTERS = ["All", "Assigned", "Pending", "In Progress", "Completed", "Delayed"];

/* ── Status badge ─────────────────────────────────────────────── */
function Badge({ status = "" }) {
  const cls = {
    "in progress": "inprogress", "pending": "assigned",
    "assigned": "assigned",      "completed": "completed",
    "delayed": "delayed",
  }[status.toLowerCase()] ?? "assigned";
  return <span className={`badge ${cls}`}>● {status}</span>;
}

/* ── Status steps ─────────────────────────────────────────────── */
const STATUS_STEPS  = ["Order Assigned", "Work in Progress", "Order Completed"];
const STATUS_STEP_MAP = { "Assigned": 0, "Pending": 0, "In Progress": 1, "Completed": 2, "Delayed": 0 };

/* ── Inline Tracking overlay ─────────────────────────────────── */
function TrackingOverlay({ order, onClose }) {
  const activeStep = STATUS_STEP_MAP[order.status] ?? 0;
  const meas = order.measurements ?? {};
  const measFields = Object.entries(meas).filter(([, v]) => v !== "" && v != null);
  const first = (order.client || order.artisan || "there").split(" ")[0];
  const aiMsg = `Hi ${first}, your order (${order.id}) is currently: ${order.status}. Expected delivery: ${order.delivery || "TBC"}.`;

  const copyLink = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/client/orders`).catch(() => {});
    alert("Tracking link copied!");
  };

  return (
    <div className="co-overlay-backdrop" onClick={onClose}>
      <div className="co-tracking-panel" onClick={(e) => e.stopPropagation()}>
        <div className="co-tracking-header">
          <div>
            <h2 className="co-tracking-title">Order Tracking</h2>
            <p className="co-tracking-subtitle">{order.id}{order.artisan ? ` · ${order.artisan}` : ""}</p>
          </div>
          <button className="co-tracking-close" onClick={onClose}>✕</button>
        </div>

        <div className="co-tracking-status-row">
          <Badge status={order.status} />
          {order.delivery && <span className="co-tracking-delivery">📅 Due {order.delivery}</span>}
        </div>

        {/* AI message */}
        <div className="co-tracking-ai">
          <span>⭐</span>
          <p>{aiMsg}</p>
        </div>

        {/* Timeline */}
        <div className="co-timeline">
          {STATUS_STEPS.map((step, i) => {
            const done = i <= activeStep;
            return (
              <div key={step} className="co-timeline-item">
                <div className="co-timeline-dot-wrap">
                  <div className={`co-timeline-dot ${done ? "done" : ""}`}>{done ? "✓" : ""}</div>
                  {i < STATUS_STEPS.length - 1 && <div className={`co-timeline-line ${done ? "done" : ""}`} />}
                </div>
                <div className="co-timeline-content">
                  <p className="co-timeline-title">{step}</p>
                  <p className="co-timeline-desc">
                    {i === 0 && "Order received and assigned to your artisan."}
                    {i === 1 && "Your garment is being crafted."}
                    {i === 2 && "Order complete and ready for delivery."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {measFields.length > 0 && (
          <div className="co-tracking-meas">
            <p className="co-tracking-section-label">📏 Measurements (inches)</p>
            <div className="co-tracking-meas-grid">
              {measFields.map(([label, value]) => (
                <div key={label} className="co-tracking-meas-field">
                  <span className="co-tracking-meas-label" style={{ textTransform: "capitalize" }}>{label}</span>
                  <span className="co-tracking-meas-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="co-tracking-copy-btn" onClick={copyLink}>🔗 Copy Tracking Link</button>
      </div>
    </div>
  );
}

/* ── Order Detail view ────────────────────────────────────────── */
function OrderDetailView({ order, onBack, onTrack }) {
  const steps = [
    { title: "Order Received",     desc: "Your order has been received and assigned to an artisan.", done: true },
    { title: "Work in Progress",   desc: "Your garment is being crafted with care.",                 done: ["In Progress", "Completed"].includes(order.status) },
    { title: "Ready for Delivery", desc: "Your order is complete and ready to be delivered.",        done: order.status === "Completed" },
  ];
  const meas  = order.measurements ?? {};
  const measFields = Object.entries(meas).filter(([, v]) => v !== "" && v != null);

  return (
    <div className="order-details-content">
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button className="back-btn" onClick={onBack}>← Back to orders</button>
        <button className="co-track-btn" onClick={onTrack}>🔍 View Tracking</button>
      </div>

      <div className="order-details-grid">
        {/* LEFT */}
        <div className="order-details-left">
          <div className="details-card">
            <div className="details-card-header">
              <div className="details-section-title">Order Details</div>
              <Badge status={order.status} />
            </div>
            <div className="details-meta-grid">
              <div>
                <div className="details-meta-label">DELIVERY DATE</div>
                <div className="details-meta-value">📅 {order.delivery || "TBC"}</div>
              </div>
              <div>
                <div className="details-meta-label">ORDER ID</div>
                <div className="details-meta-value">{order.id}</div>
              </div>
            </div>
            {order.description && (
              <div className="details-section">
                <div className="details-meta-label">DESCRIPTION</div>
                <div className="details-meta-value">{order.description}</div>
              </div>
            )}
            {order.notes && (
              <div className="details-section">
                <div className="details-meta-label">NOTES</div>
                <div className="details-meta-value">{order.notes}</div>
              </div>
            )}
            {order.artisan && (
              <div className="details-section">
                <div className="details-meta-label">ARTISAN</div>
                <div className="details-meta-value">{order.artisan}</div>
              </div>
            )}
            {/* AI update message */}
            <div className="details-section" style={{ marginTop: 8 }}>
              <div className="details-meta-label">AI UPDATE</div>
              <div className="details-meta-value co-ai-update">
                ⭐ Your order ({order.id}) is {order.status.toLowerCase()}. {order.delivery ? `Expected delivery: ${order.delivery}.` : ""}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="details-card">
            <div className="details-section-title" style={{ marginBottom: 20 }}>Order Timeline</div>
            <div className="timeline">
              {steps.map((step, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot-wrap">
                    <div className={`timeline-dot ${step.done ? "done" : "pending"}`}>{step.done ? "✓" : ""}</div>
                    {i < steps.length - 1 && <div className={`timeline-line ${step.done ? "done" : ""}`} />}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-step-title">{step.title}</div>
                    <div className="timeline-step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Measurements */}
          {measFields.length > 0 && (
            <div className="details-card">
              <div className="details-section-title" style={{ marginBottom: 20 }}>📏 Measurements (inches)</div>
              <div className="measurements-grid">
                {measFields.map(([label, value]) => (
                  <div key={label} className="measurement-item">
                    <div className="measurement-label" style={{ textTransform: "capitalize" }}>{label}</div>
                    <input className="measurement-input" defaultValue={value} readOnly />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="order-details-right">
          {order.image && (
            <div className="details-card">
              <div className="details-section-title" style={{ marginBottom: 14 }}>Style Reference</div>
              <img src={order.image} alt="Style Reference" className="style-ref-image" />
            </div>
          )}
          <div className="details-card">
            <div className="details-section-title" style={{ marginBottom: 8 }}>Status</div>
            <div className="status-text">Contact your artisan for questions about this order.</div>
            <button className="contact-artisan-btn">✉️ Contact Artisan</button>
          </div>
          <div className="details-card">
            <div className="details-section-title" style={{ marginBottom: 4 }}>Share Tracking</div>
            <div className="status-text">Share a tracking link for this order.</div>
            <button className="copy-link-btn" onClick={() => {
              navigator.clipboard?.writeText(`${window.location.origin}/client/orders`).catch(() => {});
              alert("Tracking link copied!");
            }}>Copy Tracking Link</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function MyOrders() {
  const { user }     = useAuth();
  /* KEY FIX: use email as key — must match pushOrderToClient in store.js */
  const clientEmail  = user?.email ?? null;

  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [activeFilter,  setActiveFilter]  = useState("All");
  const [search,        setSearch]        = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [hoveredId,     setHoveredId]     = useState(null);
  const [showTracking,  setShowTracking]  = useState(false);

  /* Load: email-keyed localStorage first, then try API */
  useEffect(() => {
    if (!clientEmail) { setLoading(false); return; }

    // Load from local immediately
    const local = getClientOrders(clientEmail);
    setOrders(local);

    // Try API
    ordersApi.list({ mine: 1 }).then(({ data, error }) => {
      if (!error && Array.isArray(data) && data.length > 0) {
        const normalised = data.map((raw) => ({
          id:           raw.order_number ?? String(raw.id),
          apiId:        raw.id,
          status:       (raw.status ?? "pending").charAt(0).toUpperCase() + (raw.status ?? "pending").slice(1).replace(/_/g, " "),
          description:  raw.description ?? "",
          notes:        raw.notes ?? "",
          delivery:     raw.delivery_date
                          ? new Date(raw.delivery_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "",
          image:        raw.styleReferenceImageUrl ?? null,
          artisan:      raw.artisan?.name ?? raw.artisanName ?? "",
          clientEmail,
          measurements: {
            chest:    raw.chest    ?? "", waist:    raw.waist    ?? "",
            hip:      raw.hip      ?? "", shoulder: raw.shoulder ?? "",
            sleeve:   raw.sleeve   ?? "", length:   raw.length   ?? "",
          },
        }));
        // Merge: API results take priority, keep local-only ones
        const merged = [...normalised];
        local.forEach((lo) => {
          if (!merged.find((a) => a.id === lo.id)) merged.push(lo);
        });
        setOrders(merged);
        saveClientOrders(clientEmail, merged);
      }
      setLoading(false);
    });
  }, [clientEmail]);

  /* Filter + search */
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchFilter = activeFilter === "All" || o.status === activeFilter;
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        (o.id          ?? "").toLowerCase().includes(q) ||
        (o.description ?? "").toLowerCase().includes(q) ||
        (o.status      ?? "").toLowerCase().includes(q) ||
        (o.artisan     ?? "").toLowerCase().includes(q) ||
        (o.client      ?? "").toLowerCase().includes(q) ||
        (o.notes       ?? "").toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [orders, activeFilter, search]);

  /* Detail view */
  if (selectedOrder) {
    return (
      <>
        {showTracking && (
          <TrackingOverlay
            order={selectedOrder}
            onClose={() => setShowTracking(false)}
          />
        )}
        <OrderDetailView
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
          onTrack={() => setShowTracking(true)}
        />
      </>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="orders-content">

        {/* Search + filter row */}
        <div className="orders-search-row">
          <div className="orders-search-wrap">
            <span className="orders-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input className="orders-search-input"
              placeholder="Search by name, type, status…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button key={f}
              className={`filter-tab ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="no-results">Loading orders…</div>
        ) : filtered.length === 0 ? (
          <div className="no-results">
            {orders.length === 0
              ? "No orders yet. Your artisan will create orders for you once you're linked."
              : `No orders match "${search || activeFilter}"`
            }
          </div>
        ) : (
          <div className="orders-grid">
            {filtered.map((order) => (
              <div key={order.id}
                className="order-grid-card"
                onMouseEnter={() => setHoveredId(order.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedOrder(order)}>

                <div className="order-card-image-wrap">
                  {order.image ? (
                    <img src={order.image} alt={order.id} className="order-card-image" />
                  ) : (
                    <div className="order-card-placeholder">
                      <span style={{ fontSize: 36 }}>🧵</span>
                    </div>
                  )}
                  <span className={`order-card-badge badge ${
                    order.status.toLowerCase() === "in progress" ? "inprogress" :
                    order.status.toLowerCase() === "pending"     ? "assigned"   :
                    order.status.toLowerCase()
                  }`}>● {order.status}</span>

                  {hoveredId === order.id && (
                    <div className="order-card-hover-overlay">
                      <span>View Order Details</span>
                    </div>
                  )}
                </div>

                <div className="order-card-body">
                  <div className="order-card-id">{order.id}</div>
                  {order.artisan && <div className="order-card-artisan">{order.artisan}</div>}
                  <div className="order-card-desc">{order.description}</div>
                  <div className="order-card-footer">
                    <span className="order-card-date">📅 {order.delivery ? `Due ${order.delivery}` : "No date set"}</span>
                    <span className="order-card-arrow">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
