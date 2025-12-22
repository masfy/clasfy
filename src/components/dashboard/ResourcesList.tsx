"use client"

import * as React from "react"
import { MoreHorizontal, Code, Figma, Chrome, Github, MessageSquare } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const resources = [
    { name: "VS Code", time: "42:00:07", percent: 35, icon: Code, color: "bg-primary" },
    { name: "Figma", time: "30:00:00", percent: 25, icon: Figma, color: "bg-purple-500" },
    { name: "Chrome DevTools", time: "21:36:07", percent: 18, icon: Chrome, color: "bg-yellow-500" },
    { name: "GitHub", time: "14:24:05", percent: 12, icon: Github, color: "bg-gray-800" },
    { name: "ChatGPT", time: "12:04:01", percent: 10, icon: MessageSquare, color: "bg-green-500" },
]

export function ResourcesList() {
    return (
        <Card className="p-6 border-none bg-card text-foreground h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Apps & URLs</h3>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">15</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-6">
                {resources.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white", item.color)}>
                                <item.icon className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{item.name}</span>
                                <span className="text-xs text-muted-foreground">{item.time}</span>
                            </div>
                        </div>

                        <div className="relative h-10 w-10 flex items-center justify-center">
                            {/* Simple SVG Circle Progress */}
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-muted"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    className="text-primary"
                                    strokeDasharray={`${item.percent}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>
                            <span className="absolute text-[8px] font-medium">{item.percent}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
