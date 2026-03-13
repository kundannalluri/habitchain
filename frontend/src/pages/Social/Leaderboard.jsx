import React, { useState, useEffect } from 'react';
import { Trophy, Award, TrendingUp } from 'lucide-react';
import { authApi } from '../../api';

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardRes, meRes] = await Promise.all([
          authApi.getLeaderboard(),
          authApi.getMe()
        ]);
        setTopUsers(leaderboardRes.data);
        setCurrentUser(meRes.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading rankings...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Global Leaderboard 🏆</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Top performers this month across the HabitChain community</p>
      </header>

      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'grid', gridTemplateColumns: '80px 1fr 150px 150px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <span>RANK</span>
          <span>USER</span>
          <span style={{ textAlign: 'center' }}>LEVEL</span>
          <span style={{ textAlign: 'right' }}>POINTS</span>
        </div>

        {topUsers.map((user, index) => (
          <div key={user.id} style={{ 
            padding: '1.5rem 2rem', 
            display: 'grid', 
            gridTemplateColumns: '80px 1fr 150px 150px', 
            alignItems: 'center',
            borderBottom: index < topUsers.length - 1 ? '1px solid var(--glass-border)' : 'none',
            background: user.id === currentUser?.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
          }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: index === 0 ? 'var(--warning)' : 'var(--text-muted)' }}>
              #{index + 1}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: '600' }}>{user.username} {user.id === currentUser?.id && '(You)'}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span className="streak-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
                Lv. {user.level}
              </span>
            </div>
            <span style={{ textAlign: 'right', fontWeight: '800', color: 'var(--primary)' }}>{user.points.toLocaleString()} XP</span>
          </div>
        ))}

        {topUsers.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No legends yet. Start your journey to appear here! 🚀
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
