"use client"

import * as React from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Medal, Plus, Pencil, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function LencanaPage() {
    const { badges, addBadge, editBadge, deleteBadge, isLoaded } = useData()
    const [mounted, setMounted] = React.useState(false)

    // Add Badge State
    const [isAddBadgeOpen, setIsAddBadgeOpen] = React.useState(false)
    const [newBadgeName, setNewBadgeName] = React.useState("")
    const [newBadgeIcon, setNewBadgeIcon] = React.useState("🏅")
    const [newBadgeDesc, setNewBadgeDesc] = React.useState("")
    const [newBadgePoints, setNewBadgePoints] = React.useState(50)

    // Edit Badge State
    const [editingBadge, setEditingBadge] = React.useState<any>(null)
    const [isEditBadgeOpen, setIsEditBadgeOpen] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleAddBadge = () => {
        if (newBadgeName && newBadgeIcon) {
            addBadge({
                name: newBadgeName,
                icon: newBadgeIcon,
                description: newBadgeDesc,
                points: newBadgePoints
            })
            setIsAddBadgeOpen(false)
            setNewBadgeName("")
            setNewBadgeIcon("🏅")
            setNewBadgeDesc("")
            setNewBadgePoints(50)
        }
    }

    const handleEditBadge = () => {
        if (editingBadge && editingBadge.name) {
            editBadge(editingBadge.id, editingBadge)
            setIsEditBadgeOpen(false)
            setEditingBadge(null)
        }
    }

    const handleDeleteBadge = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus badge ini?")) {
            deleteBadge(id)
        }
    }

    if (!mounted) return null

    if (!isLoaded) {
        return (
            <div className="flex flex-col gap-6 pb-8 animate-in fade-in duration-700">
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-40" />
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                                <div key={i} className="flex flex-col items-center p-3 rounded-xl border border-border">
                                    <Skeleton className="h-10 w-10 mb-2 rounded-full" />
                                    <Skeleton className="h-4 w-20 mb-1" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 pb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lencana</h1>
                    <p className="text-slate-500">Kelola koleksi badge dan penghargaan.</p>
                </div>
                <Dialog open={isAddBadgeOpen} onOpenChange={setIsAddBadgeOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                            <Plus className="h-4 w-4 mr-2" /> Tambah Badge
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-slate-200 text-slate-900">
                        <DialogHeader>
                            <DialogTitle>Buat Badge Baru</DialogTitle>
                            <DialogDescription className="text-slate-500">Tambahkan badge baru untuk dikoleksi siswa.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nama Badge</label>
                                <Input value={newBadgeName} onChange={e => setNewBadgeName(e.target.value)} className="bg-white border-slate-200 text-slate-900" placeholder="Contoh: Rajin Menabung" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ikon (Emoji)</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {["🏅", "🎖️", "🥇", "🥈", "🥉", "🏆", "⭐", "🌟", "✨", "💎", "👑", "🎓", "📚", "✏️", "🧠", "💡", "🚀", "🔥"].map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => setNewBadgeIcon(emoji)}
                                            className={`h-10 w-10 rounded-lg flex items-center justify-center text-xl transition-colors ${newBadgeIcon === emoji ? "bg-yellow-500 text-black" : "bg-slate-100 hover:bg-slate-200 text-slate-900"}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2 items-center mt-2">
                                    <Input value={newBadgeIcon} onChange={e => setNewBadgeIcon(e.target.value)} className="bg-white border-slate-200 text-slate-900 flex-1" placeholder="Atau ketik emoji lain..." />
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl border border-slate-200 text-slate-900">
                                        {newBadgeIcon || "?"}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Deskripsi</label>
                                <Input value={newBadgeDesc} onChange={e => setNewBadgeDesc(e.target.value)} className="bg-white border-slate-200 text-slate-900" placeholder="Deskripsi singkat..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Poin Bonus</label>
                                <Input type="number" value={newBadgePoints} onChange={e => setNewBadgePoints(parseInt(e.target.value) || 0)} className="bg-white border-slate-200 text-slate-900" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsAddBadgeOpen(false)} className="text-slate-500 hover:text-slate-900">Batal</Button>
                            <Button onClick={handleAddBadge} className="bg-yellow-500 hover:bg-yellow-600 text-black">Simpan Badge</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-white border-slate-200 text-slate-900 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Medal className="h-5 w-5 text-indigo-500" />
                        Koleksi Badge
                    </CardTitle>
                    <CardDescription className="text-slate-500">Daftar badge yang tersedia.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {badges.map(badge => (
                            <div key={badge.id} className="relative group flex flex-col items-center p-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 text-center">
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                                    <button onClick={() => { setEditingBadge(badge); setIsEditBadgeOpen(true) }} className="p-1 hover:bg-blue-500/20 rounded text-blue-400">
                                        <Pencil className="h-3 w-3" />
                                    </button>
                                    <button onClick={() => handleDeleteBadge(badge.id)} className="p-1 hover:bg-red-500/20 rounded text-red-400">
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                                <div className="text-3xl mb-2">{badge.icon}</div>
                                <h4 className="font-bold text-sm text-slate-900 line-clamp-1" title={badge.name}>{badge.name}</h4>
                                <p className="text-xs text-yellow-500 font-bold mt-1">+{badge.points || 0} XP</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Badge Dialog */}
            <Dialog open={isEditBadgeOpen} onOpenChange={setIsEditBadgeOpen}>
                <DialogContent className="bg-white border-slate-200 text-slate-900">
                    <DialogHeader>
                        <DialogTitle>Edit Badge</DialogTitle>
                        <DialogDescription className="text-slate-500">Ubah detail badge.</DialogDescription>
                    </DialogHeader>
                    {editingBadge && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nama Badge</label>
                                <Input value={editingBadge.name || ""} onChange={e => setEditingBadge({ ...editingBadge, name: e.target.value })} className="bg-white border-slate-200 text-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ikon (Emoji)</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {["🏅", "🎖️", "🥇", "🥈", "🥉", "🏆", "⭐", "🌟", "✨", "💎", "👑", "🎓", "📚", "✏️", "🧠", "💡", "🚀", "🔥"].map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => setEditingBadge({ ...editingBadge, icon: emoji })}
                                            className={`h-10 w-10 rounded-lg flex items-center justify-center text-xl transition-colors ${editingBadge.icon === emoji ? "bg-yellow-500 text-black" : "bg-slate-100 hover:bg-slate-200 text-slate-900"}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2 items-center mt-2">
                                    <Input value={editingBadge.icon || ""} onChange={e => setEditingBadge({ ...editingBadge, icon: e.target.value })} className="bg-white border-slate-200 text-slate-900 flex-1" placeholder="Atau ketik emoji lain..." />
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl border border-slate-200 text-slate-900">
                                        {editingBadge.icon || "?"}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Deskripsi</label>
                                <Input value={editingBadge.description || ""} onChange={e => setEditingBadge({ ...editingBadge, description: e.target.value })} className="bg-white border-slate-200 text-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Poin Bonus</label>
                                <Input type="number" value={editingBadge.points || 0} onChange={e => setEditingBadge({ ...editingBadge, points: parseInt(e.target.value) || 0 })} className="bg-white border-slate-200 text-slate-900" />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEditBadgeOpen(false)} className="text-slate-500 hover:text-slate-900">Batal</Button>
                        <Button onClick={handleEditBadge} className="bg-blue-500 hover:bg-blue-600 text-white">Simpan Perubahan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
