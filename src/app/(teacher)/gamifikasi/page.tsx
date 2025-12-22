"use client"

import * as React from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Star, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GamificationPage() {
    const { students, challenges } = useData()
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        // Optional: Redirect to Tantangan by default
        // router.push("/gamifikasi/tantangan")
    }, [])

    // Filter and Sort Students for Hall of Fame
    const sortedStudents = React.useMemo(() => {
        return students.sort((a, b) => (b.points || 0) - (a.points || 0))
    }, [students])

    if (!mounted) return null

    return (
        <div className="flex flex-col gap-6 pb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gamifikasi</h1>
                <p className="text-slate-500">Ringkasan aktivitas gamifikasi kelas.</p>
            </div>

            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/20 text-slate-900 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => router.push("/gamifikasi/peringkat")}
                >
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-600">
                            <Trophy className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Top Student</p>
                            <h3 className="text-2xl font-bold">{sortedStudents[0]?.name || "-"}</h3>
                            <p className="text-xs text-yellow-600 font-medium">{sortedStudents[0]?.points || 0} Poin</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/20 text-slate-900 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-500/20 text-blue-600">
                            <Star className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Poin Diberikan</p>
                            <h3 className="text-2xl font-bold">{students.reduce((acc, s) => acc + (s.points || 0), 0).toLocaleString()}</h3>
                            <p className="text-xs text-blue-600 font-medium">Semua Kelas</p>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/20 text-slate-900 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => router.push("/gamifikasi/tantangan")}
                >
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-600">
                            <Zap className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Tantangan Aktif</p>
                            <h3 className="text-2xl font-bold">{challenges.filter(c => c.status === "Active").length}</h3>
                            <p className="text-xs text-indigo-600 font-medium">Berakhir Bulan Ini</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center text-slate-500 mt-10">
                <p>Pilih menu di sidebar untuk mengelola Tantangan, Lencana, atau melihat Peringkat.</p>
            </div>
        </div>
    )
}
