import React, { useState } from 'react';
import { useGameInfo } from '../context/GameContext';
import { Plus, Check, X, Filter, Target, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['All', 'Workout', 'Study', 'MMA', 'Productivity'];
const STATS = ['strength', 'speed', 'intelligence', 'discipline'];

const Quests = () => {
  const { quests, completeQuest, addQuest, deleteQuest, loading } = useGameInfo();
  
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuest, setNewQuest] = useState({ title: '', questType: 'main', category: 'Workout', xpReward: 25, stat: 'strength' });

  if (loading) return <div>[SYNCHRONIZING_SYSTEM_DATA...]</div>;

  const activeQuests = quests.filter(q => !q.completed && (filter === 'All' || q.category === filter));
  const dailyQuests = activeQuests.filter(q => q.questType === 'daily' || q.isDaily);
  const mainQuests = activeQuests.filter(q => q.questType === 'main' || !q.questType);
  const minorQuests = activeQuests.filter(q => q.questType === 'minor');
  const completedQuests = quests.filter(q => q.completed && (filter === 'All' || q.category === filter));

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newQuest.title.trim() === '') return;
    addQuest({ ...newQuest, xpReward: parseInt(newQuest.xpReward, 10) });
    setShowAddModal(false);
    setNewQuest({ title: '', questType: 'main', category: 'Workout', xpReward: 25, stat: 'strength' });
  };

  return (
    <div className="animate-pop">
      <div className="card-header" style={{ marginBottom: '1.5rem', borderBottom: 'none' }}>
        <h2 className="title-glitch flex items-center gap-2"><Target size={24} color="var(--accent-color)" /> SYSTEM_QUESTS</h2>
        <button className="flex items-center gap-2" onClick={() => setShowAddModal(true)} style={{ borderRadius: '2px', fontSize: '0.8rem' }}>
          <Plus size={16} /> NEW_QUEST
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <Filter size={18} color="var(--accent-color)" style={{ alignSelf: 'center', marginRight: '0.5rem', opacity: 0.5 }} />
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`icon-btn ${filter === cat ? 'active' : ''}`}
            style={{ 
              backgroundColor: filter === cat ? 'var(--accent-color)' : 'rgba(0,0,0,0.3)',
              color: filter === cat ? '#000' : 'var(--text-secondary)',
              border: filter === cat ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
              borderRadius: '2px', padding: '0.3rem 1.25rem', fontSize: '0.75rem', fontWeight: 900
            }}
            onClick={() => setFilter(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {/* Daily Prerequisite - Urgent Notification Logic */}
        {dailyQuests.length > 0 && (
          <div className="card" style={{ borderColor: 'var(--danger-color)', background: 'rgba(255, 45, 85, 0.05)', position: 'relative' }}>
             <div className="system-scan"></div>
             <h3 className="flex items-center gap-2" style={{ color: 'var(--danger-color)', marginBottom: '1.25rem', fontWeight: 900 }}>
               <AlertTriangle size={20} /> [URGENT] DAILY MISSION
             </h3>
             <div className="quest-list">
                {dailyQuests.map(q => (
                  <QuestItem key={q.id} quest={q} onComplete={completeQuest} onDelete={deleteQuest} isUrgent />
                ))}
             </div>
          </div>
        )}

        {/* Regular Quests */}
        <div className="card">
           <h3 style={{ marginBottom: '1.25rem', fontWeight: 900, color: 'var(--accent-color)' }}>ACTIVE_QUEST_LOG ({mainQuests.length + minorQuests.length})</h3>
           {activeQuests.length === 0 ? (
             <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>[ NO_ACTIVE_QUESTS_FOUND ]</p>
           ) : (
             <div className="quest-list">
                {mainQuests.map(q => <QuestItem key={q.id} quest={q} onComplete={completeQuest} onDelete={deleteQuest} />)}
                {minorQuests.map(q => <QuestItem key={q.id} quest={q} onComplete={completeQuest} onDelete={deleteQuest} />)}
             </div>
           )}
        </div>

        {/* Completed History */}
        {completedQuests.length > 0 && (
          <div className="card" style={{ opacity: 0.6, borderStyle: 'dashed' }}>
             <h3 style={{ marginBottom: '1.25rem', fontWeight: 900, color: 'var(--success-color)' }}>COMPLETED_CLEARED ({completedQuests.length})</h3>
             <div className="quest-list">
                {completedQuests.map(q => (
                   <div key={q.id} className="quest-item" style={{ borderLeft: '3px solid var(--success-color)', opacity: 0.8 }}>
                      <div className="quest-info" style={{ textDecoration: 'line-through' }}>
                        <span className="quest-title">{q.title}</span>
                        <div className="quest-meta">
                          <span>[{q.category.toUpperCase()}]</span>
                          <span style={{ color: 'var(--success-color)' }}>+{q.xpReward} XP</span>
                        </div>
                      </div>
                      <Check size={20} color="var(--success-color)" />
                   </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-pop" style={{ border: '1px solid var(--accent-color)', boxShadow: 'var(--accent-glow)' }}>
            <h2 className="title-glitch" style={{ marginBottom: '1.5rem', color: 'var(--accent-color)', fontSize: '1.5rem' }}>DEPLOY_NEW_QUEST</h2>
            <form onSubmit={handleAddSubmit}>
              <div>
                <label className="text-xs" style={{ color: 'var(--accent-color)', marginBottom: '0.25rem', display: 'block' }}>MISSION_DETAILS</label>
                <input type="text" value={newQuest.title} onChange={(e) => setNewQuest({...newQuest, title: e.target.value.toUpperCase()})} placeholder="E.G. 10KM RUN" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>CATEGORY</label>
                  <select value={newQuest.category} onChange={(e) => setNewQuest({...newQuest, category: e.target.value})}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>STRENGTH_STAT</label>
                  <select value={newQuest.stat} onChange={(e) => setNewQuest({...newQuest, stat: e.target.value})}>
                    {STATS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                 <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', flex: 1 }}>ABORT</button>
                 <button type="submit" style={{ flex: 2 }}>DEPLOY</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const QuestItem = ({ quest, onComplete, onDelete, isUrgent }) => (
  <div className="quest-item" style={{ 
    borderLeft: isUrgent ? '4px solid var(--danger-color)' : quest.questType === 'main' ? '4px solid var(--success-color)' : '4px solid var(--accent-color)',
    background: 'rgba(0,0,0,0.2)',
    padding: '1.25rem'
  }}>
    <div className="quest-info">
       <span className="quest-title" style={{ color: isUrgent ? 'var(--danger-color)' : 'inherit', letterSpacing: '0.5px' }}>
         {isUrgent ? '⚠️ ' : quest.questType === 'main' ? '⭐ ' : ''} {quest.title}
       </span>
       <div className="quest-meta">
         <span style={{ color: 'var(--accent-color)', fontWeight: 800 }}>[{quest.category.toUpperCase()}]</span>
         <span style={{ color: 'var(--success-color)' }}>+{quest.xpReward} XP</span>
         <span style={{ color: 'var(--rank-b)' }}>+{quest.stat.toUpperCase()}</span>
       </div>
    </div>
    <div className="quest-actions">
       <button className="success" onClick={() => onComplete(quest.id)} style={{ padding: '0.5rem', minWidth: '40px', borderRadius: '2px' }}>
         <Check size={20} />
       </button>
       <button onClick={() => onDelete(quest.id)} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.5rem', minWidth: '40px', borderRadius: '2px' }}>
         <X size={20} />
       </button>
    </div>
  </div>
);

export default Quests;
