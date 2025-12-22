"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Tags, Scale, Save, Trash2, Edit2, AlertCircle } from "lucide-react"
import { useData, AssessmentCategory } from "@/lib/data-context"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function KategoriBobotPage() {
    const {
        categories, addCategory, updateCategory, deleteCategory,
        weights, saveWeights,
        mapel
    } = useData()
    const { toast } = useToast()

    // --- State for Kategori ---
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<AssessmentCategory | null>(null)
    const [categoryForm, setCategoryForm] = useState({ name: "", code: "" })

    // --- State for Bobot ---
    const [selectedMapelId, setSelectedMapelId] = useState<string>("")
    const [currentWeights, setCurrentWeights] = useState<Record<number, number>>({})
    const [isSavingWeights, setIsSavingWeights] = useState(false)

    // --- Kategori Logic ---

    const handleOpenDialog = (category?: AssessmentCategory) => {
        if (category) {
            setEditingCategory(category)
            setCategoryForm({ name: category.name, code: category.code })
        } else {
            setEditingCategory(null)
            setCategoryForm({ name: "", code: "" })
        }
        setIsDialogOpen(true)
    }

    const handleSaveCategory = () => {
        if (!categoryForm.name || !categoryForm.code) {
            toast({ title: "Error", description: "Nama dan Kode harus diisi", variant: "destructive" })
            return
        }

        if (editingCategory) {
            updateCategory(editingCategory.id, categoryForm)
        } else {
            addCategory(categoryForm)
        }
        setIsDialogOpen(false)
    }

    const handleDeleteCategory = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
            deleteCategory(id)
        }
    }

    // --- Bobot Logic ---

    // Load weights when mapel is selected
    useEffect(() => {
        if (selectedMapelId) {
            const mapelId = parseInt(selectedMapelId)
            const mapelWeights = weights.filter(w => w.mapelId === mapelId)

            const newWeights: Record<number, number> = {}
            categories.forEach(cat => {
                const found = mapelWeights.find(w => w.categoryId === cat.id)
                newWeights[cat.id] = found ? found.weight : 0
            })
            setCurrentWeights(newWeights)
        }
    }, [selectedMapelId, weights, categories])

    const handleWeightChange = (categoryId: number, value: string) => {
        const val = parseInt(value) || 0
        setCurrentWeights(prev => ({ ...prev, [categoryId]: val }))
    }

    const totalWeight = Object.values(currentWeights).reduce((a, b) => a + b, 0)

    const handleSaveBobot = () => {
        if (!selectedMapelId) {
            toast({ title: "Error", description: "Pilih mata pelajaran terlebih dahulu", variant: "destructive" })
            return
        }

        if (totalWeight !== 100) {
            toast({ title: "Error", description: "Total bobot harus 100%", variant: "destructive" })
            return
        }

        setIsSavingWeights(true)
        const mapelId = parseInt(selectedMapelId)
        const newWeightsList = Object.entries(currentWeights).map(([catId, weight]) => ({
            mapelId,
            categoryId: parseInt(catId),
            weight
        }))

        setTimeout(() => {
            saveWeights(mapelId, newWeightsList)
            setIsSavingWeights(false)
        }, 500)
    }

    return (
        <div className="space-y-6 pb-24">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Kategori & Bobot Penilaian</h2>
                <p className="text-muted-foreground">Kelola jenis penilaian dan atur persentase bobotnya per mata pelajaran.</p>
            </div>

            <Tabs defaultValue="kategori" className="space-y-6">
                <TabsList className="bg-card border border-border p-1">
                    <TabsTrigger value="kategori" className="data-[state=active]:bg-muted data-[state=active]:text-foreground">
                        <Tags className="mr-2 h-4 w-4" />
                        Kategori Penilaian
                    </TabsTrigger>
                    <TabsTrigger value="bobot" className="data-[state=active]:bg-muted data-[state=active]:text-foreground">
                        <Scale className="mr-2 h-4 w-4" />
                        Bobot Penilaian
                    </TabsTrigger>
                </TabsList>

                {/* --- Tab Kategori --- */}
                <TabsContent value="kategori" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90" onClick={() => handleOpenDialog()}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Kategori
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border text-foreground">
                                <DialogHeader>
                                    <DialogTitle>{editingCategory ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
                                    <DialogDescription className="text-muted-foreground">
                                        Buat kategori penilaian baru untuk digunakan dalam perhitungan nilai.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Kategori</Label>
                                        <Input
                                            id="name"
                                            value={categoryForm.name}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                            className="bg-muted border-border text-foreground"
                                            placeholder="Contoh: Ulangan Harian"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="code">Kode Singkatan</Label>
                                        <Input
                                            id="code"
                                            value={categoryForm.code}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, code: e.target.value })}
                                            className="bg-muted border-border text-foreground"
                                            placeholder="Contoh: UH"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border text-muted-foreground hover:bg-muted hover:text-foreground">Batal</Button>
                                    <Button onClick={handleSaveCategory} className="bg-primary hover:bg-primary/90">Simpan</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-4">
                        {categories.map((item) => (
                            <Card key={item.id} className="bg-card border-border text-foreground">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-accent/10 rounded-lg">
                                            <Tags className="h-5 w-5 text-accent" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Kode: {item.code}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                            onClick={() => handleOpenDialog(item)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                            onClick={() => handleDeleteCategory(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* --- Tab Bobot --- */}
                <TabsContent value="bobot" className="space-y-6">
                    <Card className="bg-card border-border text-foreground">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Scale className="h-5 w-5 text-green-600" />
                                Konfigurasi Bobot per Mapel
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Pilih Mata Pelajaran</Label>
                                <Select value={selectedMapelId} onValueChange={setSelectedMapelId}>
                                    <SelectTrigger className="bg-muted border-none text-foreground w-full md:w-[300px]">
                                        <SelectValue placeholder="Pilih Mapel..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        {mapel.map((m) => (
                                            <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedMapelId ? (
                                <div className="space-y-4 pt-4 border-t border-border">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {categories.map((cat) => (
                                            <div key={cat.id} className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg border border-border">
                                                <Label className="flex-1">{cat.name} ({cat.code})</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        value={currentWeights[cat.id] || 0}
                                                        onChange={(e) => handleWeightChange(cat.id, e.target.value)}
                                                        className="bg-card border-border text-foreground w-20 text-right focus:ring-primary"
                                                    />
                                                    <span className="text-muted-foreground w-4">%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">Total Bobot:</span>
                                            <span className={`text-lg font-bold ${totalWeight === 100 ? "text-green-600" : "text-red-600"}`}>
                                                {totalWeight}%
                                            </span>
                                            {totalWeight !== 100 && (
                                                <span className="text-xs text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Harus 100%
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            onClick={handleSaveBobot}
                                            className="bg-primary hover:bg-primary/90"
                                            disabled={isSavingWeights || totalWeight !== 100}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {isSavingWeights ? "Menyimpan..." : "Simpan Bobot"}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground italic">
                                    Silakan pilih mata pelajaran terlebih dahulu untuk mengatur bobot.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
