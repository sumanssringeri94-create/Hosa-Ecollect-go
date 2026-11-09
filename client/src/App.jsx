import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import HowItWorks from './pages/public/HowItWorks';
import About from './pages/public/About';
import EWasteGuide from './pages/public/EWasteGuide';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// User Portal Pages
import UserDashboard from './pages/user/UserDashboard';
import MyPickups from './pages/user/MyPickups';
import SchedulePickup from './pages/user/SchedulePickup';
import TrackCollection from './pages/user/TrackCollection';
import UserEWasteGuide from './pages/user/UserEWasteGuide';
import UserNotifications from './pages/user/UserNotifications';
import UserProfile from './pages/user/UserProfile';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPickups from './pages/admin/AdminPickups';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRecyclers from './pages/admin/AdminRecyclers';
import AdminLogistics from './pages/admin/AdminLogistics';
import AdminAssignments from './pages/admin/AdminAssignments';
import AdminCategories from './pages/admin/AdminCategories';
import AdminReports from './pages/admin/AdminReports';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSettings from './pages/admin/AdminSettings';

// Recycler Portal Pages
import RecyclerDashboard from './pages/recycler/RecyclerDashboard';
import RecyclerAssigned from './pages/recycler/RecyclerAssigned';
import RecyclerIncoming from './pages/recycler/RecyclerIncoming';
import RecyclerOperations from './pages/recycler/RecyclerOperations';
import RecyclerInventory from './pages/recycler/RecyclerInventory';
import RecyclerReports from './pages/recycler/RecyclerReports';
import RecyclerProfile from './pages/recycler/RecyclerProfile';

// Logistics Portal Pages
import LogisticsDashboard from './pages/logistics/LogisticsDashboard';
import LogisticsPickups from './pages/logistics/LogisticsPickups';
import LogisticsSchedule from './pages/logistics/LogisticsSchedule';
import LogisticsHistory from './pages/logistics/LogisticsHistory';
import LogisticsDeliveryStatus from './pages/logistics/LogisticsDeliveryStatus';
import LogisticsProfile from './pages/logistics/LogisticsProfile';

import NotFound from './pages/NotFound';

// Protected Route wrapper with role check
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9]">
        <div className="w-10 h-10 border-3 border-forest-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If not allowed, send to appropriate home dashboard for their role
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'recycler') return <Navigate to="/recycler/dashboard" replace />;
    if (user?.role === 'logistics') return <Navigate to="/logistics/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

// Route component redirecting legacy /dashboard path to proper role dashboard
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'recycler') return <Navigate to="/recycler/dashboard" replace />;
  if (user?.role === 'logistics') return <Navigate to="/logistics/dashboard" replace />;
  return <Navigate to="/user/dashboard" replace />;
};

function AppRoutes() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#FFFFFF',
            color: '#1C2621',
            borderRadius: '16px',
            border: '1px solid #E5E0D3',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 8px 30px rgba(28, 58, 39, 0.08)',
          },
        }}
      />

      <Routes>
        {/* ─── PUBLIC ROUTES ─── */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/e-waste-guide" element={<PublicLayout><EWasteGuide /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* ─── AUTH ROUTES ─── */}
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
        <Route path="/reset-password" element={<PublicLayout><ResetPassword /></PublicLayout>} />

        {/* ─── USER PORTAL ROUTES ─── */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/pickups"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <MyPickups />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/schedule"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <SchedulePickup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/track"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <TrackCollection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/guide"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserEWasteGuide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/notifications"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* ─── ADMIN PORTAL ROUTES ─── */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pickups"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPickups />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/recyclers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminRecyclers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/logistics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLogistics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assignments"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* ─── RECYCLER PORTAL ROUTES ─── */}
        <Route
          path="/recycler/dashboard"
          element={
            <ProtectedRoute allowedRoles={['recycler', 'admin']}>
              <RecyclerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recycler/assigned"
          element={
            <ProtectedRoute allowedRoles={['recycler', 'admin']}>
              <RecyclerAssigned />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recycler/incoming"
          element={
            <ProtectedRoute allowedRoles={['recycler', 'admin']}>
              <RecyclerIncoming />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recycler/operations"
          element={
            <ProtectedRoute allowedRoles={['recycler', 'admin']}>
              <RecyclerOperations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recycler/inventory"
          element={
            <ProtectedRoute allowedRoles={['recycler', 'admin']}>
              <RecyclerInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recycler/reports"
          element={
            <ProtectedRoute allowedRoles={['recycler', 'admin']}>
              <RecyclerReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recycler/profile"
          element={
            <ProtectedRoute allowedRoles={['recycler', 'admin']}>
              <RecyclerProfile />
            </ProtectedRoute>
          }
        />

        {/* ─── LOGISTICS PORTAL ROUTES ─── */}
        <Route
          path="/logistics/dashboard"
          element={
            <ProtectedRoute allowedRoles={['logistics', 'admin']}>
              <LogisticsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/pickups"
          element={
            <ProtectedRoute allowedRoles={['logistics', 'admin']}>
              <LogisticsPickups />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/schedule"
          element={
            <ProtectedRoute allowedRoles={['logistics', 'admin']}>
              <LogisticsSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/history"
          element={
            <ProtectedRoute allowedRoles={['logistics', 'admin']}>
              <LogisticsHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/delivery"
          element={
            <ProtectedRoute allowedRoles={['logistics', 'admin']}>
              <LogisticsDeliveryStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics/profile"
          element={
            <ProtectedRoute allowedRoles={['logistics', 'admin']}>
              <LogisticsProfile />
            </ProtectedRoute>
          }
        />

        {/* ─── LEGACY & FALLBACK REDIRECTS ─── */}
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/recycler" element={<Navigate to="/recycler/dashboard" replace />} />
        <Route path="/logistics" element={<Navigate to="/logistics/dashboard" replace />} />
        <Route path="/pickups" element={<Navigate to="/user/pickups" replace />} />
        <Route path="/waste" element={<Navigate to="/user/schedule" replace />} />
        <Route path="/map" element={<Navigate to="/contact" replace />} />

        {/* ─── 404 CATCH-ALL ─── */}
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
