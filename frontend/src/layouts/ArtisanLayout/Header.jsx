import { useState } from "react";
import Icon from "../../components/Icon.jsx";
import { currentUser } from "../../data/mockData.js";
import "./Header.css";

export default function Header({ title, subtitle, onMenuToggle }) {
  const [query, setQuery] = useState("");

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuToggle} aria-label="Open menu">
          <Icon name="menu" />
        </button>
        <div>
          <h1 className="header__title">{title}</h1>
          {subtitle && <p className="header__subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header__right">
        <div className="header__search-wrap">
          <Icon name="search" className="header__search-icon" />
          <input
            className="header__search-input"
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
        </div>

        <button className="header__notif-btn" aria-label="Notifications">
          <Icon name="bell" />
          <span className="header__badge">2</span>
        </button>

        <div className="header__avatar">
          {currentUser.avatar
            ? <img src={currentUser.avatar} alt={currentUser.name} />
            : <span>{currentUser.name.charAt(0)}</span>
          }
        </div>
      </div>
    </header>
  );
}
