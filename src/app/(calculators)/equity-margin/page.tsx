"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/formatters"
import { calculateEquityMargin, type EquityMarginResult } from "@/lib/calculations"
import Link from "next/link"
import { ArrowLeft, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function EquityMarginCalculatorPage() {
  const [optionType, setOptionType] = useState<"call" | "put">("call")
  const [positionType, setPositionType] = useState<"long" | "short">("short")
  const [underlyingPrice, setUnderlyingPrice] = useState(200)
  const [strikePrice, setStrikePrice] = useState(200)
  const [lotSize, setLotSize] = useState(500)
  const [volatility, setVolatility] = useState(25)
  
  const results: EquityMarginResult = useMemo(() => {
    return calculateEquityMargin({ optionType, positionType, underlyingPrice, strikePrice, lotSize, volatility })
  }, [optionType, positionType, underlyingPrice, strikePrice, lotSize, volatility])

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
            <BarChart /> Equity Margin Calculator (Options)
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Conceptually estimate SPAN & Exposure margin for options.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Position Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
              <Label>Position</Label>
              <RadioGroup value={positionType} onValueChange={(val: "long" | "short") => setPositionType(val)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long" id="long" />
                  <Label htmlFor="long">Long</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short">Short</Label>
                </div>
              </RadioGroup>
            </div>
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
              <Label htmlFor="underlying-price">Underlying Price</Label>
              <Input id="underlying-price" value={underlyingPrice} onChange={(e) => setUnderlyingPrice(Number(e.target.value))} type="number" />
              <Slider value={[underlyingPrice]} onValueChange={(vals) => setUnderlyingPrice(vals[0])} max={1000} step={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strike-price">Strike Price</Label>
              <Input id="strike-price" value={strikePrice} onChange={(e) => setStrikePrice(Number(e.target.value))} type="number" />
              <Slider value={[strikePrice]} onValueChange={(vals) => setStrikePrice(vals[0])} max={1000} step={5} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="lot-size">Lot Size</Label>
              <Input id="lot-size" value={lotSize} onChange={(e) => setLotSize(Number(e.target.value))} type="number" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="volatility">Implied Volatility (%)</Label>
              <Input id="volatility" value={volatility} onChange={(e) => setVolatility(Number(e.target.value))} type="number" />
               <Slider value={[volatility]} onValueChange={(vals) => setVolatility(vals[0])} max={100} step={1} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estimated Margin Breakdown</CardTitle>
            <CardDescription>
              A conceptual breakdown for a {positionType} {optionType} option position.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="space-y-1 rounded-md bg-muted/50 p-4">
                <p className="text-muted-foreground text-sm">Contract Value</p>
                <p className="text-3xl font-bold">{formatCurrency(results.contractValue)}</p>
              </div>
              <div className="space-y-1 rounded-md bg-primary/10 p-4">
                <p className="text-muted-foreground text-sm">Total Margin</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.totalMargin)}</p>
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-muted-foreground">Option Premium {positionType === 'long' ? 'Paid' : 'Received'}</span>
                <span className="font-semibold">{formatCurrency(results.optionPremium)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-muted-foreground">SPAN Margin (Conceptual)</span>
                <span className="font-semibold">{formatCurrency(results.spanMargin)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-muted-foreground">Exposure Margin (Conceptual)</span>
                <span className="font-semibold">{formatCurrency(results.exposureMargin)}</span>
              </div>
            </div>
            <CardDescription className="pt-4 text-xs">
              Disclaimer: This is a highly simplified, educational model and does NOT represent actual exchange margin requirements. SPAN margin is a complex portfolio-based calculation. Use for conceptual understanding only.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
