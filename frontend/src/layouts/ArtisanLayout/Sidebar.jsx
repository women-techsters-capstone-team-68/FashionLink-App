import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Icon from "../../components/Icon.jsx";
import { navLinks } from "../../data/mockData.js";
import "./Sidebar.css";

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
        <button className="sidebar__collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          <Icon name={collapsed ? "menu" : "close"} />
        </button>
      </div>

      <div className="sidebar__divider" />

      <nav className="sidebar__nav">
        {navLinks.map((link) => (
          <button
            key={link.id}
            className={`sidebar__nav-item ${activePage === link.id ? "active" : ""}`}
            onClick={() => onNavigate?.(link.id)}
            aria-current={activePage === link.id ? "page" : undefined}
          >
            <Icon name={link.icon} className="sidebar__nav-icon" />
            {!collapsed && <span className="sidebar__nav-label">{link.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar__user">
        <div className="sidebar__avatar">
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} />
            : <span>{user?.name?.charAt(0) ?? "?"}</span>
          }
        </div>
        {!collapsed && (
          <div className="sidebar__user-info">
            <p className="sidebar__user-name">{user?.name ?? "User"}</p>
            <p className="sidebar__user-role" style={{ textTransform: "capitalize" }}>{user?.role ?? ""}</p>
          </div>
        )}
        <button className="sidebar__logout-btn" onClick={handleLogout} aria-label="Log out">
          <Icon name="logout" />
        </button>
      </div>
    </aside>
  );
}
