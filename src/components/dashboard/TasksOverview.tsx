"use client"

import * as React from "react"
import { Search, Cloud, MoreHorizontal } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const days = [
    { day: "Sun", date: 15 },
    { day: "Mon", date: 16 },
    { day: "Tue", date: 17 },
    { day: "Wed", date: 18, active: true },
    { day: "Thu", date: 19 },
    { day: "Fri", date: 20 },
    { day: "Sat", date: 21 },
]

const hours = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

export function TasksOverview() {
    return (
        <Card className="p-6 border-none bg-card text-foreground h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium text-muted-foreground">Tasks overview</h3>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Cloud className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Calendar Header */}
            <div className="grid grid-cols-8 mb-4">
                <div className="col-span-1" /> {/* Spacer for time labels */}
                {days.map((item) => (
                    <div key={item.day} className="flex flex-col items-center gap-1">
                        <span className="text-xs text-muted-foreground">{item.day}</span>
                        <div
                            className={cn(
                                "h-8 w-8 flex items-center justify-center rounded-full text-sm font-medium",
                                item.active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                            )}
                        >
                            {item.date}
                        </div>
                    </div>
                ))}
            </div>

            {/* Timeline Grid */}
            <div className="flex-1 relative">
                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-8 pointer-events-none">
                    <div className="col-span-1 border-r border-dashed border-border/50" />
                    {days.map((_, i) => (
                        <div key={i} className="col-span-1 border-r border-dashed border-border/50 last:border-0" />
                    ))}
                </div>

                {/* Time Slots */}
                <div className="relative">
                    {hours.map((hour) => (
                        <div key={hour} className="grid grid-cols-8 h-14">
                            <div className="col-span-1 text-xs text-muted-foreground -mt-2 pr-2 text-right">{hour}</div>
                            <div className="col-span-7 border-t border-dashed border-border/30" />
                        </div>
                    ))}

                    {/* Events */}
                    {/* Team Sync: Mon 13:00 */}
                    <div className="absolute top-[56px] left-[12.5%] w-[12.5%] h-[56px] p-1 z-10">
                        <div className="h-full w-full rounded-xl bg-muted p-2 flex flex-col justify-between">
                            <span className="text-[10px] font-medium text-foreground">Team Sync</span>
                            <div className="flex -space-x-1">
                                <Avatar className="h-4 w-4 border border-muted"><AvatarFallback>A</AvatarFallback></Avatar>
                                <Avatar className="h-4 w-4 border border-muted"><AvatarFallback>B</AvatarFallback></Avatar>
                            </div>
                        </div>
                    </div>

                    {/* Component Review: Wed 14:00 */}
                    <div className="absolute top-[112px] left-[37.5%] w-[25%] h-[56px] p-1 z-10">
                        <div className="h-full w-full rounded-xl bg-primary p-2 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-primary-foreground">Component Review</span>
                                <span className="text-[8px] text-primary-foreground/70">Refactor shared components.</span>
                            </div>
                            <div className="flex -space-x-1">
                                <Avatar className="h-5 w-5 border border-primary"><AvatarImage src="https://i.pravatar.cc/150?u=1" /></Avatar>
                                <Avatar className="h-5 w-5 border border-primary"><AvatarImage src="https://i.pravatar.cc/150?u=2" /></Avatar>
                            </div>
                        </div>
                    </div>

                    {/* Bug Reproduction: Fri 16:00 */}
                    <div className="absolute top-[224px] left-[62.5%] w-[25%] h-[56px] p-1 z-10">
                        <div className="h-full w-full rounded-xl bg-muted p-2 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-medium text-foreground">Bug Reproduction</span>
                                <span className="text-[8px] text-muted-foreground">Find and log UI bugs.</span>
                            </div>
                            <Avatar className="h-5 w-5 border border-muted"><AvatarImage src="https://i.pravatar.cc/150?u=3" /></Avatar>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
