import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Users, Settings } from 'lucide-react';
import './ArtisanLayout.css';

const ArtisanLayout = () => {
  const location = useLocation();
  const menu = [
    { path: '/artisan/dashboard', icon: <LayoutDashboard />, label: 'Home' },
    { path: '/artisan/orders', icon: <ClipboardList />, label: 'Orders' },
    { path: '/artisan/clients', icon: <Users />, label: 'Clients' },
    { path: '/artisan/settings', icon: <Settings />, label: 'Settings' },
  ];

  return (
    <div className="layout-container">
      <main className="content"><Outlet /></main>
      <nav className="bottom-nav">
        {menu.map(item => (
          <Link key={item.path} to={item.path} className={location.pathname === item.path ? 'active' : ''}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
export default ArtisanLayout;