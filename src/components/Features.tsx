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
  Lock
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
      title: 'Zero PII Login & Workspace',
      benefit: 'No Emails, Phones, or OTPs',
      description: 'Your workspace is secured without single-use passwords or personal accounts. Just enter any self-created alias passkey and password to save and reload your sessions. We process only raw transactions, never names or PAN cards.',
      icon: ShieldCheck,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      id: 'section-matching',
      title: 'Discover Eligible Benefits',
      benefit: 'Savings Discovery',
      description: 'Our rule-based engine screens line descriptions for key markers like "EPF", "ELSS", "Rent", "Health Insurance", or "NPS" to surface benefits that can dramatically lower your net taxable base.',
      icon: Coins,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
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
            Taxes are stressful enough without data concerns or overwhelming calculators. We help you make complete sense of your filings, identify hidden exemptions, and build better wealth-management habits completely offline.
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
