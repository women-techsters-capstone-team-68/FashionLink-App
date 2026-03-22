import { useNavigate }  from "react-router-dom";
import { useAuth }      from "../../../context/AuthContext.jsx";
import { useData }      from "../../../context/DataContext.jsx";
import StatCard    from "../../../components/artisan/UIDashboard/StatCard/StatCard.jsx";
import AICard      from "../../../components/artisan/UIDashboard/AICard/AICard.jsx";
import OrdersTable from "../../../components/artisan/UIDashboard/OrdersTable/OrdersTable.jsx";
import Icon        from "../../../components/Icon.jsx";
import "./Dashboard.css";

/* ── Derive stats from live orders ───────────────────────────── */
function computeStats(orders) {
  const active    = orders.filter((o) => !["Completed", "Cancelled"].includes(o.status)).length;
  const completed = orders.filter((o) => o.status === "Completed").length;
  const delayed   = orders.filter((o) => o.status === "Delayed").length;

  const today     = new Date();
  const weekEnd   = new Date(today);
  weekEnd.setDate(today.getDate() + 7);
  const dueThisWeek = orders.filter((o) => {
    if (!o.deliveryDate) return false;
    const d = new Date(o.deliveryDate);
    return d >= today && d <= weekEnd;
  }).length;

  return [
    { id: "active_orders",  label: "Active Orders",    value: active,       icon: "orders",  variant: "default" },
    { id: "due_this_week",  label: "Due This Week",    value: dueThisWeek,  icon: "clock",   variant: "warning" },
    { id: "completed",      label: "Completed",        value: completed,    icon: "check",   variant: "success" },
    { id: "urgent_delayed", label: "Urgent / Delayed", value: delayed,      icon: "alert",   variant: "danger"  },
  ];
}

/* ── Derive AI card text from live orders ─────────────────────── */
function computeAI(orders) {
  const delayed   = orders.filter((o) => o.status === "Delayed");
  const today     = new Date();
  const weekEnd   = new Date(today);
  weekEnd.setDate(today.getDate() + 7);
  const dueSoon   = orders.filter((o) => {
    if (!o.deliveryDate) return false;
    const d = new Date(o.deliveryDate);
    return d >= today && d <= weekEnd && o.status !== "Completed";
  });

  let deadlineRisk = "No deadline risks this week.";
  if (delayed.length > 0) {
    const names = delayed.map((o) => `${o.id}${o.client ? " for " + o.client : ""}`).join(", ");
    deadlineRisk = `${delayed.length} delayed order${delayed.length > 1 ? "s" : ""}: ${names}. Prioritize these immediately.`;
  } else if (dueSoon.length > 0) {
    deadlineRisk = `${dueSoon.length} order${dueSoon.length > 1 ? "s" : ""} due within 7 days. Stay on track.`;
  }

  const active = orders.filter((o) => !["Completed", "Cancelled"].includes(o.status)).length;
  const workload = active === 0
    ? "No active orders. Create your first order to get started."
    : `${active} active order${active > 1 ? "s" : ""} across ${[...new Set(orders.map((o) => o.clientId).filter(Boolean))].length || active} client${active > 1 ? "s" : ""}. ${active < 5 ? "Workload is light." : active < 10 ? "Workload is moderate." : "Workload is high — consider prioritising."}`;

  return { deadlineRisk, workload };
}

/* ── Upcoming orders (next 5 by delivery date, non-completed) ── */
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
  const navigate = useNavigate();
  const { user }                 = useAuth();
  const { orders, loadingOrders } = useData();

  const stats    = computeStats(orders);
  const ai       = computeAI(orders);
  const upcoming = computeUpcoming(orders);

  const firstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "there";

  return (
    <div className="dash">

      {/* Stat cards — always computed, never static */}
      <div className="dash__stats">
        {stats.map((stat) => (
          <StatCard key={stat.id} label={stat.label} value={stat.value} icon={stat.icon} variant={stat.variant} />
        ))}
      </div>

      {/* AI cards + add button */}
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

      {/* Orders table — empty state for new users */}
      {loadingOrders && orders.length === 0 ? (
        <div className="dash__loading">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="dash__empty">
          <p className="dash__empty-title">Welcome, {firstName}!</p>
          <p className="dash__empty-sub">You have no orders yet. Create your first order to get started.</p>
          <button className="dash__add-btn" onClick={() => navigate("/artisan/add-order")}>
            <Icon name="plus" />
            Create First Order
          </button>
        </div>
      ) : (
        <OrdersTable
          orders={upcoming}
          onView={(order) => navigate(`/artisan/orders/${order.id}`)}
          onViewAll={() => navigate("/artisan/orders")}
        />
      )}

    </div>
  );
}
