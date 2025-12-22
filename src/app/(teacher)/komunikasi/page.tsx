"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Megaphone, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"

export default function KomunikasiPage() {
    const { posts } = useData()
    const router = useRouter()

    const announcementCount = posts.filter(p => p.type === 'announcement').length
    const discussionCount = posts.filter(p => p.type === 'discussion' || !p.type).length

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Komunikasi</h2>
                <p className="text-gray-400">Pusat informasi dan diskusi kelas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/20 text-foreground shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => router.push("/komunikasi/pengumuman")}
                >
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-500/20 text-blue-600">
                            <Megaphone className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Pengumuman</p>
                            <h3 className="text-2xl font-bold">{announcementCount}</h3>
                            <p className="text-xs text-blue-600 font-medium">Info Resmi</p>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/20 text-foreground shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => router.push("/komunikasi/forum")}
                >
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-600">
                            <Users className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Forum Diskusi</p>
                            <h3 className="text-2xl font-bold">{discussionCount}</h3>
                            <p className="text-xs text-indigo-600 font-medium">Diskusi Kelas</p>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/20 text-foreground shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer md:col-span-2 lg:col-span-1"
                    onClick={() => router.push("/komunikasi/chat")}
                >
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-600">
                            <MessageSquare className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Pesan Pribadi</p>
                            <h3 className="text-2xl font-bold">Chat</h3>
                            <p className="text-xs text-emerald-600 font-medium">Komunikasi Personal</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center text-muted-foreground mt-10">
                <p>Pilih menu di sidebar untuk melihat Pengumuman atau masuk ke Forum Diskusi.</p>
            </div>
        </div>
    )
}
