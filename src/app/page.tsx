
"use client"

import Link from "next/link"
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
import { Footer } from "@/components/footer"

const calculators = [
  // Investment
  { href: "/sip", icon: Clock, label: "SIP Calculator" },
  { href: "/lumpsum", icon: Briefcase, label: "Lumpsum Calculator" },
  { href: "/step-up-sip", icon: TrendingUp, label: "Step-Up SIP Calculator" },
  { href: "/retirement", icon: Goal, label: "Retirement Planner" },
  { href: "/nps", icon: Shield, label: "NPS Calculator" },
  { href: "/swp", icon: TrendingDown, label: "SWP Calculator" },
  // Loans & Taxes
  { href: "/emi", icon: Landmark, label: "EMI Calculator" },
  { href: "/tax", icon: ReceiptText, label: "Income Tax Calculator" },
  // Trading
  { href: "/brokerage", icon: Percent, label: "Brokerage Calculator" },
  { href: "/black-scholes", icon: Sigma, label: "Black-Scholes" },
  { href: "/stp", icon: Repeat, label: "STP Calculator" },
  { href: "/mtf", icon: Percent, label: "MTF Calculator" },
  { href: "/fo-margin", icon: Briefcase, label: "F&O Margin" },
  { href: "/equity-futures", icon: LineChart, label: "Equity Futures" },
  { href: "/equity-margin", icon: BarChart, label: "Equity Margin" },
  { href: "/commodity-margin", icon: CandlestickChart, label: "Commodity Margin" },
  { href: "/currency-derivatives-margin", icon: CircleDollarSign, label: "Currency Derivatives" },
]

function CalculatorLink({ href, icon: Icon, label }: { href: string, icon: React.ElementType, label: string }) {
  return (
    <Link href={href} className="group flex flex-col items-start gap-4 rounded-xl border bg-card text-card-foreground p-4 transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-md">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
            <h3 className="font-semibold text-base">{label}</h3>
            <p className="text-sm text-muted-foreground">Calculate now</p>
        </div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex flex-col items-center justify-center text-center gap-6 py-12 md:py-20 px-4">
        <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tight">
                Financial Clarity, Simplified.
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                A comprehensive suite of tools to help you make informed financial decisions.
                From investments to taxes, we have you covered.
            </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
                <a href="#calculators">
                    View Calculators
                </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
                <Link href="/insights">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Get AI Insights
                </Link>
            </Button>
        </div>
      </header>
      
      <main id="calculators" className="flex-grow px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {calculators.map((calc) => <CalculatorLink key={calc.href} {...calc} />)}
        </div>
      </main>
      <Footer />
    </div>
  )
}
