import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { WASTE_CATEGORIES } from '../data/wasteCategories';
import { requestService } from '../services/api';
import { Info, AlertCircle } from 'lucide-react';
import GoogleMapView from '../components/GoogleMapView';

export default function RequestPickupPage() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(WASTE_CATEGORIES[0].name);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pickup_date: '',
    pickup_time: '09:00 AM - 12:00 PM',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeCategoryObj = WASTE_CATEGORIES.find(c => c.name === selectedCategory) || WASTE_CATEGORIES[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pickup_date) {
      setError('Please fill in all required fields marked with *');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        category: selectedCategory,
        address: formData.address.trim(),
        pickup_date: formData.pickup_date,
        pickup_time: formData.pickup_time,
        description: formData.description.trim() || undefined
      };

      const result = await requestService.createRequest(payload);
      navigate(`/track?id=${encodeURIComponent(result.request_id)}`, {
        replace: true,
        state: { submitted: true }
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to submit pickup request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Request Waste Pickup — Pune</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Schedule municipal waste collection for your home or commercial premises in Pune.
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Category Selection */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--accent-green-light)',
                color: 'var(--accent-green)',
                fontSize: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>1</span>
              Select Waste Category
            </h3>

            {/* Selectable Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}>
              {WASTE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    style={{
                      padding: '1rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--accent-green)' : '1px solid var(--border-medium)',
                      backgroundColor: isSelected ? 'var(--accent-green-light)' : 'var(--bg-surface)',
                      color: isSelected ? 'var(--accent-green-text)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: '0.875rem'
                    }}
                  >
                    <div>{cat.name}</div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Guidance Banner */}
            {activeCategoryObj && (
              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                borderLeft: '4px solid var(--accent-green)',
                padding: '1rem',
                borderRadius: '0 var(--radius-md) var(--radius-md) 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  <Info size={16} color="var(--accent-green)" />
                  Disposal Guidance for {activeCategoryObj.name}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  "{activeCategoryObj.guide}"
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Common items: {activeCategoryObj.examples.join(', ')}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Pickup Information */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--accent-green-light)',
                color: 'var(--accent-green)',
                fontSize: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>2</span>
              Enter Pune Address & Contact Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Rajesh Kulkarni"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="e.g. +91 98220 12345"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pickup Address (Pune Sector / Locality) *</label>
              <textarea
                name="address"
                rows={3}
                className="form-control"
                placeholder="e.g. Flat 402, Sneha Apartments, FC Road, Shivajinagar, Pune - 411005"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Live Google Map Preview Box */}
            {formData.address.trim().length > 5 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <GoogleMapView address={formData.address} height="180px" />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Preferred Pickup Date *</label>
                <input
                  type="date"
                  name="pickup_date"
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.pickup_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Time Slot *</label>
                <select
                  name="pickup_time"
                  className="form-select"
                  value={formData.pickup_time}
                  onChange={handleInputChange}
                >
                  <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM (Morning)</option>
                  <option value="01:00 PM - 04:00 PM">01:00 PM - 04:00 PM (Afternoon)</option>
                  <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM (Evening)</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Optional Description / Items List</label>
              <input
                type="text"
                name="description"
                className="form-control"
                placeholder="e.g. 2 old laptops, batteries, and broken chargers"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link to="/" className="btn btn-secondary">Cancel</Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '0.75rem 2rem' }}
            >
              {loading ? 'Submitting Request...' : 'Submit Pickup Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
