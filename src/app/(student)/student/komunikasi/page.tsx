"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Megaphone, Users, ChevronRight, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentKomunikasi() {
    const { posts } = useData()
    const router = useRouter()

    const announcementCount = posts.filter(p => p.type === 'announcement').length
    const discussionCount = posts.filter(p => p.type === 'discussion' || !p.type).length

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col items-center text-center space-y-2 pt-4">
                <h2 className="text-xl font-bold text-slate-900">Komunikasi Kelas</h2>
                <p className="text-slate-500 text-sm">Pusat informasi dan diskusi</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Card
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-lg shadow-blue-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
                    onClick={() => router.push("/student/komunikasi/pengumuman")}
                >
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                                <Megaphone className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Pengumuman</h3>
                                <p className="text-blue-100 text-xs">{announcementCount} Info Terbaru</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-white/50" />
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-none shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
                    onClick={() => router.push("/student/komunikasi/forum")}
                >
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Forum Diskusi</h3>
                                <p className="text-indigo-100 text-xs">{discussionCount} Topik Diskusi</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-white/50" />
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-none shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
                    onClick={() => router.push("/student/komunikasi/chat")}
                >
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                                <MessageSquare className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Pesan Pribadi</h3>
                                <p className="text-emerald-100 text-xs">Chat dengan Guru</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-white/50" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
