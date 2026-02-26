import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from "../../components/Icon.jsx";
import './Topbar.css';

export default function Topbar({ title, subtitle, onMenuToggle }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuToggle} aria-label="Open menu">
          <Icon name="menu" />
        </button>
        <div className="header__title-wrap">
          <h1 className="header__title">{title}</h1>
          {subtitle && <p className="header__subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header__right">
        <div className="header__search-wrap">
          <Icon name="search" className="header__search-icon" />
          <input className="header__search-input" type="text" placeholder="Search..." />
        </div>

        <button className="header__notif-btn" onClick={() => navigate('/client/notifications')}>
          <Icon name="bell" />
          <span className="header__badge">2</span>
        </button>

        <button className="header__avatar" onClick={() => navigate('/client/profile')}>
          {user?.avatar ? (
            <img src={user.avatar} alt="User" className="header__avatar-img" />
          ) : (
            <span>{user?.name?.charAt(0).toUpperCase() || "C"}</span>
          )}
        </button>
      </div>
    </header>
  );
}