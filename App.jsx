import React, { useState } from 'react';
import { GameProvider, useGameInfo } from './context/GameContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LayoutDashboard, Swords, Dumbbell, BookOpen, LogOut } from 'lucide-react';

import Dashboard from './components/Dashboard';
import Quests from './components/Quests';
import Training from './components/Training';
import Manual from './components/Manual';
import Notifications from './components/Notifications';
import Auth from './components/Auth';

const MainLayout = () => {
  const { sysMsg, setSysMsg } = useGameInfo();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'quests': return <Quests />;
      case 'training': return <Training />;
      case 'manual': return <Manual />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h1>System</h1>
        
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Status</span>
        </div>

        <div 
          className={`nav-item ${activeTab === 'quests' ? 'active' : ''}`}
          onClick={() => setActiveTab('quests')}
        >
          <Swords size={20} />
          <span>Quests</span>
        </div>

        <div 
          className={`nav-item ${activeTab === 'training' ? 'active' : ''}`}
          onClick={() => setActiveTab('training')}
        >
          <Dumbbell size={20} />
          <span>Training</span>
        </div>

        <div 
          className={`nav-item ${activeTab === 'manual' ? 'active' : ''}`}
          onClick={() => setActiveTab('manual')}
        >
          <BookOpen size={20} />
          <span>Manual</span>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div className="nav-item" onClick={logout} style={{ color: 'var(--danger-color)' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </div>
          <div className="user-profile-small" style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Player: <span className="text-accent">{user?.username}</span>
          </div>
        </div>

      </aside>
      
      <main className="main-content" style={{ position: 'relative' }}>
        {sysMsg && (
           <div className="modal-overlay" style={{ zIndex: 100 }}>
             <div className="modal-content animate-pop" style={{ textAlign: 'center', borderColor: 'var(--accent-color)', boxShadow: 'var(--accent-glow)' }}>
               <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>SYSTEM ALERT</h2>
               <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{sysMsg}</p>
               <button onClick={() => setSysMsg('')}>Confirm</button>
             </div>
           </div>
        )}
        <Notifications />
        {renderContent()}
      </main>
    </div>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Auth />;
  }

  return (
    <GameProvider>
      <MainLayout />
    </GameProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
