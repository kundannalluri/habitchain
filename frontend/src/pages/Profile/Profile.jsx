import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api';
import { User, Award, Zap, Target, LogOut, Key, TrendingUp, Calendar, Flame, Shield } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Change Password
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState({ msg: '', isError: false });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userRes, statsRes, badgesRes] = await Promise.all([
          authApi.getMe(),
          authApi.getStats(),
          authApi.getBadges()
        ]);
        setUser(userRes.data);
        setStats(statsRes.data);
        setBadges(badgesRes.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) {
      setPwStatus({ msg: "New passwords don't match.", isError: true });
      return;
    }
    if (pwForm.newPw.length < 6) {
      setPwStatus({ msg: 'Password must be at least 6 characters.', isError: true });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/reset-password`,
        { new_password: pwForm.newPw },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPwStatus({ msg: 'Password changed successfully! ✓', isError: false });
      setPwForm({ current: '', newPw: '', confirm: '' });
      setTimeout(() => { setShowChangePassword(false); setPwStatus({ msg: '', isError: false }); }, 2000);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to change password.';
      setPwStatus({ msg: detail, isError: true });
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading profile...</div>;

  // XP / Level calculations
  const currentLevelXp = Math.pow(user?.level - 1, 2) * 100;
  const nextLevelXp = Math.pow(user?.level, 2) * 100;
  const xpIntoLevel = (user?.points || 0) - currentLevelXp;
  const xpNeededForLevel = nextLevelXp - currentLevelXp;
  const xpPercent = Math.min(100, Math.round((xpIntoLevel / xpNeededForLevel) * 100));

  // Consistency
  const daysPassed = new Date().getDate();
  const expectedCompletions = (stats?.total_habits || 0) * daysPassed;
  const consistency = expectedCompletions > 0
    ? Math.min(100, Math.round((stats.total_completions / expectedCompletions) * 100))
    : 0;

  const statRow = (label, value, color = 'var(--text-main)') => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{label}</span>
      <span style={{ fontWeight: '700', color }}>{value}</span>
    </div>
  );

  return (
    <div style={{ padding: '2rem 0' }}>
      {/* ─── Header ─── */}
      <header className="glass-card" style={{ padding: '3rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
            <User size={64} />
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{user?.username}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.4rem 1.2rem', borderRadius: '2rem', background: 'rgba(99,102,241,0.2)', color: 'var(--primary)', fontWeight: '700' }}>
                🏅 Level {user?.level}
              </span>
              <span style={{ padding: '0.4rem 1.2rem', borderRadius: '2rem', background: 'rgba(245,158,11,0.2)', color: 'var(--warning)', fontWeight: '700' }}>
                ⚡ {user?.points} XP
              </span>
              <span style={{ padding: '0.4rem 1.2rem', borderRadius: '2rem', background: 'rgba(16,185,129,0.2)', color: 'var(--success)', fontWeight: '700' }}>
                🏆 {badges.length} Badges
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button onClick={() => setShowChangePassword(p => !p)} className="btn glass-card"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', padding: '0.85rem 1.75rem' }}>
            <Key size={18} /> Change Password
          </button>
          <button onClick={handleLogout} className="btn glass-card"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--danger)', borderColor: 'rgba(244,63,94,0.2)', padding: '0.85rem 1.75rem' }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </header>

      {/* ─── Change Password Panel ─── */}
      {showChangePassword && (
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Key size={20} color="var(--primary)" /> Change Password
          </h3>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <input type="password" placeholder="New Password" value={pwForm.newPw}
              onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))}
              className="input" style={{ background: 'var(--bg-elevated)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.85rem 1.25rem' }} required />
            <input type="password" placeholder="Confirm New Password" value={pwForm.confirm}
              onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
              className="input" style={{ background: 'var(--bg-elevated)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.85rem 1.25rem' }} required />
            {pwStatus.msg && (
              <p style={{ color: pwStatus.isError ? 'var(--danger)' : 'var(--success)', fontSize: '0.875rem' }}>{pwStatus.msg}</p>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn" style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '700' }}>
                Update Password
              </button>
              <button type="button" onClick={() => setShowChangePassword(false)} className="btn glass-card"
                style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── XP Progress ─── */}
      <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TrendingUp size={20} color="var(--primary)" /> Level Progress
          </h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {xpIntoLevel} / {xpNeededForLevel} XP → Level {(user?.level || 0) + 1}
          </span>
        </div>
        <div style={{ height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '1rem', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${xpPercent}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            borderRadius: '1rem',
            transition: 'width 0.8s ease'
          }} />
        </div>
        <p style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{xpPercent}% to next level</p>
      </div>

      {/* ─── Main Grid ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Stats */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Zap size={18} color="var(--primary)" /> Statistics
            </h3>
            {statRow('Total Habits', stats?.total_habits)}
            {statRow('Total Completions', stats?.total_completions)}
            {statRow('Consistency', `${consistency}%`, consistency >= 80 ? 'var(--success)' : consistency >= 50 ? 'var(--warning)' : 'var(--danger)')}
            {statRow('Member Since', new Date(user?.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }))}
          </div>

          {/* Quick Actions */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={18} color="var(--secondary)" /> Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <div style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}>
                  📋 Go to Dashboard
                </div>
              </Link>
              <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
                <div style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}>
                  🏆 View Leaderboard
                </div>
              </Link>
              <div onClick={() => setShowChangePassword(true)} style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}>
                🔑 Change Password
              </div>
              <div onClick={handleLogout} style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', background: 'rgba(244,63,94,0.1)', color: 'var(--danger)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}>
                🚪 Sign Out
              </div>
            </div>
          </div>
        </div>

        {/* ─── Badges ─── */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Award size={22} color="var(--warning)" /> Earned Badges
            <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '400' }}>{badges.length} unlocked</span>
          </h3>
          {badges.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: '1.25rem' }}>
              {badges.map(badge => (
                <div key={badge.id} style={{ textAlign: 'center', padding: '1.5rem 1rem', borderRadius: '1.25rem', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', transition: 'transform 0.2s, background 0.2s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(245,158,11,0.05)'; }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{badge.icon}</div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.4rem' }}>{badge.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{badge.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <Award size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No badges earned yet.</p>
              <p style={{ fontSize: '0.875rem' }}>Complete habits and build streaks to unlock rewards!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
