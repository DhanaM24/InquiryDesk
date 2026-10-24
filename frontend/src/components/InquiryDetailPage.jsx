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
  const [staleConflict, setStaleConflict] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchDetail = async () => {
    setLoading(true);
    setError('');
    setStaleConflict(false);
    try {
      const data = await api.getInquiry(inquiryId);
      setInquiry(data);
    } catch (err) {
      if (err.status === 404) {
        setError('Inquiry not found or access restricted by ownership policy.');
      } else {
        setError(err.message || 'Failed to load inquiry record.');
      }
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
    setStaleConflict(false);
    setFeedback('');

    try {
      // Optimistic concurrency control: sends current inquiry.version
      const updated = await api.changeStatus(inquiry.id, nextStatus, inquiry.version);
      setInquiry(updated);
      setFeedback(`Status successfully updated to "${nextStatus.replace('_', ' ')}" (version incremented to v${updated.version}).`);
    } catch (err) {
      if (err.status === 409) {
        setStaleConflict(true);
        setError(err.message || 'This inquiry was updated elsewhere. Please reload to see the latest version.');
      } else {
        setError(err.message || 'Status transition failed.');
      }
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    return new Date(isoStr).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  /* Loading State */
  if (loading) {
    return (
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div className="skeleton" style={{ width: '140px', height: '34px', marginBottom: '1.5rem' }} />
        <div className="card" style={{ padding: '2rem' }}>
          <div className="skeleton skeleton-badge" style={{ marginBottom: '1rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '70%', height: '24px', marginBottom: '1.5rem' }} />
          <div className="skeleton" style={{ width: '100%', height: '100px', marginBottom: '1.5rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '100%', height: '80px' }} />
        </div>
      </div>
    );
  }

  /* 404 or Critical Error State */
  if (error && !inquiry) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontSize: '1.75rem',
            }}
          >
            ✕
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Inquiry Not Available
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {error}
          </p>
          <button className="btn btn-primary" onClick={onBack}>
            ← Return to Inquiries Workspace
          </button>
        </div>
      </div>
    );
  }

  const nextActions = inquiry ? ALLOWED_TRANSITIONS[inquiry.status] || [] : [];

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      {/* Navigation and Actions Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={onBack}
          className="btn btn-outline"
          style={{ padding: '0.45rem 0.85rem' }}
        >
          ← Back to Inquiries
        </button>
      </div>

      {/* Success alert */}
      {feedback && <div className="alert alert-success">{feedback}</div>}

      {/* Stale Concurrency Conflict (409) Banner */}
      {staleConflict && (
        <div
          className="alert alert-warning"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <strong>⚠️ Concurrency Conflict (OCC):</strong> {error}
          </div>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            onClick={fetchDetail}
          >
            Reload Latest Version
          </button>
        </div>
      )}

      {/* General Error Banner */}
      {error && !staleConflict && <div className="alert alert-danger">{error}</div>}

      {/* Main Detail Card */}
      <div className="card" style={{ padding: '2.25rem' }}>
        {/* Card Header: Subject, Status, Version, and Lifecycle buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1.5rem',
            marginBottom: '1.75rem',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
              <StatusBadge status={inquiry.status} />
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  background: '#f1f5f9',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '4px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
                title="Optimistic Concurrency Control integer version"
              >
                v{inquiry.version}
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {inquiry.subject}
            </h1>
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
                {updating ? 'Updating status...' : action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Information Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            background: '#f8fafc',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            marginBottom: '2rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              Customer Name
            </span>
            <div style={{ fontWeight: 600, marginTop: '0.25rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
              {inquiry.customerName}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              Contact Channel
            </span>
            <div style={{ fontWeight: 600, marginTop: '0.25rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
              {inquiry.contact}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              Created At
            </span>
            <div style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
              {formatDate(inquiry.createdAt)}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              Last Status Update
            </span>
            <div style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
              {formatDate(inquiry.updatedAt)}
            </div>
          </div>
        </div>

        {/* Full Inquiry Description */}
        <div>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Inquiry Narrative & Customer Request
          </h2>
          <div
            style={{
              lineHeight: 1.7,
              fontSize: '0.95rem',
              whiteSpace: 'pre-wrap',
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
            }}
          >
            {inquiry.description}
          </div>
        </div>

        {/* Technical Footer */}
        <div
          style={{
            marginTop: '2.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            color: 'var(--text-light)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span>Record ID: <code style={{ color: 'var(--text-muted)' }}>{inquiry.id}</code></span>
          <span>Logged By User: <code style={{ color: 'var(--text-muted)' }}>{inquiry.createdBy}</code></span>
        </div>
      </div>
    </div>
  );
}
