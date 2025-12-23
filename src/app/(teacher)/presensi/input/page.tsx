"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CalendarCheck, Save, Search } from "lucide-react"
import { useData, AttendanceRecord } from "@/lib/data-context"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function InputPresensiPage() {
    const { classes, students, attendance, saveAttendance, isLoaded } = useData()
    const { toast } = useToast()

    const [selectedClassId, setSelectedClassId] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [searchQuery, setSearchQuery] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    // Local state for attendance form
    const [formState, setFormState] = useState<Record<number, "H" | "S" | "I" | "A">>({})

    // Load existing attendance when class/date changes
    useEffect(() => {
        if (selectedClassId && selectedDate) {
            const classId = parseInt(selectedClassId)
            const existingRecords = attendance.filter(
                a => a.classId === classId && a.date === selectedDate
            )

            const newFormState: Record<number, "H" | "S" | "I" | "A"> = {}

            // Default to 'H' (Hadir) for all students in the class if no record exists
            const classStudents = students.filter(s => s.class === classes.find(c => c.id === classId)?.name)

            classStudents.forEach(student => {
                const record = existingRecords.find(r => r.studentId === student.id)
                newFormState[student.id] = record ? record.status : "H"
            })

            setFormState(newFormState)
        }
    }, [selectedClassId, selectedDate, attendance, classes, students])

    const handleStatusChange = (studentId: number, status: "H" | "S" | "I" | "A") => {
        setFormState(prev => ({ ...prev, [studentId]: status }))
    }

    const handleSave = () => {
        if (!selectedClassId) {
            toast({ title: "Error", description: "Pilih kelas terlebih dahulu", variant: "destructive" })
            return
        }

        setIsSaving(true)
        const classId = parseInt(selectedClassId)
        const records: AttendanceRecord[] = Object.entries(formState).map(([studentId, status]) => ({
            id: `${selectedDate}-${studentId}`,
            date: selectedDate,
            classId,
            studentId: parseInt(studentId),
            status
        }))

        setTimeout(() => {
            saveAttendance(records)
            setIsSaving(false)
        }, 500)
    }

    // Filter students
    const filteredStudents = selectedClassId
        ? students
            .filter(s => s.class === classes.find(c => c.id === parseInt(selectedClassId))?.name)
            .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : []

    if (!isLoaded) {
        return (
            <div className="space-y-6 pb-24 animate-in fade-in duration-700">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>

                <Card className="bg-card border-border">
                    <CardContent className="pt-6">
                        <div className="grid gap-6 md:grid-cols-3 items-end">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Card className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <Skeleton className="h-6 w-32" />
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-4 w-16" />
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((j) => (
                                            <Skeleton key={j} className="h-8 w-10 rounded-md" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-24">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Input Presensi</h2>
                <p className="text-muted-foreground">Catat kehadiran siswa harian.</p>
            </div>

            <Card className="bg-card border-border text-foreground">
                <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-3 items-end">
                        <div className="space-y-2">
                            <Label>Pilih Kelas</Label>
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
                        <div className="space-y-2">
                            <Label>Tanggal</Label>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-muted border-none text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Cari Siswa</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Nama siswa..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-muted border-none text-foreground"
                                    disabled={!selectedClassId}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedClassId && (
                <div className="space-y-4 mb-4">
                    {/* Sunday Warning */}
                    {new Date(selectedDate).getDay() === 0 && (
                        <div className="p-3 rounded-lg border bg-red-50 border-red-200 text-red-700 flex items-center gap-3">
                            <div className="h-5 w-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">!</div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold">Hari Minggu</p>
                                <p className="text-xs opacity-90">
                                    Tanggal yang Anda pilih adalah hari Minggu (Libur).
                                </p>
                            </div>
                        </div>
                    )}

                    <div className={`p-3 rounded-lg border flex items-center gap-3 ${attendance.some(a => a.classId === parseInt(selectedClassId) && a.date === selectedDate)
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-yellow-50 border-yellow-200 text-yellow-700"
                        }`}>
                        {attendance.some(a => a.classId === parseInt(selectedClassId) && a.date === selectedDate) ? (
                            <CalendarCheck className="h-5 w-5" />
                        ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">!</div>
                        )}
                        <div className="flex-1">
                            <p className="text-sm font-semibold">
                                {attendance.some(a => a.classId === parseInt(selectedClassId) && a.date === selectedDate)
                                    ? "Presensi Sudah Diinput"
                                    : "Presensi Belum Diinput"
                                }
                            </p>
                            <p className="text-xs opacity-90">
                                {attendance.some(a => a.classId === parseInt(selectedClassId) && a.date === selectedDate)
                                    ? `Data kehadiran untuk tanggal ${selectedDate} sudah tersimpan.`
                                    : `Silakan input dan simpan data kehadiran untuk tanggal ${selectedDate}.`
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {selectedClassId && (
                <Card className="bg-card border-border text-foreground">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Daftar Siswa</CardTitle>
                        <div className="flex gap-2 text-sm">
                            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Hadir</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Sakit</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Izin</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Alpa</div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <div key={student.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-xs text-muted-foreground">{student.nis}</p>
                                        </div>
                                        <div className="flex bg-card rounded-lg p-1 border border-border">
                                            {(["H", "S", "I", "A"] as const).map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(student.id, status)}
                                                    className={`
                                                        w-10 h-8 rounded-md text-sm font-medium transition-colors
                                                        ${formState[student.id] === status
                                                            ? status === "H" ? "bg-green-500 text-white"
                                                                : status === "S" ? "bg-blue-500 text-white"
                                                                    : status === "I" ? "bg-yellow-500 text-black"
                                                                        : "bg-red-500 text-white"
                                                            : "text-muted-foreground hover:bg-muted"
                                                        }
                                                    `}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Tidak ada siswa ditemukan.
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90" disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving ? "Menyimpan..." : "Simpan Presensi"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
