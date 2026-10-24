import React, { useState } from 'react';
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

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
        }}
      >
        Initializing InquiryDesk...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-container">
        <LoginPage />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar
        onOpenCreate={() => setIsCreateOpen(true)}
        onGoHome={() => setSelectedInquiryId(null)}
      />

      <main className="main-content">
        {selectedInquiryId ? (
          <InquiryDetailPage
            inquiryId={selectedInquiryId}
            onBack={() => setSelectedInquiryId(null)}
          />
        ) : (
          <InquiryListPage
            onSelectInquiry={(id) => setSelectedInquiryId(id)}
            onOpenCreate={() => setIsCreateOpen(true)}
          />
        )}
      </main>

      {isCreateOpen && (
        <CreateInquiryModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={(newInquiry) => {
            setIsCreateOpen(false);
            setSelectedInquiryId(newInquiry.id);
          }}
          onViewExisting={(existingId) => {
            setIsCreateOpen(false);
            setSelectedInquiryId(existingId);
          }}
        />
      )}
    </div>
  );
}
