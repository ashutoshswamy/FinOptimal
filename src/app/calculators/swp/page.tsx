
"use client"

import { useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/formatters"
import { calculateSwp, type SWPResult } from "@/lib/calculations"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SwpCalculatorPage() {
  const [totalInvestment, setTotalInvestment] = useState(1000000)
  const [withdrawalPerMonth, setWithdrawalPerMonth] = useState(8000)
  const [returnRate, setReturnRate] = useState(8)
  const [tenure, setTenure] = useState(10)

  const results: SWPResult = useMemo(() => {
    return calculateSwp(totalInvestment, withdrawalPerMonth, returnRate, tenure)
  }, [totalInvestment, withdrawalPerMonth, returnRate, tenure])

  const chartData = results.breakdown.map(item => ({
    name: `Year ${item.year}`,
    "Final Balance": item.balance,
  }));

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline">SWP Calculator</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Plan your systematic withdrawals.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="total-investment">Total Investment</Label>
              <Input id="total-investment" value={formatCurrency(totalInvestment)} onChange={(e) => setTotalInvestment(Number(e.target.value.replace(/[^0-9]/g, '')))} />
              <Slider value={[totalInvestment]} onValueChange={(vals) => setTotalInvestment(vals[0])} max={50000000} step={100000} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdrawal-per-month">Withdrawal per Month</Label>
              <Input id="withdrawal-per-month" value={formatCurrency(withdrawalPerMonth)} onChange={(e) => setWithdrawalPerMonth(Number(e.target.value.replace(/[^0-9]/g, '')))} />
              <Slider value={[withdrawalPerMonth]} onValueChange={(vals) => setWithdrawalPerMonth(vals[0])} max={100000} step={1000} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-rate">Expected Annual Return (%)</Label>
              <Input id="return-rate" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} type="number" />
              <Slider value={[returnRate]} onValueChange={(vals) => setReturnRate(vals[0])} max={20} step={0.5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenure">Time Period (Years)</Label>
              <Input id="tenure" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} type="number" />
              <Slider value={[tenure]} onValueChange={(vals) => setTenure(vals[0])} max={30} step={1} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Projections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
              <div className="space-y-1 rounded-md bg-muted/50 p-2">
                <p className="text-muted-foreground text-xs sm:text-sm">Total Withdrawn</p>
                <p className="text-xl sm:text-2xl font-bold">{formatCurrency(results.totalWithdrawal)}</p>
              </div>
              <div className="space-y-1 rounded-md bg-muted/50 p-2">
                <p className="text-muted-foreground text-xs sm:text-sm">Total Interest</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{formatCurrency(results.totalInterest)}</p>
              </div>
              <div className="space-y-1 rounded-md bg-muted/50 p-2">
                <p className="text-muted-foreground text-xs sm:text-sm">Final Value</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{formatCurrency(results.finalBalance)}</p>
              </div>
            </div>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(Number(value))} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '16px' }} />
                  <Line type="monotone" dataKey="Final Balance" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
