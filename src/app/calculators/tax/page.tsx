
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { formatCurrency } from "@/lib/formatters"
import { calculateTax, type TaxResult } from "@/lib/calculations"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TaxCalculatorPage() {
  const [income, setIncome] = useState(1000000)
  const [deductions, setDeductions] = useState(150000)
  const [isSenior, setIsSenior] = useState(false)

  const { oldRegime, newRegime } = useMemo(() => {
    return calculateTax({ income, deductions, isSenior })
  }, [income, deductions, isSenior])

  const regimeChoice = newRegime.totalTax < oldRegime.totalTax ? "New" : "Old";

  const renderTaxSlabs = (slabs: {slab: string, tax: number}[]) => (
    <div className="space-y-2">
        {slabs.map((s, i) => (
             <div key={i} className="flex justify-between items-center border-b pb-1">
                <span className="text-xs text-muted-foreground">{s.slab}</span>
                <span className="text-sm font-mono">{formatCurrency(s.tax)}</span>
              </div>
        ))}
    </div>
  )

  const renderRegimeCard = (title: string, data: TaxResult) => (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title} Regime</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        {renderTaxSlabs(data.taxSlabs)}
      </CardContent>
      <CardHeader>
        <div className="flex justify-between items-baseline bg-muted/50 p-3 rounded-lg">
            <CardTitle className="text-base">Total Tax</CardTitle>
            <span className="font-bold text-xl text-primary">{formatCurrency(data.totalTax)}</span>
        </div>
      </CardHeader>
    </Card>
  )

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
            <Link href="/">
                <ArrowLeft />
            </Link>
        </Button>
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline">Income Tax Calculator</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Compare your tax liability under the old and new tax regimes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-1 space-y-6">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Your Income Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="income">Annual Income</Label>
                  <Input id="income" value={income} onChange={(e) => setIncome(Number(e.target.value))} type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deductions">Total Deductions (e.g., 80C, 80D)</Label>
                  <Input id="deductions" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} type="number" />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="is-senior" checked={isSenior} onCheckedChange={setIsSenior} />
                    <Label htmlFor="is-senior">Are you a Senior Citizen (60+ years)?</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recommendation</CardTitle>
                     <CardDescription>Based on your inputs, this regime seems more beneficial.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <p className="text-lg font-semibold">You should opt for the</p>
                        <p className="text-4xl font-bold text-primary">{regimeChoice} Regime</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Potential Savings: <span className="font-semibold text-foreground">{formatCurrency(Math.abs(oldRegime.totalTax - newRegime.totalTax))}</span>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>


        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderRegimeCard("Old", oldRegime)}
            {renderRegimeCard("New", newRegime)}
        </div>
      </div>
    </div>
  )
}
