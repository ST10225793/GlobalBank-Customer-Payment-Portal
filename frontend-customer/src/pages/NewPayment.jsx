import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contex/AuthContext'; // Fixed path
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useMutation } from '@tanstack/react-query';

const NewPayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    provider: 'SWIFT',
    beneficiaryName: '',
    beneficiaryAccount: '',
    swiftCode: '',
    reference: ''
  });
  const [errors, setErrors] = useState({});
  const [swiftValid, setSwiftValid] = useState(null);

  // Currency options
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
  ];

  // Provider options
  const providers = [
    { id: 'SWIFT', name: 'SWIFT', description: 'Traditional bank transfer', icon: '🏦', fee: '$15' },
    { id: 'Wise', name: 'Wise', description: 'Low cost transfers', icon: '🌍', fee: '$5' },
    { id: 'Payoneer', name: 'Payoneer', description: 'Business payments', icon: '💼', fee: '$10' }
  ];

  // Mock exchange rates
  const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    ZAR: 18.50,
    JPY: 150.20
  };

  const validateSwiftCode = (code) => {
    const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    if (!code) return false;
    
    if (swiftRegex.test(code.toUpperCase())) {
      const bankMap = {
        'CHASUS33': 'JPMorgan Chase Bank, New York',
        'BOFAUS3N': 'Bank of America, New York',
        'CITIUS33': 'Citibank, New York',
        'SBZAZAJJ': 'Standard Bank, South Africa',
        'FIRNZAJJ': 'FirstRand Bank, South Africa'
      };
      return { valid: true, bank: bankMap[code.toUpperCase()] || 'Bank identified' };
    }
    return { valid: false, bank: null };
  };

  const handleSwiftChange = (e) => {
    const code = e.target.value.toUpperCase();
    setFormData({ ...formData, swiftCode: code });
    const validation = validateSwiftCode(code);
    setSwiftValid(validation);
    
    if (!validation.valid && code.length > 0) {
      setErrors({ ...errors, swiftCode: 'Invalid SWIFT code format' });
    } else {
      setErrors({ ...errors, swiftCode: null });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.beneficiaryName) {
      newErrors.beneficiaryName = 'Beneficiary name is required';
    }
    if (!formData.beneficiaryAccount) {
      newErrors.beneficiaryAccount = 'Account number is required';
    }
    if (!formData.swiftCode) {
      newErrors.swiftCode = 'SWIFT code is required';
    } else if (!validateSwiftCode(formData.swiftCode).valid) {
      newErrors.swiftCode = 'Invalid SWIFT code format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit payment to Firestore
  const submitMutation = useMutation({
    mutationFn: async (paymentData) => {
      // Save to Firestore payments collection
      const docRef = await addDoc(collection(db, 'payments'), {
        ...paymentData,
        customerId: user?.uid,
        customerName: user?.fullName,
        customerAccount: user?.accountNumber,
        status: 'pending',
        verified: false,
        submittedToSwift: false,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...paymentData };
    },
    onSuccess: (data) => {
      navigate('/confirmation', { state: { payment: data } });
    },
    onError: (error) => {
      setErrors({ submit: error.message || 'Payment failed' });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const paymentData = {
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        provider: formData.provider,
        beneficiaryName: formData.beneficiaryName,
        beneficiaryAccount: formData.beneficiaryAccount,
        swiftCode: formData.swiftCode.toUpperCase(),
        reference: formData.reference || 'International payment'
      };
      submitMutation.mutate(paymentData);
    }
  };

  const getConvertedAmount = () => {
    if (!formData.amount) return '0';
    const amount = parseFloat(formData.amount);
    const rate = exchangeRates[formData.currency];
    return (amount / rate).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800">
      <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">GB</span>
              </div>
              <h1 className="text-2xl font-bold text-white">New International Payment</h1>
            </div>
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all">Cancel</button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Amount Section */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Payment Amount</h3>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-white/70 text-sm mb-2">Amount</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg focus:outline-none focus:border-blue-400" placeholder="0.00" step="0.01" />
                    {errors.amount && <p className="text-red-300 text-xs mt-1">{errors.amount}</p>}
                  </div>
                  <div className="w-32">
                    <label className="block text-white/70 text-sm mb-2">Currency</label>
                    <select name="currency" value={formData.currency} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400">
                      {currencies.map(c => (<option key={c.code} value={c.code}>{c.code}</option>))}
                    </select>
                  </div>
                </div>
                <div className="mt-3 text-white/50 text-sm">≈ ${getConvertedAmount()} USD equivalent</div>
              </div>

              {/* Beneficiary Section */}
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Beneficiary Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Full Name</label>
                    <input type="text" name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400" placeholder="John Smith" />
                    {errors.beneficiaryName && <p className="text-red-300 text-xs mt-1">{errors.beneficiaryName}</p>}
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Account Number</label>
                    <input type="text" name="beneficiaryAccount" value={formData.beneficiaryAccount} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400" placeholder="12345678" />
                    {errors.beneficiaryAccount && <p className="text-red-300 text-xs mt-1">{errors.beneficiaryAccount}</p>}
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">SWIFT/BIC Code</label>
                    <input type="text" name="swiftCode" value={formData.swiftCode} onChange={handleSwiftChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white uppercase focus:outline-none focus:border-blue-400" placeholder="CHASUS33" maxLength="11" />
                    {swiftValid?.valid && swiftValid.bank && (<p className="text-green-300 text-xs mt-1">✓ {swiftValid.bank}</p>)}
                    {errors.swiftCode && <p className="text-red-300 text-xs mt-1">{errors.swiftCode}</p>}
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Reference (Optional)</label>
                    <input type="text" name="reference" value={formData.reference} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400" placeholder="Invoice #1234" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Select Provider</h3>
                <div className="space-y-3">
                  {providers.map(provider => (
                    <label key={provider.id} className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${formData.provider === provider.id ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-400' : 'bg-white/5 border border-white/20 hover:bg-white/10'}`}>
                      <input type="radio" name="provider" value={provider.id} checked={formData.provider === provider.id} onChange={handleChange} className="mr-3" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2"><span className="text-2xl">{provider.icon}</span><span className="text-white font-semibold">{provider.name}</span></div>
                        <p className="text-white/50 text-xs mt-1">{provider.description}</p>
                      </div>
                      <div className="text-right"><p className="text-white font-bold">{provider.fee}</p><p className="text-white/40 text-xs">fee</p></div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-white/70">Amount:</span><span className="text-white font-semibold">{formData.amount || '0'} {formData.currency}</span></div>
                  <div className="flex justify-between"><span className="text-white/70">Provider Fee:</span><span className="text-white">{providers.find(p => p.id === formData.provider)?.fee || '$0'}</span></div>
                  <div className="border-t border-white/20 pt-3"><div className="flex justify-between"><span className="text-white font-semibold">Total to Pay:</span><span className="text-white font-bold text-lg">{formData.amount || '0'} {formData.currency}</span></div></div>
                </div>
                {errors.submit && (<div className="mt-4 p-3 bg-red-500/20 rounded-lg text-red-200 text-sm">{errors.submit}</div>)}
                <button type="submit" disabled={submitMutation.isPending} className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50">{submitMutation.isPending ? 'Processing...' : 'Pay Now →'}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPayment;