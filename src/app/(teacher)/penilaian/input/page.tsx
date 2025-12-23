"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Save, Filter, Download } from "lucide-react"
import { useData, Grade } from "@/lib/data-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function InputNilaiPage() {
    const { classes, mapel, categories, students, grades, saveGrades, assignments, isLoaded } = useData()
    const { toast } = useToast()

    const [selectedClassId, setSelectedClassId] = useState("")
    const [selectedMapelId, setSelectedMapelId] = useState("")
    const [selectedCategoryId, setSelectedCategoryId] = useState("")

    // Local state for grades input
    const [inputGrades, setInputGrades] = useState<Record<number, number>>({})

    // Filter students by class
    const filteredStudents = students.filter(s => {
        const cls = classes.find(c => c.id === parseInt(selectedClassId))
        return cls && s.class === cls.name
    })

    // Find active assignment for this context (optional, or we just save grades directly linked to category/mapel if no specific assignment)
    // For this implementation, let's assume we are inputting grades for a specific "Assignment" or just a Category bucket.
    // To keep it simple and consistent with the "Tugas" page, let's try to find an assignment that matches.
    // OR, we can just save grades based on (studentId, mapelId, categoryId) if we want to be more generic.
    // However, the `Grade` interface links to `assignmentId`. 
    // So we should probably select an Assignment first?
    // The UI design shows "Jenis Penilaian" (Category). 
    // Let's assume we auto-create or find a placeholder assignment for (Class + Mapel + Category + Date/Period).
    // To simplify: let's add an "Assignment" dropdown if Category is "Tugas", or just treat Category as the bucket.

    // REVISION: The `Grade` interface I added has `assignmentId`. 
    // If I want to support "Ulangan Harian" which might not be a "Tugas", I should probably have `assessmentId` or similar.
    // But for now, let's assume we select an Assignment from the list.
    // If the user selects "Ulangan Harian", we might need to create a "dummy" assignment or have a different flow.
    // Let's stick to the plan: Select Class, Mapel, Category.
    // IF Category is "Tugas", maybe show Assignment dropdown?
    // Let's simplify: We will create a "Grade Entry" which acts as an assignment container for things like UH/UTS/UAS.
    // For now, I will fetch assignments that match the criteria.

    const [selectedAssignmentId, setSelectedAssignmentId] = useState("")

    const availableAssignments = assignments.filter(a =>
        a.classId.toString() === selectedClassId &&
        a.mapelId.toString() === selectedMapelId &&
        a.categoryId.toString() === selectedCategoryId
    )

    // Load existing grades when selection changes
    useEffect(() => {
        if (selectedAssignmentId) {
            const currentGrades: Record<number, number> = {}
            grades.filter(g => g.assignmentId === parseInt(selectedAssignmentId)).forEach(g => {
                currentGrades[g.studentId] = g.score
            })
            setInputGrades(currentGrades)
        } else {
            setInputGrades({})
        }
    }, [selectedAssignmentId, grades])

    const handleSave = () => {
        if (!selectedAssignmentId) {
            toast({
                title: "Error",
                description: "Pilih tugas/penilaian terlebih dahulu",
                variant: "destructive"
            })
            return
        }

        const newGrades: Grade[] = Object.entries(inputGrades).map(([studentId, score]) => ({
            id: `${selectedAssignmentId}-${studentId}`,
            assignmentId: parseInt(selectedAssignmentId),
            studentId: parseInt(studentId),
            score: score
        }))

        saveGrades(newGrades)
    }

    const handleScoreChange = (studentId: number, value: string) => {
        const score = parseInt(value)
        if (!isNaN(score) && score >= 0 && score <= 100) {
            setInputGrades(prev => ({ ...prev, [studentId]: score }))
        } else if (value === "") {
            const newGrades = { ...inputGrades }
            delete newGrades[studentId]
            setInputGrades(newGrades)
        }
    }

    if (!isLoaded) {
        return (
            <div className="space-y-6 animate-in fade-in duration-700">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>

                <Card className="bg-card border-border">
                    <CardHeader className="border-b border-border pb-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-6 md:grid-cols-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-4 py-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-8" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-10 w-32" />
                                    <Skeleton className="h-6 w-20" />
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
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Input Nilai</h2>
                <p className="text-gray-400">Masukkan nilai siswa berdasarkan kelas dan mata pelajaran.</p>
            </div>

            {/* Filters / Selection */}
            <Card className="bg-card border-border text-foreground">
                <CardHeader className="border-b border-border pb-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Filter Data</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-4">
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
                        <div className="space-y-2">
                            <Label>Kategori</Label>
                            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                                <SelectTrigger className="bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent className="bg-blue-50 border-blue-200">
                                    {categories.map(c => (
                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Penilaian (Tugas)</Label>
                            <Select
                                value={selectedAssignmentId}
                                onValueChange={setSelectedAssignmentId}
                                disabled={!selectedClassId || !selectedMapelId || !selectedCategoryId}
                            >
                                <SelectTrigger className="bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Pilih Penilaian" />
                                </SelectTrigger>
                                <SelectContent className="bg-blue-50 border-blue-200">
                                    {availableAssignments.map(a => (
                                        <SelectItem key={a.id} value={a.id.toString()}>{a.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {availableAssignments.length === 0 && selectedClassId && selectedMapelId && selectedCategoryId && (
                                <p className="text-xs text-red-400">Tidak ada tugas/penilaian ditemukan. Buat baru di menu Tugas.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Input Table */}
            {selectedClassId && selectedAssignmentId && (
                <Card className="bg-card border-border text-foreground">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                        <CardTitle className="text-lg">Daftar Siswa</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" className="border-border text-muted-foreground hover:bg-muted hover:text-foreground">
                                <Download className="mr-2 h-4 w-4" />
                                Import Excel
                            </Button>
                            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Nilai
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">No</th>
                                        <th className="px-6 py-4 font-medium">NISN</th>
                                        <th className="px-6 py-4 font-medium">Nama Siswa</th>
                                        <th className="px-6 py-4 font-medium w-32">Nilai</th>
                                        <th className="px-6 py-4 font-medium">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                                Tidak ada siswa di kelas ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student, index) => {
                                            const score = inputGrades[student.id]
                                            return (
                                                <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                                                    <td className="px-6 py-4 text-muted-foreground">{index + 1}</td>
                                                    <td className="px-6 py-4 font-mono text-muted-foreground">{student.nis}</td>
                                                    <td className="px-6 py-4 font-medium">{student.name}</td>
                                                    <td className="px-6 py-4">
                                                        <Input
                                                            type="number"
                                                            className="bg-muted border-none text-center focus:ring-primary"
                                                            value={score !== undefined ? score : ""}
                                                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                            max={100}
                                                            min={0}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {score !== undefined && (
                                                            <span className={`px-2 py-1 rounded text-xs ${score >= 75
                                                                ? "bg-green-500/10 text-green-500"
                                                                : "bg-red-500/10 text-red-500"
                                                                }`}>
                                                                {score >= 75 ? "Tuntas" : "Belum Tuntas"}
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
            )}
        </div>
    )
}
