"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import { useData } from "@/lib/data-context"

export function TaskProgressWidget() {
    const { assignments, grades, students } = useData()
    const totalStudents = students.length || 1

    // Get recent 5 assignments
    const tasks = assignments.slice(0, 5).map(a => {
        const gradedCount = grades.filter(g => g.assignmentId === a.id).length
        const percentage = Math.round((gradedCount / totalStudents) * 100)

        let status = "pending"
        if (percentage === 100) status = "completed"
        else if (percentage > 0) status = "in-progress"

        return {
            id: a.id,
            title: a.title,
            status,
            percentage,
            completed: gradedCount,
            total: totalStudents,
            deadline: a.dueDate
        }
    })

    return (
        <Card className="relative h-full border-none bg-white text-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl pointer-events-none opacity-50" />

            <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                        <CheckCircle2 className="h-4 w-4" />
                    </div>
                    Progress Tugas
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
                {tasks.map((task, index) => (
                    <div key={index} className="space-y-2 group cursor-pointer">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{task.title}</span>
                            <span className="text-slate-500 font-mono">{task.completed}/{task.total}</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 ${task.percentage >= 80 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" :
                                    task.percentage >= 50 ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" :
                                        "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                                    }`}
                                style={{ width: `${task.percentage}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className={`px-2 py-0.5 rounded-md font-medium ${task.percentage >= 80 ? "bg-emerald-50 text-emerald-700" :
                                task.percentage >= 50 ? "bg-blue-50 text-blue-700" :
                                    "bg-orange-50 text-orange-700"
                                }`}>
                                {task.percentage}% Selesai
                            </span>
                            <span className="text-slate-400 group-hover:text-slate-500 transition-colors">Deadline: {task.deadline}</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
