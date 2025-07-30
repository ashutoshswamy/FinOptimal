
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/formatters"
import { calculateEquityFutures, type EquityFuturesResult } from "@/lib/calculations"
import Link from "next/link"
import { ArrowLeft, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

export default function EquityFuturesCalculatorPage() {
  const [entryPrice, setEntryPrice] = useState(18000)
  const [exitPrice, setExitPrice] = useState(18100)
  const [lotSize, setLotSize] = useState(50)
  const [marginPercent, setMarginPercent] = useState(15)

  const results: EquityFuturesResult = useMemo(() => {
    return calculateEquityFutures({ entryPrice, exitPrice, lotSize, marginPercent })
  }, [entryPrice, exitPrice, lotSize, marginPercent])
  
  const isProfit = results.realizedPandL > 0;

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
            <LineChart /> Equity Futures Calculator
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Calculate potential profit or loss for futures contracts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Futures Trade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="entry-price">Entry Price</Label>
              <Input id="entry-price" value={entryPrice} onChange={(e) => setEntryPrice(Number(e.target.value))} type="number" />
              <Slider value={[entryPrice]} onValueChange={(vals) => setEntryPrice(vals[0])} max={50000} step={50} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exit-price">Exit Price</Label>
              <Input id="exit-price" value={exitPrice} onChange={(e) => setExitPrice(Number(e.target.value))} type="number" />
              <Slider value={[exitPrice]} onValueChange={(vals) => setExitPrice(vals[0])} max={50000} step={50} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lot-size">Lot Size</Label>
              <Input id="lot-size" value={lotSize} onChange={(e) => setLotSize(Number(e.target.value))} type="number" />
               <Slider value={[lotSize]} onValueChange={(vals) => setLotSize(vals[0])} max={200} step={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="margin-percent">Margin Requirement (%)</Label>
              <Input id="margin-percent" value={marginPercent} onChange={(e) => setMarginPercent(Number(e.target.value))} type="number" />
               <Slider value={[marginPercent]} onValueChange={(vals) => setMarginPercent(vals[0])} max={50} step={1} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Trade Summary</CardTitle>
             <CardDescription>
                Based on your trade details, here is the estimated P&L and margin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm text-muted-foreground">Contract Value</span>
                        <span className="font-bold text-lg">{formatCurrency(results.contractValue)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm text-muted-foreground">Required Margin</span>
                        <span className="font-bold text-lg">{formatCurrency(results.requiredMargin)}</span>
                    </div>
                     <Separator />
                     <div className="flex justify-between items-baseline pt-2">
                        <span className="text-base font-semibold">Realized P&L</span>
                        <span className={`font-bold text-xl ${isProfit ? 'text-primary' : 'text-destructive'}`}>
                            {formatCurrency(results.realizedPandL)}
                        </span>
                    </div>
                </div>
                <div className="space-y-2 rounded-lg bg-muted/50 p-4 text-center">
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Points Captured</p>
                        <p className="text-3xl font-bold">{results.pointsCaptured}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Return on Margin</p>
                        <p className={`text-3xl font-bold ${isProfit ? 'text-primary' : 'text-destructive'}`}>{results.returnOnMargin.toFixed(2)}%</p>
                    </div>
                </div>
             </div>
             <CardDescription className="pt-4 text-xs">
                Note: This is a simplified calculation and does not include brokerage, taxes, or other statutory charges. Actual margin requirements are determined by the exchange (SPAN+Exposure) and can vary.
             </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
