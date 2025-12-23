"use client"

import { useState, useMemo, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Filter, Printer, LayoutList, Table as TableIcon } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useReactToPrint } from "react-to-print"
import { Skeleton } from "@/components/ui/skeleton"

export default function RekapNilaiPage() {
    const { classes, mapel, students, grades, assignments, categories, weights, sekolah, user, isLoaded } = useData()
    const [selectedClassId, setSelectedClassId] = useState("")
    const [selectedMapelId, setSelectedMapelId] = useState("")
    const [selectedSemester, setSelectedSemester] = useState("ganjil")
    const [viewMode, setViewMode] = useState("detail") // 'detail' | 'leger'

    // Filter students by class
    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const cls = classes.find(c => c.id === parseInt(selectedClassId))
            return cls && s.class === cls.name
        })
    }, [students, classes, selectedClassId])

    // Helper to check if a date is in the selected semester
    const isInSemester = (dateString: string, semester: string) => {
        if (!dateString) return false
        const date = new Date(dateString)
        const month = date.getMonth() // 0 = Jan, 11 = Dec

        if (semester === "ganjil") {
            // Ganjil: July (6) - December (11)
            return month >= 6 && month <= 11
        } else {
            // Genap: January (0) - June (5)
            return month >= 0 && month <= 5
        }
    }

    // Helper to get grade for a student, mapel, and category
    const getGrade = (studentId: number, mapelId: number, categoryId: number) => {
        // Find assignments for this mapel and category
        const relevantAssignments = assignments.filter(a =>
            a.mapelId === mapelId &&
            a.categoryId === categoryId &&
            isInSemester(a.dueDate, selectedSemester)
        )

        if (relevantAssignments.length === 0) return 0

        // Find grades for these assignments
        let totalScore = 0
        let count = 0

        relevantAssignments.forEach(assignment => {
            const grade = grades.find(g => g.assignmentId === assignment.id && g.studentId === studentId)
            if (grade) {
                totalScore += grade.score
                count++
            }
        })

        return count > 0 ? Math.round(totalScore / count) : 0
    }

    const calculateFinal = (studentId: number, mapelId: number) => {
        const mapelWeights = weights.filter(w => w.mapelId === mapelId)

        // If no weights defined, use simple average of all categories that have grades
        if (mapelWeights.length === 0) {
            let total = 0
            let count = 0
            categories.forEach(cat => {
                const grade = getGrade(studentId, mapelId, cat.id)
                if (grade > 0) {
                    total += grade
                    count++
                }
            })
            return count > 0 ? Math.round(total / count) : 0
        }

        // Calculate weighted average
        let weightedSum = 0
        let totalWeight = 0

        mapelWeights.forEach(w => {
            const grade = getGrade(studentId, mapelId, w.categoryId)
            weightedSum += grade * (w.weight / 100)
            totalWeight += w.weight
        })

        // Normalize if total weight is not 100 (though it should be)
        return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : 0
    }

    const getPredikat = (score: number) => {
        if (score >= 90) return "A"
        if (score >= 80) return "B"
        if (score >= 70) return "C"
        return "D"
    }

    // Leger Data Calculation
    const legerData = useMemo(() => {
        if (!selectedClassId) return []

        const data = filteredStudents.map(student => {
            const scores: Record<number, number> = {}
            let totalScore = 0
            let subjectCount = 0

            mapel.forEach(m => {
                const score = calculateFinal(student.id, m.id)
                scores[m.id] = score
                if (score > 0) {
                    totalScore += score
                    subjectCount++
                }
            })

            const average = subjectCount > 0 ? Math.round(totalScore / subjectCount) : 0

            return {
                ...student,
                scores,
                totalScore,
                average
            }
        })

        // Sort by total score for ranking
        return data.sort((a, b) => b.totalScore - a.totalScore).map((item, index) => ({
            ...item,
            rank: index + 1
        }))
    }, [filteredStudents, mapel, grades, assignments, selectedClassId, weights, categories, selectedSemester])

    // Column Stats for Leger
    const columnStats = useMemo(() => {
        const stats: Record<number, { total: number, avg: number, max: number, min: number }> = {}

        mapel.forEach(m => {
            const scores = legerData.map(d => d.scores[m.id]).filter(s => s > 0)
            if (scores.length > 0) {
                const total = scores.reduce((a, b) => a + b, 0)
                stats[m.id] = {
                    total,
                    avg: Math.round(total / scores.length),
                    max: Math.max(...scores),
                    min: Math.min(...scores)
                }
            } else {
                stats[m.id] = { total: 0, avg: 0, max: 0, min: 0 }
            }
        })
        return stats
    }, [legerData, mapel])

    // Print Handler
    const componentRef = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Leger_Nilai_${selectedClassId || "Semua"}`,
    })

    // Export Handler
    const handleExport = () => {
        if (!selectedClassId) {
            alert("Pilih kelas terlebih dahulu")
            return
        }

        let csvContent = "data:text/csv;charset=utf-8,"

        if (viewMode === "detail") {
            // Header
            const categoryHeaders = categories.map(c => c.name).join(",")
            csvContent += `No,NISN,Nama Siswa,${categoryHeaders},Nilai Akhir,Predikat\n`

            // Rows
            filteredStudents.forEach((student, index) => {
                const mapelId = parseInt(selectedMapelId)
                const categoryScores = categories.map(c => getGrade(student.id, mapelId, c.id)).join(",")
                const final = calculateFinal(student.id, mapelId)
                const grade = getPredikat(final)

                csvContent += `${index + 1},${student.nis},"${student.name}",${categoryScores},${final},${grade}\n`
            })
        } else {
            // Leger Mode
            // Header
            const mapelHeaders = mapel.map(m => m.name).join(",")
            csvContent += `No,Nama Siswa,${mapelHeaders},Jumlah,Rata-rata,Rank\n`

            // Rows
            legerData.forEach((student, index) => {
                const scores = mapel.map(m => student.scores[m.id] || 0).join(",")
                csvContent += `${index + 1},"${student.name}",${scores},${student.totalScore},${student.average},${student.rank}\n`
            })
        }

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `Rekap_Nilai_${viewMode}_${selectedClassId}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (!isLoaded) {
        return (
            <div className="space-y-6 animate-in fade-in duration-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-40" />
                </div>

                <Card className="bg-card border-border">
                    <CardHeader className="border-b border-border pb-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-6 md:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardContent className="p-0">
                        <div className="space-y-4 py-4 px-6">
                            <div className="flex gap-4 mb-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Skeleton key={i} className="h-6 w-24" />
                                ))}
                            </div>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex gap-4">
                                    {[1, 2, 3, 4, 5, 6].map((j) => (
                                        <Skeleton key={j} className="h-4 w-full" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Rekap Nilai</h2>
                    <p className="text-gray-400">Lihat dan unduh rekapitulasi nilai siswa.</p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Cetak
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* View Toggle & Filters */}
            <div ref={componentRef} className="print:p-8 print:bg-white print:text-black min-w-[1000px]">
                {/* Kop Surat (Print Only) */}
                <div className="hidden print:block mb-8 text-black">
                    <div className="flex items-center gap-4 border-b-2 border-black pb-4 mb-4">
                        <div className="flex-1 text-center">
                            <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">{sekolah?.nama || "NAMA SEKOLAH"}</h1>
                            <p className="text-sm">{sekolah?.alamat || "Alamat Sekolah"}</p>
                        </div>
                    </div>
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold underline mb-2">LEGER NILAI SISWA</h2>
                        <p className="text-sm">
                            Kelas: {classes.find(c => c.id === parseInt(selectedClassId))?.name || "-"} |
                            Semester: {selectedSemester === "ganjil" ? "Ganjil" : "Genap"} |
                            Tahun: {sekolah?.tahunPelajaran || new Date().getFullYear()}
                        </p>
                    </div>
                </div>
                <Tabs defaultValue="detail" className="w-full" value={viewMode} onValueChange={setViewMode}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 no-print">
                        <TabsList className="bg-muted border border-border">
                            <TabsTrigger value="detail" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <LayoutList className="mr-2 h-4 w-4" />
                                Detail per Mapel
                            </TabsTrigger>
                            <TabsTrigger value="leger" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <TableIcon className="mr-2 h-4 w-4" />
                                Leger Kelas
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <Card className="bg-card border-border text-foreground mb-6 no-print">
                        <CardHeader className="border-b border-border pb-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Filter Data</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Kelas</Label>
                                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                        <SelectTrigger className="bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500">
                                            <SelectValue placeholder="Pilih Kelas" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-blue-50 border-blue-200">
                                            {classes.map(c => (
                                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {viewMode === "detail" && (
                                    <div className="space-y-2">
                                        <Label>Mata Pelajaran</Label>
                                        <Select value={selectedMapelId} onValueChange={setSelectedMapelId}>
                                            <SelectTrigger className="bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500">
                                                <SelectValue placeholder="Pilih Mapel" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-blue-50 border-blue-200">
                                                {mapel.map(m => (
                                                    <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label>Semester</Label>
                                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                                        <SelectTrigger className="bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500">
                                            <SelectValue placeholder="Pilih Semester" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-blue-50 border-blue-200">
                                            <SelectItem value="ganjil">Ganjil</SelectItem>
                                            <SelectItem value="genap">Genap</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <TabsContent value="detail" className="mt-0">
                        {selectedClassId && selectedMapelId ? (
                            <Card className="bg-card border-border text-foreground">
                                <CardContent className="p-0">
                                    <div className="relative overflow-x-auto max-h-[60vh] overflow-y-auto">
                                        <table className="w-full text-sm text-left print:text-xs print:text-black print:border-collapse print:bg-white">
                                            <thead className="text-xs text-muted-foreground uppercase border-b border-border bg-muted/50 sticky top-0 z-20 print:bg-white print:text-black print:border-black print:static">
                                                <tr>
                                                    <th className="px-6 py-4 font-medium print:border print:border-black print:p-1 print:text-center print:bg-white">No</th>
                                                    <th className="px-6 py-4 font-medium print:border print:border-black print:p-1 print:bg-white">NISN</th>
                                                    <th className="px-6 py-4 font-medium print:border print:border-black print:p-1 print:bg-white">Nama Siswa</th>
                                                    {categories.map(cat => (
                                                        <th key={cat.id} className="px-6 py-4 font-medium text-center print:border print:border-black print:p-1 print:bg-white">{cat.name}</th>
                                                    ))}
                                                    <th className="px-6 py-4 font-medium text-center print:border print:border-black print:p-1 print:bg-white">Akhir</th>
                                                    <th className="px-6 py-4 font-medium text-center print:border print:border-black print:p-1 print:bg-white">Predikat</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border print:divide-black">
                                                {filteredStudents.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={categories.length + 5} className="px-6 py-8 text-center text-muted-foreground print:text-black print:border print:border-black print:bg-white">
                                                            Tidak ada siswa di kelas ini.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredStudents.map((student, index) => {
                                                        const mapelId = parseInt(selectedMapelId)
                                                        const final = calculateFinal(student.id, mapelId)
                                                        const grade = getPredikat(final)

                                                        return (
                                                            <tr key={student.id} className="hover:bg-muted/50 transition-colors print:hover:bg-transparent">
                                                                <td className="px-6 py-4 text-muted-foreground print:text-black print:border print:border-black print:p-1 print:text-center print:bg-white">{index + 1}</td>
                                                                <td className="px-6 py-4 font-mono text-muted-foreground print:text-black print:border print:border-black print:p-1 print:bg-white">{student.nis}</td>
                                                                <td className="px-6 py-4 font-medium print:border print:border-black print:p-1 print:bg-white">{student.name}</td>
                                                                {categories.map(cat => (
                                                                    <td key={cat.id} className="px-6 py-4 text-center print:border print:border-black print:p-1 print:bg-white">
                                                                        {getGrade(student.id, mapelId, cat.id) || "-"}
                                                                    </td>
                                                                ))}
                                                                <td className="px-6 py-4 text-center font-bold text-primary print:text-black print:border print:border-black print:p-1 print:bg-white">{final || "-"}</td>
                                                                <td className="px-6 py-4 text-center print:border print:border-black print:p-1 print:bg-white">
                                                                    {final > 0 && (
                                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${grade === "A" ? "bg-green-500/10 text-green-500 print:bg-transparent print:text-black" :
                                                                            grade === "B" ? "bg-primary/10 text-primary print:bg-transparent print:text-black" :
                                                                                grade === "C" ? "bg-yellow-500/10 text-yellow-500 print:bg-transparent print:text-black" :
                                                                                    "bg-red-500/10 text-red-500 print:bg-transparent print:text-black"
                                                                            }`}>
                                                                            {grade}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground bg-muted/30 border border-border rounded-lg">
                                Pilih Kelas dan Mata Pelajaran untuk melihat detail.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="leger" className="mt-0">
                        {selectedClassId ? (
                            <Card className="bg-card border-border text-foreground">
                                <CardContent className="p-0">
                                    <div className="relative w-full overflow-x-auto max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent pb-4">
                                        <table className="w-full text-sm text-left whitespace-nowrap print:text-xs print:text-black print:border-collapse print:bg-white">
                                            <thead className="text-xs text-muted-foreground uppercase border-b border-border bg-muted/50 print:bg-white print:text-black print:border-black">
                                                <tr>
                                                    <th className="px-4 py-4 font-medium sticky left-0 bg-card z-20 w-16 min-w-[4rem] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:bg-white print:border print:border-black print:p-1 print:text-center print:shadow-none">No</th>
                                                    <th className="px-4 py-4 font-medium sticky left-16 bg-card z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:bg-white print:border print:border-black print:p-1 print:shadow-none">Nama Siswa</th>
                                                    {mapel.map(m => (
                                                        <th key={m.id} className="px-4 py-4 font-medium text-center border-l border-border print:border print:border-black print:p-1 print:bg-white">{m.name}</th>
                                                    ))}
                                                    <th className="px-4 py-4 font-medium text-center border-l border-border bg-primary/20 print:bg-white print:border print:border-black print:p-1">Jumlah</th>
                                                    <th className="px-4 py-4 font-medium text-center border-l border-border bg-primary/20 print:bg-white print:border print:border-black print:p-1">Rata-rata</th>
                                                    <th className="px-4 py-4 font-medium text-center border-l border-border bg-yellow-500/20 print:bg-white print:border print:border-black print:p-1">Rank</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border print:divide-black">
                                                {legerData.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={mapel.length + 5} className="px-6 py-8 text-center text-muted-foreground print:text-black print:border print:border-black print:bg-white">
                                                            Tidak ada siswa di kelas ini.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    legerData.map((student, index) => (
                                                        <tr key={student.id} className="hover:bg-muted/50 transition-colors print:hover:bg-transparent">
                                                            <td className="px-4 py-3 text-muted-foreground sticky left-0 bg-card z-10 w-16 min-w-[4rem] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:bg-white print:text-black print:border print:border-black print:p-1 print:text-center print:shadow-none">{index + 1}</td>
                                                            <td className="px-4 py-3 font-medium sticky left-16 bg-card z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:bg-white print:text-black print:border print:border-black print:p-1 print:shadow-none">{student.name}</td>
                                                            {mapel.map(m => (
                                                                <td key={m.id} className="px-4 py-3 text-center border-l border-border print:border print:border-black print:p-1 print:bg-white">
                                                                    {student.scores[m.id] || "-"}
                                                                </td>
                                                            ))}
                                                            <td className="px-4 py-3 text-center font-bold text-primary border-l border-border bg-primary/10 print:bg-white print:text-black print:border print:border-black print:p-1">
                                                                {student.totalScore}
                                                            </td>
                                                            <td className="px-4 py-3 text-center font-bold text-primary border-l border-border bg-primary/10 print:bg-white print:text-black print:border print:border-black print:p-1">
                                                                {student.average}
                                                            </td>
                                                            <td className="px-4 py-3 text-center font-bold text-yellow-500 border-l border-border bg-yellow-500/10 print:bg-white print:text-black print:border print:border-black print:p-1">
                                                                #{student.rank}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                                {/* Footer Stats */}
                                                {legerData.length > 0 && (
                                                    <>
                                                        <tr className="bg-muted/30 font-medium border-t-2 border-border print:bg-transparent print:border-black">
                                                            <td className="px-4 py-3 text-right sticky left-0 bg-card z-10 w-16 min-w-[4rem] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:bg-white print:text-black print:border print:border-black print:p-1 print:shadow-none"></td>
                                                            <td className="px-4 py-3 text-right sticky left-16 bg-card z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:bg-white print:text-black print:border print:border-black print:p-1 print:shadow-none">Jumlah</td>
                                                            {mapel.map(m => (
                                                                <td key={m.id} className="px-4 py-3 text-center border-l border-border print:border print:border-black print:p-1 print:bg-white">
                                                                    {columnStats[m.id].total}
                                                                </td>
                                                            ))}
                                                            <td colSpan={3} className="border-l border-border print:border print:border-black print:bg-white"></td>
                                                        </tr>
                                                        <tr className="bg-muted/30 font-medium print:bg-transparent">
                                                            <td className="px-4 py-3 text-right sticky left-0 bg-card z-10 w-16 min-w-[4rem] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:bg-white print:text-black print:border print:border-black print:p-1 print:shadow-none"></td>
                                                            <td className="px-4 py-3 text-right sticky left-16 bg-card z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:bg-white print:text-black print:border print:border-black print:p-1 print:shadow-none">Rata-rata</td>
                                                            {mapel.map(m => (
                                                                <td key={m.id} className="px-4 py-3 text-center border-l border-border print:border print:border-black print:p-1 print:bg-white">
                                                                    {columnStats[m.id].avg}
                                                                </td>
                                                            ))}
                                                            <td colSpan={3} className="border-l border-border print:border print:border-black print:bg-white"></td>
                                                        </tr>
                                                        <tr className="bg-muted/30 font-medium print:bg-transparent">
                                                            <td className="px-4 py-3 text-right sticky left-0 bg-card z-10 w-16 min-w-[4rem] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:bg-white print:text-black print:border print:border-black print:p-1 print:shadow-none"></td>
                                                            <td className="px-4 py-3 text-right sticky left-16 bg-card z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:bg-white print:text-black print:border print:border-black print:p-1 print:shadow-none">Tertinggi</td>
                                                            {mapel.map(m => (
                                                                <td key={m.id} className="px-4 py-3 text-center border-l border-border text-green-500 print:text-black print:border print:border-black print:p-1 print:bg-white">
                                                                    {columnStats[m.id].max}
                                                                </td>
                                                            ))}
                                                            <td colSpan={3} className="border-l border-border print:border print:border-black print:bg-white"></td>
                                                        </tr>
                                                        <tr className="bg-muted/30 font-medium print:bg-transparent">
                                                            <td className="px-4 py-3 text-right sticky left-0 bg-card z-10 w-16 min-w-[4rem] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:bg-white print:text-black print:border print:border-black print:p-1 print:shadow-none"></td>
                                                            <td className="px-4 py-3 text-right sticky left-16 bg-card z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:bg-white print:text-black print:border print:border-black print:p-1 print:shadow-none">Terendah</td>
                                                            {mapel.map(m => (
                                                                <td key={m.id} className="px-4 py-3 text-center border-l border-border text-red-500 print:text-black print:border print:border-black print:p-1 print:bg-white">
                                                                    {columnStats[m.id].min}
                                                                </td>
                                                            ))}
                                                            <td colSpan={3} className="border-l border-border print:border print:border-black print:bg-white"></td>
                                                        </tr>
                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground bg-muted/30 border border-border rounded-lg">
                                Pilih Kelas untuk melihat leger nilai.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Signatures (Print Only) */}
                <div className="hidden print:flex justify-between mt-16 text-black px-8 page-break-inside-avoid">
                    <div className="text-center min-w-[200px]">
                        <p className="mb-1">Mengetahui,</p>
                        <p className="font-semibold mb-24">Kepala Sekolah</p>
                        <p className="font-bold underline decoration-2">{sekolah?.kepala || "........................."}</p>
                        <p>NIP. {sekolah?.nipKepala || "-"}</p>
                    </div>
                    <div className="text-center min-w-[200px]">
                        <p className="mb-1">{sekolah?.kabupatenKota || sekolah?.alamat?.split(',').pop()?.trim() || "Jakarta"}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p className="font-semibold mb-24">Guru Mata Pelajaran</p>
                        <p className="font-bold underline decoration-2">{user?.name || "........................."}</p>
                        <p>NIP. {user?.nip || "-"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
