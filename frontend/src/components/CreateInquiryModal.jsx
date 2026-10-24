import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function CreateInquiryModal({ onClose, onCreated, onViewExisting }) {
  const [form, setForm] = useState({
    customerName: '',
    contact: '',
    subject: '',
    description: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [duplicateId, setDuplicateId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setFieldErrors({});
    setDuplicateId(null);

    // Client-side quick checks
    const errors = {};
    if (form.customerName.trim().length < 2) errors.customerName = ['Name must be at least 2 characters'];
    if (form.contact.trim().length < 5) errors.contact = ['Contact must be at least 5 characters'];
    if (form.subject.trim().length < 3) errors.subject = ['Subject must be at least 3 characters'];
    if (form.description.trim().length < 10) errors.description = ['Description must be at least 10 characters'];

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const created = await api.createInquiry(form);
      onCreated(created);
    } catch (err) {
      if (err.status === 422 && err.details) {
        setFieldErrors(err.details);
      } else if (err.status === 409) {
        setServerError(err.message || 'A similar inquiry was recently submitted.');
        if (err.details?.existingId) {
          setDuplicateId(err.details.existingId);
        }
      } else {
        setServerError(err.message || 'Failed to submit inquiry. Please check your network.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Record Customer Inquiry
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Log a new service request or customer query
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#f1f5f9',
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="Close modal (Esc)"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
          {/* Duplicate warning (409) */}
          {serverError && (
            <div className="alert alert-warning" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div>
                <strong>Duplicate Notice:</strong> {serverError}
              </div>
              {duplicateId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ alignSelf: 'flex-start', fontSize: '0.775rem', padding: '0.3rem 0.65rem' }}
                  onClick={() => onViewExisting(duplicateId)}
                >
                  View Existing Inquiry →
                </button>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Customer Name */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  Customer Name <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-light)' }}>
                  {form.customerName.length} / 100
                </span>
              </div>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="e.g. Kasun Fernando"
                className={fieldErrors.customerName ? 'input-error' : ''}
                required
              />
              {fieldErrors.customerName && (
                <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>
                  {fieldErrors.customerName[0]}
                </span>
              )}
            </div>

            {/* Contact */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  Contact (Email or Phone) <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-light)' }}>
                  {form.contact.length} / 150
                </span>
              </div>
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="e.g. kasun@example.com or 0771234567"
                className={fieldErrors.contact ? 'input-error' : ''}
                required
              />
              {fieldErrors.contact && (
                <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>
                  {fieldErrors.contact[0]}
                </span>
              )}
            </div>

            {/* Subject */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  Subject <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-light)' }}>
                  {form.subject.length} / 150
                </span>
              </div>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. Late delivery for Order #1042"
                className={fieldErrors.subject ? 'input-error' : ''}
                required
              />
              {fieldErrors.subject && (
                <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>
                  {fieldErrors.subject[0]}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  Description <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <span
                  style={{
                    fontSize: '0.725rem',
                    color: form.description.length >= 10 ? 'var(--success)' : 'var(--text-light)',
                  }}
                >
                  {form.description.length} / 10 chars minimum
                </span>
              </div>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the customer request, details, and initial action taken..."
                className={fieldErrors.description ? 'input-error' : ''}
                required
              />
              {fieldErrors.description && (
                <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>
                  {fieldErrors.description[0]}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Record Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
