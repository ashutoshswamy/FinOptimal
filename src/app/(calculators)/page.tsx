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
  PlusMinus,
  Goal
} from "lucide-react"

const investmentCalculators = [
  { href: "/sip", icon: Clock, label: "SIP" },
  { href: "/step-up-sip", icon: TrendingUp, label: "Step up SIP" },
  { href: "/emi", icon: Landmark, label: "EMI" },
  { href: "/mtf", icon: Percent, label: "MTF" },
  { href: "/swp", icon: TrendingDown, label: "SWP" },
  { href: "/stp", icon: Repeat, label: "STP" },
  { href: "/retirement", icon: Goal, label: "Retirement" },
  { href: "/nps", icon: Shield, label: "National Pension Scheme (NPS)" },
]

const brokerageCalculators = [
  { href: "/brokerage", icon: Percent, label: "Brokerage calculator" },
  { href: "/fo-margin", icon: Briefcase, label: "F&O Margin" },
  { href: "/equity-futures", icon: LineChart, label: "Equity futures" },
  { href: "/equity-margin", icon: BarChart, label: "Equity margin" },
  { href: "/commodity-margin", icon: CandlestickChart, label: "Commodity margin" },
  { href: "/currency-derivatives-margin", icon: CircleDollarSign, label: "Currency derivatives margin" },
  { href: "/black-scholes", icon: PlusMinus, label: "Black & Scholes" },
]

function CalculatorLink({ href, icon: Icon, label }: { href: string, icon: React.ElementType, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent hover:text-accent-foreground transition-colors">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-medium">{label}</span>
    </Link>
  )
}

export default function CalculatorsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">Calculators</h1>
        <p className="text-muted-foreground">Your one-stop destination for all financial calculations.</p>
      </div>
      <Accordion type="multiple" defaultValue={["investment", "brokerage"]} className="w-full">
        <AccordionItem value="investment">
          <AccordionTrigger className="text-xl font-semibold">Investment</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {investmentCalculators.map((calc) => <CalculatorLink key={calc.href} {...calc} />)}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="brokerage">
          <AccordionTrigger className="text-xl font-semibold">Brokerage & Margin</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {brokerageCalculators.map((calc) => <CalculatorLink key={calc.href} {...calc} />)}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
