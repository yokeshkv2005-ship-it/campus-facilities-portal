'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  initializeMockData,
  loginUser as mockLogin,
  logoutUser as mockLogout,
  getCurrentUser,
  getUnreadCount,
  addUser,
} from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  unreadCount: number;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    department_id: number;
    role: 'staff' | 'student';
    password: string;
  }) => { success: boolean; message: string };
  refreshUnreadCount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    initializeMockData();
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setUnreadCount(getUnreadCount(savedUser.user_id));
    }
    setLoading(false);
  }, []);

  const refreshUnreadCount = useCallback(() => {
    if (user) {
      setUnreadCount(getUnreadCount(user.user_id));
    }
  }, [user]);

  const login = (email: string, password: string) => {
    const loggedIn = mockLogin(email, password);
    if (loggedIn) {
      setUser(loggedIn);
      setUnreadCount(getUnreadCount(loggedIn.user_id));
      return { success: true, message: 'Login successful!' };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  const logout = () => {
    mockLogout();
    setUser(null);
    setUnreadCount(0);
  };

  const register = (data: {
    name: string;
    email: string;
    phone: string;
    department_id: number;
    role: 'staff' | 'student';
    password: string;
  }) => {
    try {
      const { getUsers } = require('@/lib/mockData');
      const users = getUsers();
      if (users.find((u: User) => u.email === data.email)) {
        return { success: false, message: 'Email already registered.' };
      }
      addUser({ ...data, status: 'active' });
      return { success: true, message: 'Registration successful! You can now login.' };
    } catch {
      return { success: false, message: 'Registration failed.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, unreadCount, login, logout, register, refreshUnreadCount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
