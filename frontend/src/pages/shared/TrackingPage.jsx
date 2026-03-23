/**
 * TrackingPage.jsx — /track/:orderId
 *
 * Shared between artisan and client portals.
 * Reads order from the viewer's own localStorage bucket.
 * - Artisan: reads from getOrders(userId)
 * - Client:  reads from getClientOrders(email)
 *
 * Displays: order id, status badge, AI summary, timeline steps,
 * delivery date, and measurements.
 * No auth required — can be shared via link.
 */
import { useParams, useNavigate } from "react-router-dom";
import { useAuth }                from "../../../context/AuthContext.jsx";
import { useData }                from "../../../context/DataContext.jsx";
import { getClientOrders }        from "../../../services/store.js";
import "./TrackingPage.css";

const STATUS_STEPS = ["Order Assigned", "Work in Progress", "Order Completed"];
const STATUS_STEP_MAP = { "Assigned": 0, "Pending": 0, "In Progress": 1, "Completed": 2, "Delayed": 0 };

function buildAISummary(order) {
  const name = order.client ? `for ${order.client}` : "";
  const del  = order.delivery ? `Delivery expected on ${order.delivery}.` : "";
  return `Order ${order.id} ${name} — ${order.description}. Current status: ${order.status}. ${del} ${order.notes ? "Note: " + order.notes : ""}`.trim();
}

export default function TrackingPage() {
  const { orderId } = useParams();
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const { orders }  = useData();

  // Try artisan orders first, then client orders
  let order = orders.find((o) => o.id === orderId);

  if (!order && user?.role === "client") {
    const clientEmail = user?.email ?? "";
    const clientOrders = getClientOrders(clientEmail);
    order = clientOrders.find((o) => o.id === orderId);
  }

  if (!order) {
    return (
      <div className="trk trk--notfound">
        <div className="trk__card">
          <span className="trk__notfound-icon">🔍</span>
          <h2>Order Not Found</h2>
          <p>Order <strong>{orderId}</strong> could not be found.</p>
          <button onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </div>
    );
  }

  const activeStep = STATUS_STEP_MAP[order.status] ?? 0;
  const aiSummary  = buildAISummary(order);
  const meas       = order.measurements ?? {};
  const measFields = Object.entries(meas).filter(([, v]) => v !== "" && v !== undefined && v !== null);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert("Tracking link copied!");
  };

  return (
    <div className="trk">
      <div className="trk__header">
        <button className="trk__back" onClick={() => navigate(-1)}>← Back</button>
        <div className="trk__header-right">
          <button className="trk__copy-btn" onClick={handleCopyLink}>🔗 Copy Link</button>
        </div>
      </div>

      {/* Order ID + status */}
      <div className="trk__card trk__hero-card">
        <div className="trk__hero-left">
          <h1 className="trk__order-id">{order.id}</h1>
          {order.client && <p className="trk__client-name">{order.client}</p>}
          {order.description && <p className="trk__description">{order.description}</p>}
        </div>
        <div className="trk__hero-right">
          <span className={`trk__status-badge trk__status-badge--${(order.status ?? "").toLowerCase().replace(/ /g, "")}`}>
            ● {order.status}
          </span>
          {order.delivery && (
            <p className="trk__delivery">📅 Due {order.delivery}</p>
          )}
        </div>
      </div>

      {/* AI Summary */}
      <div className="trk__card trk__ai-card">
        <div className="trk__ai-header">
          <span className="trk__ai-icon">⭐</span>
          <h3 className="trk__ai-title">Order Summary</h3>
          <span className="trk__ai-badge">AI</span>
        </div>
        <p className="trk__ai-body">{aiSummary}</p>
      </div>

      {/* Timeline */}
      <div className="trk__card">
        <h3 className="trk__section-title">Order Progress</h3>
        <div className="trk__timeline">
          {STATUS_STEPS.map((step, i) => {
            const done = i <= activeStep;
            const isDelayed = order.status === "Delayed" && i === 0;
            return (
              <div key={step} className="trk__timeline-item">
                <div className="trk__timeline-dot-wrap">
                  <div className={`trk__timeline-dot ${done ? "done" : ""} ${isDelayed && i === 0 ? "delayed" : ""}`}>
                    {done ? (isDelayed && i === 0 ? "!" : "✓") : ""}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`trk__timeline-line ${done ? "done" : ""}`} />
                  )}
                </div>
                <div className="trk__timeline-content">
                  <p className="trk__timeline-title">{step}</p>
                  <p className="trk__timeline-desc">
                    {i === 0 && "Order has been received and assigned."}
                    {i === 1 && "Your garment is being crafted with care."}
                    {i === 2 && "Order is complete and ready for delivery."}
                  </p>
                  {isDelayed && i === 0 && (
                    <p className="trk__timeline-warning">⚠️ This order is currently delayed.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Measurements */}
      {measFields.length > 0 && (
        <div className="trk__card">
          <h3 className="trk__section-title">📏 Measurements (inches)</h3>
          <div className="trk__meas-grid">
            {measFields.map(([label, value]) => (
              <div key={label} className="trk__meas-field">
                <span className="trk__meas-label" style={{ textTransform: "capitalize" }}>{label}</span>
                <span className="trk__meas-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Style Reference */}
      {order.image && (
        <div className="trk__card">
          <h3 className="trk__section-title">Style Reference</h3>
          <img className="trk__style-img" src={order.image} alt="Style Reference" />
        </div>
      )}
    </div>
  );
}
