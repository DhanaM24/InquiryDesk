import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import StatusBadge from './StatusBadge';

export default function InquiryListPage({
  onSelectInquiry,
  onOpenCreate,
  statusFilter = 'all',
  onFilterChange,
  onCountsChange,
}) {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Overview stats counts
  const [stats, setStats] = useState({ total: 0, new: 0, in_progress: 0, resolved: 0 });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const loadInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.listInquiries({
        status: statusFilter,
        q: debouncedSearch,
        page,
      });
      setInquiries(data.items);
      setTotal(data.total);

      // Compute status breakdown from fetched list or all
      if (statusFilter === 'all' && !debouncedSearch) {
        const counts = { total: data.total, new: 0, in_progress: 0, resolved: 0 };
        data.items.forEach((item) => {
          if (counts[item.status] !== undefined) counts[item.status]++;
        });
        setStats(counts);
        if (onCountsChange) onCountsChange(counts);
      }
    } catch (err) {
      setError(err.message || 'Failed to load inquiries. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [statusFilter, debouncedSearch, page]);

  const handleTabChange = (newStatus) => {
    if (onFilterChange) {
      onFilterChange(newStatus);
    }
    setPage(1);
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Customer Inquiries
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            {user?.role === 'admin'
              ? '👑 Administrator workspace: Showing all customer inquiries across the organization'
              : '👤 Staff workspace: Showing inquiries created and handled by you'}
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenCreate}>
          + Log New Inquiry
        </button>
      </div>

      {/* Summary Stat Cards with Rich Colors & Icons */}
      <div className="stats-grid">
        <div
          className={`stat-card stat-card-total ${statusFilter === 'all' ? 'stat-card-active' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => handleTabChange('all')}
          title="Click to view all inquiries"
        >
          <div className="stat-card-header">
            <span className="stat-title">Total Records</span>
            <span className="stat-icon-badge badge-total">📊</span>
          </div>
          <div className="stat-value">{stats.total || total}</div>
          <div className="stat-subtitle">All active inquiries</div>
        </div>

        <div
          className={`stat-card stat-card-new ${statusFilter === 'new' ? 'stat-card-active' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => handleTabChange('new')}
          title="Click to filter by New inquiries"
        >
          <div className="stat-card-header">
            <span className="stat-title">New Inquiries</span>
            <span className="stat-icon-badge badge-new">✦</span>
          </div>
          <div className="stat-value">{stats.new}</div>
          <div className="stat-subtitle">Awaiting response</div>
        </div>

        <div
          className={`stat-card stat-card-progress ${statusFilter === 'in_progress' ? 'stat-card-active' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => handleTabChange('in_progress')}
          title="Click to filter by In Progress inquiries"
        >
          <div className="stat-card-header">
            <span className="stat-title">In Progress</span>
            <span className="stat-icon-badge badge-progress">⏳</span>
          </div>
          <div className="stat-value">{stats.in_progress}</div>
          <div className="stat-subtitle">Under active review</div>
        </div>

        <div
          className={`stat-card stat-card-resolved ${statusFilter === 'resolved' ? 'stat-card-active' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => handleTabChange('resolved')}
          title="Click to filter by Resolved inquiries"
        >
          <div className="stat-card-header">
            <span className="stat-title">Resolved</span>
            <span className="stat-icon-badge badge-resolved">✓</span>
          </div>
          <div className="stat-value">{stats.resolved}</div>
          <div className="stat-subtitle">Successfully completed</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Inquiries' },
            { id: 'new', label: 'New' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`btn ${statusFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input with clear button */}
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <input
            type="text"
            placeholder="Search name, subject, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingRight: searchTerm ? '2rem' : '0.85rem' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }} onClick={loadInquiries}>
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Subject & Description</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Version</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td>
                    <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                    <div className="skeleton skeleton-text" style={{ width: '85%' }} />
                  </td>
                  <td>
                    <div className="skeleton skeleton-text" style={{ width: '50%' }} />
                    <div className="skeleton skeleton-text" style={{ width: '70%' }} />
                  </td>
                  <td>
                    <div className="skeleton skeleton-badge" />
                  </td>
                  <td>
                    <div className="skeleton" style={{ width: '32px', height: '18px' }} />
                  </td>
                  <td>
                    <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : inquiries.length === 0 ? (
        /* Empty State */
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
            color: 'var(--text-muted)',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontSize: '1.75rem',
            }}
          >
            📋
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            {searchTerm || statusFilter !== 'all' ? 'No matching inquiries found' : 'No inquiries logged yet'}
          </h2>
          <p style={{ fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or resetting the status filters to find what you are looking for.'
              : 'Keep track of all customer requests, support issues, and service tickets in one central workspace.'}
          </p>

          {searchTerm || statusFilter !== 'all' ? (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('');
                handleTabChange('all');
              }}
            >
              Reset Filters
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onOpenCreate}>
              + Log First Inquiry
            </button>
          )}
        </div>
      ) : (
        /* Populated Table */
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Subject & Details</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Version (OCC)</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className="table-row-hover"
                    onClick={() => onSelectInquiry(inq.id)}
                  >
                    <td style={{ maxWidth: '340px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                        {inq.subject}
                      </div>
                      <div
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.825rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {inq.description}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{inq.customerName}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.785rem' }}>{inq.contact}</div>
                    </td>
                    <td>
                      <StatusBadge status={inq.status} />
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          background: '#f1f5f9',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)',
                          fontWeight: 600,
                        }}
                        title="Optimistic Concurrency Control version counter"
                      >
                        v{inq.version}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {formatDate(inq.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              Showing <strong>{inquiries.length}</strong> of <strong>{total}</strong> inquiries
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                className="btn btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                ← Previous
              </button>
              <span style={{ padding: '0 0.5rem', fontWeight: 500 }}>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
