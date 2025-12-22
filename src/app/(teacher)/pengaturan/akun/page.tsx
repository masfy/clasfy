"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save } from "lucide-react"
import { useData } from "@/lib/data-context"

export default function AkunPage() {
    const { user, updateUser } = useData()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState({
        name: "",
        nip: "",
        email: "",
        username: "",
        motto: "",
        avatar: "",
        password: "",
        confirmPassword: ""
    })

    const [isSaving, setIsSaving] = useState(false)

    // Sync local state when context data loads
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            name: user.name,
            nip: user.nip,
            email: user.email,
            username: user.username,
            motto: user.motto || "",
            avatar: user.avatar
        }))
    }, [user])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const img = new Image()
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const MAX_WIDTH = 500
                    const MAX_HEIGHT = 500
                    let width = img.width
                    let height = img.height

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width
                            width = MAX_WIDTH
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height
                            height = MAX_HEIGHT
                        }
                    }

                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx?.drawImage(img, 0, 0, width, height)

                    // Compress to JPEG with 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
                    setFormData(prev => ({ ...prev, avatar: dataUrl }))
                }
                img.src = event.target?.result as string
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        console.log("Saving user profile. Current User ID:", user.id) // Verification Log

        if (formData.password && formData.password !== formData.confirmPassword) {
            alert("Password baru dan konfirmasi password tidak cocok!")
            setIsSaving(false)
            return
        }

        // Simulate API call
        setTimeout(() => {
            const updatePayload: any = {}

            // Only include changed fields
            if (formData.name !== user.name) updatePayload.name = formData.name
            if (formData.nip !== user.nip) updatePayload.nip = formData.nip
            if (formData.email !== user.email) updatePayload.email = formData.email
            if (formData.username !== user.username) updatePayload.username = formData.username
            if (formData.motto !== user.motto) updatePayload.motto = formData.motto

            // Handle avatar separately - only send if changed and not too huge
            if (formData.avatar !== user.avatar) {
                if (formData.avatar.length > 50000) {
                    console.warn("Avatar image is large, sync might fail.")
                }
                updatePayload.avatar = formData.avatar
            }

            if (formData.password) {
                updatePayload.password = formData.password
            }

            updateUser(updatePayload)
            setIsSaving(false)

            // Clear password fields after save
            setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }))
        }, 1000)
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Akun</h2>
                <p className="text-slate-500">Kelola informasi profil dan keamanan akun Anda.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                <Card className="md:col-span-4 bg-white border-slate-200 text-slate-900 h-fit shadow-md">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <div
                            className="relative group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Avatar className="h-32 w-32 border-4 border-slate-100 shadow-sm">
                                {formData.avatar ? <AvatarImage src={formData.avatar} /> : null}
                                <AvatarFallback className="bg-slate-100 text-slate-500 text-2xl">{formData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-slate-900">{formData.name}</h3>
                        <p className="text-sm text-slate-500 italic">"{formData.motto || "No motto set"}"</p>
                        <p className="text-xs text-slate-400 mt-1">NIP. {formData.nip}</p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-8 bg-white border-slate-200 text-slate-900 shadow-md">
                    <CardHeader>
                        <CardTitle>Edit Profil</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-white border-slate-200 text-slate-900 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nip">NIP</Label>
                                    <Input
                                        id="nip"
                                        value={formData.nip}
                                        onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                                        className="bg-white border-slate-200 text-slate-900 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-white border-slate-200 text-slate-900 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="bg-white border-slate-200 text-slate-900 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="motto">Motto Hidup</Label>
                                    <Input
                                        id="motto"
                                        value={formData.motto}
                                        onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                                        className="bg-white border-slate-200 text-slate-900 focus:ring-blue-500"
                                        placeholder="Tuliskan motto hidup Anda..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200">
                                <h4 className="text-sm font-medium mb-4 text-slate-500">Ganti Password</h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password Baru</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Kosongkan jika tidak ingin mengganti"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="bg-white border-slate-200 text-slate-900 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Ulangi password baru"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="bg-white border-slate-200 text-slate-900 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
