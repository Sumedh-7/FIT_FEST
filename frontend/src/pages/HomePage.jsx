import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, ShieldCheck, ArrowRight, Leaf, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        padding: '3.5rem 0 3.5rem 0'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          {/* Left Text */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              backgroundColor: 'var(--accent-green-light)',
              border: '1px solid var(--accent-green-border)',
              color: 'var(--accent-green-text)',
              padding: '0.375rem 0.875rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '1.25rem'
            }}>
              <MapPin size={14} /> Official Municipal Environmental Portal — Pune
            </div>

            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.25,
              marginBottom: '1rem'
            }}>
              Responsible Waste Collection, Made Simple
            </h1>

            <p style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}>
              Schedule doorstep waste pickups in Pune, track collection requests in real time, and help ensure household waste reaches designated processing channels.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/request" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}>
                <span>Request a Pickup</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/track" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}>
                <span>Track Request</span>
                <Search size={18} />
              </Link>
            </div>
          </div>

          {/* Right Image Banner */}
          <div>
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: 'var(--bg-subtle)'
            }}>
              <img
                src="/hero_banner.png"
                alt="EcoCollect Municipal Waste Collection Vehicle in Pune"
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '360px', objectFit: 'cover' }}
              />
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-surface)',
                borderTop: '1px solid var(--border-light)',
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Municipal Logistics Fleet — Pune City</span>
                <strong style={{ color: 'var(--accent-green)' }}>Verified Channel</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Civic Waste Services for Pune Citizens</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Designed for transparency, logistics efficiency, and environmental compliance across Pune Municipal Corporation areas.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Feature 1 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '2.75rem',
                height: '2.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-green-light)',
                color: 'var(--accent-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Easy Pickup Requests</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                Submit doorstep waste pickup requests for Shivajinagar, Kothrud, Baner, Viman Nagar, Aundh, Hadapsar, and all Pune sectors in under 2 minutes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '2.75rem',
                height: '2.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-green-light)',
                color: 'var(--accent-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Leaf size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Clear Segregation Guidance</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                Instant disposal instructions for E-Waste, Organic, Recyclables, General, and Hazardous items to ensure proper recycling stream separation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '2.75rem',
                height: '2.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-green-light)',
                color: 'var(--accent-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Search size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Transparent Tracking</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                Every request receives a unique tracking code (e.g. EC-1001). Citizens can follow real-time progress from submission to driver collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Bins & How It Works */}
      <section style={{
        padding: '4rem 0',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <img
                  src="/waste_bins.png"
                  alt="Municipal Waste Segregation Bins in Pune"
                  style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '320px', objectFit: 'cover' }}
                />
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
                3 Simple Steps to Schedule Pickup
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '2.25rem',
                    height: '2.25rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--accent-green)',
                    color: '#fff',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>1</div>
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Select Waste Category</strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Choose organic, recyclable, general, e-waste or hazardous waste to view specific disposal rules.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '2.25rem',
                    height: '2.25rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--accent-green)',
                    color: '#fff',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>2</div>
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Schedule Address & Time</strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Provide citizen name, Pune contact phone number, and select preferred morning or afternoon pickup window.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '2.25rem',
                    height: '2.25rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--accent-green)',
                    color: '#fff',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>3</div>
                  <div>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Track Collection Status</strong>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Receive your unique EC-1001 tracking ID and monitor assignment & collection updates live.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
