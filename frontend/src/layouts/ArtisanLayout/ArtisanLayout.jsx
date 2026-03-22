import { useState }                from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth }  from "../../context/AuthContext.jsx";
import { useData }  from "../../context/DataContext.jsx";
import Sidebar from "./Sidebar.jsx";
import Header  from "./Header.jsx";
import "./ArtisanLayout.css";

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

const PAGE_TO_PATH = {
  dashboard:     "/artisan/dashboard",
  orders:        "/artisan/orders",
  clients:       "/artisan/clients",
  network:       "/artisan/network",
  notifications: "/artisan/notifications",
  settings:      "/artisan/settings",
};

export default function ArtisanLayout({ children }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const { orders, clients } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const firstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "there";

  // Dynamic subtitles — computed from live data
  const activeOrders = orders.filter((o) => !["Completed", "Cancelled"].includes(o.status)).length;
  const clientCount  = clients.length;

  const PAGE_META = {
    "/artisan/dashboard":     { title: "Dashboard",      subtitle: `Hello ${firstName}, welcome to FashionLink` },
    "/artisan/orders":        { title: "Orders",         subtitle: `${activeOrders} active order${activeOrders !== 1 ? "s" : ""}` },
    "/artisan/add-order":     { title: "New Order",      subtitle: "Create a new client order" },
    "/artisan/clients":       { title: "Clients",        subtitle: `${clientCount} client${clientCount !== 1 ? "s" : ""}` },
    "/artisan/clients/add":   { title: "Clients",        subtitle: `${clientCount} client${clientCount !== 1 ? "s" : ""}` },
    "/artisan/network":       { title: "Artisan Network", subtitle: "Discover skilled artisans to collaborate on your designs." },
    "/artisan/coming-soon":   { title: "Artisan Network", subtitle: "Discover skilled artisans to collaborate on your designs." },
    "/artisan/notifications": { title: "Notifications",  subtitle: "Stay up to date" },
    "/artisan/settings":      { title: "Settings",       subtitle: "Manage your account and preferences" },
  };

  const pathBase       = "/" + location.pathname.split("/").slice(1, 3).join("/");
  const activePage     = PATH_TO_PAGE[location.pathname] ?? PATH_TO_PAGE[pathBase] ?? "dashboard";
  const resolvedActive =
    location.pathname.startsWith("/artisan/clients") ? "clients"
    : location.pathname.startsWith("/artisan/network") || location.pathname === "/artisan/coming-soon" ? "network"
    : activePage;
  const meta = PAGE_META[location.pathname] ?? PAGE_META[pathBase] ?? PAGE_META["/artisan/dashboard"];

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

      <Sidebar activePage={resolvedActive} onNavigate={handleNavigate} mobileOpen={sidebarOpen} />

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
