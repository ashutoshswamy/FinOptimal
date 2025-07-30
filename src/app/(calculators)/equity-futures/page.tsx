"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export default function EquityFuturesCalculatorPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline">Equity Futures Calculator</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Calculate potential profit or loss for futures contracts.</p>
        </div>
      </div>
      <div className="flex items-center justify-center h-full py-16">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
             <div className="mx-auto bg-primary/10 p-4 rounded-full">
                <Construction className="w-12 h-12 text-primary" />
             </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardTitle className="text-2xl font-bold">Coming Soon</CardTitle>
            <CardDescription className="text-muted-foreground">
              This calculator is under construction. We are working hard to bring it to you.
              It will help you analyze your equity futures trades. Please check back later!
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
