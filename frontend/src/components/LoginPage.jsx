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
      setError(err.message || 'Incorrect email or password');
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
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#030712',
      }}
    >
      {/* LEFT COLUMN: Hero showcase in Deep Midnight Blue */}
      <div
        style={{
          flex: '1.15',
          background: 'radial-gradient(ellipse at 20% 25%, #172554 0%, #0f172a 55%, #020617 100%)',
          color: '#ffffff',
          padding: '3.75rem 4.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="login-hero-pane"
      >
        {/* Top: Logo with Blue Sparkle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6">
            <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
          </svg>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
            InquiryDesk
          </span>
        </div>

        {/* Middle: Headline */}
        <div style={{ maxWidth: '520px', margin: '3rem 0' }}>
          <h1
            style={{
              fontSize: '3.1rem',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.035em',
              color: '#ffffff',
            }}
          >
            Every customer request, from first message to{' '}
            <span style={{ color: '#3b82f6' }}>resolved.</span>
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#94a3b8',
              marginTop: '1.5rem',
              lineHeight: 1.6,
              maxWidth: '430px',
            }}
          >
            See who owns what, what happened last, and what needs you next.
          </p>
        </div>

        {/* Bottom: Overlapping Floating Cards */}
        <div
          style={{
            position: 'relative',
            height: '130px',
            width: '100%',
            maxWidth: '520px',
            marginTop: '1rem',
          }}
        >
          {/* Card 1: New */}
          <div
            style={{
              position: 'absolute',
              left: '0px',
              bottom: '0px',
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '0.85rem 1.15rem',
              width: '190px',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.45)',
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#1e3a8a',
                color: '#bfdbfe',
                fontSize: '0.725rem',
                fontWeight: 600,
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                marginBottom: '0.55rem',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa' }} />
              New
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
              Order delayed
            </div>
            <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>Nimal Perera</div>
          </div>

          {/* Card 2: In progress (Elevated in front) */}
          <div
            style={{
              position: 'absolute',
              left: '135px',
              bottom: '22px',
              background: '#172033',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '14px',
              padding: '0.85rem 1.15rem',
              width: '190px',
              boxShadow: '0 18px 32px rgba(0, 0, 0, 0.55)',
              zIndex: 3,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#42331c',
                color: '#f6b868',
                fontSize: '0.725rem',
                fontWeight: 600,
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                marginBottom: '0.55rem',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
              In progress
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
              Refund request
            </div>
            <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>Kamala Silva</div>
          </div>

          {/* Card 3: Resolved */}
          <div
            style={{
              position: 'absolute',
              left: '265px',
              bottom: '4px',
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '0.85rem 1.15rem',
              width: '190px',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.45)',
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#143828',
                color: '#6ee7b7',
                fontSize: '0.725rem',
                fontWeight: 600,
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                marginBottom: '0.55rem',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              Resolved
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
              Wrong item received
            </div>
            <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>Sunil Fernando</div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sign-in Form */}
      <div
        style={{
          flex: '1',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '390px' }}>
          <h2
            style={{
              fontSize: '2.15rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
            }}
          >
            Welcome back
          </h2>
          <p
            style={{
              fontSize: '0.925rem',
              color: '#64748b',
              marginTop: '0.35rem',
              marginBottom: '2rem',
            }}
          >
            Sign in to your workspace.
          </p>

          {error && (
            <div
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '0.45rem',
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.925rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '0.45rem',
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.925rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
                transition: 'background 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#1d4ed8')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#2563eb')}
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #e2e8f0', margin: '2rem 0 1.5rem' }} />

          {/* Demo Accounts Pill Group */}
          <div>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#64748b',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <span>Demo accounts · password</span>
              <span
                style={{
                  background: '#dbeafe',
                  color: '#1e40af',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                Password123!
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('staff1@demo.com')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.825rem',
                  color: '#334155',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.color = '#2563eb';
                  e.currentTarget.style.background = '#eff6ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                staff1@demo.com
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('staff2@demo.com')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.825rem',
                  color: '#334155',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.color = '#2563eb';
                  e.currentTarget.style.background = '#eff6ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                staff2@demo.com
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('admin@demo.com')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.825rem',
                  color: '#334155',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.color = '#2563eb';
                  e.currentTarget.style.background = '#eff6ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                admin@demo.com
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
