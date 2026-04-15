import React from 'react';
import { useGameInfo } from '../context/GameContext';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const Notifications = () => {
  const { notifications } = useGameInfo();

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
      {notifications.map(n => (
        <div key={n.id} className="animate-pop" style={{
          backgroundColor: 'var(--panel-bg)',
          border: `1px solid ${n.type === 'success' ? 'var(--success-color)' : n.type === 'error' ? 'var(--danger-color)' : 'var(--accent-color)'}`,
          padding: '1rem 1.5rem',
          borderRadius: '0.25rem',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          minWidth: '250px',
          pointerEvents: 'auto'
        }}>
          {n.type === 'success' ? <CheckCircle color="var(--success-color)" size={20} /> :
           n.type === 'error' ? <AlertCircle color="var(--danger-color)" size={20} /> :
           <Info color="var(--accent-color)" size={20} />}
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{n.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
