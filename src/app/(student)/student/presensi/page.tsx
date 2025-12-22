"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

export default function StudentPresensi() {
    const { students, attendance } = useData()
    const [student, setStudent] = useState<any>(null)

    useEffect(() => {
        const session = localStorage.getItem("clasfy_student_session")
        if (session) {
            const sessionData = JSON.parse(session)
            const freshData = students.find(s => s.id === sessionData.id)
            setStudent(freshData || sessionData)
        }
    }, [students])

    if (!student) return null

    // Filter attendance for this student
    const myAttendance = attendance.filter(a => a.studentId === student.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const summary = {
        hadir: myAttendance.filter(a => a.status === "H").length,
        sakit: myAttendance.filter(a => a.status === "S").length,
        izin: myAttendance.filter(a => a.status === "I").length,
        alpha: myAttendance.filter(a => a.status === "A").length
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "H": return "Hadir"
            case "S": return "Sakit"
            case "I": return "Izin"
            case "A": return "Alpha"
            default: return status
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "H": return "text-green-500"
            case "S": return "text-yellow-500"
            case "I": return "text-blue-500"
            case "A": return "text-red-500"
            default: return "text-gray-500"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "H": return <CheckCircle className="h-4 w-4" />
            case "S": return <AlertTriangle className="h-4 w-4" />
            case "I": return <Clock className="h-4 w-4" />
            case "A": return <XCircle className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-in-out">
            <div className="flex flex-col items-center text-center space-y-2 pt-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CalendarDays className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Rekap Presensi</h2>
                <p className="text-slate-500 text-sm">Kehadiranmu semester ini</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-2">
                <Card className="relative overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white/50 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 h-10 w-10 rounded-full bg-white/20 blur-lg" />
                    <CardContent className="p-2 flex flex-col items-center justify-center text-center h-full relative z-10">
                        <span className="text-lg font-bold text-white group-hover:scale-110 transition-transform drop-shadow-sm">{summary.hadir}</span>
                        <span className="text-[10px] text-green-100 font-medium">Hadir</span>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-amber-500 border-2 border-white/50 text-white shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 h-10 w-10 rounded-full bg-white/20 blur-lg" />
                    <CardContent className="p-2 flex flex-col items-center justify-center text-center h-full relative z-10">
                        <span className="text-lg font-bold text-white group-hover:scale-110 transition-transform drop-shadow-sm">{summary.sakit}</span>
                        <span className="text-[10px] text-yellow-100 font-medium">Sakit</span>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-400 to-cyan-500 border-2 border-white/50 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 h-10 w-10 rounded-full bg-white/20 blur-lg" />
                    <CardContent className="p-2 flex flex-col items-center justify-center text-center h-full relative z-10">
                        <span className="text-lg font-bold text-white group-hover:scale-110 transition-transform drop-shadow-sm">{summary.izin}</span>
                        <span className="text-[10px] text-blue-100 font-medium">Izin</span>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden bg-gradient-to-br from-red-400 to-pink-500 border-2 border-white/50 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 h-10 w-10 rounded-full bg-white/20 blur-lg" />
                    <CardContent className="p-2 flex flex-col items-center justify-center text-center h-full relative z-10">
                        <span className="text-lg font-bold text-white group-hover:scale-110 transition-transform drop-shadow-sm">{summary.alpha}</span>
                        <span className="text-[10px] text-red-100 font-medium">Alpha</span>
                    </CardContent>
                </Card>
            </div>

            {/* History List */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg px-1 text-slate-900">Riwayat Kehadiran</h3>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    {myAttendance.length > 0 ? (
                        myAttendance.map((record, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full bg-opacity-10 ${getStatusColor(record.status).replace('text-', 'bg-')}`}>
                                        <div className={getStatusColor(record.status)}>
                                            {getStatusIcon(record.status)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {record.notes || "-"}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold ${getStatusColor(record.status)}`}>
                                    {getStatusLabel(record.status)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            <p className="text-sm">Belum ada data presensi.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
