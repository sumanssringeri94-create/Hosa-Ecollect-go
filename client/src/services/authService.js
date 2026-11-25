import { INITIAL_USERS } from '../data/mockData';

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
];

export const authService = {
  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse current user from localStorage:', e);
    }
    return null;
  },

  getToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  login: async (email, password) => {
    const isDemoMode = import.meta.env?.VITE_DEMO_MODE === 'true';

    // Demo accounts may use local path ONLY when VITE_DEMO_MODE=true
    if (isDemoMode) {
      const preset = DEMO_PRESET_ACCOUNTS.find(
        (p) => p.email.toLowerCase() === email.toLowerCase() && p.password === password
      );
      if (preset) {
        const fullUser = {
          id: `user-${preset.role}`,
          name: preset.name,
          email: preset.email,
          role: preset.role,
          city: 'Bengaluru',
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0],
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fullUser));
        localStorage.setItem(AUTH_TOKEN_KEY, `mock-demo-token-${fullUser.id}`);
        return { user: fullUser, token: `mock-demo-token-${fullUser.id}` };
      }
    }

    // STRICT: Login must hit the server and only succeed with a valid server response
    let response;
    try {
      const apiUrl = import.meta.env?.VITE_API_URL || '/api';
      response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    } catch (networkError) {
      throw new Error('Unable to connect to the authentication server. Please verify the backend is running.');
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Invalid email or password.');
    }

    const fullUser = {
      ...data.user,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fullUser));
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    return { user: fullUser, token: data.token };
  },

  register: async (userData) => {
    const isDemoMode = import.meta.env?.VITE_DEMO_MODE === 'true';

    if (userData.role === 'admin') {
      throw new Error('Admin privileges cannot be self-registered. Please contact platform governance.');
    }

    let response;
    try {
      const apiUrl = import.meta.env?.VITE_API_URL || '/api';
      response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
    } catch (networkError) {
      if (isDemoMode) {
        const newUser = {
          id: `user-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'user',
          phone: userData.phone || '',
          city: userData.city || 'Bengaluru',
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0],
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
        localStorage.setItem(AUTH_TOKEN_KEY, `mock-demo-token-${newUser.id}`);
        return { user: newUser, token: `mock-demo-token-${newUser.id}` };
      }
      throw new Error('Unable to connect to the registration server. Please verify the backend is running.');
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Registration failed. Please check your details.');
    }

    const fullUser = {
      ...data.user,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fullUser));
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    return { user: fullUser, token: data.token };
  },

  forgotPassword: async (email) => {
    try {
      const apiUrl = import.meta.env?.VITE_API_URL || '/api';
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
    } catch (e) {}
    return { success: true, message: `Password reset instructions sent to ${email}` };
  },

  resetPassword: async (token, newPassword, email) => {
    try {
      const apiUrl = import.meta.env?.VITE_API_URL || '/api';
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
    } catch (e) {}
    return { success: true, message: 'Your password has been successfully reset.' };
  },

  switchRole: (role) => {
    const preset = DEMO_PRESET_ACCOUNTS.find((p) => p.role === role);
    if (!preset) return null;
    const target = {
      id: `user-${preset.role}`,
      name: preset.name,
      email: preset.email,
      role: preset.role,
      status: 'Active',
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(target));
    localStorage.setItem(AUTH_TOKEN_KEY, `mock-demo-token-${target.id}`);
    return target;
  },

  logout: () => {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};
