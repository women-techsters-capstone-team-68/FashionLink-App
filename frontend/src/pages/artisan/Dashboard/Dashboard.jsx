import { useState }     from "react";
import { useNavigate }  from "react-router-dom";
import StatCard    from "../../../components/artisan/UIDashboard/StatCard/StatCard.jsx";
import AICard      from "../../../components/artisan/UIDashboard/AICard/AICard.jsx";
import OrdersTable from "../../../components/artisan/UIDashboard/OrdersTable/OrdersTable.jsx";
import Icon        from "../../../components/Icon.jsx";
import { dashboardStats, upcomingOrders, aiAlerts } from "../../../data/mockData.js";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [orders] = useState(upcomingOrders);

  return (
    <div className="dash">
      {/* Stat cards */}
      <div className="dash__stats">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.id} label={stat.label} value={stat.value} icon={stat.icon} variant={stat.variant} />
        ))}
      </div>

      {/* AI cards + add button */}
      <div className="dash__ai-row">
        <AICard title="Deadline Risk Alert">
          <p>{aiAlerts.deadlineRisk.summary}</p>
        </AICard>

        <div className="dash__ai-right">
          <AICard title="Workload Summary">
            <p>{aiAlerts.workloadSummary.summary}</p>
          </AICard>

          <button className="dash__add-btn" onClick={() => navigate("/artisan/add-order")}>
            <Icon name="plus" />
            Add New Order
          </button>
        </div>
      </div>

      {/* Orders table */}
      <OrdersTable
        orders={orders}
        onView={(order) => navigate(`/artisan/orders/${order.id}`)}
        onViewAll={() => navigate("/artisan/orders")}
      />
    </div>
  );
}
