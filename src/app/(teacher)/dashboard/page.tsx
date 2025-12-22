"use client"

import { WelcomeSection } from "@/components/dashboard/WelcomeSection"
import { DataSummaryCards } from "@/components/dashboard/DataSummaryCards"
import { AttendanceChart } from "@/components/dashboard/AttendanceChart"
import { AssessmentChart } from "@/components/dashboard/AssessmentChart"
import { TaskProgressWidget } from "@/components/dashboard/TaskProgressWidget"
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard"
import { LeaderboardWidget } from "@/components/dashboard/LeaderboardWidget"


export default function Dashboard() {
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
