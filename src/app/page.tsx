
"use client"

import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Clock,
  TrendingUp,
  Landmark,
  Percent,
  TrendingDown,
  Repeat,
  Shield,
  Briefcase,
  LineChart,
  BarChart,
  CandlestickChart,
  CircleDollarSign,
  Sigma,
  Goal,
  Sparkles,
  Calculator,
  ReceiptText,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const investmentCalculators = [
  { href: "/sip", icon: Clock, label: "SIP Calculator" },
  { href: "/lumpsum", icon: Briefcase, label: "Lumpsum Calculator" },
  { href: "/step-up-sip", icon: TrendingUp, label: "Step-Up SIP Calculator" },
  { href: "/swp", icon: TrendingDown, label: "SWP Calculator" },
  { href: "/stp", icon: Repeat, label: "STP Calculator" },
  { href: "/retirement", icon: Goal, label: "Retirement Planner" },
  { href: "/nps", icon: Shield, label: "NPS Calculator" },
]

const loanCalculators = [
    { href: "/emi", icon: Landmark, label: "EMI Calculator" },
    { href: "/tax", icon: ReceiptText, label: "Income Tax Calculator" },
]

const tradingCalculators = [
  { href: "/brokerage", icon: Percent, label: "Brokerage Calculator" },
  { href: "/mtf", icon: Percent, label: "MTF Calculator" },
  { href: "/fo-margin", icon: Briefcase, label: "F&O Margin Calculator" },
  { href: "/equity-futures", icon: LineChart, label: "Equity Futures Calculator" },
  { href: "/equity-margin", icon: BarChart, label: "Equity Margin Calculator" },
  { href: "/commodity-margin", icon: CandlestickChart, label: "Commodity Margin Calculator" },
  { href: "/currency-derivatives-margin", icon: CircleDollarSign, label: "Currency Derivatives Margin" },
  { href: "/black-scholes", icon: Sigma, label: "Black-Scholes Calculator" },
]

function CalculatorLink({ href, icon: Icon, label }: { href: string, icon: React.ElementType, label: string }) {
  return (
    <Link href={href} className="group flex flex-col justify-between gap-3 rounded-lg border bg-card text-card-foreground p-4 hover:bg-accent hover:text-accent-foreground transition-colors">
        <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <Icon className="w-6 h-6" />
            </div>
            <span className="font-semibold text-base">{label}</span>
        </div>
        <p className="text-sm text-muted-foreground transition-transform group-hover:translate-x-1">Calculate now &rarr;</p>
    </Link>
  )
}

function GridSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {children}
            </div>
        </section>
    )
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 md:gap-16 lg:gap-20">
      <header className="flex flex-col items-center justify-center text-center gap-6 py-12 md:py-16">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10">
            <Calculator className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tight">
                Smart Financial Calculators
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                Your one-stop destination for all financial calculations. Make informed decisions about your investments, loans, taxes, and retirement with our comprehensive suite of tools.
            </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
                <a href="#calculators">
                    Get Started
                </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
                <Link href="/insights">
                    <Sparkles className="mr-2" />
                    AI Financial Insights
                </Link>
            </Button>
        </div>
      </header>
      
      <main id="calculators" className="space-y-12 md:space-y-16">
        <GridSection title="Investment Planning">
            {investmentCalculators.map((calc) => <CalculatorLink key={calc.href} {...calc} />)}
        </GridSection>

        <GridSection title="Loans & Taxes">
            {loanCalculators.map((calc) => <CalculatorLink key={calc.href} {...calc} />)}
        </GridSection>

        <GridSection title="Trading & Margins">
            {tradingCalculators.map((calc) => <CalculatorLink key={calc.href} {...calc} />)}
        </GridSection>
      </main>
    </div>
  )
}
