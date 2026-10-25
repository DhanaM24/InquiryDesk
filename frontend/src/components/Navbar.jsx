import React from 'react';
import { useAuth } from '../AuthContext';

export default function Navbar({ onOpenCreate, onGoHome }) {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          onClick={onGoHome}
          className="brand"
          title="InquiryDesk Dashboard"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#2563eb">
            <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
          </svg>
          <span className="brand-title">InquiryDesk</span>
        </button>

        {user && (
          <div className="user-nav-group">
            <button className="btn btn-primary" onClick={onOpenCreate}>
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span> Log New Inquiry
            </button>

            <div className="user-pill">
              <div className="user-avatar">{getInitials(user.name || user.email)}</div>
              <div className="user-details">
                <span className="user-name">{user.name || user.email}</span>
                <span className={`role-tag ${user.role}`}>{user.role}</span>
              </div>
            </div>

            <button className="btn btn-outline" onClick={logout} title="Sign out of your session">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
