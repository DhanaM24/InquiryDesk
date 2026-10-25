import React from 'react';
import { useAuth } from '../AuthContext';

export default function TopHeader({ onToggleMobileSidebar, selectedInquiryId, onBackHome, activeFilterLabel = 'All Inquiries' }) {
  const { user } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          className="mobile-menu-trigger"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div className="header-breadcrumbs">
          <button onClick={onBackHome} className="breadcrumb-link">
            Inquiries
          </button>
          <span className="breadcrumb-separator">/</span>
          {selectedInquiryId ? (
            <span className="breadcrumb-current">Inquiry Details</span>
          ) : (
            <span className="breadcrumb-current">{activeFilterLabel}</span>
          )}
        </div>
      </div>

      <div className="header-right">
        <div className="header-badge">
          <span className="live-indicator"></span>
          <span>Workspace Connected</span>
        </div>
      </div>
    </header>
  );
}
