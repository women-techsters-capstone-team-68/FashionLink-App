import { useNavigate } from 'react-router-dom';
import './OrderDetails.css';

export default function OrderDetails() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">

      <div className="order-details-content">
        <button className="back-btn" onClick={() => navigate('/orders')}>
          ← Back to orders
        </button>

        <div className="order-details-grid">
          {/* LEFT */}
          <div className="order-details-left">

            <div className="details-card">
              <div className="details-card-header">
                <div className="details-section-title">Order Details</div>
                <span className="badge inprogress">● In Progress</span>
              </div>
              <div className="details-meta-grid">
                <div>
                  <div className="details-meta-label">DELIVERY DATE</div>
                  <div className="details-meta-value">📅 Wed February 25, 2026</div>
                </div>
                <div>
                  <div className="details-meta-label">TIME REMAINING</div>
                  <div className="details-meta-value time-warning">⏱ 3 days</div>
                </div>
              </div>
              <div className="details-section">
                <div className="details-meta-label">DESCRIPTION</div>
                <div className="details-meta-value">Custom Aso-Oke Agbada with intricate embroidery for a traditional wedding ceremony</div>
              </div>
              <div className="details-section">
                <div className="details-meta-label">NOTES</div>
                <div className="details-meta-value">Client prefers gold thread embroidery</div>
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
                {[
                  { label: 'Chest', value: '35' },
                  { label: 'Waist', value: '33' },
                  { label: 'Hip', value: '30' },
                  { label: 'Chest', value: '18' },
                  { label: 'Waist', value: '25' },
                  { label: 'Hip', value: '30' },
                ].map((m, i) => (
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
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=300&fit=crop"
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