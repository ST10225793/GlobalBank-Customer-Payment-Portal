import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contex/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import StaffDashboard from './pages/StaffDashboard';
import NewPayment from './pages/NewPayment';
import Confirmation from './pages/Confirmation';// Change the capital 'P' to a lowercase 'p' to match the disk name exactly
// 1. Structural Path Realignment: Import from the isolated administrative folder scope
import CustomerProvisioning from './pages/Staff/CustomerProvisioning';

const queryClient = new QueryClient();

// This component now has access to navigate() because it is a child of BrowserRouter
function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={
        <PrivateRoute allowedRoles={['customer']}>
          <Dashboard />
        </PrivateRoute>
      } />
      
      <Route path="/new-payment" element={
        <PrivateRoute allowedRoles={['customer']}>
          <NewPayment />
        </PrivateRoute>
      } />
      
      <Route path="/confirmation" element={
        <PrivateRoute allowedRoles={['customer']}>
          <Confirmation />
        </PrivateRoute>
      } />

      <Route path="/staff/dashboard" element={
        <PrivateRoute allowedRoles={['staff']}>
          <StaffDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/staff/provisioning" element={
        <PrivateRoute allowedRoles={['staff']}>
          <CustomerProvisioning />
        </PrivateRoute>
      } />

      <Route path="/unauthorized" element={
        <div className="text-white text-center mt-20">
          <h1>403 - Unauthorized Access</h1>
          <p>You do not have permission to view this page.</p>
          <button onClick={() => navigate(-1)} className="text-blue-400">Go Back</button>
        </div>
      } />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

// The App component initializes the providers and the Router
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;