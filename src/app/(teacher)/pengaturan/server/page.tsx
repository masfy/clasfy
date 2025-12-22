"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle2, Database, RotateCcw, Save } from "lucide-react"
import { getApiUrl } from "@/lib/api"
import { StorageManager } from "@/lib/storage-manager"

export default function ServerSettingsPage() {
    const { toast } = useToast()
    const [apiUrl, setApiUrl] = useState("")
    const [isDefault, setIsDefault] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Load current API URL
        const currentUrl = getApiUrl()
        setApiUrl(currentUrl)

        // Check if it's using the default/env var or local storage
        const storedUrl = localStorage.getItem('clasfy_api_url')
        setIsDefault(!storedUrl)
    }, [])

    const handleSave = () => {
        if (!apiUrl.trim()) {
            toast({
                title: "URL tidak boleh kosong",
                variant: "destructive"
            })
            return
        }

        if (!apiUrl.includes("script.google.com")) {
            toast({
                title: "URL tidak valid",
                description: "Pastikan URL berasal dari script.google.com",
                variant: "destructive"
            })
            return
        }

        setIsLoading(true)

        // Simulate verification delay
        setTimeout(() => {
            localStorage.setItem('clasfy_api_url', apiUrl.trim())

            // Clear local cache to ensure fresh data fetch
            StorageManager.clearAllData().then(() => {
                console.log("Local cache cleared for new server connection");
            });

            setIsDefault(false)
            setIsLoading(false)

            toast({
                title: "Server Berhasil Disimpan",
                description: "Aplikasi akan memuat ulang untuk menerapkan perubahan.",
                variant: "success"
            })

            // Reload to apply changes
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        }, 800)
    }



    return (
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Pengaturan Server</h1>
                <p className="text-muted-foreground">
                    Konfigurasi koneksi database Google Apps Script.
                </p>
            </div>

            <Card className="border-primary/10 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        Koneksi Database
                    </CardTitle>
                    <CardDescription>
                        Masukkan URL Web App dari Google Apps Script Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="api-url">URL Web App</Label>
                        <div className="relative">
                            <Input
                                id="api-url"
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                                placeholder="https://script.google.com/macros/s/..."
                                className="pr-10 font-mono text-sm"
                            />
                            {isDefault ? (
                                <div className="absolute right-3 top-3 text-muted-foreground" title="Menggunakan Server Bawaan">
                                    <Database className="h-4 w-4" />
                                </div>
                            ) : (
                                <div className="absolute right-3 top-3 text-green-500" title="Menggunakan Server Kustom">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Pastikan URL diakhiri dengan <code>/exec</code>
                        </p>
                    </div>

                    <div className="bg-yellow-100 p-4 rounded-lg border-2 border-red-500 flex gap-3 items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-slate-900">
                            <p className="font-bold mb-1 uppercase tracking-wide text-red-600">Peringatan Penting!</p>
                            <ul className="list-disc list-inside space-y-1 font-medium">
                                <li>Jangan mengubah URL ini sembarangan jika tidak paham.</li>
                                <li>Perubahan yang salah akan menyebabkan aplikasi <strong>tidak bisa diakses</strong> atau <strong>error</strong>.</li>
                                <li>Jika terjadi kendala atau ingin mengganti server, silakan <strong>hubungi Administrator/Developer</strong> terlebih dahulu.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex-1 bg-primary hover:bg-primary/90"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {isLoading ? "Menyimpan..." : "Simpan Konfigurasi"}
                        </Button>


                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
