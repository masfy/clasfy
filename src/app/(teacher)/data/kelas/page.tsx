"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, Users, GraduationCap } from "lucide-react"
import { CustomModal } from "@/components/ui/custom-modal"
import { useData, ClassData } from "@/lib/data-context"

export default function DataKelasPage() {
    const { classes, students, addClass, updateClass, deleteClass } = useData()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({ name: "", description: "" })
    const [editingId, setEditingId] = useState<number | null>(null)

    const handleAdd = () => {
        setEditingId(null)
        setFormData({ name: "", description: "" })
        setIsModalOpen(true)
    }

    const handleEdit = (cls: ClassData) => {
        setEditingId(cls.id)
        setFormData({ name: cls.name, description: cls.description })
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
                updateClass(editingId, { name: formData.name, description: formData.description })
            } else {
                addClass({
                    name: formData.name,
                    description: formData.description,
                    waliKelas: "Alfian Noor Arnaim"
                })
            }
            setIsModalOpen(false)
            setIsSaving(false)
        }, 500)
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
                    return (
                        <Card key={cls.id} className="bg-card border-border text-foreground hover:bg-muted transition-all group relative overflow-hidden">
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
                                <div className="pt-3 border-t border-border flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                                        {(cls.waliKelas || "??").substring(0, 2).toUpperCase()}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Wali Kelas: <span className="text-foreground">{cls.waliKelas || "Belum ditentukan"}</span></p>
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
