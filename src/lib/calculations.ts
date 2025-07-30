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

export interface StepUpSIPResult {
  totalInvestment: number;
  totalValue: number;
  estimatedReturns: number;
  breakdown: { year: number; yearlyInvestment: number; invested: number; returns: number; total: number }[];
}

export const calculateStepUpSip = (initialMonthlyInvestment: number, years: number, rateOfReturn: number, stepUpPercentage: number): StepUpSIPResult => {
  const monthlyRate = rateOfReturn / 100 / 12;
  let totalInvestment = 0;
  let futureValue = 0;
  let currentMonthlyInvestment = initialMonthlyInvestment;
  const breakdown: StepUpSIPResult['breakdown'] = [];

  for (let year = 1; year <= years; year++) {
    let yearlyInvestment = 0;
    for (let month = 1; month <= 12; month++) {
      futureValue = (futureValue + currentMonthlyInvestment) * (1 + monthlyRate);
      totalInvestment += currentMonthlyInvestment;
      yearlyInvestment += currentMonthlyInvestment;
    }
    
    breakdown.push({
      year,
      yearlyInvestment,
      invested: totalInvestment,
      returns: futureValue - totalInvestment,
      total: futureValue,
    });
    
    currentMonthlyInvestment *= (1 + stepUpPercentage / 100);
  }

  return {
    totalInvestment,
    totalValue: futureValue,
    estimatedReturns: futureValue - totalInvestment,
    breakdown,
  };
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

  if (tenureMonths === 0) {
    return { monthlyEMI: 0, totalInterest: 0, totalPayment: loanAmount, amortization: [] };
  }

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

export type TransactionType = "intraday" | "delivery";

export interface BrokerageInput {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  brokerage: number; // percentage
  type: TransactionType;
}

export interface BrokerageResult {
  buyValue: number;
  sellValue: number;
  turnover: number;
  grossPandL: number;
  netPandL: number;
  totalCharges: number;
  charges: {
    brokerage: number;
    stt: number;
    transactionCharge: number;
    gst: number;
    sebiCharges: number;
    stampDuty: number;
  };
}

export const calculateBrokerage = (input: BrokerageInput): BrokerageResult => {
    const { buyPrice, sellPrice, quantity, brokerage, type } = input;

    const buyValue = buyPrice * quantity;
    const sellValue = sellPrice * quantity;
    const turnover = buyValue + sellValue;
    const grossPandL = sellValue - buyValue;

    const brokerageCharge = Math.min((turnover * brokerage) / 100, type === 'intraday' ? 40 : Infinity);
    const stt = type === 'intraday'
        ? (sellValue * 0.025) / 100
        : (sellValue * 0.1) / 100;
    
    const transactionCharge = (turnover * 0.00345) / 100;
    const gst = (brokerageCharge + transactionCharge) * 0.18;
    const sebiCharges = (turnover * 10) / 10000000;
    const stampDuty = (buyValue * (type === 'intraday' ? 0.003 : 0.015)) / 100;

    const totalCharges = brokerageCharge + stt + transactionCharge + gst + sebiCharges + stampDuty;
    const netPandL = grossPandL - totalCharges;

    return {
        buyValue,
        sellValue,
        turnover,
        grossPandL,
        netPandL,
        totalCharges,
        charges: {
            brokerage: brokerageCharge,
            stt,
            transactionCharge,
            gst,
            sebiCharges,
            stampDuty,
        },
    };
};

export interface TaxInput {
    income: number;
    deductions: number;
    isSenior: boolean;
}

export interface TaxResult {
    totalTax: number;
    taxSlabs: { slab: string; tax: number }[];
}

export const calculateTax = (input: TaxInput): { oldRegime: TaxResult, newRegime: TaxResult } => {
    const { income, deductions, isSenior } = input;

    // Old Regime Calculation
    const oldTaxableIncome = Math.max(0, income - deductions);
    const oldSlabs = isSenior
        ? [ { limit: 300000, rate: 0 }, { limit: 500000, rate: 0.05 }, { limit: 1000000, rate: 0.2 }, { limit: Infinity, rate: 0.3 } ]
        : [ { limit: 250000, rate: 0 }, { limit: 500000, rate: 0.05 }, { limit: 1000000, rate: 0.2 }, { limit: Infinity, rate: 0.3 } ];
    
    const calculateTaxForRegime = (taxable: number, slabs: {limit: number, rate: number}[]) => {
        let tax = 0;
        let remainingIncome = taxable;
        const slabDetails: {slab: string, tax: number}[] = [];
        let lastLimit = 0;

        for (const slab of slabs) {
            if (remainingIncome > 0) {
                const taxableInSlab = Math.min(remainingIncome, slab.limit - lastLimit);
                const taxInSlab = taxableInSlab * slab.rate;
                tax += taxInSlab;
                remainingIncome -= taxableInSlab;
                 slabDetails.push({ slab: `₹${lastLimit/100000}L - ₹${slab.limit === Infinity ? 'Above' : slab.limit/100000+'L'} @ ${slab.rate * 100}%`, tax: taxInSlab });
                lastLimit = slab.limit;
                if (taxable <= lastLimit && slab.rate > 0 && taxableInSlab === 0) break;
            } else if (taxable < slab.limit) {
                slabDetails.push({ slab: `₹${lastLimit/100000}L - ₹${slab.limit === Infinity ? 'Above' : slab.limit/100000+'L'} @ ${slab.rate * 100}%`, tax: 0 });
            }
        }
        
        const cess = tax * 0.04;
        const totalTax = tax + cess;
        slabDetails.push({ slab: 'Health & Edu Cess @ 4%', tax: cess });
        return { totalTax, taxSlabs: slabDetails };
    }

    const oldRegimeResult = calculateTaxForRegime(oldTaxableIncome, oldSlabs);
    
    // New Regime Calculation
    const newSlabs = [
        { limit: 300000, rate: 0 }, { limit: 600000, rate: 0.05 }, { limit: 900000, rate: 0.1 },
        { limit: 1200000, rate: 0.15 }, { limit: 1500000, rate: 0.2 }, { limit: Infinity, rate: 0.3 }
    ];
    const newRegimeResult = calculateTaxForRegime(income, newSlabs); // No deductions in new regime

    return { oldRegime: oldRegimeResult, newRegime: newRegimeResult };
};

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  monthlyExpenses: number;
  currentSavings: number;
  monthlyInvestment: number;
  preRetirementRate: number; // percentage
  postRetirementRate: number; // percentage
  inflationRate: number; // percentage
  lifeExpectancy: number;
}

export interface RetirementResult {
  corpusRequired: number;
  corpusProjected: number;
  difference: number;
  monthlyExpensesAtRetirement: number;
  additionalMonthlyInvestmentNeeded: number;
}

export const calculateRetirement = (input: RetirementInput): RetirementResult => {
  const { currentAge, retirementAge, monthlyExpenses, currentSavings, monthlyInvestment, preRetirementRate, postRetirementRate, inflationRate, lifeExpectancy } = input;
  
  const yearsToRetire = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;

  // FV of current monthly expenses
  const monthlyExpensesAtRetirement = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetire);

  // Corpus needed at retirement (using real rate of return)
  const realReturnRate = ((1 + postRetirementRate / 100) / (1 + inflationRate / 100) - 1);

  if (realReturnRate === 0) {
    // Simplified calculation for zero real return rate
    const corpusRequired = (monthlyExpensesAtRetirement * 12) * yearsInRetirement;
    const fvOfCurrentSavings = currentSavings * Math.pow(1 + preRetirementRate / 100, yearsToRetire);
    const monthlyPreRetirementRate = preRetirementRate / 100 / 12;
    const fvOfFutureInvestments = monthlyInvestment * ((Math.pow(1 + monthlyPreRetirementRate, yearsToRetire * 12) - 1) / monthlyPreRetirementRate);
    const corpusProjected = fvOfCurrentSavings + fvOfFutureInvestments;
    const difference = corpusProjected - corpusRequired;
    const shortfall = Math.max(0, corpusRequired - fvOfCurrentSavings);
    const additionalMonthlyInvestmentNeeded = shortfall > 0 ? (shortfall * monthlyPreRetirementRate) / (Math.pow(1 + monthlyPreRetirementRate, yearsToRetire * 12) - 1) : 0;
    
    return {
      corpusRequired,
      corpusProjected,
      difference: Math.abs(difference),
      monthlyExpensesAtRetirement,
      additionalMonthlyInvestmentNeeded
    };
  }

  // PV of an annuity formula
  const corpusRequired = (monthlyExpensesAtRetirement * 12) * ((1 - Math.pow(1 + realReturnRate, -yearsInRetirement)) / realReturnRate);


  // Projected corpus from current savings
  const fvOfCurrentSavings = currentSavings * Math.pow(1 + preRetirementRate / 100, yearsToRetire);
  
  // Projected corpus from future investments
  const monthlyPreRetirementRate = preRetirementRate / 100 / 12;
  const fvOfFutureInvestments = monthlyInvestment *
                                ((Math.pow(1 + monthlyPreRetirementRate, yearsToRetire * 12) - 1) / monthlyPreRetirementRate);

  const corpusProjected = fvOfCurrentSavings + fvOfFutureInvestments;

  const difference = corpusProjected - corpusRequired;

  // Additional investment needed
  const shortfall = Math.max(0, corpusRequired - fvOfCurrentSavings);
  const additionalMonthlyInvestmentNeeded = shortfall > 0
    ? (shortfall * monthlyPreRetirementRate) / (Math.pow(1 + monthlyPreRetirementRate, yearsToRetire * 12) - 1)
    : 0;
  
  return {
    corpusRequired,
    corpusProjected,
    difference: Math.abs(difference),
    monthlyExpensesAtRetirement,
    additionalMonthlyInvestmentNeeded
  };
};

export interface SWPResult {
  totalWithdrawal: number;
  totalInterest: number;
  finalBalance: number;
  breakdown: { year: number; balance: number }[];
}

export const calculateSwp = (initialInvestment: number, monthlyWithdrawal: number, annualReturnRate: number, years: number): SWPResult => {
  const monthlyRate = annualReturnRate / 100 / 12;
  const months = years * 12;
  let balance = initialInvestment;
  const breakdown: SWPResult['breakdown'] = [{ year: 0, balance: initialInvestment }];

  for (let month = 1; month <= months; month++) {
    balance += balance * monthlyRate; // Add interest
    balance -= monthlyWithdrawal; // Subtract withdrawal

    if (month % 12 === 0) {
      breakdown.push({ year: month / 12, balance: Math.max(0, balance) });
    }
  }

  const totalWithdrawal = monthlyWithdrawal * months;
  const finalBalance = Math.max(0, balance);
  const totalInterest = finalBalance + totalWithdrawal - initialInvestment;

  return { totalWithdrawal, totalInterest, finalBalance, breakdown };
};

export interface NPSInput {
  monthlyInvestment: number;
  currentAge: number;
  retirementAge: number;
  returnRate: number;
  annuityPercentage: number;
  annuityRate: number;
}

export interface NPSResult {
  totalInvestment: number;
  totalInterest: number;
  totalCorpus: number;
  lumpSumValue: number;
  monthlyPension: number;
}

export const calculateNps = (input: NPSInput): NPSResult => {
  const { monthlyInvestment, currentAge, retirementAge, returnRate, annuityPercentage, annuityRate } = input;
  
  const investmentPeriod = retirementAge - currentAge;
  const months = investmentPeriod * 12;
  const monthlyRate = returnRate / 100 / 12;
  
  const totalCorpus = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  
  const totalInvestment = monthlyInvestment * months;
  const totalInterest = totalCorpus - totalInvestment;
  
  const annuityValue = totalCorpus * (annuityPercentage / 100);
  const lumpSumValue = totalCorpus - annuityValue;
  
  const monthlyAnnuityRate = annuityRate / 100 / 12;
  const monthlyPension = annuityValue * monthlyAnnuityRate;

  return {
    totalInvestment,
    totalInterest,
    totalCorpus,
    lumpSumValue,
    monthlyPension,
  };
};
