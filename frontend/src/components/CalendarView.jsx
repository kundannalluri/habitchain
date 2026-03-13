import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ history = [], title = "Monthly History" }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const now = new Date();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  
  const completionDays = history
    .map(dateStr => new Date(dateStr))
    .filter(d => d.getMonth() === month && d.getFullYear() === year)
    .map(d => d.getDate());

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontWeight: '700', fontSize: '1.125rem', margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.25rem', borderRadius: '0.5rem' }} className="hover:bg-white/5">
            <ChevronLeft size={20} />
          </button>
          <span style={{ color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 600, minWidth: '110px', textAlign: 'center' }}>
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} disabled={month === now.getMonth() && year === now.getFullYear()} style={{ background: 'none', border: 'none', color: month === now.getMonth() && year === now.getFullYear() ? 'rgba(255,255,255,0.1)' : 'var(--text-muted)', cursor: month === now.getMonth() && year === now.getFullYear() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', padding: '0.25rem', borderRadius: '0.5rem' }} className="hover:bg-white/5">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={`${day}-${index}`} style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', paddingBottom: '0.5rem' }}>
            {day}
          </div>
        ))}
        {blanks.map(blank => (
          <div key={`blank-${blank}`} style={{ aspectRatio: '1' }}></div>
        ))}
        {days.map(day => {
          const isCompleted = completionDays.includes(day);
          const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
          return (
            <div key={day} style={{
              aspectRatio: '1',
              borderRadius: '6px',
              background: isCompleted ? 'rgba(16, 185, 129, 0.4)' : (isToday ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.05)'),
              border: isCompleted ? '1px solid var(--success)' : (isToday ? '2px solid var(--primary)' : '1px solid var(--glass-border)'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isToday ? '0.875rem' : '0.75rem',
              color: isCompleted || isToday ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: isToday ? '800' : 'normal',
              boxShadow: isToday ? '0 0 10px rgba(99, 102, 241, 0.4)' : 'none'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            title={isCompleted ? 'Completed' : (isToday ? 'Today' : '')}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
