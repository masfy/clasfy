"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useData } from "@/lib/data-context"
import { TrendingUp } from "lucide-react"

export function AssessmentChart() {
    const { grades, mapel, assignments } = useData()

    const data = mapel.map(m => {
        // Get assignments for this mapel
        const mapelAssignmentIds = assignments.filter(a => a.mapelId === m.id).map(a => a.id)

        // Filter grades for these assignments
        const subjectGrades = grades.filter(g => mapelAssignmentIds.includes(g.assignmentId))

        const total = subjectGrades.reduce((sum, g) => sum + g.score, 0)
        const avg = subjectGrades.length > 0 ? Math.round(total / subjectGrades.length) : 0
        return {
            subject: m.name,
            nilai: avg
        }
    })

    return (
        <Card className="relative h-full border-none bg-white text-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl pointer-events-none opacity-50" />

            <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                        <TrendingUp className="h-4 w-4" />
                    </div>
                    Rata-rata Nilai Kelas
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorNilai" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="subject"
                                stroke="#64748b"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                                interval={0}
                                angle={-15}
                                textAnchor="end"
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#1e293b' }}
                                itemStyle={{ color: '#1e293b', fontSize: '12px' }}
                                labelStyle={{ color: '#64748b', marginBottom: '8px', fontSize: '12px' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="nilai"
                                stroke="#a855f7"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorNilai)"
                                activeDot={{ r: 6, fill: '#fff', stroke: '#a855f7', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
