"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Coins,
  Landmark,
  PiggyBank,
  Receipt,
  Handshake,
  Goal,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { href: "/sip", icon: Coins, label: "SIP Calculator" },
  { href: "/lumpsum", icon: PiggyBank, label: "Lumpsum Calculator" },
  { href: "/emi", icon: Landmark, label: "EMI Calculator" },
  { href: "/brokerage", icon: Handshake, label: "Brokerage Calculator" },
  { href: "/tax", icon: Receipt, label: "Tax Calculator" },
  { href: "/retirement", icon: Goal, label: "Retirement Calculator" },
  { href: "/insights", icon: Sparkles, label: "Financial Insights" },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="p-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    asChild
                    tooltip={item.label}
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-6 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-4">
             <div className="md:hidden">
                <Logo />
             </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 lg:p-10">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
