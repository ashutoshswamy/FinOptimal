
"use client"

import { useState, useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/formatters"
import { calculateEmi, type EMIResult } from "@/lib/calculations"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
            <Link href="/">
                <ArrowLeft />
            </Link>
        </Button>
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline">EMI Calculator</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Calculate your Equated Monthly Installment (EMI).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="loan-amount">Loan Amount</Label>
              <Input id="loan-amount" value={formatCurrency(loanAmount)} onChange={(e) => setLoanAmount(Number(e.target.value.replace(/[^0-9]/g, '')))} />
              <Slider value={[loanAmount]} onValueChange={(vals) => setLoanAmount(vals[0])} max={20000000} step={100000} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-rate">Interest Rate (% p.a.)</Label>
              <Input id="interest-rate" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} type="number" />
              <Slider value={[interestRate]} onValueChange={(vals) => setInterestRate(vals[0])} max={20} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenure">Loan Tenure (Years)</Label>
              <Input id="tenure" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} type="number" />
              <Slider value={[tenure]} onValueChange={(vals) => setTenure(vals[0])} max={30} step={1} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-grow flex-col items-center justify-center gap-6 text-center">
             <div className="text-2xl sm:text-3xl md:text-4xl">
                <p className="text-sm font-medium text-muted-foreground">Monthly EMI</p>
                <p className="font-bold text-primary">{formatCurrency(results.monthlyEMI)}</p>
              </div>
            <div className="w-full h-[200px]">
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
                  <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend iconSize={14} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                <div className="space-y-1 rounded-md bg-muted/50 p-2">
                    <p className="text-muted-foreground text-xs sm:text-sm">Principal Amount</p>
                    <p className="text-lg sm:text-xl font-bold">{formatCurrency(loanAmount)}</p>
                </div>
                <div className="space-y-1 rounded-md bg-muted/50 p-2">
                    <p className="text-muted-foreground text-xs sm:text-sm">Total Interest</p>
                    <p className="text-lg sm:text-xl font-bold text-primary">{formatCurrency(results.totalInterest)}</p>
                </div>
                <div className="space-y-1 rounded-md bg-muted/50 p-2">
                    <p className="text-muted-foreground text-xs sm:text-sm">Total Payment</p>
                    <p className="text-lg sm:text-xl font-bold text-primary">{formatCurrency(results.totalPayment)}</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Amortization Schedule</CardTitle>
          <CardDescription>A month-by-month breakdown of your loan repayment.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-1/5">Month</TableHead>
                  <TableHead className="w-1/5 text-right">Principal</TableHead>
                  <TableHead className="w-1/5 text-right">Interest</TableHead>
                  <TableHead className="w-1/5 text-right">EMI</TableHead>
                  <TableHead className="w-1/5 text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.amortization.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.principal)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.interest)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.totalPayment)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(row.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
