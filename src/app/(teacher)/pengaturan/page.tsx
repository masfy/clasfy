"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StorageManager } from "@/lib/storage-manager"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, Smartphone, Trash2, User, Database, Download, Upload } from "lucide-react"
import AkunPage from "./akun/page"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function PengaturanPage() {
    const { toast } = useToast()
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        updates: false
    })

    const handleResetData = async () => {
        if (confirm("Apakah Anda yakin ingin mereset TOTAL aplikasi ini? \n\nSemua data lokal (cache, pengaturan, sesi login) akan dihapus. Aplikasi akan dimuat ulang seperti baru.")) {
            try {
                // 1. Clear IndexedDB (Offline Data)
                await StorageManager.clearAllData()
                // 2. Clear LocalStorage (Settings, Session)
                localStorage.clear()

                toast({ title: "Reset Berhasil", description: "Aplikasi akan dimuat ulang..." })
                setTimeout(() => window.location.reload(), 1000)
            } catch (e) {
                console.error("Reset failed", e)
                // Fallback
                localStorage.clear()
                window.location.reload()
            }
        }
    }

    const handleBackupData = () => {
        // Backup LocalStorage (Settings & Session)
        const data = { ...localStorage }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `clasfy-settings-backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast({ title: "Backup Pengaturan Berhasil", description: "File JSON telah diunduh." })
    }

    const handleRestoreData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (confirm("Pulihkan pengaturan dari file backup? Pengaturan saat ini akan ditimpa.")) {
            const reader = new FileReader()
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target?.result as string)
                    // Only restore keys that don't conflict with critical system state if needed, 
                    // but for now full restore is requested.
                    Object.keys(data).forEach(key => {
                        localStorage.setItem(key, data[key])
                    })
                    toast({ title: "Restore Berhasil", description: "Halaman akan dimuat ulang..." })
                    setTimeout(() => window.location.reload(), 1500)
                } catch (error) {
                    toast({ title: "Gagal memulihkan data", description: "File backup tidak valid.", variant: "destructive" })
                }
            }
            reader.readAsText(file)
        }
    }

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Pengaturan</h2>
                <p className="text-slate-500">Kelola preferensi aplikasi dan akun Anda.</p>
            </div>

            <Tabs defaultValue="akun" className="w-full">
                <TabsList className="bg-slate-100 border border-slate-200 p-1">
                    <TabsTrigger value="akun" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-500 shadow-sm">
                        <User className="h-4 w-4 mr-2" /> Akun
                    </TabsTrigger>
                    <TabsTrigger value="aplikasi" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-500 shadow-sm">
                        <Smartphone className="h-4 w-4 mr-2" /> Aplikasi
                    </TabsTrigger>
                    <TabsTrigger value="notifikasi" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-slate-500 shadow-sm">
                        <Bell className="h-4 w-4 mr-2" /> Notifikasi
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="akun" className="mt-6">
                    <AkunPage />
                </TabsContent>

                <TabsContent value="aplikasi" className="mt-6 space-y-6">
                    <Card className="bg-white border-slate-200 text-slate-900 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5 text-blue-500" />
                                Informasi Aplikasi
                            </CardTitle>
                            <CardDescription className="text-slate-500">Detail versi dan pembaruan aplikasi.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500">Versi Aplikasi</span>
                                <span className="font-mono text-sm">v2.1.1</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500">Build Number</span>
                                <span className="font-mono text-sm">20241227</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-slate-500">Status Server</span>
                                <span className="text-emerald-500 flex items-center gap-1 text-sm">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Online (Global)
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 text-slate-900 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-500">
                                <Database className="h-5 w-5" />
                                Backup & Restore (Lokal)
                            </CardTitle>
                            <CardDescription className="text-slate-500">Cadangkan pengaturan lokal browser ini.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                                <div>
                                    <h4 className="font-bold text-slate-900">Backup Pengaturan</h4>
                                    <p className="text-xs text-slate-500 mt-1">Unduh preferensi lokal sebagai file JSON.</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleBackupData} className="border-purple-500/50 text-purple-600 hover:bg-purple-50">
                                    <Download className="h-4 w-4 mr-2" /> Download Backup
                                </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                                <div>
                                    <h4 className="font-bold text-slate-900">Restore Pengaturan</h4>
                                    <p className="text-xs text-slate-500 mt-1">Pulihkan preferensi dari file JSON.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        id="restore-file"
                                        className="hidden"
                                        accept=".json"
                                        onChange={handleRestoreData}
                                    />
                                    <Button variant="outline" size="sm" onClick={() => document.getElementById('restore-file')?.click()} className="border-blue-500/50 text-blue-600 hover:bg-blue-50">
                                        <Upload className="h-4 w-4 mr-2" /> Upload Backup
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 text-slate-900 border-red-200 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-500">
                                <Shield className="h-5 w-5" />
                                Zona Bahaya
                            </CardTitle>
                            <CardDescription className="text-slate-500">Tindakan ini tidak dapat dibatalkan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                                <div>
                                    <h4 className="font-bold text-red-600">Reset Aplikasi Total</h4>
                                    <p className="text-xs text-red-500/70 mt-1">Hapus semua cache, data offline, dan pengaturan di perangkat ini.</p>
                                </div>
                                <Button variant="destructive" size="sm" onClick={handleResetData}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Reset Total
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifikasi" className="mt-6">
                    <Card className="bg-white border-slate-200 text-slate-900 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-yellow-500" />
                                Preferensi Notifikasi
                            </CardTitle>
                            <CardDescription className="text-slate-500">Atur bagaimana Anda ingin menerima pemberitahuan.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Notifikasi Email</Label>
                                    <p className="text-sm text-slate-500">Terima laporan mingguan via email.</p>
                                </div>
                                <Switch
                                    checked={notifications.email}
                                    onCheckedChange={c => {
                                        setNotifications({ ...notifications, email: c })
                                        toast({ title: "Pengaturan disimpan" })
                                    }}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Push Notification</Label>
                                    <p className="text-sm text-slate-500">Pemberitahuan langsung di browser.</p>
                                </div>
                                <Switch
                                    checked={notifications.push}
                                    onCheckedChange={c => {
                                        setNotifications({ ...notifications, push: c })
                                        toast({ title: "Pengaturan disimpan" })
                                    }}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Info Pembaruan</Label>
                                    <p className="text-sm text-slate-500">Dapatkan info fitur baru Clasfy.</p>
                                </div>
                                <Switch
                                    checked={notifications.updates}
                                    onCheckedChange={c => {
                                        setNotifications({ ...notifications, updates: c })
                                        toast({ title: "Pengaturan disimpan" })
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
