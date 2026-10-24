import React, { useState, useEffect } from 'react';
import { api } from '../api';
import StatusBadge from './StatusBadge';

const ALLOWED_TRANSITIONS = {
  new: [{ status: 'in_progress', label: 'Start Progress →', variant: 'btn-warning' }],
  in_progress: [{ status: 'resolved', label: 'Mark as Resolved ✓', variant: 'btn-success' }],
  resolved: [{ status: 'in_progress', label: 'Reopen Inquiry ↺', variant: 'btn-secondary' }],
};

export default function InquiryDetailPage({ inquiryId, onBack }) {
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [staleError, setStaleError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchDetail = async () => {
    setLoading(true);
    setError('');
    setStaleError(false);
    try {
      const data = await api.getInquiry(inquiryId);
      setInquiry(data);
    } catch (err) {
      setError(err.message || 'Failed to load inquiry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [inquiryId]);

  const handleStatusChange = async (nextStatus) => {
    if (!inquiry) return;
    setUpdating(true);
    setError('');
    setStaleError(false);
    setSuccessMessage('');

    try {
      // Optimistic concurrency control: passes current inquiry.version
      const updated = await api.changeStatus(inquiry.id, nextStatus, inquiry.version);
      setInquiry(updated);
      setSuccessMessage(`Status updated to ${nextStatus.replace('_', ' ')} (now at version v${updated.version})`);
    } catch (err) {
      if (err.status === 409) {
        setStaleError(true);
        setError(err.message);
      } else {
        setError(err.message || 'Status update failed');
      }
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    return new Date(isoStr).toLocaleString();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Loading inquiry details...
      </div>
    );
  }

  if (error && !inquiry) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <div className="alert alert-danger" style={{ display: 'inline-flex' }}>{error}</div>
        <div style={{ marginTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={onBack}>
            ← Back to Inquiries
          </button>
        </div>
      </div>
    );
  }

  const nextActions = inquiry ? ALLOWED_TRANSITIONS[inquiry.status] || [] : [];

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="btn btn-outline"
        style={{ marginBottom: '1.25rem', padding: '0.4rem 0.75rem' }}
      >
        ← Back to Inquiries
      </button>

      {/* Alerts */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {staleError && (
        <div className="alert alert-warning" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Concurrency Conflict:</strong> {error}
          </div>
          <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }} onClick={fetchDetail}>
            Reload Latest Data
          </button>
        </div>
      )}

      {error && !staleError && <div className="alert alert-danger">{error}</div>}

      {/* Inquiry Detail Card */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <StatusBadge status={inquiry.status} />
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  background: '#f1f5f9',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
                title="Optimistic Concurrency Version"
              >
                v{inquiry.version}
              </span>
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{inquiry.subject}</h1>
          </div>

          {/* Lifecycle Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {nextActions.map((action) => (
              <button
                key={action.status}
                className={`btn ${action.variant}`}
                disabled={updating}
                onClick={() => handleStatusChange(action.status)}
              >
                {updating ? 'Updating...' : action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Information Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            background: '#f8fafc',
            padding: '1.25rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Customer Name
            </span>
            <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>{inquiry.customerName}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Contact Details
            </span>
            <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>{inquiry.contact}</div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Created
            </span>
            <div style={{ fontSize: '0.875rem', marginTop: '0.2rem', color: 'var(--text-main)' }}>
              {formatDate(inquiry.createdAt)}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Last Updated
            </span>
            <div style={{ fontSize: '0.875rem', marginTop: '0.2rem', color: 'var(--text-main)' }}>
              {formatDate(inquiry.updatedAt)}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Inquiry Description
          </h3>
          <div
            style={{
              lineHeight: 1.7,
              fontSize: '0.925rem',
              whiteSpace: 'pre-wrap',
              background: '#ffffff',
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
            }}
          >
            {inquiry.description}
          </div>
        </div>

        {/* Technical / Interview info footer */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span>Inquiry ID: <code>{inquiry.id}</code></span>
          <span>Created By User ID: <code>{inquiry.createdBy}</code></span>
        </div>
      </div>
    </div>
  );
}
