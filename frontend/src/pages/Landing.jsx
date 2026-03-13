import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Trophy, Target, CheckCircle } from 'lucide-react';

const Landing = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      color: 'var(--text-main)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Soft background glows */}
      <div style={{
        position: 'fixed', top: '-15%', left: '-10%',
        width: '55vw', height: '55vw',
        background: 'radial-gradient(circle, rgba(124,110,247,0.09) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', right: '-10%',
        width: '45vw', height: '45vw',
        background: 'radial-gradient(circle, rgba(240,150,94,0.07) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Minimal top nav */}
      <nav style={{
        padding: '1.5rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <span className="logo" style={{ fontSize: '1.6rem' }}>HabitChain</span>

      </nav>

      {/* Hero */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '5rem 3rem 3rem',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '5rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.9rem',
            borderRadius: '99px',
            background: 'rgba(124,110,247,0.12)',
            border: '1px solid rgba(124,110,247,0.22)',
            fontSize: '0.8rem',
            color: 'var(--primary)',
            fontWeight: 600,
            marginBottom: '2rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            <Activity size={13} /> Habit Tracker
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            color: 'var(--text-main)'
          }}>
            Build streaks.<br />
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(120deg, var(--primary), #b8aff8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Earn your level.</span>
          </h1>

          <p style={{
            fontSize: '1.075rem',
            color: 'var(--text-sub)',
            lineHeight: 1.75,
            maxWidth: '440px',
            marginBottom: '2.5rem'
          }}>
            A calm, focused space to track the habits that matter. Earn XP, climb the leaderboard, and actually stick to your goals.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{
              padding: '0.8rem 2rem',
              fontSize: '0.95rem',
              borderRadius: '99px',
              textDecoration: 'none'
            }}>
              Get started — it's free
            </Link>
          </div>

          {/* Social proof line */}
          <p style={{
            marginTop: '2rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <CheckCircle size={14} color="var(--success)" /> No credit card required
          </p>
        </div>

        {/* Right — feature cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            {
              icon: <Target size={20} color="var(--primary)" />,
              title: 'Daily Habit Tracking',
              desc: 'Track any habit with custom goals, frequencies, and color-coded categories.'
            },
            {
              icon: <Trophy size={20} color="var(--warning)" />,
              title: 'Global Leaderboard',
              desc: 'Compete with the community. Real XP, real rankings, real motivation.'
            },
            {
              icon: <Activity size={20} color="var(--success)" />,
              title: 'Calendar Heatmap',
              desc: 'Visualize your consistency month by month. Streaks you can actually see.'
            }
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{
              padding: '1.4rem 1.6rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              marginLeft: i === 1 ? '1.5rem' : i === 2 ? '3rem' : '0'
            }}>
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.3rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
