"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Plus,
    Search,
    Calendar,
    BookOpen,
    MoreVertical,
    FileText,
    Clock,
    X,
    Filter,
    Edit,
    Trash2,
    CheckCircle2,
    AlertCircle,
    LayoutList
} from "lucide-react"
import { useData, Assignment } from "@/lib/data-context"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function TugasPage() {
    const { assignments, addAssignment, updateAssignment, deleteAssignment, classes, mapel, categories, students, grades, isLoaded } = useData()
    const { toast } = useToast()

    // State
    const [searchQuery, setSearchQuery] = useState("")
    const [filterClass, setFilterClass] = useState("")
    const [filterMapel, setFilterMapel] = useState("")
    const [filterStatus, setFilterStatus] = useState("")

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    // Form State
    const [formData, setFormData] = useState<{
        title: string
        mapelId: string
        classId: string
        categoryId: string
        dueDate: string
        status: "Active" | "Closed" | "Draft"
    }>({
        title: "",
        mapelId: "",
        classId: "",
        categoryId: "",
        dueDate: "",
        status: "Active"
    })

    // Helper Functions
    const getMapelName = (id: number) => mapel.find(m => m.id === id)?.name || "Unknown"
    const getClassName = (id: number) => classes.find(c => c.id === id)?.name || "Unknown"
    const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || "Unknown"

    const getSubmissionStats = (assignmentId: number, classId: number) => {
        const classStudents = students.filter(s => s.class === getClassName(classId))
        const totalStudents = classStudents.length
        const submittedCount = grades.filter(g => g.assignmentId === assignmentId).length

        return { submittedCount, totalStudents }
    }

    // Derived Data
    const processedAssignments = useMemo(() => {
        return assignments.map(a => {
            const stats = getSubmissionStats(a.id, a.classId)
            const isCompleted = stats.totalStudents > 0 && stats.submittedCount === stats.totalStudents
            const isOverdue = new Date(a.dueDate) < new Date() && a.status !== "Closed" && !isCompleted

            let displayStatus: string = a.status
            if (isCompleted) displayStatus = "Selesai" // Virtual status for display

            return {
                ...a,
                stats,
                isCompleted,
                isOverdue,
                displayStatus
            }
        }).sort((a, b) => b.id - a.id) // Sort by newest
    }, [assignments, students, grades])

    const filteredAssignments = useMemo(() => {
        return processedAssignments.filter(a => {
            const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesClass = filterClass && filterClass !== "all" ? a.classId.toString() === filterClass : true
            const matchesMapel = filterMapel && filterMapel !== "all" ? a.mapelId.toString() === filterMapel : true
            const matchesStatus = filterStatus && filterStatus !== "all" ? (
                filterStatus === "Selesai" ? a.isCompleted :
                    filterStatus === "Lewat" ? a.isOverdue :
                        a.status === filterStatus
            ) : true

            return matchesSearch && matchesClass && matchesMapel && matchesStatus
        })
    }, [processedAssignments, searchQuery, filterClass, filterMapel, filterStatus])

    // Summary Stats
    const summary = {
        total: processedAssignments.length,
        active: processedAssignments.filter(a => a.status === "Active" && !a.isCompleted && !a.isOverdue).length,
        overdue: processedAssignments.filter(a => a.isOverdue).length,
        completed: processedAssignments.filter(a => a.isCompleted || a.status === "Closed").length
    }

    // Handlers
    const handleOpenCreate = () => {
        setEditingId(null)
        setFormData({
            title: "",
            mapelId: "",
            classId: "",
            categoryId: "",
            dueDate: "",
            status: "Active"
        })
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (assignment: Assignment) => {
        setEditingId(assignment.id)
        setFormData({
            title: assignment.title,
            mapelId: assignment.mapelId.toString(),
            classId: assignment.classId.toString(),
            categoryId: assignment.categoryId.toString(),
            dueDate: assignment.dueDate,
            status: assignment.status
        })
        setIsDialogOpen(true)
    }

    const handleSubmit = () => {
        if (!formData.title || !formData.mapelId || !formData.classId || !formData.categoryId || !formData.dueDate) {
            toast({ title: "Gagal", description: "Mohon lengkapi semua data", variant: "destructive" })
            return
        }

        const payload = {
            title: formData.title,
            mapelId: parseInt(formData.mapelId),
            classId: parseInt(formData.classId),
            categoryId: parseInt(formData.categoryId),
            dueDate: formData.dueDate,
            status: formData.status
        }

        if (editingId) {
            updateAssignment(editingId, payload)
        } else {
            addAssignment(payload)
        }
        setIsDialogOpen(false)
    }

    const handleDeleteClick = (id: number) => {
        setDeletingId(id)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (deletingId) {
            deleteAssignment(deletingId)
            setIsDeleteDialogOpen(false)
            setDeletingId(null)
        }
    }

    const getStatusBadge = (item: typeof processedAssignments[0]) => {
        if (item.isCompleted) return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Selesai</Badge>
        if (item.isOverdue) return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Lewat Deadline</Badge>
        if (item.status === "Closed") return <Badge className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">Ditutup</Badge>
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Aktif</Badge>
    }

    if (!isLoaded) {
        return (
            <div className="space-y-6 animate-in fade-in duration-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="bg-card border-border">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="bg-card border-border">
                    <CardContent className="p-4">
                        <div className="grid gap-4 md:grid-cols-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardContent className="p-0">
                        <div className="space-y-4 py-4 px-6">
                            <div className="flex gap-4 mb-4">
                                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <Skeleton key={i} className="h-6 w-24" />
                                ))}
                            </div>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex gap-4">
                                    {[1, 2, 3, 4, 5, 6, 7].map((j) => (
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Daftar Tugas</h2>
                    <p className="text-gray-400">Kelola tugas dan latihan untuk siswa.</p>
                </div>
                <Button onClick={handleOpenCreate} className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Tugas Baru
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-card border-border text-foreground">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Tugas</p>
                            <h3 className="text-2xl font-bold mt-2">{summary.total}</h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <LayoutList className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border text-foreground">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Tugas Aktif</p>
                            <h3 className="text-2xl font-bold mt-2">{summary.active}</h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                            <Clock className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border text-foreground">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Lewat Deadline</p>
                            <h3 className="text-2xl font-bold mt-2">{summary.overdue}</h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border text-foreground">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Selesai</p>
                            <h3 className="text-2xl font-bold mt-2">{summary.completed}</h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="bg-card border-border">
                <CardContent className="p-4">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Cari judul tugas..."
                                className="pl-9 bg-blue-50 border-blue-200 text-blue-900 placeholder:text-blue-400 focus-visible:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Select value={filterClass} onValueChange={setFilterClass}>
                            <SelectTrigger className="h-10 bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Semua Kelas" />
                            </SelectTrigger>
                            <SelectContent className="bg-blue-50 border-blue-200">
                                <SelectItem value="all">Semua Kelas</SelectItem>
                                {classes.map(c => (
                                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filterMapel} onValueChange={setFilterMapel}>
                            <SelectTrigger className="h-10 bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Semua Mata Pelajaran" />
                            </SelectTrigger>
                            <SelectContent className="bg-blue-50 border-blue-200">
                                <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                                {mapel.map(m => (
                                    <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="h-10 bg-blue-50 border-blue-200 text-blue-700 focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-blue-50 border-blue-200">
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="Active">Aktif</SelectItem>
                                <SelectItem value="Closed">Ditutup</SelectItem>
                                <SelectItem value="Selesai">Selesai</SelectItem>
                                <SelectItem value="Lewat">Lewat Deadline</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Assignments Table */}
            <Card className="bg-card border-border text-foreground">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/50 border-b border-border">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="text-muted-foreground">Judul Tugas</TableHead>
                                <TableHead className="text-muted-foreground">Mapel & Kelas</TableHead>
                                <TableHead className="text-muted-foreground">Kategori</TableHead>
                                <TableHead className="text-muted-foreground">Deadline</TableHead>
                                <TableHead className="text-muted-foreground">Status</TableHead>
                                <TableHead className="text-muted-foreground">Progress</TableHead>
                                <TableHead className="text-right text-muted-foreground">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAssignments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                        Tidak ada tugas ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAssignments.map((assignment) => (
                                    <TableRow key={assignment.id} className="border-border hover:bg-muted/50">
                                        <TableCell className="font-medium">
                                            {assignment.title}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{getMapelName(assignment.mapelId)}</span>
                                                <span className="text-xs text-muted-foreground">{getClassName(assignment.classId)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getCategoryName(assignment.categoryId)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                {assignment.dueDate}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(assignment)}</TableCell>
                                        <TableCell>
                                            <div className="w-full max-w-[100px]">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-primary">{assignment.stats.submittedCount}</span>
                                                    <span className="text-muted-foreground">/ {assignment.stats.totalStudents}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full"
                                                        style={{ width: `${assignment.stats.totalStudents > 0 ? (assignment.stats.submittedCount / assignment.stats.totalStudents) * 100 : 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                                    onClick={() => handleOpenEdit(assignment)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    onClick={() => handleDeleteClick(assignment.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-card border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Tugas" : "Buat Tugas Baru"}</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Isi detail tugas di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Judul Tugas</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="bg-muted border-border focus-visible:ring-primary"
                                placeholder="Contoh: Latihan Soal Bab 1"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Mata Pelajaran</Label>
                                <Select value={formData.mapelId} onValueChange={(value) => setFormData({ ...formData, mapelId: value })}>
                                    <SelectTrigger className="bg-muted border-border focus:ring-primary">
                                        <SelectValue placeholder="Pilih Mapel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mapel.map(m => (
                                            <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Kelas</Label>
                                <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value })}>
                                    <SelectTrigger className="bg-muted border-border focus:ring-primary">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Kategori</Label>
                                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                                    <SelectTrigger className="bg-muted border-border focus:ring-primary">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tenggat Waktu</Label>
                                <Input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="bg-muted border-border focus-visible:ring-primary"
                                />
                            </div>
                        </div>
                        {editingId && (
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                                    <SelectTrigger className="bg-muted border-border focus:ring-primary">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border text-muted-foreground hover:bg-muted hover:text-foreground">Batal</Button>
                        <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-card border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>Hapus Tugas</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-border text-muted-foreground hover:bg-muted hover:text-foreground">Batal</Button>
                        <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
