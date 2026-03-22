import { useState, useEffect } from "react";
import { useAuth }             from "../../../context/AuthContext.jsx";
import { getClientOrders, saveClientOrders } from "../../../services/store.js";
import { ordersApi }           from "../../../services/api.js";
import "./MyOrders.css";

const FILTERS = ["All", "Assigned", "In Progress", "Completed", "Delayed"];

/* ── Status Badge ─────────────────────────────────────────────── */
function Badge({ status }) {
  const map = { "in progress": "inprogress", "assigned": "assigned", "completed": "completed", "delayed": "delayed", "pending": "assigned" };
  const cls = map[(status ?? "").toLowerCase()] ?? "assigned";
  return <span className={`badge ${cls}`}>● {status}</span>;
}

/* ── Order Details View ──────────────────────────────────────── */
function OrderDetails({ order, onBack }) {
  const steps = [
    { title: "Order Received",    desc: "Your order has been received and assigned to an artisan.", done: true  },
    { title: "Work in Progress",  desc: "Your garment is being crafted with care and attention.",    done: ["In Progress", "Completed"].includes(order.status) },
    { title: "Ready for Delivery",desc: "Your order is complete and ready to be delivered.",         done: order.status === "Completed" },
  ];

  const meas = order.measurements ?? {};
  const measFields = Object.entries(meas).filter(([, v]) => v !== "" && v !== undefined);

  return (
    <div className="order-details-content">
      <button className="back-btn" onClick={onBack}>← Back to orders</button>

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
            <div className="details-section">
              <div className="details-meta-label">DESCRIPTION</div>
              <div className="details-meta-value">{order.description || "No description"}</div>
            </div>
            {order.notes && (
              <div className="details-section">
                <div className="details-meta-label">NOTES</div>
                <div className="details-meta-value">{order.notes}</div>
              </div>
            )}
            {order.client && (
              <div className="details-section">
                <div className="details-meta-label">ARTISAN</div>
                <div className="details-meta-value">{order.client}</div>
              </div>
            )}
          </div>

          <div className="details-card">
            <div className="details-section-title" style={{ marginBottom: 20 }}>Order Timeline</div>
            <div className="timeline">
              {steps.map((step, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot-wrap">
                    <div className={`timeline-dot ${step.done ? "done" : "pending"}`}>
                      {step.done ? "✓" : ""}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`timeline-line ${step.done ? "done" : ""}`} />
                    )}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-step-title">{step.title}</div>
                    <div className="timeline-step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
            <div className="status-text">Share a public tracking link for this order.</div>
            <button className="copy-link-btn" onClick={() => {
              const link = `${window.location.origin}/track/${order.id}`;
              navigator.clipboard?.writeText(link);
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
  const { user }    = useAuth();
  const userId      = user?.id ?? user?.email ?? null;

  const [orders,       setOrders]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search,       setSearch]       = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [hovered,      setHovered]      = useState(null);

  /* Load orders: API first, then localStorage fallback */
  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const local = getClientOrders(userId);
    setOrders(local);

    // Try API
    ordersApi.list({ mine: 1 }).then(({ data, error }) => {
      if (!error && Array.isArray(data) && data.length > 0) {
        const normalised = data.map((raw) => ({
          id:          raw.order_number ?? String(raw.id),
          apiId:       raw.id,
          status:      (raw.status ?? "pending").charAt(0).toUpperCase() + (raw.status ?? "pending").slice(1).replace(/_/g, " "),
          description: raw.description ?? "",
          notes:       raw.notes ?? "",
          delivery:    raw.delivery_date ? new Date(raw.delivery_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
          image:       raw.styleReferenceImageUrl ?? null,
          client:      raw.client?.fullName ?? raw.client?.name ?? "",
          measurements: {
            chest: raw.chest ?? "", waist: raw.waist ?? "",
            hip: raw.hip ?? "", shoulder: raw.shoulder ?? "",
            sleeve: raw.sleeve ?? "", length: raw.length ?? "",
          },
        }));
        setOrders(normalised);
        saveClientOrders(userId, normalised);
      }
      setLoading(false);
    });
  }, [userId]);

  if (selectedOrder) {
    return <OrderDetails order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  const filtered = orders.filter((o) => {
    const matchFilter = activeFilter === "All" || o.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (o.id          ?? "").toLowerCase().includes(q) ||
      (o.description ?? "").toLowerCase().includes(q) ||
      (o.status      ?? "").toLowerCase().includes(q) ||
      (o.client      ?? "").toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="page-wrapper">
      <div className="orders-content">

        {/* Search + filter */}
        <div className="orders-search-row">
          <div className="orders-search-wrap">
            <span className="orders-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input className="orders-search-input" placeholder="Search orders by name, ID, or status"
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
              ? "No orders yet. Your artisan's orders for you will appear here."
              : `No orders match "${search || activeFilter}"`}
          </div>
        ) : (
          <div className="orders-grid">
            {filtered.map((order) => (
              <div key={order.id} className="order-grid-card"
                onMouseEnter={() => setHovered(order.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelectedOrder(order)}>

                {/* Card image or placeholder */}
                <div className="order-card-image-wrap">
                  {order.image ? (
                    <img src={order.image} alt={order.id} className="order-card-image" />
                  ) : (
                    <div className="order-card-placeholder">
                      <span style={{ fontSize: 32 }}>🧵</span>
                    </div>
                  )}
                  <span className={`order-card-badge badge ${
                    order.status.toLowerCase() === "in progress" ? "inprogress" :
                    order.status.toLowerCase()
                  }`}>● {order.status}</span>

                  {/* Hover overlay */}
                  {hovered === order.id && (
                    <div className="order-card-hover-overlay">
                      <span>View Order Details</span>
                    </div>
                  )}
                </div>

                <div className="order-card-body">
                  <div className="order-card-id">{order.id}</div>
                  {order.client && <div className="order-card-artisan">{order.client}</div>}
                  <div className="order-card-desc">{order.description}</div>
                  <div className="order-card-footer">
                    <span className="order-card-date">📅 Due {order.delivery || "TBC"}</span>
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
