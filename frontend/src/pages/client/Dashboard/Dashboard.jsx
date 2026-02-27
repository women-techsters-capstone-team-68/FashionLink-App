import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const artisans = [
  {
    id: 1,
    name: 'Maria Adeife',
    specialty: 'Aso-oke Weaver',
    badge: 'In-Weave',
    badgeColor: 'purple',
    skills: ['Hand-weave Aso-Oke fabric', 'Produce intricate patterns and colors'],
    location: 'Lagos, Nigeria',
    rating: 4.9,
    experience: '10 years Experience',
    bio: 'I specialize in creating high-quality, hand woven ceremonial fabrics with strong cultural meaning and detailed craftsmanship.',
    avatar: 'MA',
    avatarColor: '#c97b4b',
  },
  {
    id: 2,
    name: 'Alice Andrew',
    specialty: 'Corsetry Specialist',
    badge: 'Structural Build',
    badgeColor: 'teal',
    skills: ['Waist training and body contouring pieces', 'Boning and structural support techniques'],
    location: 'Lagos, Nigeria',
    rating: 4.5,
    experience: '8 years Experience',
    bio: 'A corsetry specialist focuses on structured garments that shape and support the body.',
    avatar: 'AA',
    avatarColor: '#6b5ce7',
  },
];

const allOrders = [
  {
    id: 'ORD-001',
    badge: 'In Progress',
    badgeClass: 'inprogress',
    description: 'Custom Aso-Oke Agbada with intricate embroidery for a traditional wedding ceremony',
    dueDate: 'Feb 25, 2026',
  },
  {
    id: 'ORD-008',
    badge: 'Assigned',
    badgeClass: 'assigned',
    description: 'Casual Linen Shirt in off white',
    dueDate: 'Feb 28, 2026',
  },
];

export default function ClientDashboard() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">

      <div className="dashboard-content">

        {/* SEARCH BAR */}
        <div className="dashboard-search-wrap">
          <span className="dashboard-search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            className="dashboard-search-input"
            placeholder="Search for tailors, fashion illustrator, shoemakers"
          />
        </div>

        {/* TOP RATED ARTISANS */}
        <div className="dashboard-section-header">
          <div className="dashboard-section-title">Top Rated Artisans</div>
          <button className="see-all-btn">See all →</button>
        </div>

        <div className="artisans-grid">
          {artisans.map((artisan) => (
            <div key={artisan.id} className="artisan-card">
              <div className="artisan-card-top">
                <div className="artisan-info-row">
                  <div className="artisan-avatar" style={{ background: artisan.avatarColor }}>
                    {artisan.avatar}
                  </div>
                  <div className="artisan-name-col">
                    <div className="artisan-name">{artisan.name}</div>
                    <div className="artisan-specialty">{artisan.specialty}</div>
                  </div>
                  <span className={`artisan-badge ${artisan.badgeColor}`}>{artisan.badge}</span>
                </div>

                <div className="artisan-skills-row">
                  {artisan.skills.map((skill, i) => (
                    <div key={i} className="artisan-skill">{skill}</div>
                  ))}
                </div>

                <div className="artisan-meta-row">
                  <span className="artisan-location">📍 {artisan.location}</span>
                  <span className="artisan-rating">⭐ {artisan.rating}</span>
                </div>

                <div className="artisan-experience">{artisan.experience}</div>
                <div className="artisan-bio">{artisan.bio}</div>
              </div>

              <div className="artisan-card-actions">
                <button className="view-profile-btn">View Profile</button>
                <button className="message-artisan-btn" onClick={() => navigate('/messages')}>Message</button>
              </div>
            </div>
          ))}
        </div>

        {/* ALL ORDERS */}
        <div className="dashboard-section-header">
          <div className="dashboard-section-title">All Orders</div>
          <button className="see-all-btn" onClick={() => navigate('/orders')}>View all →</button>
        </div>

        <div className="dashboard-card">
          <div className="all-orders-list">
            {allOrders.map((order) => (
              <div
                key={order.id}
                className="all-order-item"
                onClick={() => navigate('/orders')}
              >
                <div className="all-order-left">
                  <div className="all-order-id-row">
                    <span className="order-id-text">{order.id}</span>
                    <span className={`badge ${order.badgeClass}`}>● {order.badge}</span>
                  </div>
                  <div className="all-order-desc">{order.description}</div>
                  <div className="all-order-date">📅 Due {order.dueDate}</div>
                </div>
                <span className="all-order-arrow">→</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}