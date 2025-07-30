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

  if (tenureMonths <= 0 || loanAmount <= 0) {
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

  if (yearsToRetire <=0 || yearsInRetirement <= 0) {
    return { corpusRequired: 0, corpusProjected: 0, difference: 0, monthlyExpensesAtRetirement: 0, additionalMonthlyInvestmentNeeded: 0 };
  }

  // FV of current monthly expenses
  const monthlyExpensesAtRetirement = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetire);

  // Corpus needed at retirement (using real rate of return)
  const realReturnRate = ((1 + postRetirementRate / 100) / (1 + inflationRate / 100) - 1);
  let corpusRequired;

  if (realReturnRate === 0) {
    corpusRequired = (monthlyExpensesAtRetirement * 12) * yearsInRetirement;
  } else {
    // PV of an annuity formula
    corpusRequired = (monthlyExpensesAtRetirement * 12) * ((1 - Math.pow(1 + realReturnRate, -yearsInRetirement)) / realReturnRate);
  }

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

  if (months <= 0) return { totalWithdrawal: 0, totalInterest: 0, finalBalance: initialInvestment, breakdown: []};

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
  if (investmentPeriod <= 0) {
    return { totalInvestment: 0, totalInterest: 0, totalCorpus: 0, lumpSumValue: 0, monthlyPension: 0 };
  }
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

// Function to calculate Normal Cumulative Distribution Function (CDF)
const normalCdf = (x: number): number => {
    // Using the Abramowitz and Stegun approximation
    const b1 =  0.319381530;
    const b2 = -0.356563782;
    const b3 =  1.781477937;
    const b4 = -1.821255978;
    const b5 =  1.330274429;
    const p  =  0.2316419;
    const c  =  0.39894228;

    if (x >= 0.0) {
        const t = 1.0 / (1.0 + p * x);
        return (1.0 - c * Math.exp(-x * x / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1));
    } else {
        const t = 1.0 / (1.0 - p * x);
        return (c * Math.exp(-x * x / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1));
    }
}

export interface BlackScholesInput {
    stockPrice: number;
    strikePrice: number;
    timeToExpiry: number; // in years
    volatility: number; // as a percentage
    riskFreeRate: number; // as a percentage
}

export interface BlackScholesResult {
    callPrice: number;
    putPrice: number;
    callDelta: number;
    putDelta: number;
    gamma: number;
    vega: number;
    theta: number;
    rho: number;
}

export const calculateBlackScholes = (input: BlackScholesInput): BlackScholesResult => {
    const { stockPrice: S, strikePrice: K, timeToExpiry: T, volatility: vol, riskFreeRate: r } = input;

    const volPct = vol / 100;
    const rPct = r / 100;

    if (T <= 0 || S <= 0 || K <= 0 || vol <= 0) {
        const putPrice = K > S ? K - S : 0;
        const callPrice = S > K ? S - K : 0;
        return { callPrice, putPrice, callDelta: S > K ? 1 : 0, putDelta: K > S ? -1: 0, gamma: 0, vega: 0, theta: 0, rho: 0 };
    }

    const d1 = (Math.log(S / K) + (rPct + (volPct * volPct) / 2) * T) / (volPct * Math.sqrt(T));
    const d2 = d1 - volPct * Math.sqrt(T);

    const N_d1 = normalCdf(d1);
    const N_d2 = normalCdf(d2);
    const N_minus_d1 = normalCdf(-d1);
    const N_minus_d2 = normalCdf(-d2);
    
    const callPrice = S * N_d1 - K * Math.exp(-rPct * T) * N_d2;
    const putPrice = K * Math.exp(-rPct * T) * N_minus_d2 - S * N_minus_d1;

    // Greeks
    const callDelta = N_d1;
    const putDelta = N_d1 - 1;
    const normalPdf_d1 = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(d1 * d1) / 2);
    const gamma = normalPdf_d1 / (S * volPct * Math.sqrt(T));
    const vega = S * normalPdf_d1 * Math.sqrt(T) / 100; // per 1% change in vol
    const theta = -((S * normalPdf_d1 * volPct) / (2 * Math.sqrt(T))) - rPct * K * Math.exp(-rPct * T) * N_d2; // per year
    const rho = K * T * Math.exp(-rPct * T) * N_d2 / 100; // per 1% change in rate

    return {
        callPrice,
        putPrice,
        callDelta,
        putDelta,
        gamma,
        vega,
        theta: theta / 365, // daily theta
        rho,
    };
};

export interface STPResult {
  totalTransferred: number;
  finalValueOfInvestment: number;
  totalGains: number;
  breakdown: { year: number; valueInEquity: number; valueInDebt: number; totalValue: number }[];
}

export const calculateStp = (
  lumpSumAmount: number,
  monthlyTransferAmount: number,
  transferPeriodYears: number,
  equityFundReturn: number, // %
  debtFundReturn: number // %
): STPResult => {
  if (transferPeriodYears <= 0) {
    return { totalTransferred: 0, finalValueOfInvestment: lumpSumAmount, totalGains: 0, breakdown: []};
  }

  const equityMonthlyRate = equityFundReturn / 100 / 12;
  const debtMonthlyRate = debtFundReturn / 100 / 12;
  const transferMonths = transferPeriodYears * 12;

  let debtFundBalance = lumpSumAmount;
  let equityFundBalance = 0;
  const breakdown: STPResult['breakdown'] = [];

  for (let month = 1; month <= transferMonths; month++) {
    // Interest on debt fund
    debtFundBalance *= (1 + debtMonthlyRate);

    // Transfer amount
    const transferAmount = Math.min(debtFundBalance, monthlyTransferAmount);
    debtFundBalance -= transferAmount;
    
    // Grow equity fund
    equityFundBalance *= (1 + equityMonthlyRate);
    equityFundBalance += transferAmount;

    if (month % 12 === 0) {
      breakdown.push({
        year: month / 12,
        valueInEquity: equityFundBalance,
        valueInDebt: debtFundBalance,
        totalValue: equityFundBalance + debtFundBalance
      });
    }
  }

  // If debt fund still has balance after transfer period, let it grow
  // This part is complex, assuming the user might want to see the total value after the transfer period ends.
  // For simplicity, we can assume the simulation ends when transfers stop.
  // Let's assume user wants to see the state right after the last transfer.

  const totalTransferred = Math.min(lumpSumAmount, monthlyTransferAmount * transferMonths);
  const finalValueOfInvestment = equityFundBalance + debtFundBalance;
  const totalGains = finalValueOfInvestment - lumpSumAmount;
  
  if (transferMonths % 12 !== 0) {
      breakdown.push({
        year: transferPeriodYears,
        valueInEquity: equityFundBalance,
        valueInDebt: debtFundBalance,
        totalValue: equityFundBalance + debtFundBalance
      });
  }

  return {
    totalTransferred,
    finalValueOfInvestment,
    totalGains,
    breakdown,
  };
};

export interface MtfInput {
  stockPrice: number;
  quantity: number;
  marginRequirement: number; // percentage, e.g., 20%
  interestRate: number; // annual percentage
  holdingPeriod: number; // in days
}

export interface MtfResult {
  totalValue: number;
  requiredMargin: number;
  brokerFunding: number;
  interestCost: number;
  totalCost: number;
}

export const calculateMtf = (input: MtfInput): MtfResult => {
  const { stockPrice, quantity, marginRequirement, interestRate, holdingPeriod } = input;

  if (stockPrice <= 0 || quantity <= 0 || holdingPeriod < 0) {
    return { totalValue: 0, requiredMargin: 0, brokerFunding: 0, interestCost: 0, totalCost: 0 };
  }

  const totalValue = stockPrice * quantity;
  const requiredMargin = (totalValue * marginRequirement) / 100;
  const brokerFunding = totalValue - requiredMargin;
  
  const dailyInterestRate = interestRate / 100 / 365;
  const interestCost = brokerFunding * dailyInterestRate * holdingPeriod;
  
  const totalCost = requiredMargin + interestCost;

  return {
    totalValue,
    requiredMargin,
    brokerFunding,
    interestCost,
    totalCost,
  };
};

export interface EquityFuturesInput {
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  marginPercent: number;
}

export interface EquityFuturesResult {
  contractValue: number;
  requiredMargin: number;
  pointsCaptured: number;
  realizedPandL: number;
  returnOnMargin: number; // percentage
}

export const calculateEquityFutures = (input: EquityFuturesInput): EquityFuturesResult => {
  const { entryPrice, exitPrice, lotSize, marginPercent } = input;

  if (entryPrice <= 0 || lotSize <= 0 || marginPercent <= 0) {
    return { contractValue: 0, requiredMargin: 0, pointsCaptured: 0, realizedPandL: 0, returnOnMargin: 0 };
  }

  const contractValue = entryPrice * lotSize;
  const requiredMargin = (contractValue * marginPercent) / 100;
  const pointsCaptured = exitPrice - entryPrice;
  const realizedPandL = pointsCaptured * lotSize;
  const returnOnMargin = requiredMargin > 0 ? (realizedPandL / requiredMargin) * 100 : 0;
  
  return {
    contractValue,
    requiredMargin,
    pointsCaptured,
    realizedPandL,
    returnOnMargin,
  };
};

export interface FOMarginInput {
  stockPrice: number;
  strikePrice: number;
  lotSize: number;
  volatility: number;
  riskFreeRate: number;
  optionType: "call" | "put";
}

export interface FOMarginResult {
  optionPremium: number;
  totalMargin: number;
  otmAmount: number;
  exposureMargin: number;
}

// Simplified F&O Margin Calculation for shorting an option
export const calculateFOMargin = (input: FOMarginInput): FOMarginResult => {
  const { stockPrice, strikePrice, lotSize, volatility, riskFreeRate, optionType } = input;

  // For simplicity, assuming time to expiry is ~1 week (0.0192 years)
  const T = 7 / 365;
  const bsResult = calculateBlackScholes({ stockPrice, strikePrice, timeToExpiry: T, volatility, riskFreeRate });

  const optionPrice = optionType === 'call' ? bsResult.callPrice : bsResult.putPrice;
  const optionPremium = optionPrice * lotSize;

  // This is a gross simplification of exchange margin logic.
  // It's meant for conceptual understanding only.
  const otmAmount = optionType === 'call'
    ? Math.max(0, strikePrice - stockPrice) * lotSize
    : Math.max(0, stockPrice - strikePrice) * lotSize;

  // Conceptual exposure margin (e.g., 20% of underlying value)
  const underlyingValue = stockPrice * lotSize;
  const exposureMargin = underlyingValue * 0.20;

  // Simplified margin: Premium + Exposure - OTM Value
  const totalMargin = optionPremium + exposureMargin - otmAmount;

  return {
    optionPremium,
    totalMargin: Math.max(0, totalMargin), // Margin can't be negative
    otmAmount,
    exposureMargin,
  };
};

export interface EquityMarginInput {
  optionType: 'call' | 'put';
  positionType: 'long' | 'short';
  underlyingPrice: number;
  strikePrice: number;
  lotSize: number;
  volatility: number; // percentage
}

export interface EquityMarginResult {
  contractValue: number;
  optionPremium: number;
  spanMargin: number;
  exposureMargin: number;
  totalMargin: number;
}

export const calculateEquityMargin = (input: EquityMarginInput): EquityMarginResult => {
  const { optionType, positionType, underlyingPrice, strikePrice, lotSize, volatility } = input;
  
  const contractValue = underlyingPrice * lotSize;

  // Use Black-Scholes for premium calculation. Assume 1 week to expiry and 5% risk-free rate.
  const bsResult = calculateBlackScholes({
    stockPrice: underlyingPrice,
    strikePrice: strikePrice,
    timeToExpiry: 7 / 365,
    volatility: volatility,
    riskFreeRate: 5,
  });

  const optionPrice = optionType === 'call' ? bsResult.callPrice : bsResult.putPrice;
  const optionPremium = optionPrice * lotSize;
  
  if (positionType === 'long') {
    // For long positions, margin is just the premium paid.
    return {
      contractValue,
      optionPremium,
      spanMargin: 0,
      exposureMargin: 0,
      totalMargin: optionPremium
    };
  }

  // Simplified Short Position Margin
  // SPAN is conceptually based on max potential loss. A simple proxy:
  const spanMargin = Math.max(
    // Scenario 1: Volatility up
    (underlyingPrice * (volatility / 100) * 2) * lotSize * 0.15, // Simplified VaR
    // Scenario 2: Price moves against position
    (Math.abs(strikePrice - underlyingPrice) + (underlyingPrice * 0.05)) * lotSize
  ) * 0.5; // Heuristic scaling

  // Exposure margin is a percentage of the contract value
  const exposureMargin = contractValue * 0.10; // 10% exposure margin
  
  const totalMargin = spanMargin + exposureMargin;

  return {
    contractValue,
    optionPremium,
    spanMargin,
    exposureMargin,
    totalMargin,
  };
}

export interface CommodityMarginInput {
  commodityPrice: number;
  lotSize: number;
  spanFactor: number; // %
  exposureFactor: number; // %
}

export interface CommodityMarginResult {
  contractValue: number;
  spanMargin: number;
  exposureMargin: number;
  totalMargin: number;
}

export const calculateCommodityMargin = (input: CommodityMarginInput): CommodityMarginResult => {
  const { commodityPrice, lotSize, spanFactor, exposureFactor } = input;

  const contractValue = commodityPrice * lotSize;
  const spanMargin = contractValue * (spanFactor / 100);
  const exposureMargin = contractValue * (exposureFactor / 100);
  const totalMargin = spanMargin + exposureMargin;
  
  return {
    contractValue,
    spanMargin,
    exposureMargin,
    totalMargin
  };
}

export interface CurrencyDerivativesMarginInput {
  usdinrPrice: number;
  lotSize: number; // in USD
  spanPercent: number;
  exposurePercent: number;
}

export interface CurrencyDerivativesMarginResult {
  contractValue: number;
  spanMargin: number;
  exposureMargin: number;
  totalMargin: number;
}

export const calculateCurrencyDerivativesMargin = (input: CurrencyDerivativesMarginInput): CurrencyDerivativesMarginResult => {
  const { usdinrPrice, lotSize, spanPercent, exposurePercent } = input;

  if (usdinrPrice <= 0 || lotSize <= 0) {
    return { contractValue: 0, spanMargin: 0, exposureMargin: 0, totalMargin: 0 };
  }

  const contractValue = usdinrPrice * lotSize;
  const spanMargin = contractValue * (spanPercent / 100);
  const exposureMargin = contractValue * (exposurePercent / 100);
  const totalMargin = spanMargin + exposureMargin;
  
  return {
    contractValue,
    spanMargin,
    exposureMargin,
    totalMargin
  };
}
