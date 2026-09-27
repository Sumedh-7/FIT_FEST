import React, { useState } from 'react';
import { X, Calendar, MapPin, User, Phone, Tag, FileText } from 'lucide-react';
import StatusBadge from './StatusBadge';
import GoogleMapView from './GoogleMapView';

export default function RequestDetailsModal({ request, onClose, onStatusChange }) {
  if (!request) return null;

  const [updating, setUpdating] = useState(false);

  const handleStatusSelect = async (e) => {
    const newStatus = e.target.value;
    if (newStatus && onStatusChange) {
      setUpdating(true);
      await onStatusChange(request.request_id, newStatus);
      setUpdating(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="card" style={{
        maxWidth: '620px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{request.request_id}</h3>
              <StatusBadge status={request.status} />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
              Logged on {new Date(request.created_at).toLocaleString()}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.375rem', borderRadius: 'var(--radius-md)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                <User size={14} /> Citizen Name
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.25rem' }}>
                {request.name}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                <Phone size={14} /> Contact Phone
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.25rem' }}>
                {request.phone}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                <Tag size={14} /> Waste Category
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: '0.25rem', color: 'var(--accent-green)' }}>
                {request.category}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                <Calendar size={14} /> Scheduled Pickup
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem' }}>
                {request.pickup_date}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {request.pickup_time}
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
              <MapPin size={14} /> Pune Pickup Address
            </div>
            <div style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {request.address}
            </div>
          </div>

          {/* Interactive Location Map */}
          <div style={{ marginBottom: '1.25rem' }}>
            <GoogleMapView address={request.address} height="200px" />
          </div>

          {request.description && (
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                <FileText size={14} /> Description / Special Instructions
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {request.description}
              </div>
            </div>
          )}

          {onStatusChange && (
            <div style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Update Request Status:</label>
              <select 
                className="form-select" 
                style={{ width: 'auto', fontWeight: 600 }}
                value={request.status}
                onChange={handleStatusSelect}
                disabled={updating}
              >
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="Collected">Collected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
