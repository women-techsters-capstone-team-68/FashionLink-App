import { useState, useMemo }  from "react";
import { useNavigate }  from "react-router-dom";
import { useAuth }      from "../../../context/AuthContext.jsx";
import { useData }      from "../../../context/DataContext.jsx";
import StatCard    from "../../../components/artisan/UIDashboard/StatCard/StatCard.jsx";
import AICard      from "../../../components/artisan/UIDashboard/AICard/AICard.jsx";
import OrdersTable from "../../../components/artisan/UIDashboard/OrdersTable/OrdersTable.jsx";
import Icon        from "../../../components/Icon.jsx";
import "./Dashboard.css";

/* ── Stats — derived purely from live orders ─────────────────── */
function computeStats(orders) {
  const active    = orders.filter((o) => !["Completed", "Cancelled"].includes(o.status)).length;
  const completed = orders.filter((o) => o.status === "Completed").length;
  const delayed   = orders.filter((o) => o.status === "Delayed").length;

  const today   = new Date(); today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today); weekEnd.setDate(today.getDate() + 7);

  const dueThisWeek = orders.filter((o) => {
    if (!o.deliveryDate || ["Completed", "Cancelled"].includes(o.status)) return false;
    const d = new Date(o.deliveryDate);
    return d >= today && d <= weekEnd;
  }).length;

  return [
    { id: "active_orders",  label: "Active Orders",    value: active,       icon: "orders", variant: "default" },
    { id: "due_this_week",  label: "Due This Week",    value: dueThisWeek,  icon: "clock",  variant: "warning" },
    { id: "completed",      label: "Completed",        value: completed,    icon: "check",  variant: "success" },
    { id: "urgent_delayed", label: "Urgent / Delayed", value: delayed,      icon: "alert",  variant: "danger"  },
  ];
}

/* ── AI card summaries ───────────────────────────────────────── */
function computeAI(orders) {
  const delayed = orders.filter((o) => o.status === "Delayed");
  const today   = new Date(); today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today); weekEnd.setDate(today.getDate() + 7);
  const dueSoon = orders.filter((o) => {
    if (!o.deliveryDate || o.status === "Completed") return false;
    const d = new Date(o.deliveryDate);
    return d >= today && d <= weekEnd;
  });

  let deadlineRisk = "No deadline risks this week.";
  if (delayed.length > 0) {
    const names = delayed.map((o) => `${o.id}${o.client ? " for " + o.client : ""}`).join(", ");
    deadlineRisk = `${delayed.length} delayed order${delayed.length > 1 ? "s" : ""}: ${names}. Prioritize immediately.`;
  } else if (dueSoon.length > 0) {
    deadlineRisk = `${dueSoon.length} order${dueSoon.length > 1 ? "s" : ""} due within 7 days. Stay on track.`;
  }

  const active = orders.filter((o) => !["Completed", "Cancelled"].includes(o.status)).length;
  const workload = active === 0
    ? "No active orders. Create your first order to get started."
    : `${active} active order${active > 1 ? "s" : ""}. ${active < 5 ? "Workload is light." : active < 10 ? "Workload is moderate." : "Workload is high — consider prioritising."}`;

  return { deadlineRisk, workload };
}

/* ── Upcoming: next 5 non-completed, sorted by delivery ─────── */
function computeUpcoming(orders) {
  return [...orders]
    .filter((o) => o.status !== "Completed" && o.status !== "Cancelled")
    .sort((a, b) => {
      if (!a.deliveryDate) return 1;
      if (!b.deliveryDate) return -1;
      return new Date(a.deliveryDate) - new Date(b.deliveryDate);
    })
    .slice(0, 5);
}

/* ══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate                    = useNavigate();
  const { user }                    = useAuth();
  const { orders, clients, loadingOrders } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  const firstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "there";

  const stats    = computeStats(orders);
  const ai       = computeAI(orders);
  const upcoming = computeUpcoming(orders);

  /* ── Dashboard search ──────────────────────────────────────── */
  const q = searchQuery.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!q) return null;
    const matchedOrders  = orders.filter((o) =>
      (o.id          ?? "").toLowerCase().includes(q) ||
      (o.client      ?? "").toLowerCase().includes(q) ||
      (o.description ?? "").toLowerCase().includes(q) ||
      (o.status      ?? "").toLowerCase().includes(q)
    );
    const matchedClients = clients.filter((c) =>
      (c.name  ?? "").toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q)
    );
    return { orders: matchedOrders, clients: matchedClients };
  }, [q, orders, clients]);

  return (
    <div className="dash">

      {/* ── Dashboard-level search bar ─────────────────────────── */}
      <div className="dash__search-wrap">
        <svg className="dash__search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className="dash__search-input"
          type="search"
          placeholder="Search orders, clients…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search dashboard"
        />
        {searchQuery && (
          <button className="dash__search-clear" type="button" onClick={() => setSearchQuery("")} aria-label="Clear">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── Search results panel ────────────────────────────────── */}
      {searchResults && (
        <div className="dash__search-results">
          {searchResults.orders.length === 0 && searchResults.clients.length === 0 ? (
            <p className="dash__search-empty">No results for "{searchQuery}"</p>
          ) : (
            <>
              {searchResults.clients.length > 0 && (
                <div className="dash__search-section">
                  <p className="dash__search-section-title">Clients</p>
                  {searchResults.clients.map((c) => (
                    <button key={c.id} className="dash__search-item"
                      onClick={() => { navigate(`/artisan/clients/${c.id}`); setSearchQuery(""); }}>
                      <span className="dash__search-item-name">{c.name}</span>
                      <span className="dash__search-item-sub">{c.email}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchResults.orders.length > 0 && (
                <div className="dash__search-section">
                  <p className="dash__search-section-title">Orders</p>
                  {searchResults.orders.map((o) => (
                    <button key={o.id} className="dash__search-item"
                      onClick={() => { navigate(`/artisan/orders/${o.id}`); setSearchQuery(""); }}>
                      <span className="dash__search-item-name">{o.id} — {o.client}</span>
                      <span className="dash__search-item-sub">{o.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Stat cards ─────────────────────────────────────────── */}
      <div className="dash__stats">
        {stats.map((stat) => (
          <StatCard key={stat.id} label={stat.label} value={stat.value} icon={stat.icon} variant={stat.variant} />
        ))}
      </div>

      {/* ── AI cards + add button ──────────────────────────────── */}
      <div className="dash__ai-row">
        <AICard title="Deadline Risk Alert">
          <p>{ai.deadlineRisk}</p>
        </AICard>
        <div className="dash__ai-right">
          <AICard title="Workload Summary">
            <p>{ai.workload}</p>
          </AICard>
          <button className="dash__add-btn" onClick={() => navigate("/artisan/add-order")}>
            <Icon name="plus" />
            Add New Order
          </button>
        </div>
      </div>

      {/* ── Upcoming orders table ──────────────────────────────── */}
      {loadingOrders && orders.length === 0 ? (
        <div className="dash__loading">Loading orders…</div>
      ) : (
        /* Always render OrdersTable — shows header even when upcoming is empty */
        <OrdersTable
          orders={upcoming}
          onView={(order) => navigate(`/artisan/orders/${order.id}`)}
          onViewAll={() => navigate("/artisan/orders")}
          emptyMessage={
            orders.length === 0
              ? `Welcome, ${firstName}! Create your first order to get started.`
              : "No upcoming orders."
          }
        />
      )}

    </div>
  );
}
