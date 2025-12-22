"use client"

import * as React from "react"
import { Play, Pause, MoreHorizontal, Box, GitBranch } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TimeTrackingWidget() {
    return (
        <Card className="p-6 border-none bg-card text-foreground h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium text-muted-foreground">Time tracking</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            {/* Active Timer Card */}
            <div className="bg-primary rounded-3xl p-6 mb-6 text-primary-foreground relative overflow-hidden">
                <div className="relative z-10">
                    <div className="text-sm font-medium mb-1 opacity-70">Banking app</div>
                    <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold font-mono">03:37:52</div>
                        <Button size="icon" className="h-10 w-10 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                            <Play className="h-4 w-4 fill-current" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Recent Tasks List */}
            <div className="space-y-4">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-muted/80 transition-colors">
                        <Box className="h-5 w-5" />
                    </div>
                    <div className="flex-1 border-b border-border pb-4 group-last:border-0 group-last:pb-0">
                        <h4 className="text-sm font-medium text-foreground">Build responsive layout</h4>
                        <p className="text-xs text-muted-foreground">2:00:07</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-muted/80 transition-colors">
                        <GitBranch className="h-5 w-5" />
                    </div>
                    <div className="flex-1 border-b border-border pb-4 group-last:border-0 group-last:pb-0">
                        <h4 className="text-sm font-medium text-foreground">Debug API integration</h4>
                        <p className="text-xs text-muted-foreground">1:12:57</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}
