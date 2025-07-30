"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatCurrency } from "@/lib/formatters"
import { calculateBrokerage, type BrokerageResult, type TransactionType } from "@/lib/calculations"
import { Separator } from "@/components/ui/separator"

export default function BrokerageCalculatorPage() {
  const [buyPrice, setBuyPrice] = useState(100)
  const [sellPrice, setSellPrice] = useState(110)
  const [quantity, setQuantity] = useState(100)
  const [brokerage, setBrokerage] = useState(0.05)
  const [transactionType, setTransactionType] = useState<TransactionType>("intraday")

  const results: BrokerageResult = useMemo(() => {
    return calculateBrokerage({ buyPrice, sellPrice, quantity, brokerage, type: transactionType })
  }, [buyPrice, sellPrice, quantity, brokerage, transactionType])

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-headline">Brokerage Calculator</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Estimate the charges for your equity trades.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Trade Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <RadioGroup value={transactionType} onValueChange={(val: TransactionType) => setTransactionType(val)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intraday" id="intraday" />
                  <Label htmlFor="intraday">Intraday</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">Delivery</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buy-price">Buy Price</Label>
              <Input id="buy-price" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sell-price">Sell Price</Label>
              <Input id="sell-price" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} type="number" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="brokerage">Brokerage (% of transaction)</Label>
              <Input id="brokerage" value={brokerage} onChange={(e) => setBrokerage(Number(e.target.value))} type="number" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profit & Loss Summary</CardTitle>
            <CardDescription>
                Based on your trade details, here is the estimated P&L.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm text-muted-foreground">Gross P&L</span>
                        <span className="font-bold text-lg">{formatCurrency(results.grossPandL)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm text-muted-foreground">Total Charges</span>
                        <span className="font-bold text-lg text-destructive">-{formatCurrency(results.totalCharges)}</span>
                    </div>
                     <Separator />
                     <div className="flex justify-between items-baseline pt-2">
                        <span className="text-base font-semibold">Net P&L</span>
                        <span className={`font-bold text-xl ${results.netPandL >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            {formatCurrency(results.netPandL)}
                        </span>
                    </div>
                </div>
                <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm text-muted-foreground">Buy Value</span>
                        <span className="font-semibold text-base">{formatCurrency(results.buyValue)}</span>
                    </div>
                     <div className="flex justify-between items-baseline">
                        <span className="text-sm text-muted-foreground">Sell Value</span>
                        <span className="font-semibold text-base">{formatCurrency(results.sellValue)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-baseline pt-2">
                        <span className="text-sm text-muted-foreground">Total Turnover</span>
                        <span className="font-semibold text-base">{formatCurrency(results.turnover)}</span>
                    </div>
                </div>
             </div>
          </CardContent>
           <CardHeader>
            <CardTitle>Charges Breakdown</CardTitle>
          </CardHeader>
           <CardContent className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-muted-foreground">Brokerage</span>
                <span className="font-semibold">{formatCurrency(results.charges.brokerage)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-muted-foreground">STT (Securities Transaction Tax)</span>
                <span className="font-semibold">{formatCurrency(results.charges.stt)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-muted-foreground">Exchange Transaction Charges</span>
                <span className="font-semibold">{formatCurrency(results.charges.transactionCharge)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-muted-foreground">GST</span>
                <span className="font-semibold">{formatCurrency(results.charges.gst)}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-muted-foreground">SEBI Charges</span>
                <span className="font-semibold">{formatCurrency(results.charges.sebiCharges)}</span>
              </div>
               <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-muted-foreground">Stamp Duty</span>
                <span className="font-semibold">{formatCurrency(results.charges.stampDuty)}</span>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
