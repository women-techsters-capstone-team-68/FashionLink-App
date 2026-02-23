import React, { useState, useEffect } from 'react';
import FLCard from '../../../components/FLCard/FLCard';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="h1">Dashboard</h1>
      <div className="stats">
        <div className="stat-card"><h3>Active</h3><p>12</p></div>
        <div className="stat-card"><h3>Due</h3><p>3</p></div>
      </div>
      <h2 className="h2">Recent Orders</h2>
      <FLCard>
        <div className="order-item">
          <div><strong>Eduaina Ighalo</strong><p>Evening Gown</p></div>
          <span className="tag">In Progress</span>
        </div>
      </FLCard>
    </div>
  );
};
export default Dashboard;