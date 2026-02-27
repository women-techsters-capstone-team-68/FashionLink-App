import './Messages.css';

export default function Messages() {
  return (
    <div className="page-wrapper">
      <div className="messages-content">
        <div className="messages-section-title">Messages</div>
        <div className="messages-empty-card">
          <div className="messages-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b5ce7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <div className="messages-empty-title">No Messages Yet</div>
          <div className="messages-empty-sub">Your conversations with artisans will appear here</div>
        </div>
      </div>
    </div>
  );
}