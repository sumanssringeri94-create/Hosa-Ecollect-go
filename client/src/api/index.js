import axios from 'axios';

// Create base Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecg_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized & Normalize Errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear session
      localStorage.removeItem('ecg_auth_current_user');
      localStorage.removeItem('ecg_auth_token');

      // Dispatch custom logout event for app to handle gracefully
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));

      // If not already on an auth page, redirect
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/register') &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login';
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

// ───────────────────────────────────────────────
// AUTH ENDPOINTS
// ───────────────────────────────────────────────
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// ───────────────────────────────────────────────
// PICKUP ENDPOINTS
// ───────────────────────────────────────────────
export const pickupsApi = {
  schedulePickup: (pickupData) => api.post('/pickups', pickupData),
  getMyPickups: () => api.get('/pickups/my'),
  getPickupDetails: (id) => api.get(`/pickups/${id}`),
  cancelPickup: (id) => api.delete(`/pickups/${id}`),

  // Admin pickup operations
  getAllPickups: (params = {}) => api.get('/pickups/admin/all', { params }),
  verifyPickup: (id, adminNote = '') => api.put(`/pickups/admin/${id}/verify`, { adminNote }),
  assignRecycler: (id, recyclerId) => api.put(`/pickups/admin/${id}/assign-recycler`, { recyclerId }),
  assignLogistics: (id, data) => api.put(`/pickups/admin/${id}/assign-logistics`, data),
  updateStatus: (id, data) => api.put(`/pickups/admin/${id}/status`, data),
  rejectPickup: (id, adminNote = '') => api.put(`/pickups/admin/${id}/reject`, { adminNote }),
  completePickup: (id) => api.put(`/pickups/admin/${id}/complete`),
  getAnalytics: () => api.get('/pickups/admin/analytics'),
};

// ───────────────────────────────────────────────
// WASTE ITEM ENDPOINTS
// ───────────────────────────────────────────────
export const wasteApi = {
  getCategories: () => api.get('/waste/categories'),
  addWasteItem: (itemData) => api.post('/waste', itemData),
  getMyWasteItems: () => api.get('/waste/my'),
  deleteWasteItem: (id) => api.delete(`/waste/${id}`),
};

// ───────────────────────────────────────────────
// ADMIN MANAGEMENT ENDPOINTS
// ───────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  updateUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
  getRecyclers: () => api.get('/admin/recyclers'),
  verifyRecycler: (id, isVerified = true) => api.put(`/admin/recyclers/${id}/verify`, { isVerified }),
  getLogistics: () => api.get('/admin/logistics'),
  getReports: () => api.get('/admin/reports'),
};

// ───────────────────────────────────────────────
// RECYCLER PORTAL ENDPOINTS
// ───────────────────────────────────────────────
export const recyclersApi = {
  getDashboard: () => api.get('/recyclers/dashboard'),
  getAssignedRequests: (params = {}) => api.get('/recyclers/assigned', { params }),
  acceptAssignment: (id) => api.put(`/recyclers/pickups/${id}/accept`),
  rejectAssignment: (id, reason = '') => api.put(`/recyclers/pickups/${id}/reject`, { reason }),
  updateOperations: (id, operationsData) => api.put(`/recyclers/pickups/${id}/operations`, operationsData),
};

// ───────────────────────────────────────────────
// LOGISTICS PORTAL ENDPOINTS
// ───────────────────────────────────────────────
export const logisticsApi = {
  getDashboard: () => api.get('/logistics/dashboard'),
  getPickups: (params = {}) => api.get('/logistics/pickups', { params }),
  acceptPickup: (id) => api.put(`/logistics/pickups/${id}/accept`),
  rejectPickup: (id, reason = '') => api.put(`/logistics/pickups/${id}/reject`, { reason }),
  markCollected: (id, notes = '') => api.put(`/logistics/pickups/${id}/collected`, { notes }),
  confirmDelivery: (id, notes = '') => api.put(`/logistics/pickups/${id}/delivered`, { notes }),
  updateAvailability: (availabilityData) => api.put('/logistics/availability', availabilityData),
};

// ───────────────────────────────────────────────
// NOTIFICATIONS ENDPOINTS
// ───────────────────────────────────────────────
export const notificationsApi = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export default api;
