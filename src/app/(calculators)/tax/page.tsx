"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction } from "lucide-react"

export default function TaxCalculatorPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Tax Calculator</h1>
        <p className="text-muted-foreground">Calculate your income tax liability under old and new regimes.</p>
      </div>
      <Card className="flex flex-col items-center justify-center text-center py-20">
        <CardHeader>
          <Construction className="h-16 w-16 mx-auto text-muted-foreground" />
          <CardTitle className="mt-4">Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This calculator is currently under construction. Please check back later.</p>
        </CardContent>
      </Card>
    </div>
  )
}
