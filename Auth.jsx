import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, LogIn, UserPlus, ShieldAlert } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = isLogin 
        ? await login(username, password)
        : await register(username, password);
        
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('System connection failure');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="system-scan"></div>
      <div className="auth-card animate-pop">
        <div className="auth-header">
           <h1 className="title-glitch">{isLogin ? 'SYSTEM ACCESS' : 'PLAYER AWAKENING'}</h1>
           <p className="text-secondary">
             {isLogin 
               ? '[AUTHENTICATION REQUIRED TO SYNC PROGRESS]' 
               : '[INITIALIZING NEW PLAYER IDENTITY]'}
           </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <User size={18} className="auth-input-icon" />
            <input
              type="text"
              placeholder="PLAYER NAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="auth-input-group">
            <Lock size={18} className="auth-input-icon" />
            <input
              type="password"
              placeholder="ACCESS CODE"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {!isLogin && (
            <div className="auth-input-group">
              <Lock size={18} className="auth-input-icon" />
              <input
                type="password"
                placeholder="CONFIRM ACCESS CODE"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          )}

          {error && (
            <div className="auth-error">
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'SYNCING...' : isLogin ? (
              <>
                LOG IN <LogIn size={18} style={{ marginLeft: '0.75rem' }} />
              </>
            ) : (
              <>
                AWAKEN <UserPlus size={18} style={{ marginLeft: '0.75rem' }} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "NEW TO THE SYSTEM?" : "ALREADY REGISTERED?"}
            <span onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}>
              {isLogin ? "RE-INITIALIZE IDENTITY" : "ACCESS SYSTEM"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
