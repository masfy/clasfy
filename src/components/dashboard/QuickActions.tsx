"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    UserPlus,
    FileEdit,
    Calendar,
    Upload,
    MessageSquarePlus,
    Settings
} from "lucide-react"

export function QuickActions() {
    const actions = [
        { label: "Input Presensi", icon: FileEdit, color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Input Nilai", icon: Upload, color: "text-green-400", bg: "bg-green-400/10" },
        { label: "Tambah Siswa", icon: UserPlus, color: "text-purple-400", bg: "bg-purple-400/10" },
        { label: "Jadwal Pelajaran", icon: Calendar, color: "text-orange-400", bg: "bg-orange-400/10" },
        { label: "Buat Pengumuman", icon: MessageSquarePlus, color: "text-accent", bg: "bg-accent/10" },
        { label: "Pengaturan Kelas", icon: Settings, color: "text-gray-400", bg: "bg-gray-400/10" },
    ]

    return (
        <Card className="bg-white border-slate-200 text-slate-900 h-full shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            className="flex-1 min-w-[100px] flex-col items-center justify-center py-3 px-2 gap-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all rounded-xl h-auto"
                        >
                            <div className={`p-2 rounded-full ${action.bg}`}>
                                <action.icon className={`h-4 w-4 ${action.color}`} />
                            </div>
                            <span className="text-[10px] font-medium text-slate-600 text-center leading-tight">{action.label}</span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
