import React from 'react';
import { 
  EyeOff, 
  Coins, 
  TrendingDown, 
  Layers, 
  ShieldCheck, 
  FileCheck, 
  ArrowRight,
  Sparkles,
  Lock,
  Check,
  X
} from 'lucide-react';

interface FeaturesProps {
  onOpenEarlyAccess: () => void;
}

export default function Features({ onOpenEarlyAccess }: FeaturesProps) {
  const features = [
    {
      id: 'no-pii',
      title: 'Make Sense of the Tax Jungle',
      benefit: 'No Complex Jargon',
      description: 'We translate dry section clauses and complex rules into plain, actionable human logic. Understand precisely why each deduction fits your career and salary stage, turning taxation into clarity.',
      icon: EyeOff,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      badge: 'Intuitive'
    },
    {
      id: 'no-file-storage',
      title: 'Anxiety-Free Privacy',
      benefit: '100% Isolated & Private',
      description: 'We ban the collection of real-world identity markers—no names, no phone numbers, and no linked personal tracking. Because our system isolates your financial data from your identity, your transaction history remains completely untraceable to you.',
      icon: ShieldCheck,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      id: 'section-matching',
      title: 'Discover Eligible Benefits',
      benefit: 'Savings Discovery',
      description: 'Identify eligible deductions, investments, and rent exemptions directly from your transactions to surface key benefits that can lower your net taxable base.',
      icon: Coins,
      iconColor: 'text-amber-600 bg-emerald-50 border-emerald-100',
      badge: 'Smart Match'
    },
    {
      id: 'regime-optimizer',
      title: 'Regime Stress Relief',
      benefit: 'Old vs New Clarity',
      description: 'The anxiety of choosing between the Old and New tax regimes is real. Our planner does the comparative work side-by-side down to the exact rupee, giving you ultimate decision confidence.',
      icon: TrendingDown,
      iconColor: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      id: 'salaried-benefits',
      title: 'Optimized Cash Flow Checks',
      benefit: 'HRA & Rent Harmony',
      description: 'Get deep clarity on your House Rent Allowance. We help you calculate the sweet spot between basic salary and actual rent paid to maximize your rent exemptions without the stress of manual ledgers.',
      icon: Layers,
      iconColor: 'text-teal-600 bg-teal-50 border-teal-100',
    },
    {
      id: 'compliance-alerts',
      title: 'Smarter Money Management',
      benefit: 'Long-Term Financial Security',
      description: 'Go beyond the current year. Visualize where you stand on Section 80C, 80D, and NPS. Build long-term wealth by identifying investment gaps you can easily fill next quarter to safeguard your income.',
      icon: FileCheck,
      iconColor: 'text-sky-600 bg-sky-50 border-sky-100',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white border-y border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 font-mono">
            Designed for Peace of Mind
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            A comforting, mindful approach to Indian tax & finance
          </h2>
          <p className="text-base text-gray-600 font-sans">
            Taxes are stressful enough without data concerns or overwhelming calculators. We help you make complete sense of your filings, identify hidden exemptions, and build better wealth-management habits completely privately.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative bg-white border border-gray-150 p-6 sm:p-8 rounded-2xl hover:shadow-xl hover:shadow-gray-100/60 hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feature.iconColor} mb-6 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Benefit Badge */}
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-3 uppercase tracking-wider font-mono">
                    {feature.benefit}
                  </span>

                  {/* Title */}
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="font-display font-bold text-lg text-gray-950 group-hover:text-emerald-700 transition-colors">
                      {feature.title}
                    </h3>
                    {feature.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed font-sans mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between">
                  <a
                    href="#scanner"
                    className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Scan Transactions
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy by Architecture, Not by Policy Section */}
        <div className="mt-32 border border-gray-200 bg-slate-50/80 rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xs">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-indigo-600" />
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-600 font-mono">
              Unmatched Data Autonomy
            </span>
            <h3 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
              Privacy by Architecture, Not by Policy
            </h3>
            <p className="text-sm text-slate-600 font-sans leading-relaxed max-w-2xl mx-auto">
              Most platforms write elaborate legal privacy policies while storing your financial habits in centralized databases. FinMynd is structurally different: we engineered our platform so that sensitive data physically cannot be linked to your real identity. No PAN, no email, no mobile is ever collected—access is secured purely through a customizable username and password/passkey.
            </p>
          </div>

          {/* CSS Architecture Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8 text-left">
            
            {/* Isolated Backend Container */}
            <div className="lg:col-span-7 bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">Secure Isolated Backend Environment</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-400">SHIELDED HOST</span>
                </div>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-150">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Identity-Blind Submissions</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Enter financial figures and transactions freely. No PAN, no email verification, and no mobile OTP is requested or mapped.
                      </p>
                    </div>
                  </div>

                  {/* SVG Arrow */}
                  <div className="pl-4 text-emerald-400">
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-150">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Isolated Server Compute</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        All complex tax slab calculations, Section 87A relief offsets, and exemption estimations occur inside a secure, identity-decoupled backend.
                      </p>
                    </div>
                  </div>

                  {/* SVG Arrow */}
                  <div className="pl-4 text-teal-400">
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-150">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Pre-Registered Login Control</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Early access is restricted to pre-registered usernames. When the system launches, users sign in using their reserved username and select their secure password/passkey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6 flex items-center justify-between text-xs text-emerald-700 font-mono font-bold bg-emerald-50/40 p-3 rounded-xl">
                <span>🛡️ Backend Computing Sandboxed & Decoupled</span>
                <span className="text-[10px] text-emerald-600 bg-white border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
              </div>
            </div>

            {/* Outbound Firewall Barrier Block */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
              
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden flex-1 flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-3">
                  <span className="px-2 py-0.5 text-[9px] font-mono font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md uppercase tracking-wider">STRICT BLOCK</span>
                </div>

                <div className="space-y-4">
                  <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
                    Outbound Firewall Barrier
                  </div>
                  <h4 className="font-display font-extrabold text-base leading-snug">
                    Zero Real-World Identity Association
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Our firewalls strictly filter outbound telemetry. Because we bypass traditional identity schemas, no real-world names, mobile numbers, email addresses, or tax profiles are synchronized with marketing brokers or profiling platforms.
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-800 pt-4 flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Inbound Queries:</span>
                    <span className="text-emerald-400 font-bold">Only registered usernames / suggestions</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Sensitive Logs:</span>
                    <span className="text-rose-500 font-bold">PHYSICALLY IMPOSSIBLE</span>
                  </div>
                </div>
              </div>

              {/* Shielding explanation block */}
              <div className="bg-emerald-50/40 border border-emerald-200/40 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-emerald-800 font-mono tracking-wide uppercase">
                  Anonymity Shield Architecture:
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  By handling calculations strictly inside our isolated backends, your raw financial values are computed independently of who you are. We verify logins solely using your chosen username and a password / passkey, keeping your profile 100% blind to third-party trackers.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Freedom from Unnecessary Identity (Our Principles) */}
        <div className="mt-24 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 font-mono">
              Core Principles
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              Freedom from Unnecessary Identity
            </h3>
            <p className="text-sm text-gray-600 font-sans max-w-xl mx-auto">
              We operate under a simple, non-negotiable philosophy: you should never have to prove who you are just to understand your money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Principle 1 */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl hover:border-emerald-200 hover:shadow-lg transition-all duration-300 space-y-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-indigo-100 bg-indigo-50 text-indigo-600 font-bold text-sm">
                01
              </div>
              <h4 className="font-display font-extrabold text-sm text-slate-900">
                Identity-Shielded Access
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                No email, mobile, or real identity needed. Access using a custom username and password/passkey to protect your data.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl hover:border-emerald-200 hover:shadow-lg transition-all duration-300 space-y-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-emerald-100 bg-emerald-50 text-emerald-600 font-bold text-sm">
                02
              </div>
              <h4 className="font-display font-extrabold text-sm text-slate-900">
                Backend-Isolated Computing
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Rule parsing and calculations happen on our high-security backend servers, completely decoupled from any personal details.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl hover:border-emerald-200 hover:shadow-lg transition-all duration-300 space-y-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-rose-100 bg-rose-50 text-rose-600 font-bold text-sm">
                03
              </div>
              <h4 className="font-display font-extrabold text-sm text-slate-900">
                Zero Behavior Profiling
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                We can't sell or share your tax plans with ad agencies because we physically avoid compiling marketing cohorts or profiling habits.
              </p>
            </div>

          </div>
        </div>

        {/* Traditional comparative table tab container */}
        <div className="mt-24 border border-gray-150 bg-slate-50/50 rounded-3xl p-6 sm:p-12">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <span className="text-xs uppercase tracking-widest font-extrabold text-indigo-600 font-mono">
              The Comparison
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              How We Differ From the Rest
            </h3>
            <p className="text-sm text-slate-600 font-sans">
              Compare how your details are handled inside traditional financial applications versus FinMynd&apos;s identity-shielded planner.
            </p>
          </div>

          <MatrixTable />
        </div>

        {/* Inner Highlight Banner */}
        <div className="mt-16 bg-linear-to-r from-emerald-600 to-indigo-700 rounded-3xl p-8 sm:p-12 relative overflow-hidden text-white shadow-xl">
          {/* Subtle decoration */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative max-w-3xl space-y-6">
            <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Salaried Stress Relief
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Unsure if you should switch to the New Tax Regime?
            </h3>
            <p className="text-sm sm:text-base text-emerald-100 max-w-2xl font-sans leading-relaxed">
              With the New Regime offering a higher rebate limit and updated slabs, but eliminating key deductions like 80C, 80D, and HRA, finding the absolute optimal path is highly customized. Let our interactive planner compute both sides side-by-side!
            </p>
            <div className="pt-2">
              <a
                href="#estimator"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-gray-950 font-bold rounded-xl text-sm shadow-sm hover:bg-gray-50 transition-colors"
              >
                Compare Old & New Regimes
                <ArrowRight className="w-4 h-4 ml-2 text-emerald-600" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function MatrixTable() {
  const [activeState, setActiveState] = React.useState<'identity' | 'targeting' | 'control'>('identity');

  const states = [
    {
      id: 'identity' as const,
      name: 'User Identity',
      icon: '👤',
      traditional: 'Force you to log in with your email, mobile number, or Google account, linking all data to your real identity.',
      finmynd: 'No email, mobile, or real identity needed. Access using a chosen username and password/passkey to safeguard your profile.',
      details: 'We believe you shouldn\'t have to prove who you are just to calculate your taxes. Our planner operates with complete identity shielding using customizable credentials.'
    },
    {
      id: 'targeting' as const,
      name: 'Ad Targeting & Spam',
      icon: '🚫',
      traditional: 'Scan your personal transactions and habits to pitch high-interest credit cards, loans, and sponsored products.',
      finmynd: 'Zero ad integrations, zero tracking, and zero sponsored placements. Unbiased math only.',
      details: 'Since we don\'t track your real-world identity or store behavioral profiles, it is physically impossible for us to show you targeted ads.'
    },
    {
      id: 'control' as const,
      name: 'Data Autonomy',
      icon: '🛡️',
      traditional: 'Store your habits permanently on central company databases to build marketing cohorts.',
      finmynd: 'Your financial information is your own business. We act as a helper tool, never a behavior tracker.',
      details: 'FinMynd is designed strictly as an assistant for tax planning and discovery. You are a customer seeking clarity, not a data asset to be mined.'
    }
  ];

  const currentState = states.find(s => s.id === activeState) || states[0];

  return (
    <div className="space-y-6 text-left">
      {/* Interactive Tabs for mobile/quick toggle */}
      <div className="flex flex-wrap gap-2 justify-center p-1.5 bg-slate-200/40 rounded-2xl border border-gray-200/60 max-w-xl mx-auto">
        {states.map((state) => (
          <button
            key={state.id}
            onClick={() => setActiveState(state.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeState === state.id
                ? 'bg-white text-emerald-700 shadow-xs border border-emerald-100/40'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <span>{state.icon}</span>
            {state.name}
          </button>
        ))}
      </div>

      {/* Main Comparative Table */}
      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[640px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-150 text-slate-500 font-mono text-[10px] uppercase tracking-wider font-extrabold">
                <th className="p-4 sm:p-6 w-1/4">Feature Area</th>
                <th className="p-4 sm:p-6 w-3/8 bg-rose-50/5 text-rose-800">Traditional Apps</th>
                <th className="p-4 sm:p-6 w-3/8 bg-emerald-50/5 text-emerald-950 font-display font-black">Fin<sup className="align-baseline text-[0.65em] font-black relative -top-[0.4em] ml-0.5 text-emerald-600">Mynd</sup></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {states.map((state) => {
                const isActive = state.id === activeState;
                return (
                  <tr
                    key={state.id}
                    onClick={() => setActiveState(state.id)}
                    className={`cursor-pointer transition-all duration-150 group ${
                      isActive ? 'bg-emerald-500/5' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="p-4 sm:p-6 font-sans font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <span className="text-lg p-2 bg-slate-50 border border-slate-100 rounded-lg group-hover:scale-105 transition-transform duration-200">
                          {state.icon}
                        </span>
                        <div>
                          <span className="block text-sm sm:text-base leading-tight">{state.name}</span>
                          <span className="text-[9px] text-emerald-600 font-mono font-semibold uppercase tracking-wider mt-1 block">
                            Shielded
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:p-6 text-xs sm:text-sm text-slate-500 bg-rose-50/5 leading-relaxed font-sans">
                      <div className="flex gap-2 items-start">
                        <span className="text-rose-500 mt-0.5 shrink-0 font-bold">✕</span>
                        <span>{state.traditional}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-6 text-xs sm:text-sm text-emerald-950 bg-emerald-50/5 font-medium leading-relaxed font-sans">
                      <div className="flex gap-2 items-start">
                        <span className="text-emerald-600 mt-0.5 shrink-0 font-bold">✓</span>
                        <span>{state.finmynd}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dynamic Detail Card */}
        <div className="border-t border-gray-150 bg-slate-50/60 p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[9px] font-bold border border-emerald-100">
              COMPANION PHILOSOPHY
            </span>
            <h4 className="font-display font-extrabold text-xs sm:text-sm text-slate-900">
              A Deeper Look: {currentState.name}
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {currentState.details}
          </p>
        </div>
      </div>
    </div>
  );
}

