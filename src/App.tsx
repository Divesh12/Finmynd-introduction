import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SavingsEstimator from './components/SavingsEstimator';
import TransactionScanner from './components/TransactionScanner';
import Features from './components/Features';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafb] flex flex-col font-sans antialiased text-slate-800 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      {/* Dynamic top ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-radial from-emerald-100/30 via-transparent to-transparent pointer-events-none -z-10" />

      {/* Beautiful Header */}
      <Header onOpenEarlyAccess={scrollToContact} />

      {/* Hero section */}
      <Hero onOpenEarlyAccess={scrollToContact} />

      {/* Main Content Area */}
      <main className="flex-grow space-y-4">
        
        {/* Savings Estimator / Mindful Planner Section */}
        <div id="estimator" className="scroll-mt-24">
          <SavingsEstimator onOpenEarlyAccess={scrollToContact} />
        </div>

        {/* Transaction Scanner Section */}
        <div id="scanner" className="scroll-mt-24">
          <TransactionScanner />
        </div>

        {/* Features Philosophy Section */}
        <div id="features" className="scroll-mt-24">
          <Features onOpenEarlyAccess={scrollToContact} />
        </div>

        {/* Contact/Query/Feedback Form Section */}
        <div id="contact" className="scroll-mt-24">
          <ContactForm />
        </div>

      </main>

      {/* Beautiful Footer */}
      <Footer />

    </div>
  );
}
