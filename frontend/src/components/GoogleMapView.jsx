import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

export default function GoogleMapView({ address, height = '220px' }) {
  const puneAddress = address ? `${address}, Pune, Maharashtra, India` : 'Pune, Maharashtra, India';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(puneAddress)}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(puneAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div style={{
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border-medium)',
      backgroundColor: 'var(--bg-subtle)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.625rem 0.875rem',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        fontSize: '0.8125rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          <MapPin size={15} color="var(--accent-green)" />
          <span>Location Location Preview (Pune Jurisdiction)</span>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem' }}
        >
          <Navigation size={12} />
          <span>Open Google Maps</span>
          <ExternalLink size={12} />
        </a>
      </div>

      <div style={{ height, width: '100%', position: 'relative' }}>
        <iframe
          title="Google Maps Location Preview"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={embedUrl}
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
}
