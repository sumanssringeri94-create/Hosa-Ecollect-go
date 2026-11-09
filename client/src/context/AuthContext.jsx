import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, DEMO_PRESET_ACCOUNTS } from '../services/authService';
import { initializeDemoData } from '../services/storageService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize demo data in localStorage on mount
  useEffect(() => {
    initializeDemoData();
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      return loggedInUser;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const { user: registeredUser } = await authService.register(formData);
      setUser(registeredUser);
      toast.success(`Welcome to eCollect-Go, ${registeredUser.name}! 🌱`);
      return registeredUser;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    toast.success('Signed out safely.');
  }, []);

  const switchAccount = useCallback((role) => {
    const targetUser = authService.switchRole(role);
    if (targetUser) {
      setUser(targetUser);
      toast.success(`Switched role to ${role.toUpperCase()} (${targetUser.name})`);
      return targetUser;
    }
    return null;
  }, []);

  const updateUserProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('ecg_auth_current_user', JSON.stringify(updated));
    toast.success('Profile preferences updated.');
  };

  const isAdmin = user?.role === 'admin';
  const isRecycler = user?.role === 'recycler';
  const isLogistics = user?.role === 'logistics';
  const isUser = user?.role === 'user';
  const isAuthenticated = !!user;

  // Compute default dashboard path based on role
  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isRecycler) return '/recycler/dashboard';
    if (isLogistics) return '/logistics/dashboard';
    return '/user/dashboard';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isRecycler,
        isLogistics,
        isUser,
        login,
        register,
        logout,
        switchAccount,
        updateUserProfile,
        getDashboardPath,
        demoPresets: DEMO_PRESET_ACCOUNTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
