import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authApi } from '../api/authApi';

// 1. We keep the context internal to this file to satisfy Fast Refresh
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authApi.me();
          setUser(res.data.user);
        } catch (err) {
          logout(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, [token, logout]);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem('token', t);
  };

  const signup = async (email, password, role) => {
    await authApi.signup(email, password, role);
  };

  // 2. Memoize the value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    token,
    login,
    signup,
    logout,
    loading
  }), [user, token, logout, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Export the hook separately
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};