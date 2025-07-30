
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-background text-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-3 md:px-6">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            A comprehensive suite of financial calculators to help you make informed decisions.
          </p>
          <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
            Disclaimer
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3">
          <div className="space-y-4 md:col-start-2">
            <h3 className="font-semibold">Connect with Us</h3>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="icon">
                <a href="https://github.com/ashutoshswamy" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <a href="https://linkedin.com/in/ashutoshswamy" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <a href="https://twitter.com/ashutoshswamy_" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Developer: Ashutosh Swamy</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Theme</h3>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto flex h-14 items-center justify-center px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FinOptimal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
