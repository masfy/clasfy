"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Printer, FileText } from "lucide-react"
import { useData } from "@/lib/data-context"
import { useReactToPrint } from "react-to-print"
import { Skeleton } from "@/components/ui/skeleton"

export default function RekapPresensiPage() {
    const { classes, students, attendance, sekolah, user, isLoaded } = useData()
    const componentRef = useRef<HTMLDivElement>(null)

    const currentYear = new Date().getFullYear()
    const yearOptions = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]

    const [selectedClassId, setSelectedClassId] = useState<string>("")
    const [reportMode, setReportMode] = useState<"Bulanan" | "Semester">("Bulanan")
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString())
    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString())
    const [selectedSemester, setSelectedSemester] = useState<string>("Ganjil")

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Rekap_Presensi_${selectedClassId ? classes.find(c => c.id === parseInt(selectedClassId))?.name : "Semua"}`,
    })

    // --- Logic ---

    // Filter students
    const filteredStudents = selectedClassId
        ? students.filter(s => s.class === classes.find(c => c.id === parseInt(selectedClassId))?.name)
        : []

    // Bulanan Logic
    const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth) + 1, 0).getDate()
    const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    const getDailyStatus = (studentId: number, day: number) => {
        const dateStr = `${selectedYear}-${(parseInt(selectedMonth) + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        const record = attendance.find(a => a.studentId === studentId && a.date === dateStr)
        return record ? record.status : "-"
    }

    const getMonthlyTotals = (studentId: number) => {
        let totals = { H: 0, S: 0, I: 0, A: 0 }
        for (let day = 1; day <= daysInMonth; day++) {
            const status = getDailyStatus(studentId, day)
            if (status !== "-") totals[status as keyof typeof totals]++
        }
        return totals
    }

    // Semester Logic
    const semesterMonths = selectedSemester === "Ganjil"
        ? [6, 7, 8, 9, 10, 11] // July - Dec (0-indexed)
        : [0, 1, 2, 3, 4, 5]   // Jan - June (0-indexed)

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]

    const getSemesterTotals = (studentId: number) => {
        let totals = { H: 0, S: 0, I: 0, A: 0 }

        // Filter attendance for this student within the semester months and year
        const studentRecords = attendance.filter(a => {
            if (a.studentId !== studentId) return false
            const date = new Date(a.date)
            const month = date.getMonth()
            const year = date.getFullYear()
            return semesterMonths.includes(month) && year === parseInt(selectedYear)
        })

        studentRecords.forEach(r => {
            if (totals[r.status] !== undefined) totals[r.status]++
        })

        return totals
    }

    if (!isLoaded) {
        return (
            <div className="space-y-6 pb-24 animate-in fade-in duration-700">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>

                <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                        <div className="grid gap-6 md:grid-cols-5 items-end">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border flex flex-col items-center justify-center">
                    <Skeleton className="h-12 w-12 rounded-full mb-4" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Rekap Presensi</h2>
                    <p className="text-muted-foreground">Lihat dan cetak laporan kehadiran siswa.</p>
                </div>
                <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90" disabled={!selectedClassId}>
                    <Printer className="mr-2 h-4 w-4" />
                    Cetak Laporan
                </Button>
            </div>

            <Card className="bg-card border-border text-foreground">
                <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-5 items-end">
                        <div className="space-y-2">
                            <Label>Mode Laporan</Label>
                            <Select value={reportMode} onValueChange={(v: "Bulanan" | "Semester") => setReportMode(v)}>
                                <SelectTrigger className="bg-muted border-none text-foreground">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border text-foreground">
                                    <SelectItem value="Bulanan">Bulanan</SelectItem>
                                    <SelectItem value="Semester">Semester</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Kelas</Label>
                            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                <SelectTrigger className="bg-muted border-none text-foreground">
                                    <SelectValue placeholder="Pilih Kelas..." />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border text-foreground">
                                    {classes.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {reportMode === "Bulanan" && (
                            <div className="space-y-2">
                                <Label>Bulan</Label>
                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger className="bg-muted border-none text-foreground">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        {monthNames.map((m, i) => (
                                            <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Tahun</Label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="bg-muted border-none text-foreground">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border text-foreground">
                                    {yearOptions.map((y) => (
                                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Semester</Label>
                            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                                <SelectTrigger className="bg-muted border-none text-foreground">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border text-foreground">
                                    <SelectItem value="Ganjil">Ganjil (Jul-Des)</SelectItem>
                                    <SelectItem value="Genap">Genap (Jan-Jun)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Printable Area */}
            <div className="hidden">
                <div ref={componentRef} className="p-8 bg-white text-black min-w-[1000px]">
                    <div className="text-center mb-8 border-b-2 border-black pb-4">
                        <h1 className="text-2xl font-bold uppercase">{sekolah.nama}</h1>
                        <p className="text-sm">{sekolah.alamat}</p>
                        <p className="text-sm font-bold mt-2">LAPORAN PRESENSI SISWA - {reportMode.toUpperCase()}</p>
                        <p className="text-sm">
                            Kelas: {classes.find(c => c.id === parseInt(selectedClassId))?.name || "-"} |
                            {reportMode === "Bulanan" ? `Bulan: ${monthNames[parseInt(selectedMonth)]}` : `Semester: ${selectedSemester}`} |
                            Tahun: {selectedYear}
                        </p>
                    </div>

                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr>
                                <th className="border border-black p-1 w-8" rowSpan={2}>No</th>
                                <th className="border border-black p-1 text-left" rowSpan={2}>Nama Siswa</th>
                                {reportMode === "Bulanan" ? (
                                    <>
                                        <th className="border border-black p-1" colSpan={daysInMonth}>Tanggal</th>
                                        <th className="border border-black p-1" colSpan={4}>Total</th>
                                    </>
                                ) : (
                                    <th className="border border-black p-1" colSpan={4}>Total Kehadiran Semester Ini</th>
                                )}
                            </tr>
                            <tr>
                                {reportMode === "Bulanan" ? (
                                    <>
                                        {dates.map(d => {
                                            const date = new Date(parseInt(selectedYear), parseInt(selectedMonth), d)
                                            const isSunday = date.getDay() === 0
                                            return (
                                                <th key={d} className={`border border-black p-0.5 w-6 text-[10px] ${isSunday ? 'bg-red-200' : ''}`}>{d}</th>
                                            )
                                        })}
                                    </>
                                ) : null}
                                <th className="border border-black p-1 w-12 bg-green-100">Hadir</th>
                                <th className="border border-black p-1 w-12 bg-blue-100">Sakit</th>
                                <th className="border border-black p-1 w-12 bg-yellow-100">Izin</th>
                                <th className="border border-black p-1 w-12 bg-red-100">Alpa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => {
                                const totals = reportMode === "Bulanan" ? getMonthlyTotals(student.id) : getSemesterTotals(student.id)
                                return (
                                    <tr key={student.id}>
                                        <td className="border border-black p-1 text-center">{index + 1}</td>
                                        <td className="border border-black p-1">{student.name}</td>

                                        {reportMode === "Bulanan" && dates.map(d => {
                                            const status = getDailyStatus(student.id, d)
                                            const date = new Date(parseInt(selectedYear), parseInt(selectedMonth), d)
                                            const isSunday = date.getDay() === 0

                                            let colorClass = ""
                                            if (status === "H") colorClass = "text-green-600 font-bold"
                                            if (status === "S") colorClass = "text-blue-600 font-bold"
                                            if (status === "I") colorClass = "text-yellow-600 font-bold"
                                            if (status === "A") colorClass = "text-red-600 font-bold"

                                            return (
                                                <td key={d} className={`border border-black p-0.5 text-center ${colorClass} ${isSunday ? 'bg-red-200' : ''}`}>
                                                    {status !== "-" ? status : ""}
                                                </td>
                                            )
                                        })}

                                        <td className="border border-black p-1 text-center font-bold">{totals.H}</td>
                                        <td className="border border-black p-1 text-center font-bold">{totals.S}</td>
                                        <td className="border border-black p-1 text-center font-bold">{totals.I}</td>
                                        <td className="border border-black p-1 text-center font-bold">{totals.A}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    <div className="mt-12 flex justify-between px-8">
                        <div className="text-center">
                            <p>Mengetahui,</p>
                            <p>Kepala Sekolah</p>
                            <div className="h-20"></div>
                            <p className="font-bold underline">{sekolah.kepala}</p>
                            <p>NIP. {sekolah.nipKepala}</p>
                        </div>
                        <div className="text-center">
                            <p>{sekolah.kabupatenKota}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p>Guru Wali Kelas</p>
                            <div className="h-20"></div>
                            <p className="font-bold underline">{user.name}</p>
                            <p>NIP. {user.nip}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Screen View */}
            {selectedClassId ? (
                <div className="overflow-auto bg-card rounded-lg border border-border p-4">
                    <table className="w-full text-sm text-left text-muted-foreground">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted">
                            <tr>
                                <th className="px-4 py-3">No</th>
                                <th className="px-4 py-3">Nama Siswa</th>
                                <th className="px-4 py-3 text-center">Hadir</th>
                                <th className="px-4 py-3 text-center">Sakit</th>
                                <th className="px-4 py-3 text-center">Izin</th>
                                <th className="px-4 py-3 text-center">Alpa</th>
                                <th className="px-4 py-3 text-center">% Kehadiran</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => {
                                const totals = reportMode === "Bulanan" ? getMonthlyTotals(student.id) : getSemesterTotals(student.id)
                                const totalDays = totals.H + totals.S + totals.I + totals.A
                                const percentage = totalDays > 0 ? ((totals.H / totalDays) * 100).toFixed(0) : "0"
                                return (
                                    <tr key={student.id} className="border-b border-border hover:bg-muted/50">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium text-foreground">{student.name}</td>
                                        <td className="px-4 py-3 text-center text-green-500">{totals.H}</td>
                                        <td className="px-4 py-3 text-center text-blue-500">{totals.S}</td>
                                        <td className="px-4 py-3 text-center text-yellow-500">{totals.I}</td>
                                        <td className="px-4 py-3 text-center text-red-500">{totals.A}</td>
                                        <td className="px-4 py-3 text-center">{percentage}%</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Silakan pilih kelas untuk melihat rekap presensi.</p>
                </div>
            )}
        </div>
    )
}
