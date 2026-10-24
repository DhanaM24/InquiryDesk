import React, { useState } from 'react';
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
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
    setDuplicateInfo(null);
    setSubmitting(true);

    try {
      const created = await api.createInquiry(form);
      onCreated(created);
    } catch (err) {
      if (err.status === 422 && err.details) {
        setFieldErrors(err.details);
      } else if (err.status === 409) {
        setServerError(err.message);
        if (err.details?.existingId) {
          setDuplicateInfo(err.details.existingId);
        }
      } else {
        setServerError(err.message || 'Failed to create inquiry');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Create New Customer Inquiry</h3>
          <button
            onClick={onClose}
            style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {serverError && (
            <div className="alert alert-warning" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div>{serverError}</div>
              {duplicateInfo && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ alignSelf: 'flex-start', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  onClick={() => onViewExisting(duplicateInfo)}
                >
                  View Existing Inquiry →
                </button>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Customer Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="e.g. Kasun Silva"
                required
              />
              {fieldErrors.customerName && (
                <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  {fieldErrors.customerName[0]}
                </span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Contact (Email / Phone) <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="e.g. kasun@example.com or 0771234567"
                required
              />
              {fieldErrors.contact && (
                <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  {fieldErrors.contact[0]}
                </span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Subject <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. Billing error on March statement"
                required
              />
              {fieldErrors.subject && (
                <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  {fieldErrors.subject[0]}
                </span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Description (minimum 10 chars) <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Detail the issue, account details, and what was discussed..."
                required
              />
              {fieldErrors.description && (
                <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  {fieldErrors.description[0]}
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Create Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
