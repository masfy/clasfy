"use client"

import { useEffect, useState } from "react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Mail, School, Shield, Trophy } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function StudentProfile() {
    const { students, updateStudent } = useData()
    const [student, setStudent] = useState<any>(null)

    useEffect(() => {
        const session = localStorage.getItem("clasfy_student_session")
        if (session) {
            const sessionData = JSON.parse(session)
            const freshData = students.find(s => s.id === sessionData.id)
            setStudent(freshData || sessionData)
        }
    }, [students])

    if (!student) return null

    const handleLogout = () => {
        localStorage.removeItem("clasfy_student_session")
        window.location.href = "/login"
    }

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-in-out">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center space-y-3 pt-4">
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl scale-110 animate-pulse" />
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="cursor-pointer relative block transition-transform duration-300 hover:scale-105">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                                    <AvatarImage src={student.avatar} className="object-cover" />
                                    <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-[10px] text-white font-medium">Ganti</span>
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-2xl w-full">
                            <DialogHeader>
                                <DialogTitle>Ganti Foto Profil</DialogTitle>
                                <DialogDescription className="text-slate-500">
                                    Pilih avatar yang tersedia atau upload foto kamu sendiri.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                {/* Upload Section */}
                                <div className="flex flex-col items-center gap-3 pb-4 border-b border-slate-200">
                                    <label htmlFor="upload-own" className="cursor-pointer">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors text-white">
                                            <User className="h-4 w-4" />
                                            Upload Foto Sendiri
                                        </div>
                                    </label>
                                    <input
                                        id="upload-own"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                    alert("Ukuran file terlalu besar! Maksimal 2MB.")
                                                    return
                                                }
                                                const reader = new FileReader()
                                                reader.onload = (event) => {
                                                    const img = new Image()
                                                    img.onload = () => {
                                                        const canvas = document.createElement('canvas')
                                                        const MAX_WIDTH = 300
                                                        const MAX_HEIGHT = 300
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

                                                        // Update directly for upload (no need to select first, just save)
                                                        const base64 = canvas.toDataURL('image/jpeg', 0.7)
                                                        const updatedStudent = { ...student, avatar: base64 }
                                                        setStudent(updatedStudent)
                                                        localStorage.setItem("clasfy_student_session", JSON.stringify(updatedStudent))
                                                        updateStudent(student.id, { avatar: base64 })
                                                        // Close dialog hack (click close button programmatically or just let user close)
                                                        document.getElementById('close-dialog')?.click()
                                                    }
                                                    img.src = event.target?.result as string
                                                }
                                                reader.readAsDataURL(file)
                                            }
                                        }}
                                    />
                                    <p className="text-[10px] text-slate-500">Maksimal 2MB. Format JPG/PNG.</p>
                                </div>

                                {/* Avatar Selection Removed as per user request to avoid dummy avatars */}
                            </div>
                            <div className="flex justify-end pt-2">
                                <DialogTrigger asChild>
                                    <Button id="close-dialog" className="bg-green-600 hover:bg-green-700 text-white">
                                        Selesai & Simpan
                                    </Button>
                                </DialogTrigger>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <div className="absolute bottom-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                        Lvl {Math.floor((student.points || 0) / 100) + 1}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                    <p className="text-slate-500 text-sm">NISN. {student.nis}</p>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white/50 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
                    <CardContent className="p-4 flex items-center gap-3 relative z-10">
                        <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 border border-white/30">
                            <Trophy className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-amber-100 font-medium">Total XP</p>
                            <p className="font-bold text-lg text-white">{student.points}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white/50 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
                    <CardContent className="p-4 flex items-center gap-3 relative z-10">
                        <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 border border-white/30">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-100 font-medium">Badges</p>
                            <p className="font-bold text-lg text-white">{(student.badges || []).length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Details */}
            <Card className="bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-slate-500">Informasi Pribadi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-slate-400" />
                        <div className="flex-1">
                            <p className="text-xs text-slate-500">Username</p>
                            <p className="text-sm font-medium">{student.username}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <School className="h-4 w-4 text-slate-400" />
                        <div className="flex-1">
                            <p className="text-xs text-slate-500">Kelas</p>
                            <p className="text-sm font-medium">{student.class}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-slate-400" />
                        <div className="flex-1">
                            <p className="text-xs text-slate-500">Status</p>
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 mt-1">
                                {student.status}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300 font-bold"
                onClick={handleLogout}
            >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar Aplikasi
            </Button>
        </div>
    )
}
