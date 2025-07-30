
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/formatters"
import { calculateFOMargin, type FOMarginResult } from "@/lib/calculations"
import Link from "next/link"
import { ArrowLeft, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function FoMarginCalculatorPage() {
  const [stockPrice, setStockPrice] = useState(100)
  const [strikePrice, setStrikePrice] = useState(100)
  const [lotSize, setLotSize] = useState(1000)
  const [volatility, setVolatility] = useState(20)
  const [riskFreeRate, setRiskFreeRate] = useState(5)
  const [optionType, setOptionType] = useState<"call" | "put">("call")

  const results: FOMarginResult = useMemo(() => {
    return calculateFOMargin({ stockPrice, strikePrice, lotSize, volatility, riskFreeRate, optionType })
  }, [stockPrice, strikePrice, lotSize, volatility, riskFreeRate, optionType])

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline flex items-center gap-2">
            <Briefcase /> F&O Margin Calculator
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Estimate margin for shorting options (simplified).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Option Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Option Type</Label>
              <RadioGroup value={optionType} onValueChange={(val: "call" | "put") => setOptionType(val)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="call" id="call" />
                  <Label htmlFor="call">Call</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="put" id="put" />
                  <Label htmlFor="put">Put</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock-price">Underlying Price (S)</Label>
              <Input id="stock-price" value={stockPrice} onChange={(e) => setStockPrice(Number(e.target.value))} type="number" />
              <Slider value={[stockPrice]} onValueChange={(vals) => setStockPrice(vals[0])} max={500} step={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strike-price">Strike Price (K)</Label>
              <Input id="strike-price" value={strikePrice} onChange={(e) => setStrikePrice(Number(e.target.value))} type="number" />
              <Slider value={[strikePrice]} onValueChange={(vals) => setStrikePrice(vals[0])} max={500} step={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lot-size">Lot Size</Label>
              <Input id="lot-size" value={lotSize} onChange={(e) => setLotSize(Number(e.target.value))} type="number" />
              <Slider value={[lotSize]} onValueChange={(vals) => setLotSize(vals[0])} max={5000} step={50} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volatility">Volatility (% p.a.)</Label>
              <Input id="volatility" value={volatility} onChange={(e) => setVolatility(Number(e.target.value))} type="number" />
              <Slider value={[volatility]} onValueChange={(vals) => setVolatility(vals[0])} max={100} step={1} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="risk-free-rate">Risk-Free Rate (% p.a.)</Label>
              <Input id="risk-free-rate" value={riskFreeRate} onChange={(e) => setRiskFreeRate(Number(e.target.value))} type="number" />
              <Slider value={[riskFreeRate]} onValueChange={(vals) => setRiskFreeRate(vals[0])} max={15} step={0.1} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estimated Margin (Naked Short)</CardTitle>
            <CardDescription>
              A simplified estimation of margin required to write a {optionType} option.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="space-y-1 rounded-md bg-muted/50 p-4">
                <p className="text-muted-foreground text-sm">Option Premium Received</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.optionPremium)}</p>
              </div>
              <div className="space-y-1 rounded-md bg-muted/50 p-4">
                <p className="text-muted-foreground text-sm">Total Required Margin</p>
                <p className="text-3xl font-bold">{formatCurrency(results.totalMargin)}</p>
              </div>
            </div>
            <div className="space-y-3 pt-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm text-muted-foreground">Value of Option Premium</span>
                    <span className="font-semibold">{formatCurrency(results.optionPremium)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm text-muted-foreground">Out-of-the-Money (OTM) Amount</span>
                    <span className="font-semibold">{formatCurrency(results.otmAmount)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm text-muted-foreground">Exposure Margin (Conceptual)</span>
                    <span className="font-semibold">{formatCurrency(results.exposureMargin)}</span>
                </div>
            </div>
             <CardDescription className="pt-4 text-xs">
                Disclaimer: This is a highly simplified and conceptual calculation for educational purposes. It does NOT represent the actual SPAN + Exposure margin calculated by exchanges, which is far more complex. Do not use for actual trading decisions.
             </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
