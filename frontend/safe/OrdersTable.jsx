import Icon from "../../../Icon.jsx";
import StatusBadge from "../../StatusBadge/StatusBadge.jsx";
import "./OrdersTable.css";

export default function OrdersTable({ orders, onView, onViewAll }) {
  return (
    <section className="ot">
      <div className="ot__header">
        <h2 className="ot__title">Upcoming Orders</h2>
        <button className="ot__view-all" onClick={onViewAll}>
          View all
          <Icon name="arrowRight" />
        </button>
      </div>

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
            {orders.map((order, idx) => (
              <tr
                key={order.id}
                className="ot__row"
                style={{ animationDelay: `${0.3 + idx * 0.06}s` }}
              >
                <td className="ot__order-id">{order.id}</td>
                <td className="ot__client">{order.client}</td>
                <td className="ot__desc">{order.description}</td>
                <td className="ot__delivery">
                  <div className="ot__delivery-content" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name="calendar" />
                    {order.delivery}
                  </div>
                </td>
                <td>
                  {/* Using your modular component */}
                  <StatusBadge status={order.status} />
                </td>
                <td>
                  <button
                    className="ot__view-btn"
                    onClick={() => onView?.(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view cards */}
      <div className="ot__cards">
        {orders.map((order) => (
          <div key={order.id} className="ot__card">
            <div className="ot__card-top">
              <span className="ot__order-id">{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            <p className="ot__card-client">{order.client}</p>
            <p className="ot__card-desc">{order.description}</p>
            <div className="ot__card-bottom">
              <div className="ot__delivery">
                <Icon name="calendar" />
                {order.delivery}
              </div>
              <button className="ot__view-btn" onClick={() => onView?.(order)}>
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}