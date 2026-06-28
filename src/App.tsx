import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import SavingsEstimator from './components/SavingsEstimator';
import TransactionScanner from './components/TransactionScanner';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

export default function App() {
  const [sessionPasskey, setSessionPasskey] = useState<string | null>(() => {
    return localStorage.getItem('finmynd_active_session');
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleScrollToFeedback = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenLogin = () => {
    setIsLoginOpen(true);
  };

  const handleLogout = () => {
    setSessionPasskey(null);
    localStorage.removeItem('finmynd_active_session');
  };

  const handleLoginSuccess = (passkey: string) => {
    setSessionPasskey(passkey);
    localStorage.setItem('finmynd_active_session', passkey);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans antialiased text-gray-800">
      
      {/* Header */}
      <Header 
        onOpenEarlyAccess={handleScrollToFeedback} 
        sessionPasskey={sessionPasskey}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero 
          onOpenEarlyAccess={handleScrollToFeedback} 
          sessionPasskey={sessionPasskey}
          onOpenLogin={handleOpenLogin}
        />

        {/* Features / Value Propositions */}
        <Features onOpenEarlyAccess={handleScrollToFeedback} />

        {/* Savings Estimator Interactive Calculator */}
        <SavingsEstimator onOpenEarlyAccess={handleScrollToFeedback} />

        {/* Transaction Scanner for Bank Statements */}
        <TransactionScanner />

        {/* Contact/Feedback Form Section */}
        <ContactForm />
      </main>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
