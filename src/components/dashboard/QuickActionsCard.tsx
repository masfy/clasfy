"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenTool, BookOpen, MessageSquare, CalendarCheck, PlusCircle, Megaphone, FileEdit } from "lucide-react"
import Link from "next/link"

export function QuickActionsCard() {
    return (
        <Card className="relative h-full border-none bg-white text-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Background Gradients - Clean Colorful */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl pointer-events-none opacity-50" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl pointer-events-none opacity-50" />

            <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                        <SparklesIcon className="h-4 w-4" />
                    </div>
                    Aksi Cepat
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 relative z-10">
                <Link href="/presensi/input" className="w-full">
                    <Button variant="ghost" className="w-full h-auto py-3 flex flex-col gap-2 bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 text-slate-600 transition-all duration-300 group shadow-sm">
                        <div className="p-2 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <CalendarCheck className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="text-xs font-semibold">Presensi</span>
                    </Button>
                </Link>
                <Link href="/nilai/input" className="w-full">
                    <Button variant="ghost" className="w-full h-auto py-3 flex flex-col gap-2 bg-slate-50 border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 text-slate-600 transition-all duration-300 group shadow-sm">
                        <div className="p-2 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <FileEdit className="h-5 w-5 text-emerald-500" />
                        </div>
                        <span className="text-xs font-semibold">Input Nilai</span>
                    </Button>
                </Link>
                <Link href="/tugas/baru" className="w-full">
                    <Button variant="ghost" className="w-full h-auto py-3 flex flex-col gap-2 bg-slate-50 border border-slate-100 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 text-slate-600 transition-all duration-300 group shadow-sm">
                        <div className="p-2 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <PlusCircle className="h-5 w-5 text-purple-500" />
                        </div>
                        <span className="text-xs font-semibold">Buat Tugas</span>
                    </Button>
                </Link>
                <Link href="/pengumuman/baru" className="w-full">
                    <Button variant="ghost" className="w-full h-auto py-3 flex flex-col gap-2 bg-slate-50 border border-slate-100 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 text-slate-600 transition-all duration-300 group shadow-sm">
                        <div className="p-2 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Megaphone className="h-5 w-5 text-orange-500" />
                        </div>
                        <span className="text-xs font-semibold">Pengumuman</span>
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M9 5h4" />
            <path d="M19 19v4" />
            <path d="M15 21h4" />
        </svg>
    )
}
