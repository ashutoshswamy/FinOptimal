
"use client"

import { useState, useTransition } from "react"
import { generateFinancialInsights } from "@/ai/flows/financial-insight-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, Bot, Wand2, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { marked } from "marked"

export default function InsightsPage() {
  const [isPending, startTransition] = useTransition()
  const [financialSituation, setFinancialSituation] = useState("")
  const [insight, setInsight] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setInsight("")
    startTransition(async () => {
      try {
        const result = await generateFinancialInsights({ financialSituation })
        const html = await marked.parse(result.explanation);
        setInsight(html)
      } catch (error) {
        console.error("Error generating financial insight:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate financial insight. Please try again.",
        })
      }
    })
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
            <Link href="/">
                <ArrowLeft />
            </Link>
        </Button>
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline flex items-center gap-2">
              <Sparkles className="text-accent" />
              Financial Insight Generator
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Get AI-powered explanations for your financial questions and decisions.
            </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Situation</CardTitle>
            <CardDescription>
              Enter a financial question or decision you're facing. For example, "I'm 25 and want to start investing in mutual funds for the long term, but I'm not sure how to start."
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="financial-situation">Financial Situation</Label>
                <Textarea
                  id="financial-situation"
                  placeholder="Describe your financial situation here..."
                  value={financialSituation}
                  onChange={(e) => setFinancialSituation(e.target.value)}
                  rows={5}
                  disabled={isPending}
                />
              </div>
              <Button type="submit" disabled={isPending || !financialSituation}>
                <Wand2 className="mr-2 h-4 w-4" />
                {isPending ? "Generating Insight..." : "Generate Insight"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="text-primary" />
              AI-Generated Insight
            </CardTitle>
            <CardDescription>
              Here's a plain-English explanation of the key factors for your decision.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            {isPending && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}
            {insight && (
              <div
                dangerouslySetInnerHTML={{
                  __html: insight,
                }}
              />
            )}
            {!isPending && !insight && (
              <p className="text-muted-foreground">Your financial insight will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
