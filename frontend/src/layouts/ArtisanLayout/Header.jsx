import { useState }               from "react";
import { useNavigate }             from "react-router-dom";
import { useAuth }                 from "../../context/AuthContext.jsx";
import Icon                        from "../../components/Icon.jsx";
import "./Header.css";
// import { PAGE_META } from "./ArtisanLayout.jsx";

export default function Header({ title, subtitle, onMenuToggle, unreadCount = 3 }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user }  = useAuth();

  /* Avatar: use uploaded URL if available, else first letter of firstName */
  const avatarSrc    = user?.avatar ?? null;
  const avatarLetter = (user?.firstName ?? user?.fullName ?? "?").charAt(0).toUpperCase();

  /* function to enable the function that displays the first name under dashboard*/
  /*const pathname = window.location.pathname;
  const currentPage = PAGE_META[pathname] || PAGE_META["/artisan/dashboard"];

  if (!currentPage) return null;*/

  // Resolve the subtitle logic
  // If it's a function, call it with 'user'. Otherwise, use it as a string.
  /*const displaySubtitle = typeof currentPage.subtitle === "function"
    ? currentPage.subtitle(user) : currentPage.subtitle;*/

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
        {/* Remove the headder search icon because it wasnt cordinated at all */}
        {/* <div className="header__search-wrap">
          <Icon name="search" className="header__search-icon" />
          <input
            className="header__search-input"
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Global search"
          />
        </div> */}

        {/* Notification bell — linked */}
        <button
          className="header__notif-btn"
          aria-label="Notifications"
          onClick={() => navigate("/artisan/notifications")}
        >
          <Icon name="bell" />
          {unreadCount > 0 && (
            <span className="header__badge">{unreadCount}</span>
          )}
        </button>

        {/* Avatar — links to settings */}
        <button
          className="header__avatar"
          aria-label="Open settings"
          onClick={() => navigate("/artisan/settings")}
          type="button"
        >
          {avatarSrc
            ? <img src={avatarSrc} alt={user?.fullName ?? user?.firstName ?? "User"} className="header__avatar-img" />
            : <span>{avatarLetter}</span>
          }
        </button>
      </div>
    </header>
  );
}
