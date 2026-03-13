import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Trophy, User as UserIcon } from 'lucide-react';

const navLinkStyle = {
  color: 'var(--text-sub)',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: '0.4rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  transition: 'color 0.15s, background 0.15s'
};

export const Layout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="nav-container" style={{ margin: 0, borderRadius: 0, borderBottom: '1px solid var(--border-subtle)', background: 'rgba(17,18,23,0.85)' }}>
        <span className="logo" style={{ fontSize: '1.4rem', cursor: 'default', userSelect: 'none' }}>HabitChain</span>
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <Link to="/dashboard" style={navLinkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-sub)'; e.currentTarget.style.background = 'transparent'; }}>
            <Activity size={16} /> Dashboard
          </Link>
          <Link to="/leaderboard" style={navLinkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-sub)'; e.currentTarget.style.background = 'transparent'; }}>
            <Trophy size={16} /> Leaderboard
          </Link>
          <Link to="/profile" style={{
            ...navLinkStyle,
            marginLeft: '0.5rem',
            padding: '0.4rem 1rem',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)'
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-sub)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}>
            <UserIcon size={15} /> Profile
          </Link>
        </div>
      </nav>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 2rem', width: '100%', flex: 1 }}>
        {children}
      </main>
    </div>
  );
};
