import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck, Search, History, LayoutDashboard, PlusCircle, Wifi, WifiOff } from 'lucide-react';
import { requestService } from '../services/api';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8001/api';

export default function Navbar() {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState('checking'); // 'connected' | 'disconnected' | 'checking'

  const checkBackendHealth = async () => {
    try {
const res = await axios.get('http://127.0.0.1:8001/api/health', {
  timeout: 4000
});
      if (res.status === 200) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('disconnected');
      }
    } catch (err) {
      setBackendStatus('disconnected');
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4rem',
        gap: '1rem'
      }}>
        {/* Brand & City Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'var(--accent-green-light)',
              border: '1px solid var(--accent-green-border)',
              color: 'var(--accent-green)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                EcoCollect
              </span>
              <span style={{
                display: 'block',
                fontSize: '0.6875rem',
                color: 'var(--accent-green-text)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 700,
                marginTop: '-2px'
              }}>
                Pune Municipal Region
              </span>
            </div>
          </Link>

          {/* Connection Status Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.25rem 0.625rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: backendStatus === 'connected' ? 'var(--status-collected-bg)' : backendStatus === 'disconnected' ? 'var(--status-cancelled-bg)' : 'var(--bg-subtle)',
            color: backendStatus === 'connected' ? 'var(--status-collected-text)' : backendStatus === 'disconnected' ? 'var(--status-cancelled-text)' : 'var(--text-muted)',
            border: `1px solid ${backendStatus === 'connected' ? 'var(--status-collected-border)' : backendStatus === 'disconnected' ? 'var(--status-cancelled-border)' : 'var(--border-medium)'}`
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: backendStatus === 'connected' ? '#16a34a' : backendStatus === 'disconnected' ? '#dc2626' : '#94a3b8',
              display: 'inline-block'
            }} />
            {backendStatus === 'connected' ? 'Backend Live' : backendStatus === 'disconnected' ? 'API Offline' : 'Checking API...'}
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            to="/request"
            className="btn btn-primary btn-sm"
          >
            <PlusCircle size={15} />
            <span>Request Pickup</span>
          </Link>

          <Link
            to="/track"
            style={{
              padding: '0.5rem 0.875rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-md)',
              color: isActive('/track') ? 'var(--accent-green)' : 'var(--text-secondary)',
              backgroundColor: isActive('/track') ? 'var(--accent-green-light)' : 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}
          >
            <Search size={16} />
            <span>Track</span>
          </Link>

          <Link
            to="/my-requests"
            style={{
              padding: '0.5rem 0.875rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-md)',
              color: isActive('/my-requests') ? 'var(--accent-green)' : 'var(--text-secondary)',
              backgroundColor: isActive('/my-requests') ? 'var(--accent-green-light)' : 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}
          >
            <History size={16} />
            <span>My Requests</span>
          </Link>

          <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'var(--border-light)', margin: '0 0.375rem' }} />

          <Link
            to="/admin"
            style={{
              padding: '0.5rem 0.875rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: 'var(--radius-md)',
              color: isActive('/admin') ? 'var(--text-primary)' : 'var(--text-secondary)',
              backgroundColor: isActive('/admin') ? 'var(--bg-subtle)' : 'transparent',
              border: '1px solid',
              borderColor: isActive('/admin') ? 'var(--border-dark)' : 'var(--border-light)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}
          >
            <LayoutDashboard size={16} />
            <span>Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
