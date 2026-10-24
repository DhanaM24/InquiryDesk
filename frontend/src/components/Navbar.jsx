import React from 'react';
import { useAuth } from '../AuthContext';

export default function Navbar({ onOpenCreate, onGoHome }) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          onClick={onGoHome}
          className="brand"
          style={{ cursor: 'pointer' }}
          title="InquiryDesk Home"
        >
          <span className="brand-badge">ID</span>
          <span>InquiryDesk</span>
        </button>

        {user && (
          <div className="user-profile">
            <button className="btn btn-primary" onClick={onOpenCreate}>
              + New Inquiry
            </button>

            <div className="user-tag">
              <span className="user-name">{user.name || user.email}</span>
              <span className={`role-badge ${user.role}`}>{user.role}</span>
            </div>

            <button className="btn btn-outline" onClick={logout}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
