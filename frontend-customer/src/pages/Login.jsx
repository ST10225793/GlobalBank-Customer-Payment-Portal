import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';

import { useAuth } from '../contex/AuthContext';



const schema = yup.object({

  accountNumber: yup.string().required('Account identifier is required'),

  password: yup.string().required('Password is required')

});



const Login = () => {

  const { login } = useAuth();

  const navigate = useNavigate();

  const [error, setError] = useState('');

  const [isStaff, setIsStaff] = useState(false);

  const [showPassword, setShowPassword] = useState(false);



  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({

    resolver: yupResolver(schema),

  });


const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
 const onSubmit = async (data) => {
  setError('');
  try {
    let identifier = data.accountNumber.trim();

    // Domain Logic:
    // If staff, ensure the email is complete; if customer, append @banking.local
    if (isStaff) {
      if (!identifier.includes('@')) {
        throw new Error("Staff must enter a full email address.");
      }
    } else {
      // Append the customer domain if it's not already there
      if (!identifier.includes('@')) {
        identifier = `${identifier}@banking.local`;
      }
    }

    const result = await login({ 
      email: identifier, 
      password: data.password 
    });

    if (result?.success) {
      navigate(result.userRole === 'staff' ? '/staff/dashboard' : '/dashboard');
    }
  } catch (err) {
    console.error("Submission Error:", err);
    setError(err.message || "Authentication failed. Please check your credentials.");
  }
};





  const gradientClass = prefersDark

    ? "from-gray-900 via-purple-900 to-gray-900"

    : "from-blue-900 via-purple-900 to-pink-800";



  return (

    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} flex items-center justify-center p-4 relative overflow-hidden`}>

      {/* Animated background blobs */}

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

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-300 animate-pulse"></div>

             

              <svg className="relative w-12 h-12 text-white z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M6 14h2m3 0h2m3 0h2M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 6V4h8v2" />

                <circle cx="12" cy="16" r="1" fill="white" />

              </svg>

            </div>

           

            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">

              GlobalBank

            </h1>

            <p className="text-white/60 text-xs mt-1">Secure International Payments</p>

          </div>

         

          {/* Error Alert Display */}

          {error && (

            <div className="mb-6 p-4 rounded-lg bg-red-500/40 border-2 border-red-500 backdrop-blur-sm">

              <div className="flex items-center justify-between">

                <div className="flex items-center space-x-3">

                  <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />

                  </svg>

                  <p className="text-white font-medium text-sm">{error}</p>

                </div>

                <button

                  type="button"

                  onClick={() => setError('')}

                  className="text-white/80 hover:text-white transition-colors"

                >

                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />

                  </svg>

                </button>

              </div>

            </div>

          )}



          {/* Staff/Customer Access Portal Toggle */}

          <div className="mb-6">

            <div className="bg-white/10 rounded-xl p-1">

              <div className="flex gap-1">

                <button

                  type="button"

                  onClick={() => {

                    setIsStaff(false);

                    setError('');

                  }}

                  className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 ${

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

                    setError('');

                  }}

                  className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300 ${

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

            {/* Account Identifiers Input Field */}

            <div className="mb-5">

              <label className="block text-white/90 text-sm font-semibold mb-2">

                {isStaff ? 'Enterprise Email Address' : 'Customer Account Number'}

              </label>

              <input

                type={isStaff ? 'email' : 'text'}

                {...register('accountNumber')}

                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200 text-sm"

                placeholder={isStaff ? 'operator@apdsbank.com' : 'Enter 10-digit account string'}

              />

              {errors.accountNumber && (

                <p className="text-red-300 text-xs mt-1 font-medium">{errors.accountNumber.message}</p>

              )}

            </div>



            {/* Secret Verification Bounds Field */}

            <div className="mb-6">

              <label className="block text-white/90 text-sm font-semibold mb-2">

                Password

              </label>

              <div className="relative">

                <input

                  type={showPassword ? 'text' : 'password'}

                  autoComplete="current-password"

                  {...register('password')}

                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 pr-12 text-sm"

                  placeholder="••••••••"

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

                <p className="text-red-300 text-xs mt-1 font-medium">{errors.password.message}</p>

              )}

            </div>



            {/* Environment Security Scope Hints */}

            <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">

              <p className="text-white/50 text-xs leading-relaxed text-center">

                {isStaff

                  ? '🔒 System Audit: Authorized bank employee credentials required.'

                  : '🔒 Closed Enrollment: Accounts must be provisioned out-of-band by an administrator.'}

              </p>

            </div>



            {/* Submit Action Router Button */}

            <button

              type="submit"

              disabled={isSubmitting}

              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 tracking-wide shadow-md"

            >

              {isSubmitting ? 'Validating Token Handshake...' : 'Authorize Secure Session'}

            </button>

          </form>

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

