import { useState } from 'react';
import './MyOrders.css';

const orders = [
  {
    id: 'ORD-001',
    badge: 'In Progress',
    badgeClass: 'inprogress',
    artisan: 'Emmanuel Happiness',
    description: 'Custom Aso-Oke Agbada with intricate embroidery for a traditional wedding ceremony',
    dueDate: 'Feb 25',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=200&fit=crop',
    deliveryDate: 'Wed February 25, 2026',
    timeRemaining: '3 days',
    notes: 'Client prefers gold thread embroidery',
    measurements: [
      { label: 'Chest', value: '35' },
      { label: 'Waist', value: '33' },
      { label: 'Hip', value: '30' },
      { label: 'Chest', value: '18' },
      { label: 'Waist', value: '25' },
      { label: 'Hip', value: '30' },
    ],
  },
  {
    id: 'ORD-006',
    badge: 'Assigned',
    badgeClass: 'assigned',
    artisan: 'Emmanuel Happiness',
    description: 'Casual Linen Shirt in off white with mandarin collar',
    dueDate: 'Feb 28',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=200&fit=crop',
    deliveryDate: 'Wed February 28, 2026',
    timeRemaining: '6 days',
    notes: 'Client prefers slim fit',
    measurements: [
      { label: 'Chest', value: '40' },
      { label: 'Waist', value: '34' },
      { label: 'Hip', value: '38' },
      { label: 'Shoulder', value: '18' },
      { label: 'Sleeve', value: '25' },
      { label: 'Length', value: '62' },
    ],
  },
];

const filters = ['All', 'Assigned', 'In Progress', 'Completed', 'Delayed'];

export default function MyOrders() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = orders.filter((o) => {
    const matchesFilter = activeFilter === 'All' || o.badge === activeFilter;
    const matchesSearch =
      o.description.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (selectedOrder) {
    return (
      <div className="page-wrapper">
        <div className="order-details-content">
          <button className="back-btn" onClick={() => setSelectedOrder(null)}>
            ← Back to orders
          </button>

          <div className="order-details-grid">
            {/* LEFT */}
            <div className="order-details-left">
              <div className="details-card">
                <div className="details-card-header">
                  <div className="details-section-title">Order Details</div>
                  <span className={`badge ${selectedOrder.badgeClass}`}>● {selectedOrder.badge}</span>
                </div>
                <div className="details-meta-grid">
                  <div>
                    <div className="details-meta-label">DELIVERY DATE</div>
                    <div className="details-meta-value">📅 {selectedOrder.deliveryDate}</div>
                  </div>
                  <div>
                    <div className="details-meta-label">TIME REMAINING</div>
                    <div className="details-meta-value time-warning">⏱ {selectedOrder.timeRemaining}</div>
                  </div>
                </div>
                <div className="details-section">
                  <div className="details-meta-label">DESCRIPTION</div>
                  <div className="details-meta-value">{selectedOrder.description}</div>
                </div>
                <div className="details-section">
                  <div className="details-meta-label">NOTES</div>
                  <div className="details-meta-value">{selectedOrder.notes}</div>
                </div>
              </div>

              <div className="details-card">
                <div className="details-section-title" style={{ marginBottom: '20px' }}>Order Timeline</div>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot-wrap">
                      <div className="timeline-dot done">✓</div>
                      <div className="timeline-line done" />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-step-title">Order Received</div>
                      <div className="timeline-step-desc">Your Order has been received and assigned to our Artisan</div>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot-wrap">
                      <div className="timeline-dot done">✓</div>
                      <div className="timeline-line" />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-step-title">Work in Progress</div>
                      <div className="timeline-step-desc">Your garment is being crafted with care and attention to details</div>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot-wrap">
                      <div className="timeline-dot pending" />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-step-title">Ready for Delivery</div>
                      <div className="timeline-step-desc">Your order is complete and ready to be delivered or picked up</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="details-card">
                <div className="details-section-title" style={{ marginBottom: '20px' }}>📏 Measurement (inches)</div>
                <div className="measurements-grid">
                  {selectedOrder.measurements.map((m, i) => (
                    <div key={i} className="measurement-item">
                      <div className="measurement-label">{m.label}</div>
                      <input className="measurement-input" defaultValue={m.value} readOnly />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="order-details-right">
              <div className="details-card">
                <div className="details-section-title" style={{ marginBottom: '14px' }}>Style Reference</div>
                <img
                  src={selectedOrder.image}
                  alt="Style Reference"
                  className="style-ref-image"
                />
              </div>

              <div className="details-card">
                <div className="details-section-title" style={{ marginBottom: '8px' }}>Status</div>
                <div className="status-text">Contact your artisan for questions about this order.</div>
                <button className="contact-artisan-btn">✉️ Contact Artisan</button>
              </div>

              <div className="details-card">
                <div className="details-section-title" style={{ marginBottom: '4px' }}>Share Tracking</div>
                <div className="status-text">Share a public tracking link for this order.</div>
                <button className="copy-link-btn">Copy Tracking Link</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">

      <div className="orders-content">
        <div className="orders-search-row">
          <div className="orders-search-wrap">
            <span className="orders-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              className="orders-search-input"
              placeholder="Search Orders"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="filter-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filter
          </button>
        </div>

        <div className="filter-tabs">
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="orders-grid">
          {filtered.length === 0 ? (
            <div className="no-results">No orders found</div>
          ) : (
            filtered.map((order) => (
              <div
                key={order.id}
                className="order-grid-card"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-card-image-wrap">
                  <img src={order.image} alt={order.id} className="order-card-image" />
                  <span className={`order-card-badge badge ${order.badgeClass}`}>
                    ● {order.badge}
                  </span>
                </div>
                <div className="order-card-body">
                  <div className="order-card-id">{order.id}</div>
                  <div className="order-card-artisan">{order.artisan}</div>
                  <div className="order-card-desc">{order.description}</div>
                  <div className="order-card-footer">
                    <span className="order-card-date">📅 Due {order.dueDate}</span>
                    <span className="order-card-arrow">→</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}