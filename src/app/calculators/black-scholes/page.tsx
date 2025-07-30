
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/formatters"
import { calculateBlackScholes, type BlackScholesResult } from "@/lib/calculations"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { ArrowLeft, Sigma } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BlackScholesPage() {
  const [stockPrice, setStockPrice] = useState(100)
  const [strikePrice, setStrikePrice] = useState(100)
  const [timeToExpiry, setTimeToExpiry] = useState(0.25) // 3 months
  const [volatility, setVolatility] = useState(20)
  const [riskFreeRate, setRiskFreeRate] = useState(5)

  const results: BlackScholesResult = useMemo(() => {
    return calculateBlackScholes({ stockPrice, strikePrice, timeToExpiry, volatility, riskFreeRate })
  }, [stockPrice, strikePrice, timeToExpiry, volatility, riskFreeRate])

  const greeks = [
    { name: 'Delta', call: results.callDelta.toFixed(4), put: results.putDelta.toFixed(4) },
    { name: 'Gamma', value: results.gamma.toFixed(4) },
    { name: 'Vega', value: results.vega.toFixed(4) },
    { name: 'Theta (Daily)', value: results.theta.toFixed(4) },
    { name: 'Rho', value: results.rho.toFixed(4) },
  ]

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
            <Sigma /> Black-Scholes Calculator
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Calculate European option prices and Greeks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Option Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="stock-price">Stock Price (S)</Label>
              <Input id="stock-price" value={stockPrice} onChange={(e) => setStockPrice(Number(e.target.value))} type="number" />
              <Slider value={[stockPrice]} onValueChange={(vals) => setStockPrice(vals[0])} max={500} step={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strike-price">Strike Price (K)</Label>
              <Input id="strike-price" value={strikePrice} onChange={(e) => setStrikePrice(Number(e.target.value))} type="number" />
              <Slider value={[strikePrice]} onValueChange={(vals) => setStrikePrice(vals[0])} max={500} step={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-to-expiry">Time to Expiry (Years)</Label>
              <Input id="time-to-expiry" value={timeToExpiry} onChange={(e) => setTimeToExpiry(Number(e.target.value))} type="number" step="0.01" />
              <Slider value={[timeToExpiry]} onValueChange={(vals) => setTimeToExpiry(vals[0])} max={2} step={0.01} />
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

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Option Prices</CardTitle>
              <CardDescription>Theoretical prices for Call and Put options.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="space-y-1 rounded-md bg-primary/10 p-4">
                <p className="text-muted-foreground text-sm">Call Option Price</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.callPrice)}</p>
              </div>
              <div className="space-y-1 rounded-md bg-destructive/10 p-4">
                <p className="text-muted-foreground text-sm">Put Option Price</p>
                <p className="text-3xl font-bold text-destructive">{formatCurrency(results.putPrice)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Option Greeks</CardTitle>
              <CardDescription>Measures of sensitivity to different risk factors.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Greek</TableHead>
                    <TableHead>Call Value</TableHead>
                    <TableHead>Put Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {greeks.map((greek) => (
                    <TableRow key={greek.name}>
                      <TableCell className="font-semibold">{greek.name}</TableCell>
                      <TableCell>{greek.call ?? greek.value}</TableCell>
                      <TableCell>{greek.put ?? 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
