"use client"

import * as React from "react"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { BadgeCheck } from "lucide-react"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
            </div>

            {/* Layout Container */}
            <div className="flex pt-20">
                <Sidebar
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 md:pl-28 pb-24 overflow-y-auto h-[calc(100vh-5rem)] scrollbar-hide">
                    {children}
                </main>

                {/* Fixed Footer */}
                <footer className="fixed bottom-0 right-0 left-0 md:left-20 py-4 border-t border-border bg-background flex items-center justify-center text-sm text-muted-foreground z-40">
                    <span>&copy; {new Date().getFullYear()} | Clasfy by Mas Alfy</span>
                    <BadgeCheck className="ml-2 h-5 w-5 text-primary fill-primary/20" />
                </footer>
            </div>
        </div>
    )
}
