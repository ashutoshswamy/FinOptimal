

"use client"

import Link from "next/link"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Home } from "lucide-react"
import { Footer } from "@/components/footer"

export default function AppLayout({ children }: { children: React.ReactNode }) {

  return (
    <div>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:h-16 sm:px-6 md:px-8">
            <Link href="/">
                <Logo />
            </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
            {children}
        </main>
        <Footer />
    </div>
  )
}
