import React from 'react';

const MonthlySummary = ({ stats = [] }) => {
  const defaultStats = [
    { label: 'Consistency', value: '0%', color: 'var(--primary)' },
    { label: 'Total Habits', value: '0', color: 'var(--success)' },
    { label: 'Missed Days', value: '0', color: 'var(--danger)' },
    { label: 'Points Earned', value: '0', color: 'var(--warning)' },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1.5rem', fontWeight: '700', fontSize: '1.125rem' }}>Monthly Performance</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {displayStats.map(stat => (
          <div key={stat.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
              <span style={{ fontWeight: '700', color: stat.color }}>{stat.value}</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ 
                width: stat.value.includes('%') ? stat.value : (parseInt(stat.value) > 0 ? '100%' : '0%'), 
                height: '100%', 
                background: stat.color,
                boxShadow: `0 0 8px ${stat.color}`,
                transition: 'width 0.5s ease-out'
              }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlySummary;
