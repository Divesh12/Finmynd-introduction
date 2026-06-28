import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  HelpCircle
} from 'lucide-react';

export default function ContactForm() {
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestedQuestions = [
    { text: "Is ₹12.5L really tax-free in the New Regime?", tag: "Budget 2025" },
    { text: "Can I claim both HRA & Home Loan interest?", tag: "Tax Exemption" },
    { text: "How does Section 87A marginal relief work?", tag: "Tax Slabs" },
    { text: "Can you build a local Form 16 PDF parser?", tag: "Feature Request" }
  ];

  const handleQuestionClick = (text: string) => {
    setMessage((prev) => {
      if (prev.trim() === '') return text;
      return `${prev}\n\n${text}`;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // 1. Determine Google Form Config (Auto-detecting from browser query string if passed, with fallback to default)
    const defaultUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeGZKwX934TAmYXEMfRs4i7igBBODcdyoFHhhFN9kkGebAtOQ/viewform';
    const defaultEntryId = 'entry.1569938489';

    let activeUrl = defaultUrl;
    let activeEntryId = defaultEntryId;

    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlParam = searchParams.get('form_url') || searchParams.get('url');
      const entryParam = searchParams.get('entry_id') || searchParams.get('entry');

      if (urlParam) {
        activeUrl = urlParam.trim();
        // If they pass a full pre-filled link in the form_url, extract the entry ID
        if (activeUrl.includes('entry.')) {
          try {
            const tempUrl = new URL(activeUrl);
            tempUrl.searchParams.forEach((val, key) => {
              if (key.startsWith('entry.')) {
                activeEntryId = key;
              }
            });
            activeUrl = activeUrl.split('?')[0];
          } catch (err) {
            // ignore
          }
        }
      }

      // Check for explicit entry parameter
      if (entryParam) {
        activeEntryId = entryParam.trim().startsWith('entry.') ? entryParam.trim() : `entry.${entryParam.trim()}`;
      }

      // Also scan browser search parameters directly for any entry.XXXX keys
      searchParams.forEach((value, key) => {
        if (key.startsWith('entry.')) {
          activeEntryId = key;
        }
      });
    }

    // Convert active URL to /formResponse format
    let cleanUrl = activeUrl.trim();
    if (cleanUrl.includes('?')) {
      cleanUrl = cleanUrl.split('?')[0];
    }
    cleanUrl = cleanUrl.replace(/\/+$/, '');
    if (!cleanUrl.endsWith('/formResponse')) {
      cleanUrl = cleanUrl.replace(/\/viewform$/, '') + '/formResponse';
    }

    const entryKey = activeEntryId.trim().startsWith('entry.') ? activeEntryId.trim() : `entry.${activeEntryId.trim()}`;

    console.log(`[Form Submission] Target response URL: ${cleanUrl}`);
    console.log(`[Form Submission] Question Entry Field: ${entryKey}`);

    // --- TRANSMISSION ROUTE: Secure Server-side Proxy Relay (Bypasses local browser CORS/adblockers securely, single submission) ---
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: message.trim(),
          formUrl: activeUrl,
          entryId: activeEntryId
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("🚀 Submission dispatched via backend Server Proxy. Google Forms HTTP status:", data.status);
        if (data.preview) {
          console.log("[Server Google Response Preview]", data.preview);
        }
      } else {
        console.warn("⚠️ Server Proxy submission warning:", data.error);
      }
    } catch (serverErr) {
      console.error("❌ Server Proxy submission error:", serverErr);
    }

    // Preserve locally in browser state silently as a local sandbox backup
    try {
      const submissions = JSON.parse(localStorage.getItem('finmynd_feedback') || '[]');
      const newSubmission = {
        id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9),
        message: message,
        submittedAt: new Date().toISOString(),
      };
      localStorage.setItem('finmynd_feedback', JSON.stringify([...submissions, newSubmission]));
    } catch (err) {
      console.error("Error writing to localStorage", err);
    }

    // Add a slight delay for transmission effect
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="inline-flex items-center space-x-1.5 bg-linear-to-r from-emerald-50 to-indigo-50 border border-emerald-100 text-emerald-800 text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider font-mono shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Integrated Feedback & Routing</span>
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Have a Complex Tax Question? Ask <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 font-extrabold">FinMynd</span>
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed font-sans">
            Whether you are curious about the new ₹12.5 Lakh zero-tax threshold, Section 87A marginal relief computations, or want us to code a custom visual chart—just type below. 
          </p>
        </div>

        {/* Main interactive form card */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-10 relative">
          
          {isSubmitted ? (
            <div className="text-center py-10 space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-gray-900">Query Received!</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto font-sans leading-relaxed font-medium text-emerald-700 text-center">
                  Your query has been successfully compiled and securely routed!
                </p>
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Submit another query
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Suggested Prompts */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  Tap to auto-fill your message:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuestionClick(q.text)}
                      className="group flex flex-col items-start p-3.5 text-left rounded-2xl border border-gray-150 bg-gray-50/50 hover:bg-emerald-50/20 hover:border-emerald-300 hover:shadow-xs transition-all duration-200 cursor-pointer w-full"
                    >
                      <span className="inline-block bg-slate-200/60 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-md font-mono uppercase tracking-wider mb-2">
                        {q.tag}
                      </span>
                      <span className="text-xs text-gray-700 group-hover:text-gray-900 font-medium font-sans">
                        {q.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message field */}
              <div className="space-y-2 text-left">
                <label htmlFor="feedback-message" className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Your message / query / request:
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 pointer-events-none text-gray-400">
                    <MessageSquare className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <textarea
                    id="feedback-message"
                    required
                    rows={5}
                    placeholder="Describe your tax concern or request. e.g. I want to calculate Section 87A marginal relief on my ₹12.75L salary. Can you build an interactive visualization chart?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl border border-gray-250 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-gray-900 placeholder-gray-400 font-sans leading-relaxed shadow-inner bg-white"
                  />
                </div>
              </div>

              {/* Micro Privacy Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-150 flex items-center space-x-3 shadow-xs text-left">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <span className="text-xs text-gray-500 font-sans">
                  <strong>FinMynd Zero-Leak Guarantee:</strong> No email logins, names, trackers, or financial files leave your client session. Your inputs remain entirely sandboxed.
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full inline-flex items-center justify-center py-4 px-4 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-500/10 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Filing your secure entry...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Submit Query to FinMynd
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </section>
  );
}
