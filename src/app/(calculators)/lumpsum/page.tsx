"use client"

import { useState, useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/formatters"
import { calculateLumpsum, type LumpsumResult } from "@/lib/calculations"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"


const COLORS = ['hsl(var(--muted-foreground))', 'hsl(var(--primary))'];

export default function LumpsumCalculatorPage() {
  const [principal, setPrincipal] = useState(100000)
  const [period, setPeriod] = useState(10)
  const [returnRate, setReturnRate] = useState(12)

  const results: LumpsumResult = useMemo(() => {
    return calculateLumpsum(principal, period, returnRate)
  }, [principal, period, returnRate])

  const chartData = [
    { name: 'Total Investment', value: results.totalInvestment },
    { name: 'Estimated Returns', value: results.estimatedReturns },
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
                <h1 className="text-2xl sm:text-3xl font-bold font-headline">Lumpsum Calculator</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Calculate the future value of a one-time investment.</p>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="principal">Total Investment</Label>
                        <Input id="principal" value={formatCurrency(principal)} onChange={(e) => setPrincipal(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                        <Slider value={[principal]} onValueChange={(vals) => setPrincipal(vals[0])} max={10000000} step={10000} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="period">Investment Period (Years)</Label>
                        <Input id="period" value={period} onChange={(e) => setPeriod(Number(e.target.value))} type="number" />
                        <Slider value={[period]} onValueChange={(vals) => setPeriod(vals[0])} max={40} step={1} />
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
                    <CardDescription>
                        Your investment of <span className="font-bold text-foreground">{formatCurrency(results.totalInvestment)}</span> could grow to
                        <span className="font-bold text-primary"> {formatCurrency(results.totalValue)}</span> in {period} years.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-1/2 h-[200px] sm:h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
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
                            <span className="text-sm text-muted-foreground">Estimated Returns</span>
                            <span className="font-semibold text-base sm:text-lg text-primary">{formatCurrency(results.estimatedReturns)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg sm:text-xl">
                            <span className="text-foreground">Total Value</span>
                            <span className="font-bold text-primary">{formatCurrency(results.totalValue)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
