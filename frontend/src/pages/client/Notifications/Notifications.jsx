import { useState } from "react";
import "./Notifications.css";

const SEED = [
  { id: "cn1", icon: "📦", title: "Order Update", body: "Your order ORD-001 is now In Progress.", time: "2h ago", read: false },
  { id: "cn2", icon: "📅", title: "Delivery Reminder", body: "ORD-006 is due in 6 days. Contact your artisan if needed.", time: "1d ago", read: false },
  { id: "cn3", icon: "✅", title: "Order Completed", body: "ORD-005 has been marked as complete and is ready!", time: "3d ago", read: true },
];

export default function ClientNotifications() {
  const [notifs, setNotifs] = useState(SEED);
  const unread = notifs.filter((n) => !n.read).length;

  const markRead  = (id) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAll   = ()   => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="cn">
      <div className="cn__bar">
        <span className="cn__label">{unread > 0 ? `${unread} unread` : "All caught up"}</span>
        {unread > 0 && <button className="cn__mark-all" onClick={markAll}>Mark all as read</button>}
      </div>
      <div className="cn__list">
        {notifs.map((n) => (
          <div key={n.id} className={`cn__row ${n.read ? "cn__row--read" : ""}`}>
            <div className="cn__row-icon">{n.icon}</div>
            <div className="cn__row-content">
              <p className="cn__row-title">{n.title}</p>
              <p className="cn__row-body">{n.body}</p>
              {!n.read && <button className="cn__mark-read" onClick={() => markRead(n.id)}>✓ Mark as read</button>}
            </div>
            <div className="cn__row-right">
              <span className="cn__row-time">{n.time}</span>
              {!n.read && <span className="cn__row-dot" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
