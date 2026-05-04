import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateReceipt } from '../utils/generateReceipt';
import { useAuth } from '../contex/AuthContext'; // Fixed path

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { payment } = location.state || {};

  if (!payment) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-white mb-2">Payment Initiated!</h1>
        <p className="text-white/70 mb-6">
          Your international payment has been submitted for processing.
        </p>
        
        <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
          <p className="text-white/50 text-sm">Amount</p>
          <p className="text-white text-xl font-bold">{payment.amount} {payment.currency}</p>
          <p className="text-white/50 text-sm mt-2">Beneficiary</p>
          <p className="text-white">{payment.beneficiaryName}</p>
          <p className="text-white/50 text-sm mt-2">Reference</p>
          <p className="text-white">{payment.reference || 'International payment'}</p>
          <p className="text-white/50 text-sm mt-2">Status</p>
          <p className="text-yellow-300">{payment.status || 'pending'}</p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => generateReceipt(payment, user)}
          className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all"
        >
          📄 Download Receipt (PDF)
        </button>
      </div>
    </div>
  );
};

export default Confirmation;