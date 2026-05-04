import React, { useState } from 'react';

const CreditCard = ({ cardNumber, cardHolder, expiry, cvv, brand = 'mastercard' }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Format card number with spaces every 4 digits
  const formatCardNumber = (num) => {
    return num.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div 
      className="relative w-full max-w-md h-64 cursor-pointer perspective-1000 mx-auto"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* FRONT OF CARD */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 shadow-2xl backdrop-blur-sm border border-white/30">
            {/* Card Brand Logo */}
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md opacity-90"></div>
              {brand === 'mastercard' && (
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-red-500/80"></div>
                  <div className="w-8 h-8 rounded-full bg-yellow-500/80 -ml-3"></div>
                </div>
              )}
            </div>
            
            {/* Card Number */}
            <div className="mb-4">
              <p className="text-white/50 text-xs mb-1">Card Number</p>
              <p className="text-white text-xl tracking-wider font-mono">{formatCardNumber(cardNumber)}</p>
            </div>
            
            {/* Card Details */}
            <div className="flex justify-between">
              <div>
                <p className="text-white/50 text-xs">Card Holder</p>
                <p className="text-white font-semibold tracking-wider">{cardHolder}</p>
              </div>
              <div>
                <p className="text-white/50 text-xs">Expires</p>
                <p className="text-white">{expiry}</p>
              </div>
            </div>
            
            {/* Card Network Badge */}
            <div className="absolute bottom-4 right-6 text-white/30 text-sm font-bold tracking-wider">
              PREMIUM
            </div>
          </div>
        </div>
        
        {/* BACK OF CARD */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-6 shadow-2xl">
            {/* Magnetic Strip */}
            <div className="w-full h-10 bg-black/60 mt-4"></div>
            
            {/* CVV Section */}
            <div className="mt-6 bg-white/10 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-xs">CVV/CVC</span>
                <span className="text-white font-mono text-lg tracking-wider">{cvv}</span>
              </div>
            </div>
            
            {/* Signature Strip */}
            <div className="mt-4 h-8 bg-white/20 rounded"></div>
            
            {/* Bank Contact */}
            <div className="mt-6 text-white/40 text-xs text-center">
              <p>24/7 Global Support: +1 888 123 4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;