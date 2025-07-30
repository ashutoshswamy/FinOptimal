
"use client"

import { useState, useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/formatters"
import { calculateNps, type NPSResult } from "@/lib/calculations"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const COLORS = ['hsl(var(--muted-foreground))', 'hsl(var(--primary))'];

export default function NpsCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000)
  const [currentAge, setCurrentAge] = useState(25)
  const [retirementAge, setRetirementAge] = useState(60)
  const [returnRate, setReturnRate] = useState(10)
  const [annuityPercentage, setAnnuityPercentage] = useState(40)
  const [annuityRate, setAnnuityRate] = useState(6)

  const results: NPSResult = useMemo(() => {
    return calculateNps({
      monthlyInvestment,
      currentAge,
      retirementAge,
      returnRate,
      annuityPercentage,
      annuityRate
    })
  }, [monthlyInvestment, currentAge, retirementAge, returnRate, annuityPercentage, annuityRate])

  const chartData = [
    { name: 'Total Investment', value: results.totalInvestment },
    { name: 'Total Interest', value: results.totalInterest },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline">NPS Calculator</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Estimate your National Pension Scheme returns.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="monthly-investment">Monthly Investment</Label>
              <Input id="monthly-investment" value={formatCurrency(monthlyInvestment)} onChange={(e) => setMonthlyInvestment(Number(e.target.value.replace(/[^0-9]/g, '')))} />
              <Slider value={[monthlyInvestment]} onValueChange={(vals) => setMonthlyInvestment(vals[0])} max={50000} step={1000} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-age">Current Age</Label>
              <Input id="current-age" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} type="number" />
              <Slider value={[currentAge]} onValueChange={(vals) => setCurrentAge(vals[0])} max={59} min={18} step={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-rate">Expected Return Rate (%)</Label>
              <Input id="return-rate" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} type="number" />
              <Slider value={[returnRate]} onValueChange={(vals) => setReturnRate(vals[0])} max={15} step={0.5} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="annuity-percentage">Percentage to Purchase Annuity (%)</Label>
              <Input id="annuity-percentage" value={annuityPercentage} onChange={(e) => setAnnuityPercentage(Number(e.target.value))} type="number" />
              <Slider value={[annuityPercentage]} onValueChange={(vals) => setAnnuityPercentage(vals[0])} min={40} max={100} step={5} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="annuity-rate">Annuity Rate (%)</Label>
              <Input id="annuity-rate" value={annuityRate} onChange={(e) => setAnnuityRate(Number(e.target.value))} type="number" />
              <Slider value={[annuityRate]} onValueChange={(vals) => setAnnuityRate(vals[0])} max={10} step={0.5} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Retirement Corpus Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2 h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                    {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend wrapperStyle={{fontSize: '0.8rem', marginTop: '16px'}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Total Investment</span>
                  <span className="font-semibold text-base sm:text-lg">{formatCurrency(results.totalInvestment)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Total Interest</span>
                  <span className="font-semibold text-base sm:text-lg text-primary">{formatCurrency(results.totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center text-lg sm:text-xl">
                  <span className="text-foreground">Total Corpus</span>
                  <span className="font-bold text-primary">{formatCurrency(results.totalCorpus)}</span>
              </div>
            </div>
          </CardContent>
           <CardHeader>
            <CardTitle>Post-Retirement Projection</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="space-y-1 rounded-md bg-muted/50 p-3">
                <p className="text-muted-foreground text-sm">Lump Sum Withdrawal</p>
                <p className="text-2xl font-bold">{formatCurrency(results.lumpSumValue)}</p>
            </div>
            <div className="space-y-1 rounded-md bg-muted/50 p-3">
                <p className="text-muted-foreground text-sm">Expected Monthly Pension</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(results.monthlyPension)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
