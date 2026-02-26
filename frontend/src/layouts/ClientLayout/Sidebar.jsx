import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Icon from "../../components/Icon.jsx";
import './Sidebar.css';

const navItems = [
  { label: 'Dashboard', id: 'dashboard', icon: 'dashboard', path: '/client/dashboard' },
  { label: 'My Orders', id: 'orders', icon: 'orders', path: '/client/orders' },
  { label: 'Message', id: 'messages', icon: 'search', path: '/client/messages' }, // Using search as placeholder or add 'mail' to icons
  { label: 'Notifications', id: 'notifications', icon: 'bell', path: '/client/notifications' },
  { label: 'Profile', id: 'profile', icon: 'userFill', path: '/client/profile' },
];

export default function Sidebar({ activePage, onNavigate, mobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobileOpen" : ""}`}>
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#6C63FF"/>
            <path d="M10 22 L16 8 L22 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.5 17.5 H19.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        {!collapsed && <span className="sidebar__logo-text">Fashion Link</span>}
        <button className="sidebar__collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <Icon name={collapsed ? "menu" : "close"} />
        </button>
      </div>

      <div className="sidebar__divider" />

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar__nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => onNavigate?.(item.id)}
          >
            <Icon name={item.icon} className="sidebar__nav-icon" />
            {!collapsed && <span className="sidebar__nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar__user">
        <div className="sidebar__avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt="User" />
          ) : (
            <span>{user?.name?.charAt(0).toUpperCase() || "C"}</span>
          )}
        </div>
        {!collapsed && (
          <div className="sidebar__user-info">
            <p className="sidebar__user-name">{user?.name || "Client"}</p>
            <p className="sidebar__user-role">Client</p>
          </div>
        )}
        <button className="sidebar__logout-btn" onClick={handleLogout}>
          <Icon name="logout" />
        </button>
      </div>
    </aside>
  );
}