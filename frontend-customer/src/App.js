import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contex/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StaffDashboard from './pages/StaffDashboard';
import NewPayment from './pages/NewPayment';
import Confirmation from './pages/Confirmation';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute allowedRoles={['customer']}>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/staff/dashboard" element={
              <PrivateRoute allowedRoles={['staff']}>
                <StaffDashboard />
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
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;