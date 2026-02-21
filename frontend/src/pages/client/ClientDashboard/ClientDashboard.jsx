import React from 'react';
import './ClientDashboard.css';

const ClientDashboard = () => {
  return (
    <div className="client-dashboard">
      <header className="client-header">
        <h1>My Designs</h1>
        <p>Welcome back, Eduaina</p>
      </header>

      <div className="order-summary-card">
        <h3>Active Orders</h3>
        <div className="order-status-row">
          <div className="status-item">
            <span className="count">1</span>
            <span className="label">In Progress</span>
          </div>
          <div className="status-item">
            <span className="count">0</span>
            <span className="label">Ready</span>
          </div>
        </div>
      </div>

      <section className="recent-activity">
        <h4>Recent Updates</h4>
        <div className="activity-item">
          <p><strong>Evening Gown</strong> is now in "Cutting" stage.</p>
          <span>2 hours ago</span>
        </div>
      </section>
    </div>
  );
};

// THIS IS THE LINE YOU ARE MISSING
export default ClientDashboard;