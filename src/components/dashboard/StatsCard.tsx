"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
    value: string
    label: string
    className?: string
    footer?: React.ReactNode
}

export function StatsCard({ value, label, className, footer }: StatsCardProps) {
    return (
        <Card className={cn("relative overflow-hidden flex flex-col justify-center p-6 border-none bg-muted/50 hover:bg-muted/80 transition-colors duration-300 group", className)}>
            <div className="relative z-10">
                <div className="text-4xl font-bold text-foreground mb-1 tracking-tight">{value}</div>
                <div className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{label}</div>
                {footer && <div className="mt-4">{footer}</div>}
            </div>
            <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
        </Card>
    )
}

export function PremiumCard() {
    return (
        <Card className="flex flex-col justify-between p-6 border-none bg-primary text-primary-foreground">
            <div className="flex justify-between items-start">
                <div className="h-8 w-8 rounded-full bg-black/10 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-primary-foreground" />
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground text-primary px-3 py-1 rounded-full text-xs font-medium">
                    $12.99/mo <ArrowRight className="h-3 w-3" />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold">HRadar Premium</h3>
                <p className="text-xs text-primary-foreground/70">Automation, AI help & more for pros</p>
            </div>
        </Card>
    )
}
