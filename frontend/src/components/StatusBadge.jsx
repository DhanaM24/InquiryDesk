import React from 'react';

export default function StatusBadge({ status }) {
  const formatted = status === 'in_progress' ? 'In Progress' : status;
  return (
    <span className={`status-badge ${status}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          display: 'inline-block',
        }}
      />
      {formatted}
    </span>
  );
}
