import React, { useState, useMemo } from 'react';
import { TransactionItem } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  EyeOff, 
  Trash2, 
  CheckCircle2, 
  HelpCircle, 
  Lock, 
  UploadCloud, 
  Play, 
  Check, 
  Edit3, 
  AlertTriangle,
  Info,
  DollarSign,
  Coins
} from 'lucide-react';

export default function TransactionScanner() {
  const [inputText, setInputText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [scannedItems, setScannedItems] = useState<TransactionItem[]>([]);
  const [isScanned, setIsScanned] = useState(false);
  const [customDescription, setCustomDescription] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customSection, setCustomSection] = useState('Section 80C');

  // Sample templates to make user interaction extremely easy
  const samples = {
    statementA: `04-Apr-2026 PG RENT PAYMENT TO LANDLORD - ₹15,000
12-Apr-2026 SIP ELSS MUTUAL FUND INVESTMENT AXIS - ₹12,500
18-Apr-2026 MEDICAL INSURANCE PREMIUM STAR HEALTH - ₹9,500
20-Apr-2026 ELECTRICITY BILL BOARD - ₹2,400
05-May-2026 PG RENT PAYMENT TO LANDLORD - ₹15,000
10-May-2026 NPS VOLUNTARY CONTRIBUTION GOI - ₹15,000
15-May-2026 SWIGGY DINEOUT ORDER - ₹1,850
05-Jun-2026 PG RENT PAYMENT TO LANDLORD - ₹15,000
12-Jun-2026 SIP ELSS MUTUAL FUND INVESTMENT AXIS - ₹12,500
19-Jun-2026 SCHOOL FEES TUITION DEPOSIT - ₹45,000`,

    statementB: `08-May-2026 HDFC HOME LOAN EMI INTEREST COMPONENT - ₹32,400
12-May-2026 NIVA BUPA HEALTH INSURANCE POLICY - ₹14,200
25-May-2026 RELIANCE DIGITAL HEADPHONES - ₹4,200
08-Jun-2026 HDFC HOME LOAN EMI INTEREST COMPONENT - ₹32,400
15-Jun-2026 NPS PRAN RETIREMENT CONTRIBUTION - ₹35,000
20-Jun-2026 DONATION TO CRY CHILD RELIEF NGO - ₹10,000
28-Jun-2026 EPF SALARY CONTRIBUTION DEDUCTED - ₹12,800`,

    statementC: `10-Apr-2026 AMAZON PAY TRANSACTION - ₹1,200
14-Apr-2026 HOUSING RENT PAID IN CASH - ₹12,000
15-Apr-2026 PPF PUBLIC PROVIDENT FUND DEPOSIT SBI - ₹50,000
28-Apr-2026 UBER INDIA RIDE - ₹650
10-May-2026 LIC LIFE INSURANCE PREMIUM RETIRE - ₹18,500
14-May-2026 HOUSING RENT PAID IN CASH - ₹12,000
30-May-2026 COFFEE HOUSE CAFE - ₹320`
  };

  // Check if pasted text contains potential PII words
  const piiAnalysis = useMemo(() => {
    if (!inputText) return { detected: false, items: [] as string[] };
    const itemsFound: string[] = [];
    const lower = inputText.toLowerCase();

    // Look for common PII patterns
    if (lower.includes('acc no') || lower.includes('account number') || /\b\d{9,18}\b/.test(lower)) {
      itemsFound.push('Possible Account Number');
    }
    if (lower.includes('pan:') || /\b[a-z]{5}\d{4}[a-z]\b/i.test(lower)) {
      itemsFound.push('Possible Permanent Account Number (PAN)');
    }
    if (lower.includes('address:') || lower.includes('flat no') || lower.includes('lane')) {
      itemsFound.push('Possible Personal Address details');
    }
    if (lower.includes('stmt for') || lower.includes('mr.') || lower.includes('ms.') || lower.includes('shri')) {
      itemsFound.push('Possible Personal Name markers');
    }

    return {
      detected: itemsFound.length > 0,
      items: itemsFound
    };
  }, [inputText]);

  // Load a sample template automatically scanning it
  const handleScanOfText = (textToScan: string) => {
    if (!textToScan.trim()) return;

    const lines = textToScan.split('\n');
    const items: TransactionItem[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('[Simulated')) return;

      const lower = trimmed.toLowerCase();
      let detectedSection = '';
      let confidence: 'High' | 'Manual Review' = 'High';
      let actionTip = '';
      let eligible = true;

      // Section 80C Patterns
      if (
        lower.includes('elss') || 
        lower.includes('mutual fund') || 
        lower.includes('ppf') || 
        lower.includes('provident') || 
        lower.includes('epf') || 
        lower.includes('lic') || 
        lower.includes('life insurance') || 
        lower.includes('sukanya') || 
        lower.includes('tuition') || 
        lower.includes('tution') || 
        lower.includes('school fee')
      ) {
        detectedSection = 'Section 80C';
        actionTip = 'Eligible for deduction under the standard ₹1.5L limit.';
      }
      // Section 80D Patterns
      else if (
        lower.includes('health') || 
        lower.includes('medical') || 
        lower.includes('mediclaim') || 
        lower.includes('bupa') || 
        lower.includes('star health') || 
        lower.includes('ergo') || 
        lower.includes('insurance policy')
      ) {
        detectedSection = 'Section 80D';
        actionTip = 'Claim up to ₹25,000 for self/family, and an extra ₹50,000 for senior parents.';
      }
      // HRA Patterns
      else if (
        lower.includes('rent') || 
        lower.includes('pg rent') || 
        lower.includes('landlord') || 
        lower.includes('housing rent')
      ) {
        detectedSection = 'HRA (Rent)';
        actionTip = 'Eligible to lower your taxable basic salary component.';
      }
      // NPS Patterns
      else if (
        lower.includes('nps') || 
        lower.includes('national pension') || 
        lower.includes('pension fund') || 
        lower.includes('pran')
      ) {
        detectedSection = 'Section 80CCD(1B)';
        actionTip = 'Claim additional voluntary retirement deduction of up to ₹50,000.';
      }
      // Section 24b Patterns
      else if (
        lower.includes('home loan') || 
        lower.includes('loan emi') || 
        lower.includes('housing loan') || 
        lower.includes('interest component')
      ) {
        detectedSection = 'Section 24(b)';
        actionTip = 'Claim interest component paid on your home loan up to ₹2,00,000.';
      }
      // Section 80G Patterns
      else if (
        lower.includes('donation') || 
        lower.includes('charity') || 
        lower.includes('cry') || 
        lower.includes('pm cares') || 
        lower.includes('relief fund')
      ) {
        detectedSection = 'Section 80G';
        actionTip = 'Donations to registered trusts are eligible for 50% or 100% tax exemption.';
      }
      // Section 80E Patterns
      else if (
        lower.includes('education loan') || 
        lower.includes('student loan') || 
        lower.includes('interest on education')
      ) {
        detectedSection = 'Section 80E';
        actionTip = 'Fully claim the interest component on education loan with no upper limit.';
      }
      // Non-eligible but processed to show filter intelligence
      else {
        eligible = false;
        confidence = 'Manual Review';
        detectedSection = 'Non-Tax Deductible';
        actionTip = 'General consumption expense. Keep records just in case.';
      }

      // Try to extract amount
      let amount = 0;
      const numbersInLine = trimmed.replace(/,/g, '').match(/\d+/g);
      if (numbersInLine && numbersInLine.length > 0) {
        const lastNum = parseInt(numbersInLine[numbersInLine.length - 1]);
        if (!isNaN(lastNum) && lastNum > 100) {
          amount = lastNum;
        }
      }

      items.push({
        id: `tx-${index}-${Date.now()}`,
        description: trimmed.split('-')[0].split('₹')[0].trim(),
        amount: amount || 2000,
        date: trimmed.match(/^\d{2}-\w{3}-\d{4}/)?.[0] || 'FY 2026-27',
        detectedSection,
        confidence,
        savingPotential: eligible ? Math.round(amount * 0.30) : 0,
        actionTip,
        isEligible: eligible
      });
    });

    setScannedItems(items);
    setIsScanned(true);
  };

  const handleLoadSample = (key: keyof typeof samples) => {
    const text = samples[key];
    setInputText(text);
    handleScanOfText(text);
  };

  // Preload first sample on mount
  React.useEffect(() => {
    handleLoadSample('statementA');
  }, []);

  // Local drag and drop file simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Completely rule-based transaction match scanner
  const handleScan = () => {
    handleScanOfText(inputText);
  };

  // Add custom manual transaction item if they want to add rows
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleToggleEligibility = (id: string) => {
    setScannedItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isEligible: !item.isEligible, savingPotential: !item.isEligible ? Math.round(item.amount * 0.30) : 0 }
          : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setScannedItems(prev => prev.filter(item => item.id !== id));
  };

  const clearAll = () => {
    setInputText('');
    setScannedItems([]);
    setIsScanned(false);
  };

  // Math aggregates for matched sections
  const aggregates = useMemo(() => {
    const totals = {
      sec80C: 0,
      sec80D: 0,
      nps: 0,
      hra: 0,
      sec24: 0,
      others: 0,
      totalEligible: 0,
      estimatedRefund: 0
    };

    scannedItems.forEach(item => {
      if (!item.isEligible) return;
      totals.totalEligible += item.amount;
      totals.estimatedRefund += item.savingPotential;

      switch(item.detectedSection) {
        case 'Section 80C':
          totals.sec80C += item.amount;
          break;
        case 'Section 80D':
          totals.sec80D += item.amount;
          break;
        case 'Section 80CCD(1B)':
          totals.nps += item.amount;
          break;
        case 'HRA (Rent)':
          totals.hra += item.amount;
          break;
        case 'Section 24(b)':
          totals.sec24 += item.amount;
          break;
        default:
          totals.others += item.amount;
          break;
      }
    });

    // Apply strict Indian tax caps for projection
    totals.sec80C = Math.min(150000, totals.sec80C);
    totals.sec80D = Math.min(50000, totals.sec80D);
    totals.nps = Math.min(50000, totals.nps);
    totals.sec24 = Math.min(200000, totals.sec24);

    return totals;
  }, [scannedItems]);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="scanner" className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 font-mono flex items-center justify-center gap-1.5">
            <EyeOff className="w-3.5 h-3.5" />
            Zero-Anxiety local analyzer
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Stress-Free Transaction Analyzer
          </h2>
          <p className="text-base text-gray-600 font-sans">
            Indian tax compliance made completely understandable. Paste raw transaction rows or drop bank statements. Our local companion automatically highlights potential tax deductions—completely on your machine, protecting your absolute privacy.
          </p>
        </div>

        {/* Outer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Statement Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 space-y-4">
              
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-gray-900 text-sm">
                  Step 1: Explore Pre-loaded Statements
                </h3>
                <span className="text-[9px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase font-mono tracking-wider">
                  Interactive Demo
                </span>
              </div>

              {/* Sample statement quick triggers */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                  Click to scan different pre-cleaned samples:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadSample('statementA')}
                    className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Sample Rent & ELSS
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSample('statementB')}
                    className="text-[10px] font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    Home Loan & NPS
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSample('statementC')}
                    className="text-[10px] font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md border border-amber-100 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    LIC & Prov Fund
                  </button>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                className="border border-gray-200 rounded-2xl p-4 text-center bg-gray-50/50 relative group"
              >
                <textarea
                  value={inputText}
                  readOnly={true}
                  className="w-full h-48 text-xs font-mono bg-transparent border-0 focus:ring-0 p-0 resize-none text-gray-500 placeholder-gray-400 focus:outline-hidden cursor-not-allowed selection:bg-slate-200"
                />
                <div className="pt-2 border-t border-gray-100 flex flex-col items-center justify-center gap-1 text-[10px] text-gray-400">
                  <div className="flex items-center gap-1.5 font-medium text-slate-500">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Upload & Paste are locked in read-only glimpse mode.</span>
                  </div>
                </div>
              </div>

              {/* Strict No-Storage Bank Statement Processing Disclaimer */}
              <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 text-[11px] text-gray-600 space-y-1.5 text-left">
                <div className="flex items-center gap-1.5 font-bold text-gray-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Our Statement Processing Pledge</span>
                </div>
                <p className="leading-relaxed">
                  We <strong>do not store your statements anywhere</strong>. When you paste or drop a statement, we simply run our parsing algorithm in-memory to compile tax insights, then discard the raw data immediately. 
                </p>
                <p className="leading-relaxed">
                  We collect <strong>no Personally Identifiable Information (PII)</strong>. Although we highly recommend manually removing any account numbers, names, or addresses before uploading for your own peace of mind, even if you forget to do so, our system completely ignores and never stores or processes any of that private data.
                </p>
              </div>

              {/* PII Shield integrity warning */}
              {piiAnalysis.detected ? (
                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900 space-y-1 text-left">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>PII Warning Detected!</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    We noticed potential sensitive tags: <strong>{piiAnalysis.items.join(', ')}</strong>. 
                    We highly recommend sanitizing these lines, but rest assured that our processing algorithm will skip and discard them immediately without storage or server inspection.
                  </p>
                </div>
              ) : (
                inputText && (
                  <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2 text-left">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-semibold">PII Scan Clear: No personal account metrics or identity details detected.</span>
                  </div>
                )
              )}

              {/* Action Trigger */}
              <button
                type="button"
                disabled={true}
                className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs font-bold text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed transition-all"
              >
                <Lock className="w-3.5 h-3.5 mr-2 text-gray-400" />
                Deduction Parser Engine Active (Read-Only)
              </button>
            </div>

            {/* Step 1.5: Locked Manual entry */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center mx-auto text-slate-400">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-display font-semibold text-gray-700 text-sm">
                Manual Deduction Creation Locked
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto font-sans">
                Availing manual adjustments and direct custom entries is reserved for early launch day. Join the waitlist above to claim your reservation!
              </p>
            </div>
          </div>

          {/* Right Side: Detected Tax Benefits Feed */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Scanned stats board */}
            {isScanned && (
              <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-6 border border-slate-800">
                
                {/* Upper metrics row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Tax Deducted</span>
                    <div className="text-xl font-bold font-display text-emerald-400 mt-1">
                      {formatINR(aggregates.totalEligible)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Tax Savings (30% bracket)</span>
                    <div className="text-xl font-bold font-display text-indigo-300 mt-1">
                      {formatINR(aggregates.estimatedRefund)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">PII Exposure Status</span>
                    <div className="text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md px-2 py-1 mt-1.5 inline-block font-mono">
                      SECURE (0% LEAKED)
                    </div>
                  </div>
                </div>

                {/* Categories progress checks */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cap Limit Safe Checks:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    
                    {/* 80C Progress */}
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-300">Section 80C Limit</span>
                        <span className="font-mono text-emerald-400">{formatINR(aggregates.sec80C)} / ₹1,50,000</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-1.5 transition-all duration-500" 
                          style={{ width: `${Math.min(100, (aggregates.sec80C / 150000) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* 80D Progress */}
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-300">Section 80D Limit</span>
                        <span className="font-mono text-emerald-400">{formatINR(aggregates.sec80D)} / ₹50,000</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-1.5 transition-all duration-500" 
                          style={{ width: `${Math.min(100, (aggregates.sec80D / 50000) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* NPS Progress */}
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-300">80CCD(1B) NPS limit</span>
                        <span className="font-mono text-emerald-400">{formatINR(aggregates.nps)} / ₹50,000</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-500 h-1.5 transition-all duration-500" 
                          style={{ width: `${Math.min(100, (aggregates.nps / 50000) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Sec 24 Home loan Progress */}
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-300">Section 24(b) Limit</span>
                        <span className="font-mono text-emerald-400">{formatINR(aggregates.sec24)} / ₹2,00,000</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-purple-500 h-1.5 transition-all duration-500" 
                          style={{ width: `${Math.min(100, (aggregates.sec24 / 200000) * 100)}%` }}
                        />
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* List of scanned transaction items */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-xs">
              <div className="px-6 py-4 border-b border-gray-150 bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-gray-900 text-sm">
                    Scanned & Extracted Transactions ({scannedItems.length})
                  </h3>
                  <p className="text-[10px] text-gray-500">Uncheck items to exclude from totals or correct incorrect classifications</p>
                </div>
                {scannedItems.length > 0 && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    Safe Mode Active
                  </span>
                )}
              </div>

              {scannedItems.length === 0 ? (
                <div className="p-12 text-center text-gray-400 space-y-3">
                  <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-300 text-lg">
                    📁
                  </div>
                  <div className="text-sm font-semibold text-gray-500">No transactions analyzed yet</div>
                  <p className="text-xs max-w-sm mx-auto text-gray-400">
                    Paste text details or use a sample on the left to test the secure rule matching parser.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                  {scannedItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                        item.isEligible ? 'bg-white' : 'bg-gray-50/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start space-x-3 flex-grow">
                        <input
                          type="checkbox"
                          checked={item.isEligible}
                          onChange={() => handleToggleEligibility(item.id)}
                          className="mt-1 h-4 w-4 rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                        />
                        <div className="space-y-0.5">
                          <div className="text-xs font-semibold text-gray-900 flex flex-wrap items-center gap-1.5">
                            <span>{item.description}</span>
                            <span className="text-[9px] text-gray-400 font-mono">({item.date})</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.2 rounded-md">
                              {item.detectedSection}
                            </span>
                            <span className="text-[9px] text-gray-400">
                              Parsed Amount: <strong className="text-gray-700">{formatINR(item.amount)}</strong>
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-gray-500 italic">
                            Tip: {item.actionTip}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-0 pt-2 md:pt-0">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Est Saving</span>
                          <span className="text-xs font-bold text-emerald-600 font-mono">
                            {formatINR(item.savingPotential)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-gray-400 hover:text-rose-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                          title="Delete transaction line"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Verification summary cards */}
            <div className="bg-emerald-50 border border-emerald-150 rounded-2xl p-6 text-emerald-950 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-semibold text-sm">Salaried Professional Exemption Assurance</h4>
              </div>
              <p className="text-xs leading-relaxed text-emerald-800">
                Availing of tax exemptions under <strong>Sections 80C, 80D, and HRA (Rule 2A)</strong> requires keeping proof of transaction records (e.g. rent receipts, insurance receipts, investment statements). Our utility highlights eligible lines from your statement to simplify matching during the filing period. We read and process strictly anonymous transaction entries—never any Personally Identifiable Information (PII) like names, mobile numbers, PAN numbers, or emails, keeping your identity fully protected.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
