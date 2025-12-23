"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Users, GraduationCap } from "lucide-react"
import { CustomModal } from "@/components/ui/custom-modal"
import { useData, ClassData } from "@/lib/data-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function DataKelasPage() {
    const { classes, students, addClass, updateClass, deleteClass, isLoaded, user } = useData()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({ name: "", description: "", waliKelas: "" })
    const [editingId, setEditingId] = useState<number | null>(null)

    const handleAdd = () => {
        setEditingId(null)
        setFormData({ name: "", description: "", waliKelas: user.name || "" })
        setIsModalOpen(true)
    }

    const handleEdit = (cls: ClassData) => {
        setEditingId(cls.id)
        setFormData({ name: cls.name, description: cls.description, waliKelas: cls.waliKelas || "" })
        setIsModalOpen(true)
    }

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
            deleteClass(id)
        }
    }

    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        // Simulate processing delay to prevent double clicks
        setTimeout(() => {
            if (editingId) {
                updateClass(editingId, {
                    name: formData.name,
                    description: formData.description,
                    waliKelas: formData.waliKelas
                })
            } else {
                addClass({
                    name: formData.name,
                    description: formData.description,
                    waliKelas: formData.waliKelas || user.name || "Guru"
                })
            }
            setIsModalOpen(false)
            setIsSaving(false)
        }, 500)
    }

    if (!isLoaded) {
        return (
            <div className="space-y-6 animate-in fade-in duration-700">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="bg-card border-border h-40">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-8 w-32" />
                                <Skeleton className="h-3 w-full" />
                                <div className="pt-3 border-t border-border flex items-center gap-2">
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                    <Skeleton className="h-3 w-40" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Data Kelas</h2>
                    <p className="text-muted-foreground">Kelola data kelas dan wali kelas.</p>
                </div>
                <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Kelas
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {classes.map((cls) => {
                    const realCount = students.filter(s => s.class === cls.name).length

                    // Normalize string for comparison (remove punctuation, lowercase)
                    const normalize = (str: string) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");

                    const userNormalized = normalize(user.name);
                    const waliNormalized = normalize(cls.waliKelas);

                    // Flexible check for wali kelas
                    const isWaliKelas = userNormalized && waliNormalized && (
                        userNormalized === waliNormalized ||
                        userNormalized.includes(waliNormalized) ||
                        waliNormalized.includes(userNormalized)
                    );

                    return (
                        <Card key={cls.id} className="bg-card border-2 border-blue-200 shadow-sm text-foreground hover:bg-muted transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-black/20 backdrop-blur-sm rounded-bl-xl">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(cls)} className="h-7 w-7 text-primary hover:text-primary/80 hover:bg-primary/10">
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)} className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>

                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <GraduationCap className="h-4 w-4" />
                                    </div>
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Kelas
                                    </CardTitle>
                                </div>
                                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {realCount} Siswa
                                </span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold mb-1">{cls.name}</div>
                                <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{cls.description}</p>
                                <div className="mt-4 -mx-6 -mb-6 p-4 bg-blue-600 flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-white/20 shadow-sm">
                                        <AvatarImage
                                            src={isWaliKelas && user.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(cls.waliKelas || "Guru")}&background=FFFFFF&color=2563EB`}
                                            alt={cls.waliKelas}
                                        />
                                        <AvatarFallback className="bg-white text-blue-600 text-xs font-bold">
                                            {cls.waliKelas
                                                ? cls.waliKelas.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
                                                : "??"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-blue-100 font-medium">Wali Kelas</span>
                                        <span className="text-sm font-bold text-white line-clamp-1">{cls.waliKelas || "Belum ditentukan"}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Kelas" : "Tambah Kelas Baru"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Kelas</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Contoh: XII IPA 1"
                            className="bg-muted border-none text-foreground"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="waliKelas">Wali Kelas</Label>
                        <Input
                            id="waliKelas"
                            value={formData.waliKelas}
                            onChange={(e) => setFormData({ ...formData, waliKelas: e.target.value })}
                            placeholder="Nama Wali Kelas"
                            className="bg-muted border-none text-foreground"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi Singkat</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Contoh: Kelas Unggulan Sains"
                            className="bg-muted border-none text-foreground"
                        />
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
