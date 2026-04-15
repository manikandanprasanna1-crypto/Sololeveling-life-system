import React, { useState, useEffect, useRef } from 'react';
import { useGameInfo } from '../context/GameContext';
import { Play, Pause, RotateCcw, Target, Dumbbell, Clock, Plus, Zap } from 'lucide-react';

const Training = () => {
  const { addAndCompleteQuest, stats } = useGameInfo();
  const [activeTab, setActiveTab] = useState('timer'); // timer or logger

  // --- MMA Timer State ---
  const [time, setTime] = useState(300); // 5 mins
  const [isActive, setIsActive] = useState(false);
  const [timerType, setTimerType] = useState('work'); // work or rest
  const [restTime, setRestTime] = useState(60); // 1 min rest
  const [rounds, setRounds] = useState(3);
  const [currentRound, setCurrentRound] = useState(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(intervalRef.current);
      if (timerType === 'work' && currentRound < rounds) {
        setTimerType('rest');
        setTime(restTime);
        setIsActive(true);
      } else if (timerType === 'rest') {
        setTimerType('work');
        setTime(300);
        setCurrentRound(prev => prev + 1);
        setIsActive(true);
      } else if (timerType === 'work' && currentRound === rounds) {
         setIsActive(false);
         // Auto-log a mission completion
         const questTitle = `COMPLETED_COMBAT_TRAINING: ${rounds} ROUNDS`;
         handleQuickLog(questTitle, 'MMA', 50, 'speed');
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, time, timerType, currentRound, rounds, restTime]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimerType('work');
    setTime(300);
    setCurrentRound(1);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- Workout Logger State ---
  const [logDetails, setLogDetails] = useState({ title: '', intensity: 'MEDIUM', stat: 'strength' });

  const handleQuickLog = async (title, category, xp, stat) => {
    await addAndCompleteQuest({
      title: title.toUpperCase(),
      category: category,
      xpReward: xp,
      stat: stat,
      questType: 'minor'
    });
  };

  return (
    <div className="animate-pop">
       <div className="card-header" style={{ marginBottom: '1.5rem', borderBottom: 'none' }}>
        <h2 className="title-glitch flex items-center gap-2"><Dumbbell size={24} color="var(--accent-color)" /> TRAINING_FACILITY</h2>
      </div>

       <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
        <button 
          onClick={() => setActiveTab('timer')}
          style={{ 
            backgroundColor: activeTab === 'timer' ? 'var(--accent-color)' : 'rgba(0,0,0,0.3)', 
            border: activeTab === 'timer' ? '1px solid var(--accent-color)' : '1px solid var(--border-color)', 
            color: activeTab === 'timer' ? '#000' : 'var(--text-secondary)',
            flex: 1, borderRadius: '2px', fontSize: '0.8rem'
          }}
        >
          [ COMBAT_CHRONO ]
        </button>
        <button 
          onClick={() => setActiveTab('logger')}
          style={{ 
            backgroundColor: activeTab === 'logger' ? 'var(--accent-color)' : 'rgba(0,0,0,0.3)', 
            border: activeTab === 'logger' ? '1px solid var(--accent-color)' : '1px solid var(--border-color)', 
            color: activeTab === 'logger' ? '#000' : 'var(--text-secondary)',
            flex: 1, borderRadius: '2px', fontSize: '0.8rem'
          }}
        >
          [ PHYSICAL_LOG ]
        </button>
      </div>

      {activeTab === 'timer' && (
        <div className="card" style={{ textAlign: 'center', background: 'rgba(0, 243, 255, 0.02)', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
          <div className="system-scan"></div>
          <h3 style={{ color: timerType === 'work' ? 'var(--danger-color)' : 'var(--success-color)', fontWeight: 900, letterSpacing: '2px' }}>
            {timerType === 'work' ? 'SYSTEM_INITIALIZING: WORK' : 'SYSTEM_RECOVERY: REST'}
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>ROUND {currentRound} / {rounds}</p>
          
          <div style={{ fontSize: '6.5rem', fontWeight: '900', fontFamily: 'monospace', margin: '1.5rem 0', color: 'var(--text-primary)', textShadow: 'var(--accent-glow)', letterSpacing: '-2px' }}>
            {formatTime(time)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
             <button onClick={toggleTimer} style={{ width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-color)', border: 'none', boxShadow: 'var(--accent-glow)' }}>
                 {isActive ? <Pause size={30} color="#000" /> : <Play size={30} color="#000" fill="#000" />}
             </button>
             <button onClick={resetTimer} style={{ width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                 <RotateCcw size={30} />
             </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', textAlign: 'left', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
            <div>
              <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>WORK_SEC</label>
              <input type="number" defaultValue="300" disabled={isActive} onChange={(e) => { if (!isActive) { setTime(parseInt(e.target.value)); } }} />
            </div>
            <div>
              <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>REST_SEC</label>
              <input type="number" defaultValue="60" disabled={isActive} onChange={(e) => setRestTime(parseInt(e.target.value))} />
            </div>
            <div>
              <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>ROUNDS</label>
              <input type="number" defaultValue="3" disabled={isActive} onChange={(e) => setRounds(parseInt(e.target.value))} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logger' && (
        <div className="card" style={{ background: 'rgba(0, 243, 255, 0.02)' }}>
          <div className="system-scan"></div>
          <h3 className="mb-6" style={{ fontWeight: 900, color: 'var(--accent-color)' }}>MANUAL_ACTIVITY_LOG</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem' }}>
             <div className="stat-item" style={{ flexDirection: 'column', alignItems: 'flex-start', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', padding: '1.5rem' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={20} color="var(--rank-s)" />
                  <span className="font-bold">QUICK_SYNC_MISSIONS</span>
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   <QuickLogBtn title="WEIGHT_TRAINING_SESSION" reward="40 XP / +STR" onClick={() => handleQuickLog('Weight Training', 'Workout', 40, 'strength')} />
                   <QuickLogBtn title="CARDIO_HIIT_BLAST" reward="35 XP / +SPD" onClick={() => handleQuickLog('Cardio HIIT', 'Workout', 35, 'speed')} />
                   <QuickLogBtn title="SPARRING_TECHNIQUE_WORK" reward="50 XP / +SPD" onClick={() => handleQuickLog('Sparring Session', 'MMA', 50, 'speed')} />
                   <QuickLogBtn title="DEEP_COGNITIVE_STUDY" reward="30 XP / +INT" onClick={() => handleQuickLog('Deep Study', 'Study', 30, 'intelligence')} />
                </div>
             </div>

             <div className="stat-item" style={{ background: 'rgba(0, 243, 255, 0.05)', border: '1px solid var(--accent-color)', padding: '1.5rem' }}>
                <div className="flex items-center gap-2">
                   <Target size={20} color="var(--accent-color)" />
                   <div>
                      <div className="font-bold">STATUS_CHECK</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        CURRENT_STRENGTH: <span className="text-accent">{stats.strength}</span> | 
                        CURRENT_SPEED: <span className="text-accent">{stats.speed}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const QuickLogBtn = ({ title, reward, onClick }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0.75rem 1rem', 
    background: 'rgba(255,255,255,0.03)', 
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }}
  className="hover-bright"
  onClick={onClick}
  >
    <div style={{ display: 'flex', flexDirection: 'column' }}>
       <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.5px' }}>{title}</span>
       <span className="text-xs" style={{ color: 'var(--success-color)', opacity: 0.8 }}>{reward}</span>
    </div>
    <Plus size={18} color="var(--accent-color)" />
  </div>
);

export default Training;
