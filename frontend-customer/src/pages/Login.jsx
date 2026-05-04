import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contex/AuthContext'; // ADD THIS

const schema = yup.object({
  accountNumber: yup.string().required('Account number required').min(10, 'Must be 10 digits'),
  password: yup.string().required('Password required').min(6, 'Minimum 6 characters'),
});

const Login = () => {
  const { login } = useAuth(); // ADD THIS - use the context login function
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isStaff, setIsStaff] = useState(false);
  const [prefersDark, setPrefersDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setPrefersDark(darkModeMediaQuery.matches);
    const handler = (e) => setPrefersDark(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);
    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setError('');
    
    const credentials = isStaff 
      ? { email: data.accountNumber, password: data.password }
      : { accountNumber: data.accountNumber, password: data.password };
    
    const result = await login(credentials, isStaff ? 'staff' : 'customer');
    
    if (result.success) {
      navigate(isStaff ? '/staff/dashboard' : '/dashboard');
    } else {
      setError(result.error);
    }
  };

  const gradientClass = prefersDark 
    ? "from-gray-900 via-purple-900 to-gray-900"
    : "from-blue-900 via-purple-900 to-pink-800";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20">
          
          <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mb-4 relative group">
             {/* Animated rings around logo */}
             <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300"></div>
             <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-300 animate-pulse"></div>
             
             {/* Logo icon */}
             <svg className="relative w-12 h-12 text-white z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M6 14h2m3 0h2m3 0h2M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 6V4h8v2" />
               <circle cx="12" cy="16" r="1" fill="white" />
             </svg>
           </div>
           
           {/* Bank name with gradient */}
           <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
             GlobalBank
           </h1>
           <p className="text-white/60 text-xs mt-1">Secure International Payments</p>
         </div>
          
          {/* ERROR MESSAGE - Improved to be more visible and persistent */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/40 border-2 border-red-500 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-white font-medium">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-white/80 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Staff/Customer Toggle */}
          <div className="mb-6">
            <div className="bg-white/10 rounded-xl p-1">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsStaff(false);
                    setError(''); // Clear error on switch
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all duration-300 ${
                    !isStaff 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsStaff(true);
                    setError(''); // Clear error on switch
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all duration-300 ${
                    isStaff 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Staff
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Account/Email Field */}
            <div className="mb-5">
              <label className="block text-white/90 text-sm font-semibold mb-2">
                {isStaff ? 'Email Address' : 'Account Number'}
              </label>
              <input
                type={isStaff ? 'email' : 'text'}
                {...register('accountNumber')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                placeholder={isStaff ? 'staff@bank.com' : 'Enter 10-digit account number'}
              />
              {errors.accountNumber && (
                <p className="text-red-300 text-xs mt-1">{errors.accountNumber.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-white/90 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 pr-12"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                >
                  {showPassword ? '🫣' : '😶'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-300 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Demo Hint */}
            <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-white/50 text-xs">
                {isStaff 
                  ? '💡 Staff demo: staff@bank.com / staff123'
                  : '💡 New user? Register an account first, then login with your account number'}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          {!isStaff && (
            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-300 hover:text-blue-200 font-semibold">
                  Create Account
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Login;