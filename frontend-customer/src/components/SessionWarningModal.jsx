import React, { useEffect, useState } from 'react';

const SessionWarningModal = ({ show, timeLeft, onStayLoggedIn, onLogout }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (show && timeLeft > 0) {
      setProgress((timeLeft / 30) * 100);
    }
  }, [show, timeLeft]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-blue-900/90 rounded-2xl p-8 border border-white/20 max-w-md w-full mx-4 shadow-2xl">
        {/* Warning Icon */}
        <div className="text-center mb-4">
          <div className="w-20 h-20 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⏰</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Session Expiring Soon</h3>
          <p className="text-white/70 text-sm">
            Your session will expire due to inactivity
          </p>
        </div>

        {/* Timer Circle */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="url(#warningGradient)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={2 * Math.PI * 58}
              strokeDashoffset={2 * Math.PI * 58 * (1 - progress / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-white">{timeLeft}</p>
            <p className="text-white/50 text-xs">seconds</p>
          </div>
        </div>

        <p className="text-white/60 text-sm text-center mb-6">
          For your security, you will be automatically logged out.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onLogout}
            className="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl transition-all border border-red-500/30"
          >
            Logout Now
          </button>
          <button
            onClick={onStayLoggedIn}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-all"
          >
            Stay Logged In
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SessionWarningModal;