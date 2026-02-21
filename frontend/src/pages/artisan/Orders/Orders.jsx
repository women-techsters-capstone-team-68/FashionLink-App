import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import FLCard from '../../../components/FLCard/FLCard';
import './Orders.css';

const Orders = () => {
  const orders = [
    { id: '1', client: 'Eduaina Ighalo', item: 'Agbada Set', date: 'Oct 24' },
    { id: '2', client: 'Sarah Kone', item: 'Summer Dress', date: 'Oct 28' }
  ];

  return (
    <div className="orders-page">
      <div className="search-bar">
        <Search size={18} />
        <input placeholder="Search orders..." />
        <Filter size={18} />
      </div>
      
      <div className="list-container">
        {orders.map(order => (
          <Link key={order.id} to={`/artisan/orders/${order.id}`} style={{textDecoration: 'none'}}>
            <FLCard>
              <div className="order-row">
                <div className="info">
                  <strong>{order.item}</strong>
                  <p>{order.client}</p>
                </div>
                <div className="meta">
                  <span>{order.date}</span>
                </div>
              </div>
            </FLCard>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Orders;