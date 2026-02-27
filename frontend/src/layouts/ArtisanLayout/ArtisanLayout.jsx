import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header  from "./Header.jsx";
import "./ArtisanLayout.css";

/* Map route path → page id used by Sidebar */
const PATH_TO_PAGE = {
  "/artisan/dashboard":      "dashboard",
  "/artisan/orders":         "orders",
  "/artisan/add-order":      "orders",
  "/artisan/clients":        "clients",
  "/artisan/clients/add":    "clients",
  "/artisan/network":        "network",
  "/artisan/network/:id":    "network",
  "/artisan/coming-soon":    "network",
  "/artisan/notifications":  "notifications",
  "/artisan/settings":       "settings",
};

/* Map sidebar link id → route path */
const PAGE_TO_PATH = {
  dashboard:     "/artisan/dashboard",
  orders:        "/artisan/orders",
  clients:       "/artisan/clients",
  network:       "/artisan/network",
  notifications: "/artisan/notifications",
  settings:      "/artisan/settings",
};

/* Page meta: title + subtitle per route */
const PAGE_META = {
  "/artisan/dashboard":   { title: "Dashboard",      subtitle: "Welcome back, Grace"        },
  "/artisan/orders":      { title: "Orders",         subtitle: "Manage your client orders"  },
  "/artisan/add-order":   { title: "New Order",      subtitle: "Create a new client order"  },
  "/artisan/clients":     { title: "Clients",        subtitle: "6 clients"                  },
  "/artisan/clients/add": { title: "Clients",        subtitle: "6 clients"                  },
  "/artisan/network":     { title: "Artisan Network", subtitle: "Discover skilled artisans to collaborate on your designs." },
  "/artisan/coming-soon": { title: "Artisan Network", subtitle: "Discover skilled artisans to collaborate on your designs." },
  "/artisan/notifications": { title: "Notifications", subtitle: "3 unread notifications" },
  "/artisan/settings":      { title: "Settings",      subtitle: "Manage your account and preferences" },
};

export default function ArtisanLayout({ children }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Derive sidebar active item and header meta from current path */
  const pathBase    = "/" + location.pathname.split("/").slice(1, 3).join("/");
  const activePage  = PATH_TO_PAGE[location.pathname] ?? PATH_TO_PAGE[pathBase] ?? "dashboard";
  const resolvedActive =
    location.pathname.startsWith("/artisan/clients") ? "clients"
    : location.pathname.startsWith("/artisan/network") || location.pathname === "/artisan/coming-soon" ? "network"
    : activePage;
  const meta        = PAGE_META[location.pathname] ?? PAGE_META[pathBase] ?? PAGE_META["/artisan/dashboard"];

  const handleNavigate = (pageId) => {
    const path = PAGE_TO_PATH[pageId];
    if (path) navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="al">
      {sidebarOpen && (
        <div className="al__overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      <Sidebar
        activePage={resolvedActive}
        onNavigate={handleNavigate}
        mobileOpen={sidebarOpen}
      />

      <div className="al__right">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="al__content">
          {children}
        </main>
      </div>
    </div>
  );
}
