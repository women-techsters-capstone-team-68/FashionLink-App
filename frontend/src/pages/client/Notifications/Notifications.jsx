import { useState } from 'react';
import './Notifications.css';

export default function ClientNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Order Update',
      message: 'ORD-001 will be available for pickup on 25 february, 2025',
      time: '2d ago',
      read: false,
    },
  ]);

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="page-wrapper">

      <div className="notif-content">
        <div className="notif-header-row">
          <span className="notif-unread-label">{unreadCount} unread</span>
          <button className="mark-all-btn" onClick={markAllRead}>✓ Mark all as read</button>
        </div>

        <div className="notif-list">
          {notifications.map((notif) => (
            <div key={notif.id} className={`notif-item ${notif.read ? 'read' : ''}`}>
              <div className="notif-item-icon">ℹ️</div>
              <div className="notif-item-body">
                <div className="notif-item-title">{notif.title}</div>
                <div className="notif-item-message">{notif.message}</div>
                {!notif.read && (
                  <button className="mark-read-btn" onClick={() => markRead(notif.id)}>
                    ✓ Mark as read
                  </button>
                )}
              </div>
              <div className="notif-item-right">
                <div className="notif-item-time">{notif.time}</div>
                {!notif.read && <div className="notif-dot" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}