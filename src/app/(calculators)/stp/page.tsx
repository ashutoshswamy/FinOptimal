"use client"

import { useState, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/formatters"
import { calculateStp, type STPResult } from "@/lib/calculations"
import Link from "next/link"
import { ArrowLeft, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StpCalculatorPage() {
  const [lumpSumAmount, setLumpSumAmount] = useState(500000)
  const [monthlyTransferAmount, setMonthlyTransferAmount] = useState(20000)
  const [transferPeriodYears, setTransferPeriodYears] = useState(2)
  const [equityFundReturn, setEquityFundReturn] = useState(12)
  const [debtFundReturn, setDebtFundReturn] = useState(7)

  const results: STPResult = useMemo(() => {
    return calculateStp(lumpSumAmount, monthlyTransferAmount, transferPeriodYears, equityFundReturn, debtFundReturn)
  }, [lumpSumAmount, monthlyTransferAmount, transferPeriodYears, equityFundReturn, debtFundReturn])

  const chartData = results.breakdown.map(item => ({
    name: `Year ${item.year}`,
    "Value in Equity": item.valueInEquity,
    "Value in Debt": item.valueInDebt,
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
          <h1 className="text-2xl sm:text-3xl font-bold font-headline flex items-center gap-2">
            <Repeat /> STP Calculator
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Plan your Systematic Transfer Plan.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="lump-sum-amount">Lump Sum Amount</Label>
              <Input id="lump-sum-amount" value={formatCurrency(lumpSumAmount)} onChange={(e) => setLumpSumAmount(Number(e.target.value.replace(/[^0-9]/g, '')))} />
              <Slider value={[lumpSumAmount]} onValueChange={(vals) => setLumpSumAmount(vals[0])} max={5000000} step={50000} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-transfer">Monthly Transfer Amount</Label>
              <Input id="monthly-transfer" value={formatCurrency(monthlyTransferAmount)} onChange={(e) => setMonthlyTransferAmount(Number(e.target.value.replace(/[^0-9]/g, '')))} />
              <Slider value={[monthlyTransferAmount]} onValueChange={(vals) => setMonthlyTransferAmount(vals[0])} max={100000} step={1000} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transfer-period">Transfer Period (Years)</Label>
              <Input id="transfer-period" value={transferPeriodYears} onChange={(e) => setTransferPeriodYears(Number(e.target.value))} type="number" />
              <Slider value={[transferPeriodYears]} onValueChange={(vals) => setTransferPeriodYears(vals[0])} max={10} step={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equity-return">Expected Equity Return (% p.a.)</Label>
              <Input id="equity-return" value={equityFundReturn} onChange={(e) => setEquityFundReturn(Number(e.target.value))} type="number" />
              <Slider value={[equityFundReturn]} onValueChange={(vals) => setEquityFundReturn(vals[0])} max={30} step={0.5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="debt-return">Expected Debt Fund Return (% p.a.)</Label>
              <Input id="debt-return" value={debtFundReturn} onChange={(e) => setDebtFundReturn(Number(e.target.value))} type="number" />
              <Slider value={[debtFundReturn]} onValueChange={(vals) => setDebtFundReturn(vals[0])} max={15} step={0.5} />
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
                <p className="text-muted-foreground text-xs sm:text-sm">Total Transferred</p>
                <p className="text-xl sm:text-2xl font-bold">{formatCurrency(results.totalTransferred)}</p>
              </div>
              <div className="space-y-1 rounded-md bg-muted/50 p-2">
                <p className="text-muted-foreground text-xs sm:text-sm">Total Gains</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{formatCurrency(results.totalGains)}</p>
              </div>
              <div className="space-y-1 rounded-md bg-muted/50 p-2">
                <p className="text-muted-foreground text-xs sm:text-sm">Final Value</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{formatCurrency(results.finalValueOfInvestment)}</p>
              </div>
            </div>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} stackOffset="sign">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(Number(value))} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '16px' }} />
                  <Bar dataKey="Value in Equity" stackId="a" fill="hsl(var(--primary))" />
                  <Bar dataKey="Value in Debt" stackId="a" fill="hsl(var(--muted-foreground))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
