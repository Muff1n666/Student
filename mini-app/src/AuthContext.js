import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.setToken(token);
      api.getMe()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token');
          api.setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const guestLogin = async () => {
    const res = await api.guestLogin();
    localStorage.setItem('token', res.access_token);
    api.setToken(res.access_token);
    setUser(res.user);
  };

  const login = async (email, password) => {
    const res = await api.login(email, password);
    localStorage.setItem('token', res.access_token);
    api.setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (email, password, firstName) => {
    const res = await api.register(email, password, firstName);
    localStorage.setItem('token', res.access_token);
    api.setToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    api.setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const u = await api.getMe();
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, loading, guestLogin, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
