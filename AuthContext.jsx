import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem('systemSession');
    if (savedSession) {
      const { user, token } = JSON.parse(savedSession);
      setUser(user);
      // We could verify token here, but for now we trust the saved session
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('systemSession', JSON.stringify(data));
        return { success: true };
      }
      return { success: false, message: data.error || 'Login failed' };
    } catch (err) {
      return { success: false, message: 'Server unreachable' };
    }
  };

  const register = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('systemSession', JSON.stringify(data));
        return { success: true };
      }
      return { success: false, message: data.error || 'Registration failed' };
    } catch (err) {
      return { success: false, message: 'Server unreachable' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('systemSession');
  };

  const getToken = useCallback(() => {
    const savedSession = localStorage.getItem('systemSession');
    return savedSession ? JSON.parse(savedSession).token : null;
  }, []);

  const value = useMemo(() => ({ 
    user, login, register, logout, getToken, loading 
  }), [user, login, register, logout, getToken, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
