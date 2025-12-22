"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, School, User } from "lucide-react"
import { useData } from "@/lib/data-context"

export default function DataSekolahPage() {
    const { sekolah, updateSekolah } = useData()
    const [formData, setFormData] = useState(sekolah)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        setFormData(sekolah)
    }, [sekolah])

    const getBadgeColor = (grade: string) => {
        switch (grade) {
            case "A": return "bg-green-500 hover:bg-green-600"
            case "B": return "bg-primary hover:bg-primary/90"
            case "C": return "bg-yellow-500 hover:bg-yellow-600"
            default: return "bg-gray-500 hover:bg-gray-600"
        }
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        // Simulate API call
        setTimeout(() => {
            updateSekolah(formData)
            setIsSaving(false)
        }, 1000)
    }

    return (
        <div className="space-y-6 pb-24">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Data Sekolah</h2>
                <p className="text-muted-foreground">Kelola informasi identitas sekolah dan kepala sekolah.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2 items-start">
                    {/* Identitas Sekolah */}
                    <Card className="bg-card border-border text-foreground">
                        <CardHeader className="flex flex-row items-center gap-2 border-b border-border pb-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <School className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg">Identitas Sekolah</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="npsn">NPSN</Label>
                                <Input
                                    id="npsn"
                                    value={formData.npsn}
                                    onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                                    className="bg-muted border-none text-foreground"
                                    placeholder="Nomor Pokok Sekolah Nasional"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Sekolah</Label>
                                <Input
                                    id="nama"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    className="bg-muted border-none text-foreground"
                                    placeholder="Nama resmi sekolah"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="alamat">Alamat Lengkap</Label>
                                <Input
                                    id="alamat"
                                    value={formData.alamat}
                                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                    className="bg-muted border-none text-foreground"
                                    placeholder="Jalan, Kelurahan, Kecamatan"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="kabupatenKota">Kabupaten/Kota</Label>
                                <Input
                                    id="kabupatenKota"
                                    value={formData.kabupatenKota || ""}
                                    onChange={(e) => setFormData({ ...formData, kabupatenKota: e.target.value })}
                                    className="bg-muted border-none text-foreground"
                                    placeholder="Contoh: Jakarta Selatan"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="akreditasi">Akreditasi</Label>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <select
                                        id="akreditasi"
                                        value={formData.akreditasi}
                                        onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                                        className="flex h-10 w-full rounded-md bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary border-none"
                                    >
                                        <option value="A">Unggul (A)</option>
                                        <option value="B">Baik (B)</option>
                                        <option value="C">Cukup (C)</option>
                                        <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                                    </select>
                                    <Badge className={`${getBadgeColor(formData.akreditasi)} text-white text-sm px-4 py-1.5 whitespace-nowrap w-fit`}>
                                        {formData.akreditasi}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tahunPelajaran">Tahun Pelajaran</Label>
                                <Input
                                    id="tahunPelajaran"
                                    value={formData.tahunPelajaran}
                                    onChange={(e) => setFormData({ ...formData, tahunPelajaran: e.target.value })}
                                    className="bg-muted border-none text-foreground"
                                    placeholder="Contoh: 2024/2025"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Kepala Sekolah */}
                    <Card className="bg-card border-border text-foreground">
                        <CardHeader className="flex flex-row items-center gap-2 border-b border-border pb-4">
                            <div className="p-2 bg-accent/10 rounded-lg">
                                <User className="h-5 w-5 text-accent" />
                            </div>
                            <CardTitle className="text-lg">Data Kepala Sekolah</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="kepala">Nama Kepala Sekolah</Label>
                                <Input
                                    id="kepala"
                                    value={formData.kepala}
                                    onChange={(e) => setFormData({ ...formData, kepala: e.target.value })}
                                    className="bg-muted border-none text-foreground"
                                    placeholder="Nama lengkap beserta gelar"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nipKepala">NIP Kepala Sekolah</Label>
                                <Input
                                    id="nipKepala"
                                    value={formData.nipKepala || ""}
                                    onChange={(e) => setFormData({ ...formData, nipKepala: e.target.value })}
                                    className="bg-muted border-none text-foreground"
                                    placeholder="NIP Kepala Sekolah"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" className="bg-primary hover:bg-primary/90 w-full md:w-auto" disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
