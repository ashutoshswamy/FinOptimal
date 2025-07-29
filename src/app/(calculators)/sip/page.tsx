"use client"

import { useState, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/formatters"
import { calculateSip, type SIPResult } from "@/lib/calculations"

export default function SipCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000)
  const [investmentPeriod, setInvestmentPeriod] =useState(10)
  const [returnRate, setReturnRate] = useState(12)

  const results: SIPResult = useMemo(() => {
    return calculateSip(monthlyInvestment, investmentPeriod, returnRate)
  }, [monthlyInvestment, investmentPeriod, returnRate])

  const chartData = results.breakdown.map(item => ({
    name: `Year ${item.year}`,
    "Total Investment": item.invested,
    "Estimated Returns": item.returns,
  }));

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">SIP Calculator</h1>
            <p className="text-muted-foreground">Estimate the future value of your monthly investments.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="monthly-investment">Monthly Investment</Label>
                        <Input id="monthly-investment" value={formatCurrency(monthlyInvestment)} onChange={(e) => setMonthlyInvestment(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                        <Slider value={[monthlyInvestment]} onValueChange={(vals) => setMonthlyInvestment(vals[0])} max={100000} step={1000} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="investment-period">Investment Period (Years)</Label>
                        <Input id="investment-period" value={investmentPeriod} onChange={(e) => setInvestmentPeriod(Number(e.target.value))} type="number" />
                        <Slider value={[investmentPeriod]} onValueChange={(vals) => setInvestmentPeriod(vals[0])} max={40} step={1} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="return-rate">Expected Return Rate (% p.a.)</Label>
                        <Input id="return-rate" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} type="number" />
                        <Slider value={[returnRate]} onValueChange={(vals) => setReturnRate(vals[0])} max={30} step={0.5} />
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Projections</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
                        <div>
                            <p className="text-muted-foreground">Total Investment</p>
                            <p className="text-2xl font-bold">{formatCurrency(results.totalInvestment)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Est. Returns</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(results.estimatedReturns)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Total Value</p>
                            <p className="text-2xl font-bold text-primary">{formatCurrency(results.totalValue)}</p>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => formatCurrency(Number(value))}/>
                                <Tooltip formatter={(value) => formatCurrency(Number(value))}/>
                                <Legend />
                                <Bar dataKey="Total Investment" stackId="a" fill="hsl(var(--muted-foreground))" />
                                <Bar dataKey="Estimated Returns" stackId="a" fill="hsl(var(--primary))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Year-wise Breakdown</CardTitle>
                <CardDescription>A detailed look at your investment growth over time.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Year</TableHead>
                            <TableHead>Total Investment</TableHead>
                            <TableHead>Est. Returns</TableHead>
                            <TableHead className="text-right">Total Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.breakdown.map((row) => (
                            <TableRow key={row.year}>
                                <TableCell className="font-medium">{row.year}</TableCell>
                                <TableCell>{formatCurrency(row.invested)}</TableCell>
                                <TableCell>{formatCurrency(row.returns)}</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(row.total)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}
