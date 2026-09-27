import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-light)',
      padding: '2rem 0',
      marginTop: 'auto',
      fontSize: '0.875rem',
      color: 'var(--text-muted)'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>EcoCollect Civic Portal</strong>
          <span style={{ margin: '0 0.5rem' }}>•</span>
          <span>Municipal Waste Management System</span>
        </div>
        <div>
          <span>Official Public Service Infrastructure &copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
