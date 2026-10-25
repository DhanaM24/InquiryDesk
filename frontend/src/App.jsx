import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import InquiryListPage from './components/InquiryListPage';
import InquiryDetailPage from './components/InquiryDetailPage';
import CreateInquiryModal from './components/CreateInquiryModal';

export default function App() {
  const { user, loading } = useAuth();
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Sync state with URL hash (e.g. #inquiry/<uuid>) for direct links & Situation 3
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#inquiry/')) {
        const id = hash.replace('#inquiry/', '');
        if (id) {
          setSelectedInquiryId(id);
          setIsCreateOpen(false);
          return;
        }
      }
      if (hash === '#new') {
        setIsCreateOpen(true);
        setSelectedInquiryId(null);
        return;
      }
      setSelectedInquiryId(null);
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const navigateToInquiry = (id) => {
    window.location.hash = `#inquiry/${id}`;
    setSelectedInquiryId(id);
    setIsCreateOpen(false);
  };

  const navigateHome = () => {
    window.location.hash = '';
    setSelectedInquiryId(null);
    setIsCreateOpen(false);
  };

  const openCreateModal = () => {
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    if (window.location.hash === '#new') {
      window.location.hash = '';
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: 'var(--text-muted)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #ff5a1f, #d94814)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1rem',
            animation: 'pulse 1.5s infinite',
          }}
        >
          ✦
        </div>
        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>Connecting to InquiryDesk...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      <Navbar onOpenCreate={openCreateModal} onGoHome={navigateHome} />

      <main className="main-content">
        {selectedInquiryId ? (
          <InquiryDetailPage inquiryId={selectedInquiryId} onBack={navigateHome} />
        ) : (
          <InquiryListPage
            onSelectInquiry={navigateToInquiry}
            onOpenCreate={openCreateModal}
          />
        )}
      </main>

      {isCreateOpen && (
        <CreateInquiryModal
          onClose={closeCreateModal}
          onCreated={(newInquiry) => {
            closeCreateModal();
            navigateToInquiry(newInquiry.id);
          }}
          onViewExisting={(existingId) => {
            closeCreateModal();
            navigateToInquiry(existingId);
          }}
        />
      )}
    </div>
  );
}
