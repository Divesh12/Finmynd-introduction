import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowRight, Lock, Unlock, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onOpenEarlyAccess: () => void;
  sessionPasskey: string | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export default function Header({ onOpenEarlyAccess, sessionPasskey, onOpenLogin, onLogout }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Value Proposition', href: '#features' },
    { name: 'Savings Estimator', href: '#estimator' },
    { name: 'Product Demo', href: '#demo' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQs', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-xs py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-3 group select-none">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-lg shadow-emerald-500/15 group-hover:shadow-emerald-500/25 group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5.5 h-5.5 text-white animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black tracking-tight text-gray-900 leading-normal pb-0.5 inline-block">
                Fin<span className="inline-block pb-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 drop-shadow-xs font-black align-bottom">Mynd</span>
                <span className="text-indigo-600">.</span>
              </span>
              <span className="text-[9px] font-mono font-extrabold text-indigo-500 tracking-wider uppercase leading-none mt-0.5">
                mindful tax companion
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">
              Philosophy
            </a>
            <a href="#estimator" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">
              Mindful Planner
            </a>
            <a href="#scanner" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">
              Stress-Free Scanner
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">
              Share Feedback
            </a>
          </nav>

          {/* CTA Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {sessionPasskey ? (
              <div className="flex items-center space-x-3 bg-slate-50 border border-slate-100 pl-3.5 pr-2 py-1.5 rounded-xl">
                <span className="flex items-center gap-1.5 text-xs text-slate-700 font-mono font-bold">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  vault: <span className="text-emerald-600">@{sessionPasskey}</span>
                </span>
                <button
                  onClick={onLogout}
                  title="Lock & Exit Vault"
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-slate-100 transition-all font-mono"
              >
                <Unlock className="w-3.5 h-3.5 mr-2 text-slate-600" />
                UNLOCK VAULT
              </button>
            )}

            <button
              onClick={onOpenEarlyAccess}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:opacity-95 transition-all shadow-sm font-mono"
            >
              SHARE FEEDBACK
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 focus:outline-hidden"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg"
              >
                Philosophy
              </a>
              <a
                href="#estimator"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg"
              >
                Mindful Planner
              </a>
              <a
                href="#scanner"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg"
              >
                Stress-Free Scanner
              </a>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg"
              >
                Share Feedback
              </a>
               <div className="pt-4 pb-2 border-t border-gray-100 px-3 flex flex-col space-y-3">
                {sessionPasskey ? (
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl">
                    <span className="flex items-center gap-1.5 text-sm text-slate-700 font-mono font-bold">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      vault: <span className="text-emerald-600">@{sessionPasskey}</span>
                    </span>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="inline-flex items-center gap-1 text-xs text-rose-600 hover:bg-rose-50 px-2 py-1.5 rounded-lg transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="inline-flex items-center justify-center py-2.5 px-4 text-base font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors font-mono"
                  >
                    <Unlock className="w-4 h-4 mr-2 text-slate-600" />
                    UNLOCK PRIVATE VAULT
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenEarlyAccess();
                  }}
                  className="inline-flex items-center justify-center py-2.5 px-4 text-base font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  Share Feedback
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
