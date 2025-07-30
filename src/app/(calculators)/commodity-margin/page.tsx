"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/formatters"
import { calculateCommodityMargin, type CommodityMarginResult } from "@/lib/calculations"
import Link from "next/link"
import { ArrowLeft, CandlestickChart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CommodityMarginCalculatorPage() {
  const [commodityPrice, setCommodityPrice] = useState(5000)
  const [lotSize, setLotSize] = useState(100)
  const [spanFactor, setSpanFactor] = useState(10) // SPAN as % of contract value
  const [exposureFactor, setExposureFactor] = useState(5) // Exposure as % of contract value

  const results: CommodityMarginResult = useMemo(() => {
    return calculateCommodityMargin({ commodityPrice, lotSize, spanFactor, exposureFactor })
  }, [commodityPrice, lotSize, spanFactor, exposureFactor])

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
            <CandlestickChart /> Commodity Margin Calculator
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Estimate margin for commodity futures (conceptual).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="commodity-price">Commodity Price</Label>
              <Input id="commodity-price" value={commodityPrice} onChange={(e) => setCommodityPrice(Number(e.target.value))} type="number" />
              <Slider value={[commodityPrice]} onValueChange={(vals) => setCommodityPrice(vals[0])} max={20000} step={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lot-size">Lot Size</Label>
              <Input id="lot-size" value={lotSize} onChange={(e) => setLotSize(Number(e.target.value))} type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="span-factor">SPAN Factor (%)</Label>
              <Input id="span-factor" value={spanFactor} onChange={(e) => setSpanFactor(Number(e.target.value))} type="number" />
              <Slider value={[spanFactor]} onValueChange={(vals) => setSpanFactor(vals[0])} max={30} step={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exposure-factor">Exposure Factor (%)</Label>
              <Input id="exposure-factor" value={exposureFactor} onChange={(e) => setExposureFactor(Number(e.target.value))} type="number" />
              <Slider value={[exposureFactor]} onValueChange={(vals) => setExposureFactor(vals[0])} max={15} step={0.5} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estimated Margin Breakdown</CardTitle>
            <CardDescription>
              A conceptual breakdown for a commodity futures contract.
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
              Disclaimer: This is a simplified calculation for educational purposes. Actual margin requirements are set by the exchange (MCX/NCDEX) and can vary based on volatility and other factors.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
