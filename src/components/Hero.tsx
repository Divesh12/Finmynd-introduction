import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  ArrowRight, 
  FileSpreadsheet, 
  Layers, 
  Coins,
  Lock,
  EyeOff,
  UserX,
  HeartCrack,
  AlertTriangle
} from 'lucide-react';

interface HeroProps {
  onOpenEarlyAccess: () => void;
}

export default function Hero({ onOpenEarlyAccess }: HeroProps) {
  // Typical Indian Salaried Tax optimization areas
  const optimizationSteps = [
    { id: 1, name: 'Section 80C Investment Check', factor: 'ELSS, PPF, EPF & Tuition Fees', impact: 'Save up to ₹46,800/yr', status: '80C Maximizer' },
    { id: 2, name: 'HRA Exemption Claim', factor: 'Exemption based on Rent vs Basic Salary', impact: 'Save up to ₹78,000/yr', status: 'HRA Calculator' },
    { id: 3, name: 'NPS Section 80CCD(1B) Top-up', factor: 'National Pension Scheme up to ₹50k', impact: 'Save up to ₹15,600/yr', status: 'Extra Deductions' },
    { id: 4, name: 'Section 80D Health Cover', factor: 'Premium for Self & Senior Citizen Parents', impact: 'Save up to ₹23,400/yr', status: 'Health Shield' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % optimizationSteps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [optimizationSteps.length]);

  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-radial from-emerald-50/20 via-transparent to-transparent">
      {/* Background gradients */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Headline & Benefits */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-indigo-50/50 border border-emerald-100 px-4 py-1.5 rounded-full text-emerald-800 text-xs sm:text-sm font-semibold shadow-xs">
              <UserX className="w-4 h-4 text-emerald-600" />
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-700 font-bold">100% Identity-Shielded</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 leading-tight">
                Understand your money.<br />
                <span className="text-emerald-600">Keep your Identity.</span>
              </h1>
              <p className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight font-display">
                Financial intelligence built on your data – not your identity.
              </p>
            </div>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
              No mobile, no email, no unnecessary personal information. Just meaningful insights from the financial data you choose to share.{' '}
              <button 
                onClick={onOpenEarlyAccess}
                className="text-indigo-600 font-bold hover:text-indigo-500 underline underline-offset-4 decoration-2 decoration-indigo-300 hover:decoration-indigo-500 cursor-pointer transition-colors"
              >
                Share your feedback
              </button>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#scanner"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20"
              >
                Scan Transactions Safely
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <button
                onClick={onOpenEarlyAccess}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all cursor-pointer"
              >
                Reserve Anonymous Username
              </button>
            </div>

            {/* Explaining what it does (Simple, non-technical list of things FinMynd helps discover) */}
            <div className="pt-6 border-t border-gray-100 text-left">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono mb-4">
                What FinMynd helps you discover:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">Hidden Tax Saving Opportunities</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Instantly spot standard deductions, medical allowances, and rent exemptions lying unclaimed in your bank logs.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">Spending Patterns</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Map where your monthly salary goes, grouped automatically in our isolated backend with absolutely zero tracing back to you.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                    <HeartCrack className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">Financial Leaks</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Identify forgotten subscriptions, hidden platform fees, and recurring charges that quietly drain your wealth.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">Investment Gaps</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Uncover missing Section 80C, 80D, or NPS allocations to safeguard your cash flows for the final quarter.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Simulated Paycheck/Vesting Dashboard */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Backglow shadow decoration */}
              <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/10 to-indigo-500/10 rounded-3xl blur-2xl" />

              {/* Console/Dashboard Mockup */}
              <div className="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
                
                {/* Header bar */}
                <div className="flex items-center justify-between px-4 py-3.5 bg-slate-950/80 border-b border-slate-800/60">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 pl-2">safe-rules-engine.in</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/50">
                    <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
                    <span>No-PII Safe Mode</span>
                  </div>
                </div>

                {/* Main Stats: Pay stub header */}
                <div className="p-4 grid grid-cols-2 gap-3 bg-slate-900/40">
                  <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center">
                      <Coins className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                      Section 80C Status
                    </div>
                    <div className="text-lg font-bold text-slate-100 mt-1 font-display">₹1,50,000 Cap</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">
                      Identify EPF, ELSS, Insurance
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 mr-1" />
                      Estimated Benefit
                    </div>
                    <div className="text-lg font-bold text-emerald-400 mt-1 font-display">Up to ₹75,000+</div>
                    <div className="text-[10px] text-emerald-400/80 mt-0.5">
                      Based on eligible categories
                    </div>
                  </div>
                </div>

                {/* Running optimization step feed */}
                <div className="p-4 pt-2">
                  <div className="text-xs font-bold text-slate-400 mb-3 px-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      Rule-Based Tax Sections
                    </span>
                    <span className="text-[9px] text-indigo-400 font-mono tracking-wider">SECURE DETECT</span>
                  </div>

                  <div className="space-y-2 max-h-[175px] overflow-hidden">
                    {optimizationSteps.map((step, idx) => {
                      const isActive = idx === activeIndex;
                      return (
                        <div
                          key={step.id}
                          className={`p-3 rounded-xl border text-xs transition-all duration-500 ${
                            isActive
                              ? 'bg-slate-800/90 border-emerald-500 shadow-lg scale-[1.01]'
                              : 'bg-slate-950/30 border-slate-800/40 opacity-40'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-0.5">
                              <div className="font-semibold text-slate-100 flex items-center gap-2">
                                {step.name}
                                {isActive && (
                                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-sm text-[8px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                                    {step.status}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Checks: <span className="text-slate-300 font-medium">{step.factor}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-emerald-400 text-xs">{step.impact}</div>
                              <span className="text-[9px] text-slate-500">Tax Saving Potential</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Connections footer */}
                <div className="px-4 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                  <span className="flex items-center">
                    <Lock className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                    Zero server storage. Processed locally in-browser.
                  </span>
                </div>

              </div>

              {/* Floating aesthetic widgets */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-gray-100 rounded-2xl p-4 shadow-xl hidden sm:flex items-center space-x-3.5 max-w-[210px]">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-display">
                  ₹
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">No Identity Check</span>
                  <span className="text-sm font-bold text-indigo-600">Pure Privacy</span>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white border border-gray-100 rounded-2xl p-4 shadow-xl hidden sm:flex items-center space-x-3.5 max-w-[210px]">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Deduction Match</span>
                  <span className="text-sm font-bold text-emerald-600">Old vs New Regime</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
