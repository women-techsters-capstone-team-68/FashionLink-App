/**
 * NotificationContext.jsx
 *
 * Fixes:
 *  - unreadCount is derived live from notifs array (not cached)
 *  - markRead / markAllRead update state + sessionStorage atomically
 *  - Header badge reflects count immediately after either action
 *  - Per-user key so two users on the same browser don't share notifs
 */
import { createContext, useContext, useState } from "react";

const NotificationContext = createContext(null);

const SEED_NOTIFS = [
  {
    id: "n1", icon: "alert", title: "Order Delayed", tag: null,
    body: "ORD-003 for Fatimah Audu has been marked as delayed due to fabric unavailability.",
    time: "2d ago", read: false,
  },
  {
    id: "n2", icon: "clock", title: "Deadline Approaching", tag: null,
    body: "ORD-002 for David Mensah is due in 4 days. Current status: Assigned.",
    time: "2d ago", read: false,
  },
  {
    id: "n3", icon: "ai", title: "AI Orders", tag: "AI",
    body: "You have 3 orders due this week. Consider prioritizing ORD-003 which is currently delayed.",
    time: "3d ago", read: false,
  },
  {
    id: "n4", icon: "check", title: "Order Complete", tag: null,
    body: "ORD-005 for Kwame Asante has been marked as complete.",
    time: "2d ago", read: true,
  },
  {
    id: "n5", icon: "ai", title: "AI Measurement Alert", tag: "AI",
    body: "Sleeve measurement for ORD-007 appears unusually short relative to shoulder width. Please verify.",
    time: "3d ago", read: true,
  },
  {
    id: "n6", icon: "clock", title: "Deadline Reminder", tag: null,
    body: "ORD-001 for Amara Okonkwo is due in 7 days.",
    time: "2d ago", read: true,
  },
];

/* Per-user storage key so two accounts don't share notification state */
function storageKey(userId) {
  return `fl:${userId ?? "guest"}:notifs`;
}

function loadNotifs(userId) {
  try {
    const raw = sessionStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : SEED_NOTIFS;
  } catch { return SEED_NOTIFS; }
}

function persist(userId, notifs) {
  try { sessionStorage.setItem(storageKey(userId), JSON.stringify(notifs)); } catch {}
}

export function NotificationProvider({ children }) {
  /* userId prop is provided by App — keeps context self-contained */
  const [userId, setUserId] = useState(null);
  const [notifs, setNotifsRaw] = useState(SEED_NOTIFS);

  /* Called by App after login so notifications reload for the right user */
  const initForUser = (uid) => {
    setUserId(uid);
    setNotifsRaw(loadNotifs(uid));
  };

  /* Always write-through to sessionStorage */
  const setNotifs = (updater) => {
    setNotifsRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persist(userId, next);
      return next;
    });
  };

  /* Derived count — never stale */
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markRead = (id) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <NotificationContext.Provider
      value={{ notifs, unreadCount, markRead, markAllRead, initForUser }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be inside <NotificationProvider>");
  return ctx;
}
