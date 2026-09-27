'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, UserStatus } from '@/types/user';
import { mockUsers } from '@/data/users';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  usersList: User[];
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginAsDemo: (role: 'customer' | 'admin') => void;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    idNumber?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  // Admin User Management actions
  updateUserStatus: (userId: string, status: UserStatus) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  updateUser: (user: User) => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'totalRentals' | 'totalSpent'>) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'photograper-current-user';
const USERS_STORAGE_KEY = 'photograper-users-list';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>(mockUsers);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        setUsersList(JSON.parse(storedUsers));
      }

      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Default to logged in as demo customer so user can immediately experience authenticated checkout & history!
        const defaultCustomer = mockUsers.find((u) => u.role === 'customer') || mockUsers[1];
        setUser(defaultCustomer);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultCustomer));
      }
    } catch {
      // localStorage unavailable
    }
    setIsHydrated(true);
  }, []);

  // Save users list changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
    } catch {
      // localStorage unavailable
    }
  }, [usersList, isHydrated]);

  // Save current user changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // localStorage unavailable
    }
  }, [user, isHydrated]);

  const login = useCallback(
    async (email: string): Promise<{ success: boolean; message?: string }> => {
      const found = usersList.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) {
        return {
          success: false,
          message: 'Không tìm thấy tài khoản với email này. Vui lòng kiểm tra lại hoặc Đăng ký.',
        };
      }
      if (found.status === 'blocked') {
        return {
          success: false,
          message: 'Tài khoản này hiện đang tạm khóa. Vui lòng liên hệ ban quản trị cửa hàng.',
        };
      }
      setUser(found);
      return { success: true };
    },
    [usersList]
  );

  const loginAsDemo = useCallback(
    (role: 'customer' | 'admin') => {
      const targetUser =
        role === 'admin'
          ? usersList.find((u) => u.role === 'admin') || mockUsers[0]
          : usersList.find((u) => u.role === 'customer' && u.status === 'active') || mockUsers[1];
      setUser(targetUser);
    },
    [usersList]
  );

  const register = useCallback(
    async (data: {
      fullName: string;
      email: string;
      phone: string;
      idNumber?: string;
    }): Promise<{ success: boolean; message?: string }> => {
      const existing = usersList.find(
        (u) =>
          u.email.toLowerCase() === data.email.trim().toLowerCase() ||
          u.phone.trim() === data.phone.trim()
      );
      if (existing) {
        return {
          success: false,
          message: 'Email hoặc số điện thoại đã được đăng ký trên hệ thống.',
        };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        idNumber: data.idNumber?.trim() || '',
        role: 'customer',
        status: 'active',
        membershipTier: 'standard',
        totalRentals: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      };

      setUsersList((prev) => [newUser, ...prev]);
      setUser(newUser);
      return { success: true };
    },
    [usersList]
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      setUsersList((list) => list.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
  }, []);

  // Admin user management functions
  const updateUserStatus = useCallback((userId: string, status: UserStatus) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, status };
          return updated;
        }
        return u;
      })
    );
    setUser((curr) => (curr && curr.id === userId ? { ...curr, status } : curr));
  }, []);

  const updateUserRole = useCallback((userId: string, role: UserRole) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, role };
          return updated;
        }
        return u;
      })
    );
    setUser((curr) => (curr && curr.id === userId ? { ...curr, role } : curr));
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUsersList((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setUser((curr) => (curr && curr.id === updatedUser.id ? updatedUser : curr));
  }, []);

  const addUser = useCallback(
    (userData: Omit<User, 'id' | 'createdAt' | 'totalRentals' | 'totalSpent'>) => {
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        totalRentals: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      };
      setUsersList((prev) => [newUser, ...prev]);
    },
    []
  );

  const deleteUser = useCallback((userId: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    setUser((curr) => (curr && curr.id === userId ? null : curr));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        usersList,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        updateUserStatus,
        updateUserRole,
        updateUser,
        addUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
