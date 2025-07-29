"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency } from "@/lib/formatters"
import { calculateEmi, type EMIResult } from "@/lib/calculations"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))'];

export default function EmiCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(2500000)
  const [interestRate, setInterestRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const results: EMIResult = useMemo(() => {
    return calculateEmi(loanAmount, interestRate, tenure)
  }, [loanAmount, interestRate, tenure])
  
  const chartData = [
    { name: 'Principal Amount', value: loanAmount },
    { name: 'Total Interest', value: results.totalInterest },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold font-headline">EMI Calculator</h1>
        <p className="text-muted-foreground">Calculate your monthly loan payments and see the full amortization schedule.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-10">
            <Card>
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-3">
                        <Label htmlFor="loan-amount">Loan Amount</Label>
                        <Input id="loan-amount" value={formatCurrency(loanAmount)} onChange={(e) => setLoanAmount(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                        <Slider value={[loanAmount]} onValueChange={(vals) => setLoanAmount(vals[0])} max={20000000} step={100000} />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="interest-rate">Interest Rate (% p.a.)</Label>
                        <Input id="interest-rate" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} type="number" />
                        <Slider value={[interestRate]} onValueChange={(vals) => setInterestRate(vals[0])} max={20} step={0.1} />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                        <Input id="tenure" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} type="number" />
                        <Slider value={[tenure]} onValueChange={(vals) => setTenure(vals[0])} max={30} step={1} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <p className="text-muted-foreground">Monthly EMI</p>
                        <p className="text-4xl font-bold text-primary">{formatCurrency(results.monthlyEMI)}</p>
                    </div>
                     <div className="w-full h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(Number(value))}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Principal Amount</span>
                            <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Interest</span>
                            <span className="font-semibold">{formatCurrency(results.totalInterest)}</span>
                        </div>
                         <div className="flex justify-between items-center font-bold text-lg border-t pt-2 mt-2">
                            <span className="text-foreground">Total Payment</span>
                            <span className="text-primary">{formatCurrency(results.totalPayment)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Amortization Schedule</CardTitle>
            <CardDescription>A month-by-month breakdown of your loan repayment.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.amortization.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{formatCurrency(row.principal)}</TableCell>
                      <TableCell>{formatCurrency(row.interest)}</TableCell>
                      <TableCell>{formatCurrency(row.balance)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
