import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { auth, db } from "../../firebase"; 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// REALTIME DATABASE UPGRADE: Import the correct operational methods
import { ref, set } from "firebase/database";

// 1. Advanced Whitelist Validation Enforcing Rigid Complex RegEx Controls
const schema = yup.object({
  fullName: yup.string()
    .required('Full name required')
    .min(3, 'Minimum 3 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Character sets restricted to alphabetic properties only'), // Eliminates code injection vectors
  idNumber: yup.string()
    .required('ID number required')
    .length(13, 'Must be exactly 13 digits')
    .matches(/^\d{13}$/, 'ID structure restricted to numeric tokens only'),
  accountNumber: yup.string()
    .required('Account number required')
    .length(10, 'Must be exactly 10 digits')
    .matches(/^\d{10}$/, 'Account matrix restricted to numeric tokens only'),
  password: yup.string()
    .required('Temporary provisioning password required')
    .min(8, 'Authentication keys mandate a minimum of 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one numeric digit')
    .matches(/[@$!%*?&]/, 'Must contain at least one special character (@$!%*?&)')
});

const CustomerProvisioning = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setError('');
    setSuccessMsg('');

    try {
      const cleanAccountNumber = data.accountNumber.trim();
      const email = `${cleanAccountNumber}@banking.local`;
      
      // 1. Register the user and capture the credential
      const userCredential = await createUserWithEmailAndPassword(auth, email, data.password);
      
      // 2. USE THE UID FROM THE CREDENTIAL
      const newUserId = userCredential.user.uid; 
      
      await updateProfile(userCredential.user, { displayName: data.fullName.trim() });
      
      // 3. NOW use the correct UID path
      const customerRecordRef = ref(db, `customers/${newUserId}`);
      
      await set(customerRecordRef, {
        fullName: data.fullName.trim(),
        idNumber: data.idNumber.trim(),
        accountNumber: cleanAccountNumber,
        role: "customer",
        provisioningCycle: "Authorized_Staff_Portal",
        accountStatus: "Active",
        securityFlags: {
          forcePasswordResetOnFirstLogin: true,
          failedLoginAttempts: 0
        },
        createdAt: new Date().toISOString()
      });
      
      setSuccessMsg(`Customer account ${cleanAccountNumber} successfully provisioned.`);
      reset();
      
    } catch (error) {
      console.error('Administrative Provisioning Error Mapping:', error);
      setError(`Enrollment Failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Security Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl p-8 border border-white/10">
          
          {/* Card Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-md mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Client Provisioning Module</h2>
            <p className="text-slate-400 text-xs mt-1">Authorized Staff Operation Loop Only</p>
          </div>
          
          {/* Status Responses */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/20 border border-red-500/30">
              <p className="text-red-300 text-xs font-medium flex items-center">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <p className="text-emerald-300 text-xs font-medium flex items-center">✓ {successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name Field */}
            <div className="mb-4">
              <label className="block text-slate-300 text-xs font-semibold mb-2">Legal Full Name</label>
              <input
                type="text"
                {...register('fullName')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500 text-sm transition-all"
                placeholder="Jane Doe"
              />
              {errors.fullName && <p className="text-red-300 text-xs mt-1 font-medium">{errors.fullName.message}</p>}
            </div>

            {/* ID Number Field */}
            <div className="mb-4">
              <label className="block text-slate-300 text-xs font-semibold mb-2">Government ID Identity Mapping</label>
              <input
                type="text"
                {...register('idNumber')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500 text-sm transition-all"
                placeholder="13-Digit String"
              />
              {errors.idNumber && <p className="text-red-300 text-xs mt-1 font-medium">{errors.idNumber.message}</p>}
            </div>

            {/* Account Number Field */}
            <div className="mb-4">
              <label className="block text-slate-300 text-xs font-semibold mb-2">System Generated Account Identifier</label>
              <input
                type="text"
                {...register('accountNumber')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500 text-sm transition-all"
                placeholder="10-Digit String"
              />
              {errors.accountNumber && <p className="text-red-300 text-xs mt-1 font-medium">{errors.accountNumber.message}</p>}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-slate-300 text-xs font-semibold mb-2">Temporary Enrollment Token (Password)</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500 text-sm transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-red-300 text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            {/* Execution Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-40 text-sm tracking-wide shadow-lg"
            >
              {isSubmitting ? 'Executing Security Handshake...' : 'Provision Secure Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerProvisioning;