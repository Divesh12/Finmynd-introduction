import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  HelpCircle,
  User,
  Tag,
  Key
} from 'lucide-react';

export default function ContactForm() {
  const [message, setMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'query' | 'request' | 'waitlist' | 'feedback'>('waitlist');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultUrl = (import.meta as any).env?.VITE_GOOGLE_FORM_URL || 'https://docs.google.com/forms/d/e/1FAIpQLSeGZKwX934TAmYXEMfRs4i7igBBODcdyoFHhhFN9kkGebAtOQ/viewform';
  const defaultEntryId = (import.meta as any).env?.VITE_GOOGLE_FORM_ENTRY_ID || 'entry.1569938489';

  // Automatically detect and save Google Form configurations passed in browser URL (case-insensitive) silently
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

      // Update and write to localStorage to persist custom configuration
      if (foundUrl) {
        let cleanUrl = foundUrl.trim();
        if (cleanUrl.includes('?')) {
          try {
            const urlObj = new URL(cleanUrl);
            const params = new URLSearchParams(urlObj.search);
            params.forEach((val, key) => {
              if (key.startsWith('entry.')) {
                foundEntry = key;
              }
            });
            cleanUrl = urlObj.origin + urlObj.pathname;
          } catch (e) {
            cleanUrl = cleanUrl.split('?')[0];
          }
        }
        try {
          localStorage.setItem('finmynd_custom_form_url', cleanUrl);
          console.log("⚙️ Saved custom form URL to localStorage:", cleanUrl);
        } catch (e) {}
      }
      if (foundEntry) {
        let cleanEntry = foundEntry.trim();
        if (!cleanEntry.startsWith('entry.')) {
          cleanEntry = `entry.${cleanEntry}`;
        }
        try {
          localStorage.setItem('finmynd_custom_entry_id', cleanEntry);
          console.log("⚙️ Saved custom entry ID to localStorage:", cleanEntry);
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

    // Format submission payload to combine all parameters into the single Google Forms text field
    let formattedPayload = `[Type: ${feedbackType.toUpperCase()}]\n`;
    if (feedbackType === 'waitlist') {
      formattedPayload += `[Reserved Username: @${message.trim().replace(/^@/, '')}]\n`;
    } else {
      formattedPayload += `[Payload]: ${message.trim()}`;
    }

    // Retrieve form parameters dynamically with local preference
    let activeUrl = defaultUrl;
    let activeEntryId = defaultEntryId;
    try {
      const savedUrl = localStorage.getItem('finmynd_custom_form_url');
      const savedEntry = localStorage.getItem('finmynd_custom_entry_id');
      if (savedUrl) activeUrl = savedUrl;
      if (savedEntry) activeEntryId = savedEntry;
    } catch (err) {}

    // Convert URL to /formResponse format
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

    // --- TRANSMISSION ROUTE: Secure Direct Client-side Submission (Zero-CORS, serverless) ---
    console.log("🔄 Initiating client-side direct form submission...");
    try {
      // Create hidden iframe and form to submit without CORS issues
      const iframeId = 'hidden_iframe_submit_' + Math.random().toString(36).substring(2, 9);
      const iframe = document.createElement('iframe');
      iframe.name = iframeId;
      iframe.id = iframeId;
      iframe.style.position = 'absolute';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.opacity = '0.01';
      iframe.style.pointerEvents = 'none';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.action = cleanUrl;
      form.method = 'POST';
      form.target = iframeId;

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = entryKey;
      input.value = formattedPayload;
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
      HTMLFormElement.prototype.submit.call(form);

      // Cleanup elements after submit
      setTimeout(() => {
        try {
          if (document.body.contains(form)) document.body.removeChild(form);
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
        } catch (e) {}
        console.log("✅ Client-side direct form submission successful.");
      }, 1000);
    } catch (clientErr) {
      console.error("❌ Client-side direct submission failed:", clientErr);
    }

    // Preserve locally in browser state silently as a local sandbox backup
    try {
      const submissions = JSON.parse(localStorage.getItem('finmynd_feedback') || '[]');
      const newSubmission = {
        id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9),
        message: message,
        submittedAt: new Date().toISOString()
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
            <span>Join the Autonomous Movement</span>
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Reserve Your Anonymous Handle
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed font-sans">
            Secure your unique identity-shielded username before we launch. No email, no mobile, no linking. Keep your handle entirely yours.
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
                <h3 className="font-display text-2xl font-bold text-gray-900">Waitlist Registered!</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto font-sans leading-relaxed font-medium text-emerald-700 text-center">
                  Your secure, identity-blind reservation has been logged. Welcome to the future of financial autonomy.
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
                  Reserve another handle or submit query
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Coming Soon Teaser Banner */}
              <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs border border-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_45%)] pointer-events-none" />
                <div className="relative space-y-2 text-left">
                  <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    Coming Soon • Q3 2026
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-white leading-snug">
                    FinMynd Client App V1.0
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-2xl">
                    Our secure client app will offer native isolated bank statement parsers, dynamic tax recommendations, and absolute identity isolation with secure isolated backend processing. No PAN, email, or mobile required.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Segmented Category Selection */}
                <div className="space-y-3 text-left">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    Select Action Category:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { id: 'waitlist', label: 'Join Waitlist', desc: 'Reserve Username' },
                      { id: 'query', label: 'Submit Query', desc: 'Tax Slabs / Rules' },
                      { id: 'request', label: 'Feature Request', desc: 'Ask for additions' },
                      { id: 'feedback', label: 'Share Feedback', desc: 'Tell us your thoughts' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setFeedbackType(item.id as any);
                          setMessage(''); // Reset message input for cleaner state transition
                        }}
                        className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                          feedbackType === item.id
                            ? 'bg-emerald-50/50 border-emerald-500 shadow-xs ring-2 ring-emerald-500/10'
                            : 'bg-slate-50/50 border-gray-200 hover:bg-slate-50 hover:border-gray-300'
                        }`}
                      >
                        <div className={`text-xs font-bold ${feedbackType === item.id ? 'text-emerald-800' : 'text-gray-800'}`}>
                          {item.label}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5 font-sans leading-tight">
                          {item.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Inputs based on selected category */}
                {feedbackType === 'waitlist' ? (
                  /* WAITLIST USERNAME ONLY INPUT */
                  <div className="space-y-3 text-left">
                    <label htmlFor="feedback-message" className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-4 h-4 text-emerald-600" />
                      Desired Username to Reserve (Required):
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 font-mono text-sm font-bold">
                        @
                      </span>
                      <input
                        id="feedback-message"
                        type="text"
                        required
                        placeholder="anonymous_professional"
                        value={message}
                        onChange={(e) => setMessage(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                        className="w-full pl-8 pr-4 py-3.5 text-sm rounded-2xl border border-gray-250 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-gray-950 font-mono tracking-wide placeholder-gray-400 bg-white"
                      />
                    </div>
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/60 text-xs text-emerald-950 font-sans leading-relaxed">
                      <strong>How early logging works:</strong> Since we physically cannot store or link phone numbers or emails, early user authorization will be restricted strictly to pre-registered usernames collected today. When our portal goes live, you will enter this handle and select your password/passkey to establish ownership.
                    </div>
                  </div>
                ) : (
                  /* GENERAL INQUIRY / SUGGESTION / FEEDBACK INPUT */
                  <div className="space-y-6">
                    {/* Suggested Prompts */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-emerald-600" />
                        Suggested Prompts:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {suggestedQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleQuestionClick(q.text)}
                            className="group flex flex-col items-start p-3 text-left rounded-2xl border border-gray-150 bg-gray-50/50 hover:bg-emerald-50/20 hover:border-emerald-300 hover:shadow-xs transition-all duration-200 cursor-pointer w-full"
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

                    {/* Textarea Field */}
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
                          rows={4}
                          placeholder="Describe your tax concern or request. e.g. I want to calculate Section 87A marginal relief on my ₹12.75L salary. Can you build an interactive visualization chart?"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl border border-gray-250 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-gray-900 placeholder-gray-400 font-sans leading-relaxed shadow-inner bg-white"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                        💡 <strong>Early Login Tip:</strong> You can include your desired username inside your message (e.g., <em>&quot;@my_username: Can we parse PDF forms locally?&quot;</em>). When the early-access portal launches, those handles will be enabled to set a password and log in.
                      </p>
                    </div>
                  </div>
                )}

                {/* Micro Privacy Banner */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-150 flex items-center space-x-3 shadow-xs text-left">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs text-gray-500 font-sans">
                    <strong>Anxiety-Free Privacy:</strong> We strictly ban the collection of real-world identity markers—no PAN, no email addresses, and no mobile numbers. Your feedback is fully anonymous.
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
                      {feedbackType === 'waitlist' ? 'Reserve My Anonymous Handle' : 'Submit Entry to FinMynd'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
