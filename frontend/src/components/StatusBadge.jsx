import React from 'react';
import { Clock, UserCheck, CheckCircle2, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const normalized = (status || 'Pending').toLowerCase();

  let badgeClass = 'badge-pending';
  let Icon = Clock;

  if (normalized === 'assigned') {
    badgeClass = 'badge-assigned';
    Icon = UserCheck;
  } else if (normalized === 'collected') {
    badgeClass = 'badge-collected';
    Icon = CheckCircle2;
  } else if (normalized === 'cancelled') {
    badgeClass = 'badge-cancelled';
    Icon = XCircle;
  }

  return (
    <span className={`badge ${badgeClass}`} style={{ gap: '0.25rem' }}>
      <Icon size={12} />
      <span>{status}</span>
    </span>
  );
}
