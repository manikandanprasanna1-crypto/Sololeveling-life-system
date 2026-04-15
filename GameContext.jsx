import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const useGameInfo = () => useContext(GameContext);

const API_URL = 'http://localhost:5000/api';

const DEFAULT_STATS = {
  playerName: 'New Player',
  level: 1,
  xp: 0,
  requiredXp: 100,
  strength: 10,
  speed: 10,
  intelligence: 10,
  discipline: 10,
  streak: 0,
};

const POSSIBLE_DAILIES = [
  { title: '100 Pushups, 100 Situps, 10km Run', category: 'Workout', xpReward: 50, stat: 'strength' },
  { title: 'Read 30 pages of a book', category: 'Study', xpReward: 20, stat: 'intelligence' },
  { title: 'Meditate for 15 minutes', category: 'Productivity', xpReward: 15, stat: 'discipline' },
  { title: '3 Rounds of Shadowboxing', category: 'MMA', xpReward: 25, stat: 'speed' },
  { title: 'Deep Work: 2 Hours Focused', category: 'Productivity', xpReward: 40, stat: 'intelligence' }
];

export const GameProvider = ({ children }) => {
  const { user, getToken } = useAuth();
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [quests, setQuests] = useState([]);
  const [history, setHistory] = useState([]);
  const [sysMsg, setSysMsg] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
    const res = await fetch(`${API_URL}${url}`, { ...options, headers });
    return res;
  }, [getToken]);

  const loadGameData = useCallback(async () => {
    if (!user) return;
    // Only show full loading screen if we don't have stats yet
    const isInitialLoad = !stats.userId;
    if (isInitialLoad) setLoading(true);
    
    try {
      const statsRes = await fetchWithAuth('/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.userId) {
          setStats(prev => ({ ...prev, ...statsData, playerName: user.username }));
        }
      }

      const questsRes = await fetchWithAuth('/quests');
      if (questsRes.ok) {
        const questsData = await questsRes.json();
        setQuests(questsData);
      }

      const historyRes = await fetchWithAuth('/history');
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }
    } catch (err) {
      console.error('Failed to load game data:', err);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, [user, fetchWithAuth]);

  useEffect(() => {
    loadGameData();
  }, [loadGameData]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const syncStats = useCallback(async (newStats) => {
    try {
      await fetchWithAuth('/stats/update', {
        method: 'POST',
        body: JSON.stringify(newStats)
      });
    } catch (err) {
      console.error('Failed to sync stats:', err);
    }
  }, [fetchWithAuth]);

  const completeQuest = useCallback(async (id) => {
    // Find quest in current state
    const quest = quests.find(q => q.id === id);
    if (!quest || quest.completed) return;

    try {
      // 1. Mark quest as completed locally immediately for better UI response
      setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q));

      // 2. Mark quest as completed on backend
      fetchWithAuth('/quests/complete', {
        method: 'POST',
        body: JSON.stringify({ id })
      }).catch(err => console.error('Backend quest completion failed:', err));

      // 3. Atomically calculate and update stats
      setStats(prevStats => {
        let currentXp = prevStats.xp + quest.xpReward;
        let level = prevStats.level;
        let requiredXp = prevStats.requiredXp;
        
        while (currentXp >= requiredXp) {
          currentXp -= requiredXp;
          level += 1;
          requiredXp = Math.floor(requiredXp * 1.2);
          setSysMsg(`LEVEL UP! You are now level ${level}`);
          addNotification(`New Level Reached: ${level}`, 'success');
        }

        const statGrowth = {
          strength: prevStats.strength,
          speed: prevStats.speed,
          intelligence: prevStats.intelligence,
          discipline: prevStats.discipline + 1,
        };
        
        if (quest.stat && statGrowth[quest.stat] !== undefined) {
          statGrowth[quest.stat] += 2;
        }

        const newStats = {
          ...prevStats,
          level,
          xp: currentXp,
          requiredXp,
          ...statGrowth,
          streak: prevStats.streak + 1
        };

        syncStats(newStats);
        
        const today = new Date().toDateString();
        fetchWithAuth('/history/log', {
          method: 'POST',
          body: JSON.stringify({ date: today, stats_json: JSON.stringify(newStats) })
        }).catch(err => console.error('History log failed:', err));

        return newStats;
      });
    } catch (err) {
      console.error('Quest completion flow failed:', err);
      addNotification('System Synchronization Error', 'error');
    }
  }, [quests, fetchWithAuth, syncStats]);

  const addQuest = useCallback(async (questData) => {
    const id = Date.now().toString();
    const newQuest = {
      ...questData,
      id,
      completed: false,
      date: new Date().toDateString(),
      questType: questData.questType || 'main'
    };

    try {
      const res = await fetchWithAuth('/quests/add', {
        method: 'POST',
        body: JSON.stringify(newQuest)
      });
      if (res.ok) {
        setQuests(prev => [...prev, newQuest]);
        return newQuest;
      }
      throw new Error('Quest deployment failed');
    } catch (err) {
      console.error('Failed to add quest:', err);
      addNotification('Quest Sync Failure', 'error');
      return null;
    }
  }, [fetchWithAuth]);

  const addAndCompleteQuest = useCallback(async (questData) => {
    const id = Date.now().toString();
    const newQuest = {
      ...questData,
      id,
      completed: true,
      date: new Date().toDateString(),
      questType: questData.questType || 'minor'
    };

    try {
      const res = await fetchWithAuth('/quests/add', {
        method: 'POST',
        body: JSON.stringify({ ...newQuest, completed: 1 })
      });

      if (!res.ok) throw new Error('Failed to deploy quick quest');

      setQuests(prev => [...prev, newQuest]);

      setStats(prevStats => {
        let currentXp = prevStats.xp + newQuest.xpReward;
        let level = prevStats.level;
        let requiredXp = prevStats.requiredXp;
        
        while (currentXp >= requiredXp) {
          currentXp -= requiredXp;
          level += 1;
          requiredXp = Math.floor(requiredXp * 1.2);
          setSysMsg(`LEVEL UP! You are now level ${level}`);
          addNotification(`MISSION_SUCCESS: Level ${level}`, 'success');
        }

        const statGrowth = {
          strength: prevStats.strength,
          speed: prevStats.speed,
          intelligence: prevStats.intelligence,
          discipline: prevStats.discipline + 1,
        };
        
        if (newQuest.stat && statGrowth[newQuest.stat] !== undefined) {
          statGrowth[newQuest.stat] += 2;
        }

        const newStats = {
          ...prevStats,
          level,
          xp: currentXp,
          requiredXp,
          ...statGrowth,
          streak: prevStats.streak + 1
        };

        syncStats(newStats);
        
        const today = new Date().toDateString();
        fetchWithAuth('/history/log', {
          method: 'POST',
          body: JSON.stringify({ date: today, stats_json: JSON.stringify(newStats) })
        }).catch(err => console.error('History log failed:', err));

        return newStats;
      });

      return newQuest;
    } catch (err) {
      console.error('Quick log failed:', err);
      addNotification('Quick Sync Error', 'error');
      return null;
    }
  }, [fetchWithAuth, syncStats]);

  const deleteQuest = useCallback(async (id) => {
    try {
      await fetchWithAuth('/quests/delete', {
        method: 'POST',
        body: JSON.stringify({ id })
      });
      setQuests(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      console.error('Failed to delete quest:', err);
    }
  }, [fetchWithAuth]);

  const getRank = useCallback((level) => {
    if (level < 10) return 'E-Rank';
    if (level < 20) return 'D-Rank';
    if (level < 30) return 'C-Rank';
    if (level < 40) return 'B-Rank';
    if (level < 50) return 'A-Rank';
    return 'S-Rank';
  }, []);

  const resetGame = useCallback(async () => {
    setStats(DEFAULT_STATS);
    setQuests([]);
    setHistory([]);
    syncStats(DEFAULT_STATS);
    addNotification('System Reinitialized', 'error');
    window.location.reload(); 
  }, [syncStats]);

  const value = useMemo(() => ({ 
    stats, quests, history, sysMsg, setSysMsg, 
    notifications, addNotification, getRank, 
    completeQuest, addQuest, addAndCompleteQuest, deleteQuest,
    resetGame, loading
  }), [stats, quests, history, sysMsg, notifications, getRank, completeQuest, addQuest, addAndCompleteQuest, deleteQuest, resetGame, loading]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
