"use client"
import { UnderConstruction } from "@/components/under-construction";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MtfCalculatorPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline">MTF Calculator</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Margin Trading Facility Calculator.</p>
        </div>
      </div>
      <UnderConstruction message="It will help you calculate the margin required for your trades." />
    </div>
  );
}
