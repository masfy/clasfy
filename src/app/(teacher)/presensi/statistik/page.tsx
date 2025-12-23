"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/lib/data-context"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, UserCheck, UserX, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function StatistikPresensiPage() {
    const { classes, students, attendance, isLoaded } = useData()

    const currentYear = new Date().getFullYear()
    const yearOptions = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]

    const [selectedClassId, setSelectedClassId] = useState<string>("all")
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString())
    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString())

    // --- Statistics Logic ---

    const stats = useMemo(() => {
        let filteredAttendance = attendance.filter(a => {
            const date = new Date(a.date)
            return date.getMonth() === parseInt(selectedMonth) && date.getFullYear() === parseInt(selectedYear)
        })

        if (selectedClassId !== "all") {
            filteredAttendance = filteredAttendance.filter(a => a.classId === parseInt(selectedClassId))
        }

        const totalRecords = filteredAttendance.length
        const counts = { H: 0, S: 0, I: 0, A: 0 }

        filteredAttendance.forEach(a => {
            if (counts[a.status] !== undefined) counts[a.status]++
        })

        const attendanceRate = totalRecords > 0 ? ((counts.H / totalRecords) * 100).toFixed(1) : "0"

        // Daily Trend Data
        const dailyData: Record<string, { date: string, H: number, S: number, I: number, A: number }> = {}
        filteredAttendance.forEach(a => {
            const day = a.date.split("-")[2]
            if (!dailyData[day]) dailyData[day] = { date: day, H: 0, S: 0, I: 0, A: 0 }
            dailyData[day][a.status]++
        })

        const trendData = Object.values(dailyData).sort((a, b) => parseInt(a.date) - parseInt(b.date))

        // Pie Chart Data
        const pieData = [
            { name: "Hadir", value: counts.H, color: "#22c55e" },
            { name: "Sakit", value: counts.S, color: "#0ea5e9" }, // Sky 500 (Cyan-Blue) instead of Blue 600
            { name: "Izin", value: counts.I, color: "#eab308" },
            { name: "Alpa", value: counts.A, color: "#ef4444" },
        ].filter(d => d.value > 0)

        return { counts, attendanceRate, trendData, pieData, totalRecords }
    }, [attendance, selectedClassId, selectedMonth, selectedYear])

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]

    if (!isLoaded) {
        return (
            <div className="space-y-6 pb-24 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="bg-card border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-4 rounded-full" />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-card border-border h-[380px]">
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent className="flex items-center justify-center h-[300px]">
                            <Skeleton className="h-full w-full rounded-lg" />
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border h-[380px]">
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent className="flex items-center justify-center h-[300px]">
                            <Skeleton className="h-48 w-48 rounded-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Statistik Kehadiran</h2>
                    <p className="text-gray-400">Analisis data kehadiran siswa secara visual.</p>
                </div>

                <div className="flex gap-2">
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                        <SelectTrigger className="w-[150px] bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Semua Kelas" />
                        </SelectTrigger>
                        <SelectContent className="bg-blue-50 border-blue-200">
                            <SelectItem value="all">Semua Kelas</SelectItem>
                            {classes.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[120px] bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-blue-50 border-blue-200">
                            {monthNames.map((m, i) => (
                                <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[100px] bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-blue-50 border-blue-200">
                            {yearOptions.map((y) => (
                                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-card border-border text-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Tingkat Kehadiran</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
                        <p className="text-xs text-muted-foreground">Rata-rata bulan ini</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border text-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Sakit</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.counts.S}</div>
                        <p className="text-xs text-muted-foreground">Siswa</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border text-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Izin</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.counts.I}</div>
                        <p className="text-xs text-muted-foreground">Siswa</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border text-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Alpa</CardTitle>
                        <UserX className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.counts.A}</div>
                        <p className="text-xs text-muted-foreground">Siswa</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Trend Chart */}
                <Card className="bg-card border-border text-foreground">
                    <CardHeader>
                        <CardTitle>Tren Kehadiran Harian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                                    <YAxis stroke="var(--muted-foreground)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--popover-foreground)' }}
                                    />
                                    <Legend iconType="circle" />
                                    <Bar dataKey="H" name="Hadir" stackId="a" fill="#22c55e" />
                                    <Bar dataKey="S" name="Sakit" stackId="a" fill="#0ea5e9" />
                                    <Bar dataKey="I" name="Izin" stackId="a" fill="#eab308" />
                                    <Bar dataKey="A" name="Alpa" stackId="a" fill="#ef4444" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Distribution Chart */}
                <Card className="bg-card border-border text-foreground">
                    <CardHeader>
                        <CardTitle>Distribusi Status Kehadiran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            {stats.pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {stats.pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                            itemStyle={{ color: 'var(--popover-foreground)' }}
                                        />
                                        <Legend iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted-foreground">Belum ada data presensi</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
