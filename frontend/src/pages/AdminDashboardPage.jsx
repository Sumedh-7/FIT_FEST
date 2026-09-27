import React, { useState, useEffect } from 'react';
import { requestService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import RequestDetailsModal from '../components/RequestDetailsModal';
import { WASTE_CATEGORIES } from '../data/wasteCategories';
import { 
  LayoutDashboard, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  XCircle, 
  Layers,
  Eye,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total_requests: 0,
    pending: 0,
    assigned: 0,
    collected: 0,
    cancelled: 0,
    category_breakdown: []
  });

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal
  const [activeModalRequest, setActiveModalRequest] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [statsData, requestsData] = await Promise.all([
        requestService.getStats(),
        requestService.getRequests({
          search: searchTerm || undefined,
          status: selectedStatus !== 'All' ? selectedStatus : undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined
        })
      ]);

      setStats(statsData);
      setRequests(requestsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setLoadError(err.response?.data?.detail || err.message || 'Unable to load dashboard data. Check that the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedStatus, selectedCategory]);

  useEffect(() => {
    const refreshTimer = window.setInterval(fetchDashboardData, 15000);
    return () => window.clearInterval(refreshTimer);
  }, [searchTerm, selectedStatus, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const handleStatusChange = async (requestId, newStatus) => {
    setUpdatingId(requestId);
    try {
      await requestService.updateStatus(requestId, newStatus);
      await fetchDashboardData();
      if (activeModalRequest && activeModalRequest.request_id === requestId) {
        setActiveModalRequest(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update request status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ padding: '2rem 0 4rem 0', backgroundColor: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">

        {loadError && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>
            Dashboard could not load live requests: {loadError}
          </div>
        )}

        {/* Top Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LayoutDashboard size={24} color="var(--accent-green)" />
              <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Pune Municipal Admin Dashboard</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Real-time waste pickup request management and logistics monitoring across Pune sectors.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="btn btn-secondary btn-sm"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh Live Data</span>
          </button>
        </div>

        {/* Top Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Total */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Requests
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {stats.total_requests}
            </div>
          </div>

          {/* Pending */}
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #eab308' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-pending-text)', textTransform: 'uppercase' }}>
              <Clock size={14} /> Pending
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {stats.pending}
            </div>
          </div>

          {/* Assigned */}
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--status-assigned-text)', textTransform: 'uppercase' }}>
              <UserCheck size={14} /> Assigned
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {stats.assigned}
            </div>
          </div>

          {/* Collected */}
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-green)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-green)', textTransform: 'uppercase' }}>
              <CheckCircle2 size={14} /> Collected
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {stats.collected}
            </div>
          </div>

          {/* Cancelled */}
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: '#991b1b', textTransform: 'uppercase' }}>
              <XCircle size={14} /> Cancelled
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {stats.cancelled}
            </div>
          </div>
        </div>

        {/* Category Breakdown Panel */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--accent-green)" /> Waste Category Breakdown
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem'
          }}>
            {stats.category_breakdown.map((item) => (
              <div
                key={item.category}
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.category}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <form onSubmit={handleSearchSubmit} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'end'
          }}>
            {/* Search Input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Search Requests</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="ID, Name, Phone, Address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Status Filter</label>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="Collected">Collected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Category Filter</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {WASTE_CATEGORIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Search Submit Button */}
            <div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Requests Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="civic-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Citizen Name</th>
                  <th>Waste Category</th>
                  <th>Pickup Date</th>
                  <th>Address (Pune)</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                      No pickup requests match the selected filters.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <strong style={{ color: 'var(--accent-green)' }}>{req.request_id}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{req.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.phone}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{req.category}</span>
                      </td>
                      <td>
                        <div>{req.pickup_date}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.pickup_time}</div>
                      </td>
                      <td style={{ maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {req.address}
                      </td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                          <select
                            className="form-select"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                            value={req.status}
                            disabled={updatingId === req.request_id}
                            onChange={(e) => handleStatusChange(req.request_id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Assigned">Assigned</option>
                            <option value="Collected">Collected</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => setActiveModalRequest(req)}
                            className="btn btn-secondary btn-sm"
                            title="View Full Details"
                            style={{ padding: '0.375rem' }}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Details */}
        {activeModalRequest && (
          <RequestDetailsModal
            request={activeModalRequest}
            onClose={() => setActiveModalRequest(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}