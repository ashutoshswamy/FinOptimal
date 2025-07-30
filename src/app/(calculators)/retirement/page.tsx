"use client"

import { useState, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/formatters"
import { calculateRetirement } from "@/lib/calculations"

export default function RetirementCalculatorPage() {
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(60)
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000)
  const [currentSavings, setCurrentSavings] = useState(1000000)
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000)
  const [preRetirementRate, setPreRetirementRate] = useState(12)
  const [postRetirementRate, setPostRetirementRate] = useState(6)
  const [inflationRate, setInflationRate] = useState(6)
  const [lifeExpectancy, setLifeExpectancy] = useState(85)


  const results = useMemo(() => {
    return calculateRetirement({
      currentAge,
      retirementAge,
      monthlyExpenses,
      currentSavings,
      monthlyInvestment,
      preRetirementRate,
      postRetirementRate,
      inflationRate,
      lifeExpectancy,
    })
  }, [currentAge, retirementAge, monthlyExpenses, currentSavings, monthlyInvestment, preRetirementRate, postRetirementRate, inflationRate, lifeExpectancy])

  const chartData = [
    { name: 'Required', value: results.corpusRequired },
    { name: 'Projected', value: results.corpusProjected },
  ]
  const isShortfall = results.corpusProjected < results.corpusRequired;

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-headline">Retirement Calculator</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Plan for your golden years and see if you're on track.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-age">Current Age</Label>
              <Input id="current-age" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} type="number" />
              <Slider value={[currentAge]} onValueChange={(vals) => setCurrentAge(vals[0])} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retirement-age">Retirement Age</Label>
              <Input id="retirement-age" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} type="number" />
               <Slider value={[retirementAge]} onValueChange={(vals) => setRetirementAge(vals[0])} max={100} step={1} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="life-expectancy">Life Expectancy</Label>
              <Input id="life-expectancy" value={lifeExpectancy} onChange={(e) => setLifeExpectancy(Number(e.target.value))} type="number" />
              <Slider value={[lifeExpectancy]} onValueChange={(vals) => setLifeExpectancy(vals[0])} max={120} step={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-expenses">Current Monthly Expenses</Label>
              <Input id="monthly-expenses" value={formatCurrency(monthlyExpenses)} onChange={(e) => setMonthlyExpenses(Number(e.target.value.replace(/[^0-9]/g, '')))} />
               <Slider value={[monthlyExpenses]} onValueChange={(vals) => setMonthlyExpenses(vals[0])} max={200000} step={5000} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="current-savings">Current Retirement Savings</Label>
              <Input id="current-savings" value={formatCurrency(currentSavings)} onChange={(e) => setCurrentSavings(Number(e.target.value.replace(/[^0-9]/g, '')))} />
              <Slider value={[currentSavings]} onValueChange={(vals) => setCurrentSavings(vals[0])} max={10000000} step={100000} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-investment">Monthly Investment for Retirement</Label>
              <Input id="monthly-investment" value={formatCurrency(monthlyInvestment)} onChange={(e) => setMonthlyInvestment(Number(e.target.value.replace(/[^0-9]/g, '')))} />
               <Slider value={[monthlyInvestment]} onValueChange={(vals) => setMonthlyInvestment(vals[0])} max={200000} step={5000} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pre-retirement-rate">Pre-Retirement Return Rate (% p.a.)</Label>
              <Input id="pre-retirement-rate" value={preRetirementRate} onChange={(e) => setPreRetirementRate(Number(e.target.value))} type="number" />
              <Slider value={[preRetirementRate]} onValueChange={(vals) => setPreRetirementRate(vals[0])} max={25} step={0.5} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="post-retirement-rate">Post-Retirement Return Rate (% p.a.)</Label>
              <Input id="post-retirement-rate" value={postRetirementRate} onChange={(e) => setPostRetirementRate(Number(e.target.value))} type="number" />
              <Slider value={[postRetirementRate]} onValueChange={(vals) => setPostRetirementRate(vals[0])} max={15} step={0.5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inflation-rate">Expected Inflation Rate (% p.a.)</Label>
              <Input id="inflation-rate" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} type="number" />
              <Slider value={[inflationRate]} onValueChange={(vals) => setInflationRate(vals[0])} max={10} step={0.5} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Retirement Projection</CardTitle>
            <CardDescription>
              {isShortfall
                ? "You are currently projected to have a shortfall in your retirement savings."
                : "You are on track to meet your retirement goals. Well done!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2 space-y-4">
                <div className="space-y-1 rounded-md bg-muted/50 p-3">
                    <p className="text-muted-foreground text-sm">Monthly Expenses at Retirement</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.monthlyExpensesAtRetirement)}</p>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm text-muted-foreground">Corpus Required</span>
                    <span className="font-semibold text-lg">{formatCurrency(results.corpusRequired)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-sm text-muted-foreground">Corpus Projected</span>
                    <span className="font-semibold text-lg">{formatCurrency(results.corpusProjected)}</span>
                </div>
                 <div className={`flex justify-between items-center rounded-lg p-3 ${isShortfall ? 'bg-destructive/20' : 'bg-primary/10'}`}>
                    <span className="font-semibold">{isShortfall ? "Shortfall" : "Surplus"}</span>
                    <span className={`font-bold text-xl ${isShortfall ? 'text-destructive' : 'text-primary'}`}>{formatCurrency(results.difference)}</span>
                </div>
            </div>
            <div className="w-full md:w-1/2 h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" barSize={40}>
                        <Cell fill="hsl(var(--muted-foreground))" />
                        <Cell fill={isShortfall ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} />
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
           <CardHeader>
            <CardTitle>How to bridge the gap?</CardTitle>
            <CardDescription>
              If you have a shortfall, you can consider increasing your monthly investment. To reach your goal, you would need to invest an additional
              <span className="font-bold text-primary"> {formatCurrency(results.additionalMonthlyInvestmentNeeded)} </span>
               per month.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
