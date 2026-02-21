import React from 'react';
import './Clients.css';

const Clients = () => {
  const clients = [
    { id: 1, name: 'Eduaina Ighalo', orders: 4 },
    { id: 2, name: 'John Smith', orders: 1 },
  ];

  return (
    <div className="clients-page">
      <div className="header-row">
        <h1>Clients</h1>
        <button className="add-btn">+</button>
      </div>
      <div className="client-list">
        {clients.map(c => (
          <div key={c.id} className="client-card">
            <div className="avatar">{c.name[0]}</div>
            <div className="info">
              <strong>{c.name}</strong>
              <p>{c.orders} active orders</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Clients;