'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from './types';
import { authAPI } from './api/index';
import { useAuthStore } from './stores';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: any) => Promise<User>;
  logout: () => void;
  loading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user,
    token,
    isLoading,
    isInitialized,
    login: storeLogin,
    logout: storeLogout,
    initialize
  } = useAuthStore();

  useEffect(() => {
    // Initialize auth on app start
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    const { user: loggedInUser, token: newToken } = response.data.data;
    localStorage.setItem('token', newToken); // Ensure token is in localStorage
    storeLogin(loggedInUser, newToken);
    return loggedInUser;
  };

  const signup = async (data: any) => {
    const response = await authAPI.signup(data);
    const { user: signedUpUser, token: newToken } = response.data.data;
    localStorage.setItem('token', newToken); // Ensure token is in localStorage
    storeLogin(signedUpUser, newToken);
    return signedUpUser;
  };

  const logout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    storeLogout();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading: isLoading, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};