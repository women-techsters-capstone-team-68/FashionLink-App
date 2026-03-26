import Icon from "../../../Icon.jsx";
import StatusBadge from "../../StatusBadge/StatusBadge.jsx";
import "./OrdersTable.css";

export default function OrdersTable({ orders, onView, onViewAll, emptyMessage }) {
  return (
    <section className="ot">
      <div className="ot__header">
        <h2 className="ot__title">Upcoming Orders</h2>
        <button className="ot__view-all" onClick={onViewAll}>
          View all
          <Icon name="arrowRight" />
        </button>
      </div>

      {/* Desktop table */}
      <div className="ot__table-wrap">
        <table className="ot__table">
          <thead>
            <tr>
              <th>ORDER</th>
              <th>CLIENT</th>
              <th>DESCRIPTION</th>
              <th>DELIVERY</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="ot__empty-row">
                  {emptyMessage ?? "No orders yet."}
                </td>
              </tr>
            ) : (
              orders.map((order, idx) => (
                <tr key={order.id} className="ot__row" style={{ animationDelay: `${0.3 + idx * 0.06}s` }}>
                  <td className="ot__order-id">{order.id}</td>
                  <td className="ot__client">{order.client}</td>
                  <td className="ot__desc">{order.description}</td>
                  <td>
                    <span className="ot__delivery">
                      <Icon name="calendar" />
                      {order.delivery}
                    </span>
                  </td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>
                    <button className="ot__view-btn" onClick={() => onView?.(order)}>View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="ot__cards">
        {orders.length === 0 && (
          <p className="ot__empty-mobile">{emptyMessage ?? "No orders yet."}</p>
        )}
        {orders.map((order) => (
          <div key={order.id} className="ot__card">
            <div className="ot__card-top">
              <span className="ot__order-id">{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            <p className="ot__card-client">{order.client}</p>
            <p className="ot__card-desc">{order.description}</p>
            <div className="ot__card-bottom">
              <span className="ot__delivery">
                <Icon name="calendar" />
                {order.delivery}
              </span>
              <button className="ot__view-btn" onClick={() => onView?.(order)}>View</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
