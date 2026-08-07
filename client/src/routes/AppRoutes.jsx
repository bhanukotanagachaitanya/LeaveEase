import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Pages
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPasswordRequest from '../pages/ForgotPasswordRequest';
import CompletePasswordReset from '../pages/CompletePasswordReset';
import SetupAdmin from '../pages/SetupAdmin';

import EmployeeDashboard from '../pages/EmployeeDashboard';
import ApplyLeave from '../pages/ApplyLeave';
import LeaveHistory from '../pages/LeaveHistory';
import EmployeeProfile from '../pages/EmployeeProfile';
import HolidayManagement from '../pages/HolidayManagement';

import AdminDashboard from '../pages/AdminDashboard';
import AllLeaveRequests from '../pages/AllLeaveRequests';
import AllEmployees from '../pages/AllEmployees';
import PasswordResetRequests from '../pages/PasswordResetRequests';
import AnnouncementManagement from '../pages/AnnouncementManagement';
import PasswordAuditLogs from '../pages/PasswordAuditLogs';
import Reports from '../pages/Reports';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Interactive Landing Home Page */}
      <Route path="/" element={<HomePage />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordRequest />} />
        <Route path="/complete-reset" element={<CompletePasswordReset />} />
        <Route path="/setup-admin" element={<SetupAdmin />} />
      </Route>

      {/* Protected Routes (Employee & Admin Shared) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<EmployeeDashboard />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/leave-history" element={<LeaveHistory />} />
          <Route path="/holidays" element={<HolidayManagement />} />
          <Route path="/profile" element={<EmployeeProfile />} />

          {/* Admin Dedicated Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/leaves" element={<AllLeaveRequests />} />
            <Route path="/admin/employees" element={<AllEmployees />} />
            <Route path="/admin/password-requests" element={<PasswordResetRequests />} />
            <Route path="/admin/holidays" element={<HolidayManagement />} />
            <Route path="/admin/announcements" element={<AnnouncementManagement />} />
            <Route path="/admin/password-audit" element={<PasswordAuditLogs />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
