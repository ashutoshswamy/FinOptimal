
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DisclaimerPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:h-16 sm:px-6 md:px-8">
        <Link href="/">
            <Logo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                <Link href="/">
                    <ArrowLeft />
                </Link>
                </Button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-headline">Disclaimer</h1>
                </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Disclaimer for FinOptimal</CardTitle>
                <CardDescription>Last updated: {currentDate}</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>
                  The information provided by FinOptimal ("we," "us," or "our") on this website is for general informational and educational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
                </p>
                <p>
                  The financial calculators provided are intended to be used as estimation tools only. They are not intended to provide investment, legal, tax, or financial advice. We are not financial advisors. Before making any financial decisions or implementing any financial strategy, you should consider obtaining additional information and advice from a qualified professional.
                </p>
                <p>
                  Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
                </p>
                <p>
                  The AI-powered "Financial Insight Generator" provides automated suggestions based on the data you provide. This is not a substitute for professional financial advice and the output may contain inaccuracies. You should not act or refrain from acting on the basis of the insights provided without first seeking professional advice from a qualified financial advisor.
                </p>
                 <p>
                  We reserve the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice.
                </p>
              </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
