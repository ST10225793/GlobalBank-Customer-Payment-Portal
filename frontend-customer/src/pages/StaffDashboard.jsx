import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contex/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  console.log('Staff user:', user);  // Add this
console.log('User UID:', user?.uid);  // Add this
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all payments from Firestore
  const { data: payments, isLoading } = useQuery({
    queryKey: ['allPayments'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'payments'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  });

  // Calculate stats from payments
  const stats = {
    total: payments?.length || 0,
    pending: payments?.filter(p => p.status === 'pending').length || 0,
    verified: payments?.filter(p => p.verified === true).length || 0,
    submittedToSwift: payments?.filter(p => p.submittedToSwift === true).length || 0
  };

  // Verify mutation - updates Firestore
  const verifyMutation = useMutation({
    mutationFn: async (paymentId) => {
      const paymentRef = doc(db, 'payments', paymentId);
      await updateDoc(paymentRef, {
        verified: true,
        verifiedBy: user?.uid,
        verifiedAt: new Date().toISOString(),
        status: 'verified'
      });
      return paymentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allPayments']);
    }
  });

  // Submit to SWIFT mutation
  const submitMutation = useMutation({
    mutationFn: async (paymentId) => {
      const paymentRef = doc(db, 'payments', paymentId);
      await updateDoc(paymentRef, {
        submittedToSwift: true,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      });
      return paymentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allPayments']);
    }
  });

  // Filter and search payments
  const filteredPayments = payments?.filter(payment => {
    if (filter === 'pending' && payment.status !== 'pending') return false;
    if (filter === 'verified' && !payment.verified) return false;
    if (filter === 'submitted' && !payment.submittedToSwift) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        payment.beneficiaryName?.toLowerCase().includes(term) ||
        payment.swiftCode?.toLowerCase().includes(term) ||
        payment.customerAccount?.toLowerCase().includes(term) ||
        payment.amount?.toString().includes(term)
      );
    }
    
    return true;
  });

  const getStatusBadge = (payment) => {
    if (payment.submittedToSwift) return 'bg-green-500/20 text-green-300 border-green-500/50';
    if (payment.verified) return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
    return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
  };

  const getStatusText = (payment) => {
    if (payment.submittedToSwift) return 'Submitted to SWIFT';
    if (payment.verified) return 'Verified';
    return 'Pending Verification';
  };

  const handleVerify = async (paymentId) => {
    if (window.confirm('Verify this payment?')) {
      await verifyMutation.mutateAsync(paymentId);
    }
  };

  const handleSubmitToSwift = async (paymentId) => {
    if (window.confirm('Submit this payment to SWIFT? This action cannot be undone.')) {
      await submitMutation.mutateAsync(paymentId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">GB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Staff Portal</h1>
                <p className="text-white/50 text-xs">Payment Operations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-white/80 text-sm hidden md:block">
                Welcome, {user?.name || 'Staff'}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <p className="text-white/70 text-sm">Total Payments</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <p className="text-white/70 text-sm">Pending Verification</p>
            <p className="text-3xl font-bold text-yellow-300">{stats.pending}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <p className="text-white/70 text-sm">Verified</p>
            <p className="text-3xl font-bold text-blue-300">{stats.verified}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <p className="text-white/70 text-sm">Submitted to SWIFT</p>
            <p className="text-3xl font-bold text-green-300">{stats.submittedToSwift}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              {['all', 'pending', 'verified', 'submitted'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filter === f
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            
            <input
              type="text"
              placeholder="Search by name, SWIFT, account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Payments Table */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h3 className="text-xl font-bold text-white">International Payments Queue</h3>
            <p className="text-white/50 text-sm mt-1">Review and verify pending transactions</p>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="text-white/70 mt-2">Loading payments...</p>
              </div>
            ) : filteredPayments && filteredPayments.length > 0 ? (
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-semibold">Beneficiary</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-semibold">SWIFT</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white/70 text-sm">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm">{payment.customerAccount || payment.customerId}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{payment.beneficiaryName}</p>
                          <p className="text-white/50 text-xs">{payment.beneficiaryAccount}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-semibold">
                          {payment.amount} {payment.currency}
                        </p>
                        <p className="text-white/50 text-xs">{payment.provider}</p>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-white/70 text-xs">{payment.swiftCode}</code>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(payment)}`}>
                          {getStatusText(payment)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {!payment.verified && !payment.submittedToSwift && (
                            <button
                              onClick={() => handleVerify(payment.id)}
                              className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg text-sm transition-all"
                            >
                              Verify
                            </button>
                          )}
                          {payment.verified && !payment.submittedToSwift && (
                            <button
                              onClick={() => handleSubmitToSwift(payment.id)}
                              className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-lg text-sm transition-all"
                            >
                              Submit to SWIFT
                            </button>
                          )}
                          {payment.submittedToSwift && (
                            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm">
                              Completed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-white/70 text-lg">No payments found</p>
                <p className="text-white/50 text-sm mt-2">Waiting for customers to make payments</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;