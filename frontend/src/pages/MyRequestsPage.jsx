import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import RequestDetailsModal from '../components/RequestDetailsModal';
import { History, PlusCircle, ExternalLink, RefreshCw } from 'lucide-react';

export default function MyRequestsPage() {
  const [localRequests, setLocalRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = async () => {
    setRefreshing(true);
    const cached = requestService.getLocalRequests();

    // Refresh live status for cached items from API
    if (cached.length > 0) {
      try {
        const updatedList = await Promise.all(
          cached.map(async (item) => {
            try {
              const live = await requestService.getRequestById(item.request_id);
              return live;
            } catch (e) {
              return item;
            }
          })
        );
        setLocalRequests(updatedList);
      } catch (err) {
        setLocalRequests(cached);
      }
    } else {
      setLocalRequests([]);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh', backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={24} color="var(--accent-green)" /> My Pickup History
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              View and track waste collection requests submitted from this device.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={loadRequests}
              className="btn btn-secondary btn-sm"
              disabled={refreshing}
            >
              <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
              <span>Refresh Status</span>
            </button>
            <Link to="/request" className="btn btn-primary btn-sm">
              <PlusCircle size={15} />
              <span>New Request</span>
            </Link>
          </div>
        </div>

        {localRequests.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <History size={48} color="var(--border-dark)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No Request History Found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
              You haven't submitted any waste collection requests from this browser yet.
            </p>
            <Link to="/request" className="btn btn-primary">
              Schedule Your First Pickup
            </Link>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="civic-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Category</th>
                    <th>Pickup Date</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {localRequests.map((req) => (
                    <tr key={req.request_id}>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>
                          {req.request_id}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{req.category}</td>
                      <td>{req.pickup_date}</td>
                      <td style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {req.address}
                      </td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="btn btn-secondary btn-sm"
                        >
                          <span>Details</span>
                          <ExternalLink size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {selectedRequest && (
          <RequestDetailsModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </div>
    </div>
  );
}
