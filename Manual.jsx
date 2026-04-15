import React from 'react';
import { Book, AlertTriangle, TrendingUp} from 'lucide-react';

const Manual = () => {
  return (
    <div className="animate-pop">
      <div className="card-header" style={{ marginBottom: '1.5rem', borderBottom: 'none' }}>
        <h2>System Manual / Guide</h2>
      </div>

      <div className="card mb-4" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', marginBottom: '1rem' }}>
          <TrendingUp size={20} />
          Leveling & Ranks
        </h3>
        <p className="text-secondary mb-4" style={{ lineHeight: '1.6' }}>
          Welcome Player. By completing Daily Quests and tasks in your real life, you accrue XP (Experience Points). 
          Accumulating enough XP will result in a Level Up. The required XP for the next level scales up by 1.2x each time.
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
          <li><strong style={{ color: 'var(--rank-e)' }}>Levels 1-9:</strong> E-Rank</li>
          <li><strong style={{ color: 'var(--rank-d)' }}>Levels 10-19:</strong> D-Rank</li>
          <li><strong style={{ color: 'var(--rank-c)' }}>Levels 20-29:</strong> C-Rank</li>
          <li><strong style={{ color: 'var(--rank-b)' }}>Levels 30-39:</strong> B-Rank</li>
          <li><strong style={{ color: 'var(--rank-a)' }}>Levels 40-49:</strong> A-Rank</li>
          <li><strong style={{ color: 'var(--rank-s)' }}>Levels 50+:</strong> S-Rank</li>
        </ul>
      </div>

      <div className="card mb-4" style={{ marginBottom: '1.5rem', border: '1px solid var(--danger-color)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-color)', marginBottom: '1rem' }}>
          <AlertTriangle size={20} />
          The Penalty Zone
        </h3>
        <p className="text-secondary" style={{ lineHeight: '1.6' }}>
          The System requires absolute discipline. Skipping a quest intentionally—or neglecting to log in and complete your daily prerequisites—will result in severe XP penalties. If your XP falls below zero, you will <strong>Level Down</strong>. Your streak will also plummet to 0.
        </p>
      </div>

      <div className="card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', marginBottom: '1rem' }}>
          <Book size={20} />
          Consistency & Mastery
        </h3>
        <p className="text-secondary" style={{ lineHeight: '1.6' }}>
          This system is a tool for tracking your real-world progress. 
          There is no virtual store or shortcuts—only the results of your daily discipline.
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <li><strong>Daily Quests:</strong> High priority tasks generated daily to keep your routine sharp.</li>
          <li><strong>Main Quests:</strong> Long-term milestones defined by you. High reward for major life achievements.</li>
          <li><strong>Attribute Radar:</strong> A visual representation of your balance between physical grit, speed, intellect, and sheer discipline.</li>
        </ul>
      </div>
    </div>
  );
};

export default Manual;
