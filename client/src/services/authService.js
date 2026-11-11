import { INITIAL_USERS } from '../data/mockData';
import { storageService } from './storageService';

const AUTH_USER_KEY = 'ecg_auth_current_user';
const AUTH_TOKEN_KEY = 'ecg_auth_token';

export const DEMO_PRESET_ACCOUNTS = [
  {
    role: 'user',
    label: 'Citizen User',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'Demo@123',
    desc: 'Submit, track and view personal e-waste pickups',
    path: '/user/dashboard',
  },
  {
    role: 'admin',
    label: 'Administrator',
    name: 'Admin User',
    email: 'admin@ecollectgo.com',
    password: 'Admin@123',
    desc: 'Verify requests, assign partners, oversee platform analytics',
    path: '/admin/dashboard',
  },
  {
    role: 'recycler',
    label: 'Recycling Facility',
    name: 'GreenTech Solutions',
    email: 'recycler@ecollectgo.com',
    password: 'Demo@123',
    desc: 'Receive e-waste, manage disassembly & log precious recovery',
    path: '/recycler/dashboard',
  },
  {
    role: 'logistics',
    label: 'Logistics Partner',
    name: 'SwiftExpress Logistics',
    email: 'logistics@ecollectgo.com',
    password: 'Demo@123',
    desc: 'View assigned pickups, execute EV route, deliver to recyclers',
    path: '/logistics/dashboard',
  },
  {
    role: 'user',
    label: 'Citizen User (Local)',
    name: 'Sarah Chen',
    email: 'sarah.chen@gmail.com',
    password: 'password123',
    desc: 'Submit, track and view personal e-waste pickups (Local Demo)',
    path: '/user/dashboard',
  },
];

export const authService = {
  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Default to Priya Sharma (Citizen user) so demo can be explored right away
    const defaultUser = {
      id: '507f1f77bcf86cd799439011',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      role: 'user',
      city: 'Bengaluru',
      phone: '+91 98765 43210',
      points: 680,
      level: 'Eco Warrior',
      status: 'Active',
      joinedDate: '2026-01-15',
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  },

  login: async (email, password) => {
    // 1. Try real backend API first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        const fullUser = {
          ...data.user,
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0],
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fullUser));
        localStorage.setItem(AUTH_TOKEN_KEY, data.token || `jwt-${data.user.id}`);
        return { user: fullUser, token: data.token };
      }
    } catch (apiErr) {
      // Backend not running or unreachable, fallback to local
      console.warn('Backend /api/auth/login not reachable, falling back to local credentials', apiErr);
    }

    // 2. Local fallback
    await new Promise((r) => setTimeout(r, 300));

    const users = storageService.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      const preset = DEMO_PRESET_ACCOUNTS.find((p) => p.email.toLowerCase() === email.toLowerCase());
      if (preset) {
        const fullUser = {
          id: `user-${Date.now()}`,
          name: preset.name,
          email: preset.email,
          role: preset.role,
          city: 'Bengaluru',
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0],
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fullUser));
        localStorage.setItem(AUTH_TOKEN_KEY, `mock-jwt-token-${fullUser.id}`);
        return { user: fullUser, token: `mock-jwt-token-${fullUser.id}` };
      }
      throw new Error('Account not found with this email. Please check your credentials or pick a demo account.');
    }

    if (found.status === 'Suspended') {
      throw new Error('This account has been suspended by platform administration.');
    }

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(found));
    localStorage.setItem(AUTH_TOKEN_KEY, `mock-jwt-token-${found.id}`);
    return { user: found, token: `mock-jwt-token-${found.id}` };
  },

  register: async (userData) => {
    // Try backend registration
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        const fullUser = {
          ...data.user,
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0],
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fullUser));
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        return { user: fullUser, token: data.token };
      }
    } catch (apiErr) {
      console.warn('Backend /api/auth/register not reachable, falling back to local storage', apiErr);
    }

    // Local fallback
    await new Promise((r) => setTimeout(r, 400));

    if (userData.role === 'admin') {
      throw new Error('Admin privileges cannot be self-registered. Please contact platform governance.');
    }

    const users = storageService.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user',
      phone: userData.phone || '',
      city: userData.city || 'Bengaluru',
      organization: userData.companyName || userData.organization || '',
      address: userData.address || '',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    if (newUser.role === 'recycler') {
      storageService.createRecycler({
        name: newUser.name,
        companyName: userData.companyName || `${newUser.name} Recovery Ltd`,
        email: newUser.email,
        phone: newUser.phone,
        location: `${userData.city || 'Bengaluru'}, Karnataka`,
        licenseNumber: `DEMO/REG/${Date.now().toString().slice(-4)}`,
        categoriesHandled: userData.categoriesHandled || ['Laptops & Computers', 'Mobiles & Tablets'],
        capacityTonnesPerMonth: 50,
      });
    }

    if (newUser.role === 'logistics') {
      storageService.createLogistics({
        name: newUser.name,
        company: userData.companyName || `${newUser.name} Green Express`,
        phone: newUser.phone,
        email: newUser.email,
        serviceArea: `${userData.city || 'Bengaluru'} Metro`,
        vehicleType: userData.vehicleType || 'Electric Cargo Van',
        vehiclePlate: `KA-01-EV-${Math.floor(1000 + Math.random() * 9000)}`,
        capacityKg: 800,
      });
    }

    const updatedUsers = [newUser, ...users];
    localStorage.setItem('ecg_demo_users', JSON.stringify(updatedUsers));
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(AUTH_TOKEN_KEY, `mock-jwt-token-${newUser.id}`);

    return { user: newUser, token: `mock-jwt-token-${newUser.id}` };
  },

  forgotPassword: async (email) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 400));
    return { success: true, message: `Password reset instructions sent to ${email}` };
  },

  resetPassword: async (token, newPassword, email) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 400));
    return { success: true, message: 'Your password has been successfully reset.' };
  },

  switchRole: (role) => {
    const preset = DEMO_PRESET_ACCOUNTS.find((p) => p.role === role);
    if (!preset) return null;
    const users = storageService.getUsers();
    let target = users.find((u) => u.email === preset.email);
    if (!target) {
      target = INITIAL_USERS.find((u) => u.email === preset.email) || {
        id: `user-${preset.role}`,
        name: preset.name,
        email: preset.email,
        role: preset.role,
        status: 'Active',
      };
    }
    if (target) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(target));
      localStorage.setItem(AUTH_TOKEN_KEY, `mock-jwt-token-${target.id}`);
      return target;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};
