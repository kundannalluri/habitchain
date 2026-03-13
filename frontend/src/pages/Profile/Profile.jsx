import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { User, Award, Zap, Target, LogOut } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <header className="glass-card" style={{ padding: '3rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <User size={64} />
          </div>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>{user?.username}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <span style={{ padding: '0.5rem 1.5rem', borderRadius: '2rem', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', fontWeight: '600' }}>
                Level {user?.level}
              </span>
              <span style={{ padding: '0.5rem 1.5rem', borderRadius: '2rem', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', fontWeight: '600' }}>
                {user?.points} Points
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="btn glass-card" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            color: 'var(--danger)', 
            borderColor: 'rgba(244, 63, 94, 0.2)',
            padding: '1rem 2rem'
          }}
        >
          <LogOut size={20} /> Sign Out
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Zap size={20} color="var(--primary)" /> Statistics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Habits</span>
                <span style={{ fontWeight: '700' }}>{stats?.total_habits}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Completions</span>
                <span style={{ fontWeight: '700' }}>{stats?.total_completions}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Join Date</span>
                <span style={{ fontWeight: '700' }}>{new Date(user?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Target size={20} color="var(--success)" /> Consistency
            </h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--success)' }}>
                {stats?.total_habits > 0 ? Math.round((stats.total_completions / (stats.total_habits * 30)) * 100) : 0}%
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Based on last 30 days</p>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Award size={24} color="var(--warning)" /> Earned Badges
          </h3>
          {badges.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '2rem' }}>
              {badges.map(badge => (
                <div key={badge.id} style={{ textAlign: 'center', padding: '1.5rem', borderRadius: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                   <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{badge.icon}</div>
                   <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{badge.name}</h4>
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{badge.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <Award size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>No badges earned yet. Keep going!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
