import React from 'react';
import { Search } from 'lucide-react';
import './ClientTracking.css';

const ClientTracking = () => {
  return (
    <div className="tracking-container">
      <header className="track-header">
        <h1>Track Order</h1>
        <p>Enter your order ID provided by your designer</p>
      </header>
      
      <div className="track-box">
        <input type="text" placeholder="e.g. FL-8829" className="track-input" />
        <button className="track-btn">Check Status</button>
      </div>

      <div className="recent-check">
        <h3>Looking for your measurements?</h3>
        <button className="secondary-link">Log in to your portal</button>
      </div>
    </div>
  );
};
export default ClientTracking;