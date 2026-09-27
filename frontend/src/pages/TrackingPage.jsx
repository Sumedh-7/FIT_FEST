import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { requestService } from '../services/api';
import { Search, CheckCircle2, Clock, UserCheck, XCircle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import GoogleMapView from '../components/GoogleMapView';

export default function TrackingPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [searchId, setSearchId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(null);
  const [error, setError] = useState(null);

  const fetchRequest = async (idToFetch) => {
    if (!idToFetch.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await requestService.getRequestById(idToFetch.trim());
      setRequest(data);
    } catch (err) {
      console.error(err);
      setRequest(null);
      setError(`No pickup request found for '${idToFetch}'. Please verify your Request ID.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchRequest(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequest(searchId);
  };

  const getStepStatus = (stepName) => {
    if (!request) return 'pending';
    const current = request.status.toLowerCase();

    if (current === 'cancelled') return 'cancelled';

    if (stepName === 'Submitted') {
      return 'completed';
    }
    if (stepName === 'Assigned') {
      if (current === 'assigned' || current === 'collected') return 'completed';
      return 'upcoming';
    }
    if (stepName === 'Collected') {
      if (current === 'collected') return 'completed';
      return 'upcoming';
    }
    return 'upcoming';
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh', backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Track Pickup Request</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Enter your unique request tracking ID (e.g. EC-1001) to view real-time status.
          </p>
        </div>

        {/* Search Bar */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem', textTransform: 'uppercase', fontWeight: 600 }}
                placeholder="Enter Request ID (e.g. EC-1001)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Track Request'}
            </button>
          </form>
        </div>

        {error && (
          <div className="alert alert-error" style={{ textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Request Tracker Result */}
        {request && (
          <div className="card">
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '1rem',
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--border-light)'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Request Tracking Code
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {request.request_id}
                </h2>
              </div>
              <div>
                <StatusBadge status={request.status} />
              </div>
            </div>

            {/* Stepper Progress Bar */}
            {request.status.toLowerCase() === 'cancelled' ? (
              <div style={{
                backgroundColor: 'var(--status-cancelled-bg)',
                border: '1px solid var(--status-cancelled-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                textAlign: 'center',
                color: 'var(--status-cancelled-text)',
                marginBottom: '1.5rem'
              }}>
                <XCircle size={28} style={{ margin: '0 auto 0.5rem auto' }} />
                <strong style={{ display: 'block', fontSize: '1rem' }}>This Request Has Been Cancelled</strong>
                <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  Please submit a new request if collection is still needed in Pune.
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: '2rem', padding: '1rem 0' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  {/* Background Connector Line */}
                  <div style={{
                    position: 'absolute',
                    top: '1.25rem',
                    left: '15%',
                    right: '15%',
                    height: '2px',
                    backgroundColor: 'var(--border-medium)',
                    zIndex: 0
                  }} />

                  {/* Step 1: Submitted */}
                  <div style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--accent-green)',
                      color: 'var(--text-inverse)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem auto',
                      fontWeight: 700
                    }}>
                      <CheckCircle2 size={20} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Submitted
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Request Logged
                    </span>
                  </div>

                  {/* Step 2: Assigned */}
                  <div style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: getStepStatus('Assigned') === 'completed' ? 'var(--accent-green)' : 'var(--bg-subtle)',
                      color: getStepStatus('Assigned') === 'completed' ? 'var(--text-inverse)' : 'var(--text-muted)',
                      border: getStepStatus('Assigned') === 'completed' ? 'none' : '2px solid var(--border-medium)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem auto',
                      fontWeight: 700
                    }}>
                      {getStepStatus('Assigned') === 'completed' ? <UserCheck size={20} /> : <Clock size={20} />}
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: getStepStatus('Assigned') === 'completed' ? 600 : 400,
                      color: getStepStatus('Assigned') === 'completed' ? 'var(--text-primary)' : 'var(--text-muted)'
                    }}>
                      Assigned
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Driver Assigned
                    </span>
                  </div>

                  {/* Step 3: Collected */}
                  <div style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: getStepStatus('Collected') === 'completed' ? 'var(--accent-green)' : 'var(--bg-subtle)',
                      color: getStepStatus('Collected') === 'completed' ? 'var(--text-inverse)' : 'var(--text-muted)',
                      border: getStepStatus('Collected') === 'completed' ? 'none' : '2px solid var(--border-medium)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem auto',
                      fontWeight: 700
                    }}>
                      <CheckCircle2 size={20} />
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: getStepStatus('Collected') === 'completed' ? 600 : 400,
                      color: getStepStatus('Collected') === 'completed' ? 'var(--text-primary)' : 'var(--text-muted)'
                    }}>
                      Collected
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Pickup Completed
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Information Grid */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                Pickup Specifications
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Citizen Name</span>
                  <strong>{request.name}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Waste Category</span>
                  <strong style={{ color: 'var(--accent-green)' }}>{request.category}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Pickup Date</span>
                  <strong>{request.pickup_date}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Preferred Window</span>
                  <strong>{request.pickup_time}</strong>
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-medium)', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Pune Address</span>
                <strong>{request.address}</strong>
              </div>
            </div>

            {/* Google Map View */}
            <GoogleMapView address={request.address} height="220px" />
          </div>
        )}
      </div>
    </div>
  );
}
