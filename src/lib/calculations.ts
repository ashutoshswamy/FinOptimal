export interface SIPResult {
  totalInvestment: number;
  totalValue: number;
  estimatedReturns: number;
  breakdown: { year: number; invested: number; returns: number; total: number }[];
}

export const calculateSip = (monthlyInvestment: number, years: number, rateOfReturn: number): SIPResult => {
  const months = years * 12;
  const monthlyRate = rateOfReturn / 100 / 12;
  const totalInvestment = monthlyInvestment * months;

  const totalValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  const estimatedReturns = totalValue - totalInvestment;

  const breakdown: SIPResult['breakdown'] = [];
  let investedAmount = 0;
  let futureValue = 0;

  for (let year = 1; year <= years; year++) {
    const yearlyMonths = year * 12;
    investedAmount = monthlyInvestment * yearlyMonths;
    futureValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, yearlyMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    breakdown.push({
      year,
      invested: investedAmount,
      returns: futureValue - investedAmount,
      total: futureValue,
    });
  }

  return { totalInvestment, totalValue, estimatedReturns, breakdown };
};

export interface LumpsumResult {
    totalValue: number;
    totalInvestment: number;
    estimatedReturns: number;
}

export const calculateLumpsum = (principal: number, years: number, rateOfReturn: number): LumpsumResult => {
    const totalValue = principal * Math.pow((1 + rateOfReturn / 100), years);
    const estimatedReturns = totalValue - principal;
    return {
        totalValue,
        totalInvestment: principal,
        estimatedReturns,
    };
};

export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  amortization: {
    month: number;
    principal: number;
    interest: number;
    totalPayment: number;
    balance: number;
  }[];
}

export const calculateEmi = (loanAmount: number, annualRate: number, years: number): EMIResult => {
  const monthlyRate = annualRate / 12 / 100;
  const tenureMonths = years * 12;

  if (monthlyRate === 0) {
    const monthlyEMI = loanAmount / tenureMonths;
    return {
      monthlyEMI,
      totalInterest: 0,
      totalPayment: loanAmount,
      amortization: Array.from({ length: tenureMonths }, (_, i) => ({
        month: i + 1,
        principal: monthlyEMI,
        interest: 0,
        totalPayment: monthlyEMI,
        balance: loanAmount - monthlyEMI * (i + 1),
      })),
    }
  }

  const monthlyEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  const totalPayment = monthlyEMI * tenureMonths;
  const totalInterest = totalPayment - loanAmount;

  const amortization = [];
  let balance = loanAmount;
  for (let i = 0; i < tenureMonths; i++) {
    const interest = balance * monthlyRate;
    const principal = monthlyEMI - interest;
    balance -= principal;
    amortization.push({
      month: i + 1,
      principal,
      interest,
      totalPayment: monthlyEMI,
      balance: balance < 0 ? 0 : balance,
    });
  }

  return { monthlyEMI, totalInterest, totalPayment, amortization };
};
