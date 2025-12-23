"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Users, Search, Download, Upload } from "lucide-react"
import { CustomModal } from "@/components/ui/custom-modal"
import { useData, StudentData } from "@/lib/data-context"
import { useToast } from "@/components/ui/use-toast"
import * as XLSX from "xlsx"
import { Skeleton } from "@/components/ui/skeleton"

import { useSearchParams } from "next/navigation"

import { Suspense } from "react"

function DataSiswaContent() {
    const { students, classes, addStudent, updateStudent, deleteStudent, isSyncing, syncError, forceSync, isLoaded } = useData()
    const { toast } = useToast()
    const searchParams = useSearchParams()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState<Partial<StudentData>>({})
    const [filterClass, setFilterClass] = useState("Semua Kelas")
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

    // Calculate summary from context data
    const classSummary = classes.map(cls => ({
        name: cls.name,
        count: students.filter(s => s.class === cls.name).length
    }))

    const filteredStudents = students.filter(student => {
        const matchesClass = filterClass === "Semua Kelas" || student.class === filterClass
        const matchesSearch = (student.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (student.nis || "").toString().includes(searchQuery)
        return matchesClass && matchesSearch
    })

    const handleAdd = () => {
        setEditingId(null)
        setFormData({
            status: "Aktif",
            class: classes[0]?.name || "",
            password: "pass123",
            points: 0,
            level: 1
        })
        setIsModalOpen(true)
    }

    const handleEdit = (student: StudentData) => {
        setEditingId(student.id)
        setFormData({ ...student })
        setIsModalOpen(true)
    }

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus siswa ini?")) {
            deleteStudent(id)
        }
    }

    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        // Simulate processing delay to prevent double clicks
        setTimeout(() => {
            if (editingId) {
                updateStudent(editingId, formData)
            } else {
                addStudent({
                    name: formData.name!,
                    nis: formData.nis!,
                    class: formData.class!,
                    status: formData.status!,
                    username: formData.username,
                    password: formData.password || "pass123",
                    points: formData.points || 0,
                    level: formData.level || 1,
                    badges: []
                })
            }
            setIsModalOpen(false)
            setIsSaving(false)
        }, 500)
    }

    const handleDownloadFormat = () => {
        const headers = [
            ["Nama Lengkap", "NISN", "Kelas", "Username", "Password"]
        ]
        const ws = XLSX.utils.aoa_to_sheet(headers)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Format Import")
        XLSX.writeFile(wb, "format_import_siswa.xlsx")
    }

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const data = new Uint8Array(event.target?.result as ArrayBuffer)
            const workbook = XLSX.read(data, { type: "array" })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

            let successCount = 0
            let failCount = 0

            // Skip header (index 0)
            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i]
                if (!row || row.length === 0) continue

                const [name, nis, className, username, password] = row

                if (name && nis && className) {
                    addStudent({
                        name: String(name).trim(),
                        nis: String(nis).trim(),
                        class: String(className).trim(),
                        username: username ? String(username).trim() : "",
                        password: password ? String(password).trim() : "",
                        status: "Aktif",
                        points: 0,
                        level: 1,
                        badges: []
                    })
                    successCount++
                } else {
                    failCount++
                }
            }

            toast({
                title: `Import Selesai. Berhasil: ${successCount}, Gagal: ${failCount}`,
                variant: successCount > 0 ? "success" : "destructive"
            })
        }
        reader.readAsArrayBuffer(file)

        // Reset input
        e.target.value = ""
    }

    if (!isLoaded) {
        return (
            <div className="space-y-6 animate-in fade-in duration-700">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                {/* Class Summary Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="bg-card border-border">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-6 w-8" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters Skeleton */}
                <div className="flex gap-4 bg-card p-4 rounded-lg border border-border">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-40" />
                </div>

                {/* Table Skeleton */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-border">
                            <div className="border-b border-border bg-muted p-4">
                                <div className="flex justify-between">
                                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                        <Skeleton key={i} className="h-4 w-20" />
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-8" />
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Data Siswa</h2>
                    <p className="text-muted-foreground">Kelola data siswa dan akun pengguna.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownloadFormat} className="border-dashed border-muted-foreground text-muted-foreground hover:text-foreground hover:border-foreground">
                        <Download className="mr-2 h-4 w-4" />
                        Unduh Format Excel
                    </Button>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleImport}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="outline" className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20 hover:bg-emerald-600/20">
                            <Upload className="mr-2 h-4 w-4" />
                            Import Excel
                        </Button>
                    </div>
                    <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Siswa
                    </Button>
                </div>
            </div>

            {/* Class Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {classSummary.map((item, index) => (
                    <Card key={index} className="bg-card border-border text-foreground">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-muted-foreground mb-1">{item.name}</span>
                            <div className="flex items-center gap-1 text-xl font-bold text-primary">
                                <Users className="h-4 w-4" />
                                {item.count}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-4 bg-card p-4 rounded-lg border border-border">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama atau NISN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-muted border-none text-foreground"
                    />
                </div>
                <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="h-10 rounded-md bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary border-none min-w-[150px]"
                >
                    <option value="Semua Kelas">Semua Kelas</option>
                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.name}>{cls.name}</option>
                    ))}
                </select>
            </div>

            <Card className="bg-card border-border text-foreground">
                <CardHeader>
                    <CardTitle>Daftar Siswa</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-medium">Nama Lengkap</th>
                                    <th className="p-4 font-medium">NISN</th>
                                    <th className="p-4 font-medium">Kelas</th>
                                    <th className="p-4 font-medium">Username</th>
                                    <th className="p-4 font-medium">Password</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                            Tidak ada data siswa ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className="border-t border-border hover:bg-muted/50">
                                            <td className="p-4 font-medium">{student.name}</td>
                                            <td className="p-4 text-muted-foreground">{student.nis}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                    {student.class}
                                                </span>
                                            </td>
                                            <td className="p-4 text-muted-foreground">{student.username || "-"}</td>
                                            <td className="p-4 text-muted-foreground font-mono">••••••</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${student.status?.toLowerCase() === "aktif"
                                                    ? "bg-green-500/10 text-green-600"
                                                    : "bg-red-500/10 text-red-600"
                                                    }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(student)} className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Data Siswa" : "Tambah Siswa Baru"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-muted border-none text-foreground"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nis">NISN</Label>
                            <Input
                                id="nis"
                                value={formData.nis || ""}
                                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                                className="bg-muted border-none text-foreground"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="class">Kelas</Label>
                            <select
                                id="class"
                                value={formData.class || ""}
                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                className="flex h-10 w-full rounded-md bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            >
                                <option value="" disabled>Pilih Kelas</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={formData.username || ""}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="bg-muted border-none text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password || ""}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-muted border-none text-foreground"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            value={formData.status || "Aktif"}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="flex h-10 w-full rounded-md bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Aktif">Aktif</option>
                            <option value="Non-Aktif">Non-Aktif</option>
                            <option value="Pindah">Pindah</option>
                            <option value="Lulus">Lulus</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="hover:bg-muted hover:text-foreground">Batal</Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSaving}>
                            {isSaving ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </form>
            </CustomModal>
        </div>
    )
}

export default function DataSiswaPage() {
    return (
        <Suspense fallback={
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
            </div>
        }>
            <DataSiswaContent />
        </Suspense>
    )
}
