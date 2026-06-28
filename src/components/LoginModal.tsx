import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Eye, EyeOff, X, Sparkles, CheckCircle, Lock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (passkey: string) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [passkey, setPasskey] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  // Check if the user is typing an existing or new passkey
  const handlePasskeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setPasskey(val);
    setError('');
    
    if (val) {
      const storedVaults = JSON.parse(localStorage.getItem('finmynd_vaults_index') || '{}');
      if (storedVaults[val]) {
        setIsNewUser(false);
      } else {
        setIsNewUser(true);
      }
    } else {
      setIsNewUser(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanPasskey = passkey.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanPasskey) {
      setError('Please enter a Passkey ID.');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    const storedVaults = JSON.parse(localStorage.getItem('finmynd_vaults_index') || '{}');

    if (storedVaults[cleanPasskey]) {
      // Existing user - verify password
      if (storedVaults[cleanPasskey] === cleanPassword) {
        setSuccessMsg(`Welcome back to your private vault, ${cleanPasskey}!`);
        setTimeout(() => {
          onLoginSuccess(cleanPasskey);
          onClose();
        }, 1200);
      } else {
        setError('Incorrect password for this Passkey. Please try again.');
      }
    } else {
      // New user - automatically register and open vault
      storedVaults[cleanPasskey] = cleanPassword;
      localStorage.setItem('finmynd_vaults_index', JSON.stringify(storedVaults));
      
      setSuccessMsg(`Vault created successfully! Welcome, ${cleanPasskey}!`);
      setTimeout(() => {
        onLoginSuccess(cleanPasskey);
        onClose();
      }, 1200);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 z-10"
          >
            {/* Elegant Top Color Ribbon */}
            <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-50 to-indigo-50 border border-emerald-100 text-emerald-600 shadow-xs">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-950 leading-tight">
                    Zero-PII Private Vault
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    No email. No phone. No OTPs. Only complete peace of mind.
                  </p>
                </div>
              </div>

              {/* Informative text about No-PII policy */}
              <div className="mb-6 p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-[11px] leading-relaxed text-indigo-950">
                <div className="font-semibold flex items-center gap-1.5 mb-1 text-indigo-900">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  How Anonymous Vault Works
                </div>
                We only process transaction listings—never actual names, PAN cards, or phone numbers. Simply create any custom nickname Passkey and secure it with a password to save and load your planning sessions.
              </div>

              {/* Success Notification */}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{successMsg}</span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Passkey ID Input */}
                <div>
                  <label htmlFor="passkey" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                    Choose Passkey ID (Any alias)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      @
                    </span>
                    <input
                      id="passkey"
                      type="text"
                      required
                      placeholder="e.g. peaceful-finances, taxninja42"
                      value={passkey}
                      onChange={handlePasskeyChange}
                      disabled={!!successMsg}
                      className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-8 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-50"
                    />
                  </div>
                  {passkey && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-[10px] mt-1.5 font-mono ${isNewUser ? 'text-indigo-600 font-bold' : 'text-emerald-600 font-bold'}`}
                    >
                      {isNewUser ? '✨ Passkey available! This will automatically register your new private vault.' : '🔒 Existing passkey detected! Enter your password to unlock.'}
                    </motion.p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                    Security Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Key className="w-4 h-4" />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      disabled={!!successMsg}
                      className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden disabled:bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-150 text-rose-700 text-xs font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!!successMsg}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 hover:opacity-95 transition-opacity shadow-md shadow-indigo-600/10 focus:outline-hidden disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isNewUser ? 'Create Vault & Start Using' : 'Unlock Private Vault'}
                </button>
              </form>

              {/* Hint */}
              <div className="mt-5 text-center">
                <span className="text-[10px] text-slate-400 font-mono">
                  Your transactions are only read to parse exemptions, never PII.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
