import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import StatusBadge from './StatusBadge';

export default function InquiryListPage({ onSelectInquiry, onOpenCreate }) {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounce search input
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
    } catch (err) {
      setError(err.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [statusFilter, debouncedSearch, page]);

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
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Customer Inquiries</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {user?.role === 'admin'
              ? 'Admin view: Showing all inquiries across all staff'
              : 'Staff view: Showing only inquiries created by you'}
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenCreate}>
          + New Inquiry
        </button>
      </div>

      {/* Filter and Search toolbar */}
      <div
        className="card"
        style={{
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Inquiries' },
            { id: 'new', label: 'New' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`btn ${statusFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ width: '280px', maxWidth: '100%' }}>
          <input
            type="text"
            placeholder="Search name, subject, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading inquiries...
        </div>
      ) : inquiries.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            No inquiries found
          </h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search terms or filter.'
              : 'Get started by logging your first customer inquiry.'}
          </p>
          <button className="btn btn-primary" onClick={onOpenCreate}>
            + Log New Inquiry
          </button>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Subject & Details</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Version</th>
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
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                        {inq.subject}
                      </div>
                      <div
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.8rem',
                          maxWidth: '380px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {inq.description}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{inq.customerName}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{inq.contact}</div>
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
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                        }}
                      >
                        v{inq.version}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {formatDate(inq.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            <div>
              Showing {inquiries.length} of {total} inquiries
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                className="btn btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
