import React, { useState, useMemo } from 'react';
import { CalculatorState, TaxEstimateResult } from '../types';
import { 
  Calculator, 
  TrendingDown, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  Info,
  Layers,
  HeartPulse,
  HelpCircle,
  Home,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface SavingsEstimatorProps {
  onOpenEarlyAccess: () => void;
}

export default function SavingsEstimator({ onOpenEarlyAccess }: SavingsEstimatorProps) {
  // Initial state for salaried Indian professionals
  const [state, setState] = useState<CalculatorState>({
    annualSalary: 1500000,      // ₹15,00,000 gross base salary
    sec80C: 120000,            // PPF, ELSS, EPF
    sec80D: 20000,             // Health Insurance
    npsContribution: 50000,    // NPS up to ₹50k limit
    rentPaid: 180000,          // Monthly ₹15,000 * 12
    hraReceived: 300000,       // Annual HRA received
    homeLoanInterest: 0,       // Section 24b Interest
    metroCity: true,           // Mumbai, Delhi, Kolkata, Chennai (50% Basic)
  });

  const [activeTab, setActiveTab] = useState<'inputs' | 'results'>('inputs');

  // Intelligent Indian Tax Calculation Engine (Latest Budget Rules)
  const results = useMemo<TaxEstimateResult>(() => {
    const {
      annualSalary,
      sec80C,
      sec80D,
      npsContribution,
      rentPaid,
      hraReceived,
      homeLoanInterest,
      metroCity
    } = state;

    const gross = Number(annualSalary) || 0;

    // --- ESTIMATE BASIC SALARY ---
    // In India, Basic Salary typically constitutes around 40% to 50% of the Gross CTC.
    const basicSalary = Math.round(gross * 0.45);

    // --- 1. CALCULATE HRA EXEMPTION (Only applicable in Old Regime) ---
    // Minimum of:
    // a. Actual HRA received
    // b. Actual Rent paid - 10% of Basic Salary
    // c. 50% of Basic (Metro) or 40% of Basic (Non-Metro)
    let hraExemption = 0;
    const actualRent = Number(rentPaid) || 0;
    const actualHra = Number(hraReceived) || 0;

    if (actualRent > 0 && actualHra > 0) {
      const rentLessTenPercentBasic = Math.max(0, actualRent - (basicSalary * 0.10));
      const percentageOfBasic = metroCity ? (basicSalary * 0.50) : (basicSalary * 0.40);
      hraExemption = Math.min(actualHra, rentLessTenPercentBasic, percentageOfBasic);
      hraExemption = Math.min(hraExemption, gross); // Cap at gross salary
    }

    // --- 2. OLD REGIME DEDUCTIONS ---
    const stdDeductionOld = 50000;
    const capped80C = Math.min(150000, Math.max(0, Number(sec80C) || 0));
    const capped80D = Math.min(50000, Math.max(0, Number(sec80D) || 0)); // max limit generally parent + self is up to ₹50-75k, typical limit ₹25k / ₹50k
    const cappedNps = Math.min(50000, Math.max(0, Number(npsContribution) || 0)); // Under 80CCD(1B)
    const cappedHomeLoan = Math.min(200000, Math.max(0, Number(homeLoanInterest) || 0)); // Section 24b limit is ₹2 Lakhs for self-occupied

    const totalOldDeductions = stdDeductionOld + capped80C + capped80D + cappedNps + cappedHomeLoan + hraExemption;
    const taxableIncomeOld = Math.max(0, gross - totalOldDeductions);

    // --- 3. NEW REGIME DEDUCTIONS ---
    // Standard deduction in New Regime is now ₹75,000 (FY 2024-25 / 2025-26). Other general exemptions are ignored.
    const stdDeductionNew = 75000;
    const taxableIncomeNew = Math.max(0, gross - stdDeductionNew);

    // --- 4. CALCULATE TAX FOR OLD REGIME SLABS ---
    // Slabs:
    // Up to ₹2,50,000: NIL
    // ₹2,50,001 to ₹5,00,000: 5%
    // ₹5,00,001 to ₹10,00,000: 20%
    // Above ₹10,00,000: 30%
    const calculateOldTax = (income: number): number => {
      let tax = 0;
      if (income <= 250000) {
        return 0;
      }
      
      // Slab 1: 2.5L to 5L
      if (income > 500000) {
        tax += (250000 * 0.05);
      } else {
        tax += (income - 250000) * 0.05;
        return applyCess(tax, income, 500000, 12500); // 87A rebate
      }

      // Slab 2: 5L to 10L
      if (income > 1000000) {
        tax += (500000 * 0.20);
      } else {
        tax += (income - 500000) * 0.20;
        return applyCess(tax, income, 500000, 12500);
      }

      // Slab 3: Above 10L
      tax += (income - 1000000) * 0.30;

      return applyCess(tax, income, 500000, 12500);
    };

    // --- 5. CALCULATE TAX FOR NEW REGIME SLABS ---
    // Slabs:
    // Up to ₹3,00,000: NIL
    // ₹3,00,001 to ₹7,00,000: 5% (with rebate if <= ₹7,00,000 after standard deduction)
    // ₹7,00,001 to ₹10,00,000: 10%
    // ₹10,00,001 to ₹12,00,000: 15%
    // ₹12,00,001 to ₹15,00,000: 20%
    // Above ₹15,00,000: 30%
    const calculateNewTax = (income: number): number => {
      let tax = 0;
      if (income <= 300000) return 0;

      // Slab 1: 3L - 7L (diff 4L)
      if (income > 700000) {
        tax += (400000 * 0.05);
      } else {
        tax += (income - 300000) * 0.05;
        return applyCess(tax, income, 700000, 20000); // 87A rebate up to ₹20k if income <= 7L
      }

      // Slab 2: 7L - 10L (diff 3L)
      if (income > 1000000) {
        tax += (300000 * 0.10);
      } else {
        tax += (income - 700000) * 0.10;
        return applyCess(tax, income, 700000, 20000);
      }

      // Slab 3: 10L - 12L (diff 2L)
      if (income > 1200000) {
        tax += (200000 * 0.15);
      } else {
        tax += (income - 1000000) * 0.15;
        return applyCess(tax, income, 700000, 20000);
      }

      // Slab 4: 12L - 15L (diff 3L)
      if (income > 1500000) {
        tax += (300000 * 0.20);
      } else {
        tax += (income - 1200000) * 0.20;
        return applyCess(tax, income, 700000, 20000);
      }

      // Slab 5: Above 15L
      tax += (income - 1500000) * 0.30;

      return applyCess(tax, income, 700000, 20000);
    };

    // Helper to apply 4% Health and Education Cess and Sec 87A Rebate
    function applyCess(taxAmount: number, taxableIncome: number, rebateThreshold: number, maxRebate: number): number {
      let absoluteTax = taxAmount;
      if (taxableIncome <= rebateThreshold) {
        absoluteTax = Math.max(0, taxAmount - maxRebate);
      }
      // Add 4% Cess
      return Math.round(absoluteTax * 1.04);
    }

    const taxOld = calculateOldTax(taxableIncomeOld);
    const taxNew = calculateNewTax(taxableIncomeNew);

    const recommendedRegime = taxOld < taxNew ? 'old' : 'new';
    const potentialSavings = Math.abs(taxOld - taxNew);

    const deductionsClaimed = [
      { section: 'Standard Deduction', amount: recommendedRegime === 'old' ? stdDeductionOld : stdDeductionNew, maxLimit: recommendedRegime === 'old' ? stdDeductionOld : stdDeductionNew, description: 'Flat tax benefit provided directly to all salaried individuals.' },
      { section: 'Section 80C', amount: capped80C, maxLimit: 150000, description: 'Investments in ELSS, PPF, Provident Fund, Life Insurance premium, or child tuition fees.' },
      { section: 'Section 80D', amount: capped80D, maxLimit: 50000, description: 'Medical insurance premiums for self, spouse, children, and dependent parents.' },
      { section: 'Section 80CCD(1B) NPS', amount: cappedNps, maxLimit: 50000, description: 'Additional voluntary contributions to the National Pension System.' },
      { section: 'HRA Exemption', amount: Math.round(hraExemption), maxLimit: actualHra, description: 'Tax-exempt house rent allowance calculated under rule 2A.' },
      { section: 'Section 24(b)', amount: cappedHomeLoan, maxLimit: 200000, description: 'Interest component paid on Home Loans for self-occupied property.' }
    ];

    return {
      taxOldRegime: taxOld,
      taxNewRegime: taxNew,
      recommendedRegime,
      potentialSavings,
      hraExemption: Math.round(hraExemption),
      deductionsClaimed: deductionsClaimed.filter(d => d.amount > 0 || d.section === 'Standard Deduction')
    };
  }, [state]);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleInputChange = (field: keyof CalculatorState, value: any) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section id="estimator" className="py-24 bg-gray-50/50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 font-mono flex items-center justify-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            Side-by-Side Clarity
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Mindful Tax & Finance Planner (FY 2026-27)
          </h2>
          <p className="text-base text-gray-600 font-sans">
            Visualize your cash flow, demystify the slabs, and confidently choose the path that preserves your financial peace of mind.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-3xl border border-gray-150 shadow-xl overflow-hidden max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: Inputs */}
          <div className="p-6 sm:p-10 lg:col-span-7 border-r border-gray-100 space-y-6">
            <div className="flex items-center space-x-3 pb-6 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold font-mono">
                1
              </div>
              <div>
                <h3 className="font-display font-semibold text-gray-900">1. Paint Your Salary & Housing Picture</h3>
                <p className="text-xs text-gray-500">Inputs used to calculate HRA exemptions and standard salaried privileges</p>
              </div>
            </div>

            {/* Income Input */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label htmlFor="annualSalary" className="font-medium text-gray-700">Gross Annual Income (CTC)</label>
                <span className="font-bold text-gray-900 font-mono">{formatINR(state.annualSalary)}</span>
              </div>
              <input
                id="annualSalary"
                type="range"
                min="300000"
                max="5000000"
                step="50000"
                value={state.annualSalary}
                onChange={(e) => handleInputChange('annualSalary', parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>₹3L</span>
                <span>₹12L</span>
                <span>₹25L</span>
                <span>₹50L+</span>
              </div>
            </div>

            {/* HRA & rent paid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="hraReceived" className="font-medium text-gray-600">Annual HRA Component</label>
                  <span className="font-semibold text-gray-800 font-mono">{formatINR(state.hraReceived)}</span>
                </div>
                <input
                  id="hraReceived"
                  type="number"
                  value={state.hraReceived || ''}
                  placeholder="e.g. 240000"
                  onChange={(e) => handleInputChange('hraReceived', parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-mono border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:outline-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="rentPaid" className="font-medium text-gray-600">Annual Rent Paid</label>
                  <span className="font-semibold text-gray-800 font-mono">{formatINR(state.rentPaid)}</span>
                </div>
                <input
                  id="rentPaid"
                  type="number"
                  value={state.rentPaid || ''}
                  placeholder="e.g. 180000"
                  onChange={(e) => handleInputChange('rentPaid', parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-mono border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:outline-emerald-500"
                />
              </div>
            </div>

            {/* Metro Toggle */}
            <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-150">
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-xs font-semibold text-gray-900 block">Resident in Metro City?</span>
                  <span className="text-[10px] text-gray-500">Metro allows 50% basic HRA limit vs 40%</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleInputChange('metroCity', !state.metroCity)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-lg border transition-all ${
                  state.metroCity 
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                {state.metroCity ? 'Metro (50%)' : 'Non-Metro (40%)'}
              </button>
            </div>

            <div className="flex items-center space-x-3 pt-4 pb-2 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono">
                2
              </div>
              <div>
                <h3 className="font-display font-semibold text-gray-900">2. Your Wealth-Building & Protection Channels</h3>
                <p className="text-xs text-gray-500">Investments and health premiums that reduce taxable income while securing your financial future.</p>
              </div>
            </div>

            {/* 80C Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label htmlFor="sec80C" className="font-semibold text-gray-700 flex items-center gap-1">
                  Section 80C Deductions (ELSS, EPF, PPF)
                  <span className="text-[9px] text-gray-400 font-normal">(Max ₹1.5 Lakhs)</span>
                </label>
                <span className="font-bold text-gray-900 font-mono">{formatINR(state.sec80C)}</span>
              </div>
              <input
                id="sec80C"
                type="range"
                min="0"
                max="150000"
                step="5000"
                value={state.sec80C}
                onChange={(e) => handleInputChange('sec80C', parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Other Deductions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label htmlFor="sec80D" className="text-xs font-semibold text-gray-700 block">
                  80D Health Premiums
                </label>
                <input
                  id="sec80D"
                  type="number"
                  value={state.sec80D || ''}
                  placeholder="Max ₹50,000"
                  onChange={(e) => handleInputChange('sec80D', parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-mono border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:outline-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="npsContribution" className="text-xs font-semibold text-gray-700 block">
                  80CCD(1B) NPS (Max 50k)
                </label>
                <input
                  id="npsContribution"
                  type="number"
                  value={state.npsContribution || ''}
                  placeholder="Max ₹50,000"
                  onChange={(e) => handleInputChange('npsContribution', parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-mono border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:outline-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="homeLoanInterest" className="text-xs font-semibold text-gray-700 block">
                  Sec 24 Home Loan Int.
                </label>
                <input
                  id="homeLoanInterest"
                  type="number"
                  value={state.homeLoanInterest || ''}
                  placeholder="Max ₹2,00,000"
                  onChange={(e) => handleInputChange('homeLoanInterest', parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-mono border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:outline-emerald-500"
                />
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl text-xs text-emerald-800 flex items-start gap-2 border border-emerald-150">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Privacy Protected:</strong> These inputs remain exclusively in your local browser state. We do not transmit or save any income metrics.
              </p>
            </div>
          </div>

          {/* Right Panel: Results & Recommendations */}
          <div className="p-6 sm:p-10 lg:col-span-5 bg-slate-900 text-white flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
                  3
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white">3. Your Mindful Tax Roadmap</h3>
                  <p className="text-xs text-slate-400">Rule-engine comparison to minimize tax stress and protect income</p>
                </div>
              </div>

              {/* Big Savings Metric */}
              <div className="text-center py-6 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-mono font-semibold">
                  Best Regime Saving Potential
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-display mt-2">
                  {formatINR(results.potentialSavings)}
                </div>
                <p className="text-[11px] text-slate-300 mt-2 font-semibold">
                  Recommended: <span className="text-emerald-400 uppercase tracking-wider">{results.recommendedRegime === 'old' ? 'Old Tax Regime' : 'New Tax Regime'}</span>
                </p>
              </div>

              {/* Side-by-Side Table */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Regime Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between pb-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Old Regime Tax:</span>
                    <span className={`font-mono ${results.recommendedRegime === 'old' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                      {formatINR(results.taxOldRegime)}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800/60">
                    <span className="text-slate-400">New Regime Tax:</span>
                    <span className={`font-mono ${results.recommendedRegime === 'new' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                      {formatINR(results.taxNewRegime)}
                    </span>
                  </div>
                  {results.hraExemption > 0 && (
                    <div className="flex justify-between text-xs text-slate-400 pt-1">
                      <span>Calculated HRA Exemption:</span>
                      <span className="font-mono text-slate-200">{formatINR(results.hraExemption)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deduction breakdown */}
              <div className="space-y-3">
                <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Active Deductions in Calculation ({results.recommendedRegime === 'old' ? 'Old Regime' : 'New Regime'})
                </div>
                
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {results.deductionsClaimed.map((d, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/40 text-xs"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-slate-200">
                          {d.section}
                        </span>
                        <span className="font-bold text-emerald-400 font-mono">
                          {formatINR(d.amount)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans">
                        {d.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action CTA bottom */}
            <div className="pt-6 border-t border-slate-800 mt-6 space-y-3">
              <a
                href="#scanner"
                className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md"
              >
                Banish Stress: Auto-Match Your Transactions
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-500 font-mono">
                <AlertCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Calculations are fully private. Zero PII processed.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
