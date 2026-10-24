import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('staff1@demo.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Unable to connect to server. Ensure backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError('');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '85vh',
        padding: '1.5rem',
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1e40af)',
              color: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.15rem',
              marginBottom: '1rem',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
            }}
          >
            ID
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Sign in to InquiryDesk
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Customer inquiry & service workflow desk
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <span style={{ fontWeight: 600 }}>Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              htmlFor="email-input"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}
            >
              Email address
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. staff1@demo.com"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password-input"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}
            >
              Password
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem', fontSize: '0.9rem' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.775rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Quick Demo Accounts (Click to auto-fill):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('staff1@demo.com')}
              style={{
                textAlign: 'left',
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
            >
              👤 <strong>Staff 1:</strong> staff1@demo.com <em>(Password123!)</em>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('staff2@demo.com')}
              style={{
                textAlign: 'left',
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
            >
              👤 <strong>Staff 2:</strong> staff2@demo.com <em>(Password123!)</em>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@demo.com')}
              style={{
                textAlign: 'left',
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                background: '#fdf2f8',
                border: '1px solid #fbcfe8',
                color: '#db2777',
                cursor: 'pointer',
              }}
            >
              👑 <strong>Admin:</strong> admin@demo.com <em>(Password123!)</em>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
