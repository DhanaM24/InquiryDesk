import React from 'react';
import { useAuth } from '../AuthContext';

export default function Sidebar({
  activeFilter,
  onSelectFilter,
  onOpenCreate,
  onGoHome,
  counts = { total: 0, new: 0, in_progress: 0, resolved: 0 },
  isMobileOpen,
  onCloseMobile,
}) {
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

  const navItems = [
    { id: 'all', label: 'All Inquiries', icon: '📋', count: counts.total },
    { id: 'new', label: 'New', icon: '🔵', count: counts.new, badgeClass: 'badge-new' },
    { id: 'in_progress', label: 'In Progress', icon: '🟠', count: counts.in_progress, badgeClass: 'badge-progress' },
    { id: 'resolved', label: 'Resolved', icon: '🟢', count: counts.resolved, badgeClass: 'badge-resolved' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`app-sidebar ${isMobileOpen ? 'sidebar-open' : ''}`}>
        {/* Top: Brand Header */}
        <div className="sidebar-brand-wrapper">
          <button onClick={onGoHome} className="sidebar-brand" title="InquiryDesk Home">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#2563eb">
              <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
            </svg>
            <span className="sidebar-brand-name">InquiryDesk</span>
          </button>
          {isMobileOpen && (
            <button className="sidebar-close-btn" onClick={onCloseMobile}>
              ×
            </button>
          )}
        </div>

        {/* Action Button */}
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <button
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              gap: '0.5rem',
            }}
            onClick={() => {
              onOpenCreate();
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span> Log New Inquiry
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="sidebar-nav-container">
          <div className="sidebar-section-title">INQUIRY WORKSPACE</div>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const isActive = activeFilter === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectFilter(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '0.85rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`sidebar-count-badge ${item.badgeClass || ''}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="sidebar-section-title" style={{ marginTop: '1.75rem' }}>
            QUICK VIEWS
          </div>
          <nav className="sidebar-nav">
            <button
              onClick={() => {
                onSelectFilter('all');
                if (onCloseMobile) onCloseMobile();
              }}
              className="sidebar-nav-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span>⚡</span>
                <span>Active Queue</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom: User Profile Card */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="sidebar-avatar">
              {getInitials(user?.name || user?.email)}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || user?.email}</div>
              <div className="sidebar-user-role">
                <span className={`role-tag ${user?.role}`}>{user?.role}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="sidebar-logout-btn"
              title="Sign Out"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
