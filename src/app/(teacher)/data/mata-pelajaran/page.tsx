"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, BookOpen, Pencil, Trash2 } from "lucide-react"
import { CustomModal } from "@/components/ui/custom-modal"
import { useData, MapelData } from "@/lib/data-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function DataMataPelajaranPage() {
    const { mapel, addMapel, updateMapel, deleteMapel, isLoaded } = useData()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState<Partial<MapelData>>({})

    const handleAdd = () => {
        setEditingId(null)
        setFormData({ kkm: 75 })
        setIsModalOpen(true)
    }

    const handleEdit = (m: MapelData) => {
        setEditingId(m.id)
        setFormData({ ...m })
        setIsModalOpen(true)
    }

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus mata pelajaran ini?")) {
            deleteMapel(id)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingId) {
            updateMapel(editingId, formData)
        } else {
            addMapel({
                name: formData.name!,
                kkm: formData.kkm!
            })
        }
        setIsModalOpen(false)
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

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="bg-card border-border h-24">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </CardHeader>
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
                    <h2 className="text-2xl font-bold tracking-tight">Data Mata Pelajaran</h2>
                    <p className="text-muted-foreground">Kelola daftar mata pelajaran.</p>
                </div>
                <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Mapel
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mapel.map((m) => (
                    <Card key={m.id} className="bg-card border-border text-foreground hover:bg-muted transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-black/20 backdrop-blur-sm rounded-bl-xl">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(m)} className="h-7 w-7 text-primary hover:text-primary/80 hover:bg-primary/10">
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10">
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-base">{m.name}</CardTitle>
                                <p className="text-xs text-muted-foreground">KKM: {m.kkm}</p>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Mata Pelajaran</Label>
                        <Input
                            id="name"
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-muted border-none text-foreground"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="kkm">KKM</Label>
                        <Input
                            id="kkm"
                            type="number"
                            value={formData.kkm || ""}
                            onChange={(e) => setFormData({ ...formData, kkm: parseInt(e.target.value) })}
                            className="bg-muted border-none text-foreground"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="hover:bg-muted hover:text-foreground">Batal</Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90">Simpan</Button>
                    </div>
                </form>
            </CustomModal>
        </div>
    )
}
