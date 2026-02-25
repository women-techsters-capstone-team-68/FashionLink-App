import { useParams, useNavigate } from "react-router-dom";
import { clients, allOrders }     from "../../../data/mockData";
import StatusBadge                from "../../../components/artisan/StatusBadge/StatusBadge.jsx";
import "./ClientProfile.css";

function initials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const MEASUREMENT_LABELS = [
  { key: "chest",    label: "Chest"    },
  { key: "waist",    label: "Waist"    },
  { key: "hip",      label: "Hip"      },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeve",   label: "Sleeve"   },
  { key: "length",   label: "Length"   },
];

export default function ClientProfile() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="cp cp--not-found">
        <p>Client not found.</p>
        <button onClick={() => navigate("/artisan/clients")} type="button">← Back to clients</button>
      </div>
    );
  }

  /* Orders belonging to this client */
  const clientOrders = allOrders.filter((o) => o.clientId === id);

  return (
    <div className="cp">

      {/* ── Back link ─────────────────────────────────────────── */}
      <button className="cp__back" onClick={() => navigate("/artisan/clients")} type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to clients
      </button>

      {/* ── Top row ───────────────────────────────────────────── */}
      <div className="cp__top">

        {/* Client info card */}
        <div className="cp__info-card">
          <div className="cp__info-head">
            <div className="cp__avatar">{initials(client.name)}</div>
            <div>
              <p className="cp__client-name">{client.name}</p>
              <p className="cp__client-id">{client.clientId}</p>
            </div>
          </div>

          <div className="cp__info-rows">
            <div className="cp__info-row">
              <span className="cp__info-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <span>{client.email}</span>
            </div>
            <div className="cp__info-row">
              <span className="cp__info-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.27-.84a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <span>{client.phone}</span>
            </div>
            <div className="cp__info-row">
              <span className="cp__info-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </span>
              <span>{client.orderCount} orders</span>
            </div>
            <div className="cp__info-row">
              <span className="cp__info-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </span>
              <span>Last Order : {client.lastOrder}</span>
            </div>
          </div>
        </div>

        {/* Order history */}
        <div className="cp__orders-card">
          <div className="cp__orders-head">
            <p className="cp__orders-title">Order History</p>
            <span className="cp__orders-count">{clientOrders.length} orders</span>
          </div>

          <div className="cp__orders-list">
            {clientOrders.length === 0 ? (
              <p className="cp__orders-empty">No orders yet.</p>
            ) : (
              clientOrders.map((order) => (
                <div
                  key={order.id}
                  className="cp__order-row"
                  onClick={() => navigate(`/artisan/orders/${order.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/artisan/orders/${order.id}`)}
                >
                  <div className="cp__order-top">
                    <span className="cp__order-id">{order.id}</span>
                    <StatusBadge status={order.status} />
                    <span className="cp__order-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </span>
                  </div>
                  <p className="cp__order-desc">{order.description}</p>
                  <div className="cp__order-due">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Due {order.delivery}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Measurements ──────────────────────────────────────── */}
      <div className="cp__measurements-card">
        <div className="cp__measurements-head">
          <span className="cp__measurements-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.3 8.7L8.7 21.3a1 1 0 0 1-1.4 0l-6.6-6.6a1 1 0 0 1 0-1.4L13.3 2.7a1 1 0 0 1 1.4 0l6.6 6.6a1 1 0 0 1 0 1.4z"/>
              <path d="M7.5 10.5l2 2"/><path d="M10.5 7.5l2 2"/><path d="M13.5 4.5l2 2"/>
            </svg>
          </span>
          <p className="cp__measurements-title">Current Measurements</p>
        </div>

        <div className="cp__measurements-grid">
          {MEASUREMENT_LABELS.map(({ key, label }) => (
            <div className="cp__measurement-field" key={key}>
              <label className="cp__measurement-label">{label}</label>
              <div className="cp__measurement-value">
                {client.measurements[key] ?? "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
