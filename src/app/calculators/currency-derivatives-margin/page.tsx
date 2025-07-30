
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/formatters"
import { calculateCurrencyDerivativesMargin, type CurrencyDerivativesMarginResult } from "@/lib/calculations"
import Link from "next/link"
import { ArrowLeft, CircleDollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CurrencyDerivativesMarginCalculatorPage() {
  const [usdinrPrice, setUsdinrPrice] = useState(83.5)
  const [lotSize, setLotSize] = useState(1000) // USD 1000
  const [spanPercent, setSpanPercent] = useState(2)
  const [exposurePercent, setExposurePercent] = useState(1)

  const results: CurrencyDerivativesMarginResult = useMemo(() => {
    return calculateCurrencyDerivativesMargin({ usdinrPrice, lotSize, spanPercent, exposurePercent })
  }, [usdinrPrice, lotSize, spanPercent, exposurePercent])

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
            <CircleDollarSign /> Currency Derivatives Margin
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Conceptually estimate margin for USD/INR futures.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="usdinr-price">USD/INR Price</Label>
              <Input id="usdinr-price" value={usdinrPrice} onChange={(e) => setUsdinrPrice(Number(e.target.value))} type="number" step="0.01" />
              <Slider value={[usdinrPrice]} onValueChange={(vals) => setUsdinrPrice(vals[0])} min={70} max={90} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lot-size">Lot Size (in USD)</Label>
              <Input id="lot-size" value={lotSize} onChange={(e) => setLotSize(Number(e.target.value))} type="number" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="span-percent">SPAN Margin (%)</Label>
              <Input id="span-percent" value={spanPercent} onChange={(e) => setSpanPercent(Number(e.target.value))} type="number" step="0.1" />
              <Slider value={[spanPercent]} onValueChange={(vals) => setSpanPercent(vals[0])} max={5} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exposure-percent">Exposure Margin (%)</Label>
              <Input id="exposure-percent" value={exposurePercent} onChange={(e) => setExposurePercent(Number(e.target.value))} type="number" step="0.1" />
              <Slider value={[exposurePercent]} onValueChange={(vals) => setExposurePercent(vals[0])} max={5} step={0.1} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estimated Margin Breakdown</CardTitle>
            <CardDescription>
              A conceptual breakdown for a single USD/INR futures lot.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="space-y-1 rounded-md bg-muted/50 p-4">
                <p className="text-muted-foreground text-sm">Contract Value</p>
                <p className="text-3xl font-bold">{formatCurrency(results.contractValue)}</p>
              </div>
              <div className="space-y-1 rounded-md bg-primary/10 p-4">
                <p className="text-muted-foreground text-sm">Total Margin Required</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.totalMargin)}</p>
              </div>
            </div>
            <div className="space-y-3 pt-4">
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
              Disclaimer: This is a simplified calculation for educational purposes. Actual margin requirements are set by the exchange (NSE/BSE) and can vary based on volatility and other factors.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
