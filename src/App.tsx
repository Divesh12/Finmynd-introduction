import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import SavingsEstimator from './components/SavingsEstimator';
import TransactionScanner from './components/TransactionScanner';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  const handleScrollToFeedback = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans antialiased text-gray-800">
      
      {/* Header */}
      <Header onOpenEarlyAccess={handleScrollToFeedback} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero onOpenEarlyAccess={handleScrollToFeedback} />

        {/* Features / Value Propositions */}
        <Features onOpenEarlyAccess={handleScrollToFeedback} />

        {/* Savings Estimator Interactive Calculator */}
        <SavingsEstimator onOpenEarlyAccess={handleScrollToFeedback} />

        {/* Transaction Scanner for Bank Statements */}
        <TransactionScanner />

        {/* Contact/Feedback Form Section */}
        <ContactForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
