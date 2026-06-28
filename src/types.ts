export interface CalculatorState {
  annualSalary: number; // gross in ₹
  sec80C: number;       // PPF, ELSS, EPF, LIC (Limit: ₹1,50,000)
  sec80D: number;       // Health Insurance Premium (Limit: ₹25,000 / ₹50,000)
  npsContribution: number; // NPS Section 80CCD(1B) (Limit: ₹50,000)
  rentPaid: number;     // Annual rent paid for HRA calculation
  hraReceived: number;  // Annual HRA component in salary
  homeLoanInterest: number; // Section 24(b) (Limit: ₹2,00,000)
  metroCity: boolean;   // For HRA calculation (50% vs 40% of basic)
}

export interface TaxEstimateResult {
  taxOldRegime: number;
  taxNewRegime: number;
  recommendedRegime: 'old' | 'new';
  potentialSavings: number;
  hraExemption: number;
  deductionsClaimed: {
    section: string;
    amount: number;
    maxLimit: number;
    description: string;
  }[];
}

export interface TransactionItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  detectedSection: string; // e.g., "Section 80C", "Section 80D", "HRA (Rent)"
  confidence: 'High' | 'Manual Review';
  savingPotential: number;
  actionTip: string;
  isEligible: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  profession: string;
  interests: string[];
  message: string;
  submittedAt: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
