"use client"

import { WelcomeSection } from "@/components/dashboard/WelcomeSection"
import { DataSummaryCards } from "@/components/dashboard/DataSummaryCards"
import { AttendanceChart } from "@/components/dashboard/AttendanceChart"
import { AssessmentChart } from "@/components/dashboard/AssessmentChart"
import { TaskProgressWidget } from "@/components/dashboard/TaskProgressWidget"
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard"
import { LeaderboardWidget } from "@/components/dashboard/LeaderboardWidget"
import { useData } from "@/lib/data-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Dashboard() {
    const { isLoaded } = useData()

    if (!isLoaded) {
        return (
            <div className="flex flex-col gap-10 pb-8 animate-in fade-in duration-700">
                {/* Top Section Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <div className="rounded-2xl bg-slate-200/50 p-6 h-48 flex flex-col justify-center space-y-4">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-96" />
                            <div className="flex gap-4 pt-4">
                                <Skeleton className="h-10 w-32 rounded-lg" />
                                <Skeleton className="h-10 w-32 rounded-lg" />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <Card className="h-full border-none shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-6 w-32" />
                                <div className="grid grid-cols-2 gap-2">
                                    <Skeleton className="h-20 w-full rounded-xl" />
                                    <Skeleton className="h-20 w-full rounded-xl" />
                                    <Skeleton className="h-20 w-full rounded-xl" />
                                    <Skeleton className="h-20 w-full rounded-xl" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Data Summary Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="border-none shadow-sm">
                            <CardContent className="p-6 flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Middle Section Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <Card className="h-96 border-none shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-6 w-40" />
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-4 w-full" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                        <Card className="h-96 border-none shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-8 w-32" />
                                </div>
                                <Skeleton className="h-64 w-full rounded-xl" />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Bottom Section Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="h-80 border-none shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-56 w-full rounded-xl" />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1">
                        <Card className="h-80 border-none shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-6 w-32" />
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-4 w-8" />
                                            </div>
                                            <Skeleton className="h-2 w-full rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-10 pb-8">

            {/* Top Section: Welcome & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <WelcomeSection />
                </div>
                <div className="lg:col-span-1">
                    <QuickActionsCard />
                </div>
            </div>

            {/* Data Summary Cards */}
            <div>
                <DataSummaryCards />
            </div>

            {/* Middle Section: Leaderboard & Attendance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <LeaderboardWidget />
                </div>
                <div className="lg:col-span-2">
                    <AttendanceChart />
                </div>
            </div>

            {/* Bottom Section: Assessment & Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AssessmentChart />
                </div>
                <div className="lg:col-span-1">
                    <TaskProgressWidget />
                </div>
            </div>

        </div>

    )
}
