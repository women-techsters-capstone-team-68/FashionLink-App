import { useState }    from "react";
import { useNavigate } from "react-router-dom";
import { allOrders }   from "../../../data/mockData.js";
import OrderCard       from "../../../components/artisan/UI/OrderCard/OrderCard.jsx";
import FilterDropdown  from "../../../components/artisan/UI/FilterDropdown/FilterDropdown.jsx";
import "./Orders.css";

const TABS = [
  { id: "All",         label: "All"         },
  { id: "Assigned",    label: "Assigned"    },
  { id: "In Progress", label: "In Progress" },
  { id: "Completed",   label: "Completed"   },
  { id: "Delayed",     label: "Delayed"     },
];

const SORTERS = {
  "delivery-asc":  (a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate),
  "delivery-desc": (a, b) => new Date(b.deliveryDate) - new Date(a.deliveryDate),
  "client-asc":    (a, b) => a.client.localeCompare(b.client),
  "client-desc":   (a, b) => b.client.localeCompare(a.client),
  "id-asc":        (a, b) => a.id.localeCompare(b.id),
  "id-desc":       (a, b) => b.id.localeCompare(a.id),
};

export default function Orders() {
  const navigate = useNavigate();

  const [orders]     = useState(allOrders);
  const [query,  setQuery]       = useState("");
  const [activeTab,  setActiveTab]   = useState("All");
  const [activeSort, setActiveSort]  = useState(null);

  const q = query.toLowerCase();

  const filtered = orders
    .filter((o) => !q || o.client.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.description.toLowerCase().includes(q))
    .filter((o) => activeTab === "All" || o.status === activeTab)
    .sort(activeSort ? SORTERS[activeSort] : () => 0);

  const countFor = (tabId) =>
    tabId === "All" ? orders.length : orders.filter((o) => o.status === tabId).length;

  return (
    <div className="op">
      {/* Toolbar */}
      <div className="op__toolbar">
        <div className="op__search-wrap">
          <svg className="op__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="op__search-input" type="text" placeholder="Search Orders" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search orders" />
          {query && (
            <button className="op__search-clear" onClick={() => setQuery("")} type="button" aria-label="Clear search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        <div className="op__actions">
          <FilterDropdown activeSort={activeSort} onSortChange={setActiveSort} />
          {/* Full-page navigation — no modal */}
          <button className="op__add-btn" onClick={() => navigate("/artisan/add-order")} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="16" height="16">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Order
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="op__tabs" role="tablist" aria-label="Filter orders by status">
        {TABS.map((tab) => {
          const count = countFor(tab.id);
          return (
            <button key={tab.id} role="tab" aria-selected={activeTab === tab.id} className={`op__tab ${activeTab === tab.id ? "op__tab--active" : ""}`} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
              {tab.id !== "All" && count > 0 && (
                <span className={`op__tab-count op__tab-count--${tab.id.toLowerCase().replace(" ", "")}`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {(query || activeSort) && (
        <p className="op__results-meta">
          {filtered.length} order{filtered.length !== 1 ? "s" : ""} found
          {activeSort && <span className="op__results-sort"> · sorted</span>}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="op__empty">
          <span className="op__empty-icon">🔍</span>
          <p className="op__empty-text">{query ? `No orders match "${query}"` : `No ${activeTab !== "All" ? activeTab : ""} orders yet`}</p>
          {query && <button className="op__empty-clear" onClick={() => setQuery("")} type="button">Clear search</button>}
        </div>
      ) : (
        <div className="op__grid">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onView={(o) => navigate(`/artisan/orders/${o.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
