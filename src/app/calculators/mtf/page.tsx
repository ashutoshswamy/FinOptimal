
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/formatters"
import { calculateMtf, type MtfResult } from "@/lib/calculations"
import Link from "next/link"
import { ArrowLeft, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MtfCalculatorPage() {
  const [stockPrice, setStockPrice] = useState(1000)
  const [quantity, setQuantity] = useState(100)
  const [marginRequirement, setMarginRequirement] = useState(25) // 25%
  const [interestRate, setInterestRate] = useState(12) // 12% p.a.
  const [holdingPeriod, setHoldingPeriod] = useState(30) // 30 days

  const results: MtfResult = useMemo(() => {
    return calculateMtf({ stockPrice, quantity, marginRequirement, interestRate, holdingPeriod })
  }, [stockPrice, quantity, marginRequirement, interestRate, holdingPeriod])

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
            <Percent /> MTF Calculator
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Estimate costs for trading with Margin Trading Facility.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Trade Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="stock-price">Stock Price</Label>
              <Input id="stock-price" value={stockPrice} onChange={(e) => setStockPrice(Number(e.target.value))} type="number" />
              <Slider value={[stockPrice]} onValueChange={(vals) => setStockPrice(vals[0])} max={5000} step={10} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} type="number" />
              <Slider value={[quantity]} onValueChange={(vals) => setQuantity(vals[0])} max={1000} step={10} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="margin-requirement">Margin Requirement (%)</Label>
              <Input id="margin-requirement" value={marginRequirement} onChange={(e) => setMarginRequirement(Number(e.target.value))} type="number" />
              <Slider value={[marginRequirement]} onValueChange={(vals) => setMarginRequirement(vals[0])} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
              <Input id="interest-rate" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} type="number" />
              <Slider value={[interestRate]} onValueChange={(vals) => setInterestRate(vals[0])} max={25} step={0.5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="holding-period">Holding Period (Days)</Label>
              <Input id="holding-period" value={holdingPeriod} onChange={(e) => setHoldingPeriod(Number(e.target.value))} type="number" />
              <Slider value={[holdingPeriod]} onValueChange={(vals) => setHoldingPeriod(vals[0])} max={365} step={1} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>MTF Cost Breakdown</CardTitle>
            <CardDescription>
              Summary of your margin trade costs for a holding period of {holdingPeriod} days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="space-y-1 rounded-md bg-muted/50 p-4">
                <p className="text-muted-foreground text-sm">Total Transaction Value</p>
                <p className="text-3xl font-bold">{formatCurrency(results.totalValue)}</p>
              </div>
               <div className="space-y-1 rounded-md bg-muted/50 p-4">
                <p className="text-muted-foreground text-sm">Total Cost to You</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.totalCost)}</p>
              </div>
            </div>
             <div className="space-y-3 pt-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm text-muted-foreground">Required Margin (Your Funds)</span>
                    <span className="font-semibold">{formatCurrency(results.requiredMargin)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm text-muted-foreground">Funding from Broker</span>
                    <span className="font-semibold">{formatCurrency(results.brokerFunding)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm text-muted-foreground">Estimated Interest Cost</span>
                    <span className="font-semibold text-destructive">{formatCurrency(results.interestCost)}</span>
                </div>
             </div>
             <CardDescription className="pt-4 text-xs">
                Note: This calculation does not include brokerage, taxes, or other statutory charges. The actual interest rate and margin requirement may vary by broker.
             </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
