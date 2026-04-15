import React from 'react';
import { useGameInfo } from '../context/GameContext';
import { User, Target, Flame, Calendar, Trophy, Zap, Info } from 'lucide-react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip as ChartTooltip } from 'recharts';

const Dashboard = () => {
  const { stats, getRank, history, resetGame } = useGameInfo();
  
  const rank = getRank(stats.level);
  const progressPercent = Math.min((stats.xp / stats.requiredXp) * 100, 100);

  const radarData = [
    { subject: 'STR', A: Number(stats.strength) || 10, fullMark: 100 },
    { subject: 'SPD', A: Number(stats.speed) || 10, fullMark: 100 },
    { subject: 'INT', A: Number(stats.intelligence) || 10, fullMark: 100 },
    { subject: 'DIS', A: Number(stats.discipline) || 10, fullMark: 100 },
  ];

  return (
    <div className="animate-pop" style={{ position: 'relative' }}>
      <div className="system-scan"></div>
      
      {/* Player Header - "Status Window" */}
      <div className="card mb-4" style={{border: '1px solid var(--accent-color)', background: 'linear-gradient(135deg, rgba(6, 10, 20, 0.9), rgba(0, 243, 255, 0.05))'}}>
        <div className="player-header">
          <div className="avatar-placeholder">
            <User size={40} color="var(--accent-color)" />
          </div>
          
          <div className="player-info" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className="title-glitch" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{stats.playerName || 'PLAYER'}</h2>
                <div className={`rank-badge`} style={{ backgroundColor: `var(--rank-${rank.split('-')[0].toLowerCase()})`, color: '#000', borderRadius: '2px', padding: '0.1rem 0.5rem' }}>
                  {rank}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-color)', textShadow: 'var(--accent-glow)', lineHeight: 1 }}>
                   Lv. {stats.level}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--accent-color)' }}>
                <span>[EXPERIENCE_PROGRESS]</span>
                <span>{stats.xp} / {stats.requiredXp} XP</span>
              </div>
              <div className="progress-container" style={{ height: '0.75rem', borderRadius: '2px' }}>
                <div className="progress-bar" style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, var(--accent-color), #fff)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Attributes Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="flex items-center gap-2"><Zap size={20} color="var(--accent-color)" /> ATTRIBUTES</h3>
          </div>
          <div style={{ height: '280px', width: '100%', marginTop: '-20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(0, 243, 255, 0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: '800' }} />
                <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 10']} tick={false} axisLine={false} />
                <Radar name="Player Stats" dataKey="A" stroke="var(--accent-color)" fill="var(--accent-color)" fillOpacity={0.4} />
                <ChartTooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--accent-color)', color: 'var(--text-primary)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {['strength', 'speed', 'intelligence', 'discipline'].map(s => (
              <div key={s} className="stat-item" style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{s.toUpperCase()}</span>
                <span className="font-bold" style={{ color: 'var(--accent-color)' }}>{stats[s]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="flex items-center gap-2"><Info size={20} color="var(--accent-color)" /> SYSTEM_STATUS</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
             <div className="stat-item" style={{ fontSize: '1.1rem', padding: '1rem', background: 'rgba(255, 45, 85, 0.05)', border: '1px solid rgba(255, 45, 85, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Flame color="var(--danger-color)" size={20} />
                 <span>SYNC_STREAK</span>
              </div>
              <span className="font-bold" style={{ color: 'var(--danger-color)' }}>{stats.streak} DAYS</span>
            </div>

            <div className="stat-item" style={{ fontSize: '1.1rem', padding: '1rem', background: 'rgba(0, 255, 170, 0.05)', border: '1px solid rgba(0, 255, 170, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Calendar color="var(--success-color)" size={20} />
                 <span>ACTIVE_TIME</span>
              </div>
              <span className="font-bold" style={{ color: 'var(--success-color)' }}>{history.length + 1} DAYS</span>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
               <div className="stat-item" style={{ padding: '1rem', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', border: '1px solid var(--accent-color)', background: 'rgba(0, 243, 255, 0.03)' }}>
                 <div className="flex items-center gap-2">
                    <Trophy color="var(--accent-color)" size={18} />
                    <span className="font-bold" style={{ fontSize: '1rem', letterSpacing: '1px' }}>SYSTEM EVALUATION</span>
                 </div>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Current Rating: <span className="text-accent font-bold">{rank}</span>. 
                    The Player has shown consistent progress in real-world attributes. Continue training to reach for S-Rank.
                 </p>
               </div>

               <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 45, 85, 0.1)' }}>
                 <h4 style={{ color: 'var(--danger-color)', marginBottom: '0.75rem', fontSize: '0.75rem', opacity: 0.8, fontWeight: 900 }}>[ SYSTEM RE-INITIALIZATION ]</h4>
                 <button 
                   className="danger" 
                   style={{ width: '100%', fontSize: '0.8rem', padding: '0.6rem', border: '1px solid var(--danger-color)', background: 'transparent' }}
                   onClick={() => {
                     if(window.confirm('WARNING: PERMANENT DATA WIPE. ALL PROGRESS WILL BE LOST. CONTINUE?')) {
                       resetGame();
                     }
                   }}
                 >
                   RESET ALL PROGRESS
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
