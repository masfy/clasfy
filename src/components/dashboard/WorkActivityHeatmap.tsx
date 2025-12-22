"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const hours = ["2pm", "1pm", "12pm", "11am", "10am", "9am", "8am"]
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Mock data: 0 = empty, 1 = >2h, 2 = >4h, 3 = >8h
const activityData = [
    [0, 1, 2, 3, 2, 1, 0], // 2pm
    [1, 2, 3, 3, 3, 2, 1], // 1pm
    [0, 3, 3, 3, 3, 3, 0], // 12pm
    [0, 2, 3, 3, 3, 2, 0], // 11am
    [0, 1, 2, 3, 2, 1, 0], // 10am
    [0, 0, 1, 2, 1, 0, 0], // 9am
    [0, 0, 0, 1, 0, 0, 0], // 8am
]

export function WorkActivityHeatmap() {
    return (
        <Card className="p-6 border-none bg-card text-foreground h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Work activity</h3>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">~120h • 79% Avg</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Calendar className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted bg-[linear-gradient(45deg,transparent_25%,var(--border)_25%,var(--border)_50%,transparent_50%,transparent_75%,var(--border)_75%,var(--border)_100%)] bg-[length:4px_4px]" />
                    <span>0h</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted-foreground/50" />
                    <span>&gt;2h</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-primary/50" />
                    <span>&gt;4h</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-primary" />
                    <span>&gt;8h</span>
                </div>
            </div>

            <div className="flex">
                {/* Y Axis Labels */}
                <div className="flex flex-col justify-between mr-4 py-1">
                    {hours.map((hour) => (
                        <span key={hour} className="text-[10px] text-muted-foreground h-8 flex items-center">
                            {hour}
                        </span>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-7 gap-2">
                        {/* Cells */}
                        {activityData.map((row, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                                {row.map((level, colIndex) => (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={cn(
                                            "h-8 w-full rounded-md transition-all hover:scale-110",
                                            level === 0 && "bg-muted bg-[linear-gradient(45deg,transparent_25%,var(--border)_25%,var(--border)_50%,transparent_50%,transparent_75%,var(--border)_75%,var(--border)_100%)] bg-[length:4px_4px] opacity-50",
                                            level === 1 && "bg-muted-foreground/50",
                                            level === 2 && "bg-primary/50",
                                            level === 3 && "bg-primary"
                                        )}
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* X Axis Labels */}
                    <div className="grid grid-cols-7 gap-2 mt-2">
                        {days.map((day) => (
                            <span key={day} className="text-[10px] text-muted-foreground text-center">
                                {day}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}
