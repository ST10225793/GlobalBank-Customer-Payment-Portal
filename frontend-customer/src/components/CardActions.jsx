import React, { useState } from 'react';

const CardActions = () => {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [isCardLocked, setIsCardLocked] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(5000);
  const [selectedTopUp, setSelectedTopUp] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('');

  const actions = [
    { 
      id: 'lock', 
      label: isCardLocked ? 'Unlock Card' : 'Lock Card', 
      icon: isCardLocked ? '🔓' : '🔒',
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/20',
      action: () => setIsCardLocked(!isCardLocked)
    },
    { id: 'pin', label: 'Change PIN', icon: '🔢', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/20' },
    { id: 'topup', label: 'Top Up', icon: '📱', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/20' },
    { id: 'limit', label: 'Set Limit', icon: '⚡', color: 'from-purple-500 to-indigo-500', bgColor: 'bg-purple-500/20' }
  ];

  // Top Up service options
  const topUpServices = [
    { id: 'airtime', label: 'Airtime', icon: '📞', providers: ['MTN', 'Vodacom', 'Telkom', 'Cell C'] },
    { id: 'electricity', label: 'Electricity', icon: '⚡', providers: ['Eskom', 'City Power'] },
    { id: 'data', label: 'Data Bundle', icon: '📶', providers: ['MTN', 'Vodacom', 'Telkom', 'Cell C'] },
    { id: 'dstv', label: 'DStv', icon: '📺', providers: ['Premium', 'Compact', 'Family', 'Access'] },
    { id: 'hollywood', label: 'Hollywood Bets', icon: '🎰', providers: ['Sports', 'Racing', 'Casino'] }
  ];

  const handleAction = (actionId) => {
    if (actionId === 'limit') {
      setShowLimitModal(true);
    } else if (actionId === 'topup') {
      setShowTopUpModal(true);
    } else if (actionId === 'pin') {
      alert('PIN change requested. An OTP has been sent to your registered mobile number.');
    }
  };

  const handleTopUp = () => {
    if (selectedTopUp && topUpAmount) {
      alert(`Top up ${selectedTopUp.label} of $${topUpAmount} successful!`);
      setShowTopUpModal(false);
      setSelectedTopUp(null);
      setTopUpAmount('');
    } else {
      alert('Please select a service and enter an amount');
    }
  };

  return (
    <>
      {/* Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              if (action.action) action.action();
              else handleAction(action.id);
            }}
            className={`group flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${action.bgColor} border border-white/10 hover:scale-105 hover:shadow-lg`}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-white text-xs font-semibold">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Card Status Indicator */}
      {isCardLocked && (
        <div className="mt-3 p-2 bg-red-500/20 rounded-lg border border-red-500/50 text-center">
          <p className="text-red-300 text-xs">⚠️ Card is currently LOCKED. Some transactions may be blocked.</p>
        </div>
      )}

      {/* ========== SET LIMIT MODAL ========== */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">Set Daily Spending Limit</h3>
              <button onClick={() => setShowLimitModal(false)} className="text-white/50 hover:text-white">✕</button>
            </div>
            
            <p className="text-white/50 text-sm mb-4">Set a maximum amount that can be spent per day</p>
            
            <div className="mb-4">
              <label className="block text-white/70 text-sm mb-2">Daily Limit Amount (USD)</label>
              <input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg"
                placeholder="Enter amount"
                min="0"
                step="100"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowLimitModal(false)} 
                className="flex-1 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => { 
                  setShowLimitModal(false); 
                  alert(`Daily limit successfully set to $${dailyLimit}`); 
                }} 
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:scale-105 transition"
              >
                Save Limit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== TOP UP MODAL ========== */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in overflow-y-auto py-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">Top Up Services</h3>
              <button onClick={() => {
                setShowTopUpModal(false);
                setSelectedTopUp(null);
                setTopUpAmount('');
              }} className="text-white/50 hover:text-white">✕</button>
            </div>
            
            {!selectedTopUp ? (
              // Service Selection
              <div className="grid grid-cols-2 gap-3">
                {topUpServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedTopUp(service)}
                    className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition group"
                  >
                    <span className="text-3xl">{service.icon}</span>
                    <span className="text-white text-sm font-semibold">{service.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              // Provider & Amount Selection
              <div>
                <button 
                  onClick={() => setSelectedTopUp(null)}
                  className="text-white/50 text-sm mb-4 flex items-center gap-1 hover:text-white"
                >
                  ← Back to services
                </button>
                
                <div className="mb-4">
                  <label className="block text-white/70 text-sm mb-2">Select Provider</label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white">
                    {selectedTopUp.providers.map((provider) => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-white/70 text-sm mb-2">Amount (USD)</label>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    placeholder="Enter amount"
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setSelectedTopUp(null)} 
                    className="flex-1 px-4 py-2 bg-white/10 rounded-xl text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleTopUp} 
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-semibold"
                  >
                    Confirm Top Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CardActions;