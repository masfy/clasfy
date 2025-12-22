"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useData } from "@/lib/data-context"
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO } from "date-fns"
import { id } from "date-fns/locale"

export function AttendanceChart() {
    const { attendance } = useData()

    // Get current week's days (Mon-Sat)
    const today = new Date()
    const start = startOfWeek(today, { weekStartsOn: 1 }) // Monday
    const end = endOfWeek(today, { weekStartsOn: 1 }) // Sunday

    // Generate array of days for the chart (Mon-Sat)
    const days = eachDayOfInterval({ start, end }).slice(0, 6)

    const data = days.map(day => {
        const dayRecords = attendance.filter(r => r.date && isSameDay(parseISO(r.date), day))
        return {
            name: format(day, "EEEE", { locale: id }),
            Hadir: dayRecords.filter(r => r.status === "H").length,
            Izin: dayRecords.filter(r => r.status === "I").length,
            Sakit: dayRecords.filter(r => r.status === "S").length,
            Alpha: dayRecords.filter(r => r.status === "A").length,
        }
    })

    // Calculate totals for this week
    const thisWeekRecords = attendance.filter(r => {
        if (!r.date) return false
        const d = parseISO(r.date)
        return d >= start && d <= end
    })

    const weekHadir = thisWeekRecords.filter(r => r.status === "H").length
    const weekIzin = thisWeekRecords.filter(r => r.status === "I").length
    const weekSakit = thisWeekRecords.filter(r => r.status === "S").length
    const weekAlpha = thisWeekRecords.filter(r => r.status === "A").length

    // Calculate average present per day (only counting days with data)
    const activeDays = days.filter(d => thisWeekRecords.some(r => r.date && isSameDay(parseISO(r.date), d))).length || 1
    const avgHadir = Math.round(weekHadir / activeDays)

    return (
        <Card className="relative h-full border-none bg-white text-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Background Gradients */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl pointer-events-none opacity-50" />

            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-lg font-bold">Statistik Kehadiran Minggu Ini</CardTitle>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                        <span className="text-xs text-emerald-700">Hadir</span>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                        <span className="text-xs text-blue-700">Izin</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorIzin" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#1e293b' }}
                                itemStyle={{ color: '#1e293b', fontSize: '12px' }}
                                labelStyle={{ color: '#64748b', marginBottom: '8px', fontSize: '12px' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="Hadir"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorHadir)"
                                activeDot={{ r: 6, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="Izin"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorIzin)"
                                activeDot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Stylish Summary Cards */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex flex-col items-center hover:bg-emerald-100 transition-colors">
                        <span className="text-xs text-emerald-600 mb-1">Rata-rata Hadir</span>
                        <span className="text-lg font-bold text-emerald-700">{avgHadir}</span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col items-center hover:bg-blue-100 transition-colors">
                        <span className="text-xs text-blue-600 mb-1">Total Izin</span>
                        <span className="text-lg font-bold text-blue-700">{weekIzin}</span>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex flex-col items-center hover:bg-yellow-100 transition-colors">
                        <span className="text-xs text-yellow-600 mb-1">Total Sakit</span>
                        <span className="text-lg font-bold text-yellow-700">{weekSakit}</span>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex flex-col items-center hover:bg-red-100 transition-colors">
                        <span className="text-xs text-red-600 mb-1">Total Alpha</span>
                        <span className="text-lg font-bold text-red-700">{weekAlpha}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
