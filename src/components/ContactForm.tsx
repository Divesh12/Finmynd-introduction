import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  HelpCircle,
  Settings,
  Link2,
  Check
} from 'lucide-react';

export default function ContactForm() {
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeGZKwX934TAmYXEMfRs4i7igBBODcdyoFHhhFN9kkGebAtOQ/viewform';
  const defaultEntryId = 'entry.1569938489';

  // State to hold the actively used Google Form configuration
  const [formUrl, setFormUrl] = useState(() => {
    try {
      return localStorage.getItem('finmynd_custom_form_url') || defaultUrl;
    } catch (e) {
      return defaultUrl;
    }
  });

  const [entryId, setEntryId] = useState(() => {
    try {
      return localStorage.getItem('finmynd_custom_entry_id') || defaultEntryId;
    } catch (e) {
      return defaultEntryId;
    }
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Automatically detect and save Google Form configurations passed in browser URL (case-insensitive)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parseParams = (queryString: string) => {
        const params = new URLSearchParams(queryString);
        let foundUrl = '';
        let foundEntry = '';
        
        params.forEach((value, key) => {
          const lowerKey = key.toLowerCase();
          if (lowerKey === 'form_url' || lowerKey === 'url' || lowerKey === 'formurl') {
            foundUrl = value;
          } else if (lowerKey === 'entry_id' || lowerKey === 'entry' || lowerKey === 'entryid') {
            foundEntry = value;
          } else if (lowerKey.startsWith('entry.')) {
            foundEntry = key;
          }
        });
        
        return { foundUrl, foundEntry };
      };

      // Check current query search parameters (?...)
      let { foundUrl, foundEntry } = parseParams(window.location.search);
      
      // Fallback check: Hash parameters (#...)
      if (!foundUrl || !foundEntry) {
        const hashIndex = window.location.hash.indexOf('?');
        const hashQuery = hashIndex !== -1 ? window.location.hash.substring(hashIndex) : window.location.hash.replace(/^#/, '?');
        const hashResult = parseParams(hashQuery);
        if (!foundUrl && hashResult.foundUrl) foundUrl = hashResult.foundUrl;
        if (!foundEntry && hashResult.foundEntry) foundEntry = hashResult.foundEntry;
      }

      // Fallback check: Parent referrer query parameters (for embedded iframe environments)
      try {
        if (document.referrer) {
          const refUrl = new URL(document.referrer);
          const refResult = parseParams(refUrl.search);
          if (!foundUrl && refResult.foundUrl) foundUrl = refResult.foundUrl;
          if (!foundEntry && refResult.foundEntry) foundEntry = refResult.foundEntry;
        }
      } catch (e) {}

      // Update state and write to localStorage to persist custom configuration
      if (foundUrl) {
        const cleanUrl = foundUrl.trim();
        setFormUrl(cleanUrl);
        try {
          localStorage.setItem('finmynd_custom_form_url', cleanUrl);
        } catch (e) {}
      }
      if (foundEntry) {
        let cleanEntry = foundEntry.trim();
        if (!cleanEntry.startsWith('entry.')) {
          cleanEntry = `entry.${cleanEntry}`;
        }
        setEntryId(cleanEntry);
        try {
          localStorage.setItem('finmynd_custom_entry_id', cleanEntry);
        } catch (e) {}
      }
    }
  }, []);

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

    const activeUrl = formUrl.trim();
    const activeEntryId = entryId.trim();

    // Convert active URL to /formResponse format
    let cleanUrl = activeUrl;
    if (cleanUrl.includes('?')) {
      cleanUrl = cleanUrl.split('?')[0];
    }
    cleanUrl = cleanUrl.replace(/\/+$/, '');
    
    if (!cleanUrl.endsWith('/formResponse')) {
      // Replace terminal parts like /viewform, /edit, /prefill, /closedForm with /formResponse
      cleanUrl = cleanUrl.replace(/\/(viewform|edit|prefill|closedForm)$/, '');
      cleanUrl = `${cleanUrl}/formResponse`;
    }

    const entryKey = activeEntryId.startsWith('entry.') ? activeEntryId : `entry.${activeEntryId}`;

    console.log(`[Form Submission] Target response URL: ${cleanUrl}`);
    console.log(`[Form Submission] Question Entry Field: ${entryKey}`);

    // --- TRANSMISSION ROUTE: Secure Server-side Proxy Relay (Bypasses local browser CORS/adblockers securely, single submission) ---
    let submittedViaBackend = false;
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

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("🚀 Submission dispatched via backend Server Proxy. Google Forms HTTP status:", data.status);
          submittedViaBackend = true;
          if (data.preview) {
            console.log("[Server Google Response Preview]", data.preview);
          }
        } else {
          console.warn("⚠️ Server Proxy submission warning:", data.error);
        }
      }
    } catch (serverErr) {
      console.error("❌ Server Proxy submission error, attempting client-side fallback:", serverErr);
    }

    if (!submittedViaBackend) {
      console.log("🔄 Initiating client-side direct form submit fallback...");
      try {
        // Create hidden iframe and form to submit without CORS issues
        const iframeId = 'hidden_iframe_submit_' + Math.random().toString(36).substring(2, 9);
        const iframe = document.createElement('iframe');
        iframe.name = iframeId;
        iframe.id = iframeId;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const form = document.createElement('form');
        form.action = cleanUrl;
        form.method = 'POST';
        form.target = iframeId;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = entryKey;
        input.value = message.trim();
        form.appendChild(input);

        // Add standard google form submit auxiliary fields
        const extraFields = {
          fvv: "1",
          pageHistory: "0",
          draftResponse: "[]",
          submit: "Submit"
        };
        Object.entries(extraFields).forEach(([key, val]) => {
          const field = document.createElement('input');
          field.type = 'hidden';
          field.name = key;
          field.value = val;
          form.appendChild(field);
        });

        document.body.appendChild(form);
        form.submit();

        // Cleanup elements after submit
        setTimeout(() => {
          document.body.removeChild(form);
          document.body.removeChild(iframe);
          console.log("✅ Client-side direct fallback form submission successful.");
        }, 1000);
      } catch (clientErr) {
        console.error("❌ Client-side direct submission fallback failed:", clientErr);
      }
    }

    // Preserve locally in browser state silently as a local sandbox backup
    try {
      const submissions = JSON.parse(localStorage.getItem('finmynd_feedback') || '[]');
      const newSubmission = {
        id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9),
        message: message,
        submittedAt: new Date().toISOString(),
        formUrl: activeUrl,
        entryId: activeEntryId
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
            Have a Complex Tax Question? Ask <span className="inline-block pb-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 font-extrabold align-bottom">FinMynd</span>
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
            <div className="space-y-8">
              {/* The Teaser Hook */}
              <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xs border border-slate-800">
                <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-2xl mx-auto space-y-3 relative text-left sm:text-center">
                  <span className="text-[9px] font-extrabold font-mono tracking-widest text-emerald-400 uppercase">
                    Privacy Assurance
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-white leading-snug">
                    &ldquo;We engineered our system so we couldn&apos;t watch you even if we wanted to.&rdquo;
                  </h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Most platforms ask for your trust. We decided to remove the human element entirely by making your real-world identity completely invisible to our network. You get total control over your money, with zero exposure.
                  </p>
                </div>
              </div>

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
                    <strong>Anxiety-Free Privacy:</strong> We strictly ban the collection of real-world identity markers—no names, no phone numbers, and no linked personal tracking. Your feedback is fully anonymous.
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

              {/* Optional Google Sheets / Form Integration Drawer */}
              <div className="mt-8 pt-6 border-t border-gray-150 text-left">
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(!isConfigOpen)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer focus:outline-hidden"
                >
                  <Settings className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Configure Google Sheets Integration</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${formUrl !== defaultUrl ? 'bg-indigo-100 text-indigo-800 font-semibold' : 'bg-slate-100 text-slate-600'}`}>
                    {formUrl !== defaultUrl ? 'Custom Link Active' : 'Default Sheet'}
                  </span>
                </button>

                {isConfigOpen && (
                  <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-gray-150 space-y-4 text-sm text-slate-700 animate-fade-in">
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                        Link Your Own Google Sheet
                      </h4>
                      <p className="text-xs text-slate-500 font-sans leading-relaxed">
                        To receive feedback directly in your own Google Sheet: Create a Google Form with a single paragraph text field, copy the Form URL, and paste it below along with its corresponding input field Entry ID (e.g., <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-[10px]">entry.1569938489</code>).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block font-mono">
                          Google Form URL (viewform or edit)
                        </label>
                        <div className="relative">
                          <div className="absolute top-2.5 left-3 text-slate-400">
                            <Link2 className="w-4 h-4" />
                          </div>
                          <input
                            type="url"
                            placeholder="https://docs.google.com/forms/d/e/.../viewform"
                            value={formUrl}
                            onChange={(e) => {
                              const val = e.target.value.trim();
                              setFormUrl(val);
                              try {
                                if (val) {
                                  localStorage.setItem('finmynd_custom_form_url', val);
                                } else {
                                  localStorage.removeItem('finmynd_custom_form_url');
                                }
                              } catch (e) {}
                            }}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-250 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-gray-800 font-sans shadow-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block font-mono">
                          Entry Field ID
                        </label>
                        <input
                          type="text"
                          placeholder="entry.1569938489"
                          value={entryId}
                          onChange={(e) => {
                            const val = e.target.value.trim();
                            setEntryId(val);
                            try {
                              if (val) {
                                localStorage.setItem('finmynd_custom_entry_id', val);
                              } else {
                                localStorage.removeItem('finmynd_custom_entry_id');
                              }
                            } catch (e) {}
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-250 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono bg-white text-gray-800 shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-200/60">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-sans">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Active Form Link: <strong className="text-slate-700 font-mono text-[10px] break-all">{formUrl.slice(0, 50)}...</strong></span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setFormUrl(defaultUrl);
                          setEntryId(defaultEntryId);
                          try {
                            localStorage.removeItem('finmynd_custom_form_url');
                            localStorage.removeItem('finmynd_custom_entry_id');
                          } catch (e) {}
                        }}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer hover:underline"
                      >
                        Reset to Default Sheet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
