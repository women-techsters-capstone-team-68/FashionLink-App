import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth }  from "../../context/AuthContext.jsx";
import Sidebar from "./Sidebar.jsx"; 
import Topbar from "./Topbar.jsx";   
import "./ClientLayout.css"; // imported Artisan CSS inside this file

const PATH_TO_PAGE = {
  "/client/dashboard":     "dashboard",
  "/client/orders":        "orders",
  "/client/messages":      "messages",
  "/client/notifications": "notifications",
  "/client/profile":       "profile",
};

const PAGE_TO_PATH = {
  dashboard:     "/client/dashboard",
  orders:        "/client/orders",
  messages:      "/client/messages",
  notifications: "/client/notifications",
  profile:       "/client/profile",
};

export default function ClientLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user }  = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const firstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "there";

  const PAGE_META = {
  "/client/dashboard":     { title: "Dashboard",     subtitle: `Hello ${firstName}, Let's help track your tailoring requests` },
  "/client/orders":        { title: "My Orders",     subtitle: "View your order history" },
  "/client/messages":      { title: "Messages",      subtitle: "Chat with your artisans" },
  "/client/notifications": { title: "Notifications", subtitle: "Stay updated" },
  "/client/profile":       { title: "My Profile",    subtitle: "Manage your measurements" },
};

  const activePage = PATH_TO_PAGE[location.pathname] ?? "dashboard";
  const meta = PAGE_META[location.pathname] ?? PAGE_META["/client/dashboard"];

  const handleNavigate = (pageId) => {
    const path = PAGE_TO_PATH[pageId];
    if (path) navigate(path);
    setSidebarOpen(false); // Close sidebar on mobile after clicking
  };

  return (
    <div className="al"> 
      {/* The overlay appears on mobile to dim the background */}
      {sidebarOpen && (
        <div className="al__overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        mobileOpen={sidebarOpen} 
      />

      <div className="al__right">
        <Topbar 
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