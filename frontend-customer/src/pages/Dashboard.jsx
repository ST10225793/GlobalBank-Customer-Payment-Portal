import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contex/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import CreditCard from '../components/CreditCard';
import CardActions from '../components/CardActions';
import useSessionTimeout from '../hooks/useSessionTimeout';
import SessionWarningModal from '../components/SessionWarningModal';

// QR Scanner Button Component (mobile-only)
const QrScannerButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="fixed bottom-6 right-6 md:hidden w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl flex items-center justify-center text-2xl animate-bounce z-50 hover:scale-110 transition-transform duration-300"
  >
    📷
  </button>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    pendingCount: 0
  });

  // Fetch user's payments from Firestore
  const { data: payments, isLoading } = useQuery({
    queryKey: ['myPayments', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const q = query(collection(db, 'payments'), where('customerId', '==', user.uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!user?.uid
  });

  useEffect(() => {
    if (payments && payments.length > 0) {
      const total = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const pending = payments.filter(p => p.status === 'pending').length;
      setStats({
        totalPayments: payments.length,
        totalAmount: total,
        pendingCount: pending
      });
    }
  }, [payments]);

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      verified: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      submitted: 'bg-green-500/20 text-green-300 border-green-500/50'
    };
    return badges[status] || badges.pending;
  };

  // Handle QR code scan (mock)
  const handleScan = (scannedData) => {
    console.log('Scanned QR data:', scannedData);
    alert(`QR Code detected! Redirecting to payment with: ${scannedData}`);
    setShowScanner(false);
    navigate('/new-payment');
  };

  const { showWarning, setShowWarning, timeLeft } = useSessionTimeout(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
      {/* Navbar */}
      <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">GB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Customer Portal</h1>
                <p className="text-white/50 text-xs">International Payments</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-white/80 text-sm hidden md:block">
                Welcome, {user?.fullName?.split(' ')[0] || user?.name}
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

      <div className="container mx-auto px-6 py-8 pb-24 md:pb-8">
        {/* Welcome Banner */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.fullName || user?.name}!
          </h2>
          <p className="text-white/70">
            Make international payments, track your transactions, and manage your beneficiaries.
          </p>
        </div>

        {/* Credit Card + Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <CreditCard 
              cardNumber="**** **** **** 1234"
              cardHolder={user?.fullName?.toUpperCase() || 'CARD HOLDER'}
              expiry="12/28"
              cvv="***"
              brand="mastercard"
            />
          </div>
          
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h3 className="text-white/70 text-sm mb-4">Account Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-white/60 text-sm">Total Transactions</span>
                <span className="text-white font-semibold text-lg">{stats.totalPayments}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-white/60 text-sm">Total Spent</span>
                <span className="text-white font-semibold text-lg">
                  ${stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Pending Transactions</span>
                <span className="text-yellow-300 font-semibold text-lg">{stats.pendingCount}</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
              <p className="text-white/50 text-xs">Available Balance</p>
              <p className="text-white text-xl font-bold">
                ${(5000 - stats.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="mb-8">
          <CardActions />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button onClick={() => navigate('/new-payment')} className="backdrop-blur-xl bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 group">
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-2">New Payment →</h3>
              <p className="text-white/70 text-sm">Make an international transfer</p>
            </div>
          </button>
          <button className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300">
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-2">Beneficiaries</h3>
              <p className="text-white/70 text-sm">Manage saved payees</p>
            </div>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
            <p className="text-white/50 text-sm mt-1">Your latest international payments</p>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="text-white/70 mt-2">Loading transactions...</p>
              </div>
            ) : payments && payments.length > 0 ? (
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-semibold">Beneficiary</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-white/70 text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 5).map((payment) => (
                    <tr key={payment.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white/80 text-sm">{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{payment.beneficiaryName}</p>
                        <p className="text-white/40 text-xs">{payment.swiftCode}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-semibold">{payment.amount} {payment.currency}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">💸</div>
                <p className="text-white/70 text-lg">No transactions yet</p>
                <p className="text-white/50 text-sm mt-2">Make your first international payment</p>
                <button
                  onClick={() => navigate('/new-payment')}
                  className="mt-4 px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-xl transition-all"
                >
                  Make a Payment →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Scanner Button */}
      <QrScannerButton onClick={() => setShowScanner(true)} />

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center p-6">
            <div className="relative w-72 h-72 md:w-96 md:h-96 border-4 border-white rounded-2xl mb-6 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-scan"></div>
              <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl"></div>
              <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl"></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-white rounded-br"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white/70 text-xs">Position QR code in frame</p>
              </div>
            </div>
            
            <p className="text-white text-lg mb-2 font-semibold">Scan QR Code</p>
            <p className="text-white/50 text-sm mb-6">Scan a beneficiary's QR code to auto-fill payment details</p>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                  setShowScanner(false);
                  setTimeout(() => {
                    handleScan('beneficiary:JohnDoe,amount:500,currency:USD');
                  }, 2000);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
              >
                Simulate Scan
              </button>
              <button 
                onClick={() => setShowScanner(false)} 
                className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Warning Modal */}
      <SessionWarningModal 
        show={showWarning}
        timeLeft={timeLeft}
        onStayLoggedIn={() => setShowWarning(false)}
        onLogout={() => {
          setShowWarning(false);
          logout();
          navigate('/login');
        }}
      />

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;