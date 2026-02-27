/**
 * Notifications.jsx  —  route: /artisan/notifications
 * List of notifications with unread dots, "Mark as read" per row,
 * "Mark all as read" header action.
 * Unread count syncs back to Header via context/state.
 */
import { useState } from "react";
import "./Notifications.css";

/* ── Icon helpers ────────────────────────────────────────────── */
const IconAlert = ({ color = "#ef4444" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconClock = ({ color = "#f59e0b" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconStar = ({ color = "#6C63FF" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ICON_MAP = {
  alert:  <IconAlert />,
  clock:  <IconClock />,
  ai:     <IconStar />,
  check:  <IconAlert color="#6C63FF" />,
};

/* ── Mock notifications ──────────────────────────────────────── */
const INITIAL_NOTIFS = [
  {
    id: "n1",
    icon: "alert",
    title: "Order Delayed",
    tag: null,
    body: "ORD-003 for Fatimah Audu has been marked as delayed due to fabric unavailability",
    time: "2d ago",
    read: false,
  },
  {
    id: "n2",
    icon: "clock",
    title: "Deadline Approaching",
    tag: null,
    body: "ORD-002 for David Mensah is due in 4 days. Current status: Assigned",
    time: "2d ago",
    read: false,
  },
  {
    id: "n3",
    icon: "ai",
    title: "AI Orders",
    tag: "AI",
    body: "You have 3 orders due this week. Consider prioritizing ORD-OO3 which is currently delayed.",
    time: "3d ago",
    read: false,
  },
  {
    id: "n4",
    icon: "check",
    title: "Order Complete",
    tag: null,
    body: "ORD-005 for Kwame Asante has been marked as complete",
    time: "2d ago",
    read: true,
  },
  {
    id: "n5",
    icon: "ai",
    title: "AI Measurement Alert",
    tag: "AI",
    body: "Sleeve measurement for ORD-007 appears unusually short relative to shoulder width. please verify.",
    time: "3d ago",
    read: true,
  },
  {
    id: "n6",
    icon: "clock",
    title: "Deadline Reminder",
    tag: null,
    body: "ORD-001 for Amara Okokwo is due in 7days",
    time: "2d ago",
    read: true,
  },
];

/* ── Single notification row ─────────────────────────────────── */
function NotifRow({ notif, onMarkRead }) {
  return (
    <div className={`nf-row ${notif.read ? "nf-row--read" : ""}`}>
      {/* Left icon */}
      <div className="nf-row__icon">{ICON_MAP[notif.icon]}</div>

      {/* Content */}
      <div className="nf-row__content">
        <div className="nf-row__top">
          <span className="nf-row__title">{notif.title}</span>
          {notif.tag && (
            <span className="nf-row__tag">{notif.tag}</span>
          )}
        </div>
        <p className="nf-row__body">{notif.body}</p>
        {!notif.read && (
          <button
            className="nf-row__mark-read"
            type="button"
            onClick={() => onMarkRead(notif.id)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Mark as read
          </button>
        )}
      </div>

      {/* Right: time + unread dot */}
      <div className="nf-row__right">
        <span className="nf-row__time">{notif.time}</span>
        {!notif.read && <span className="nf-row__dot" />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function Notifications() {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);

  const unread = notifs.filter((n) => !n.read).length;

  const markRead = (id) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="nf">

      {/* ── Toolbar bar ────────────────────────────────────────── */}
      <div className="nf__bar">
        <span className="nf__unread-label">
          {unread > 0 ? `${unread} unread` : "All caught up"}
        </span>
        {unread > 0 && (
          <button className="nf__mark-all" type="button" onClick={markAllRead}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
              <polyline points="17 6 6 17 1 12" opacity="0.4"/>
            </svg>
            Mark all as read
          </button>
        )}
      </div>

      {/* ── Notification list ──────────────────────────────────── */}
      <div className="nf__list">
        {notifs.map((n) => (
          <NotifRow key={n.id} notif={n} onMarkRead={markRead} />
        ))}
      </div>

    </div>
  );
}
