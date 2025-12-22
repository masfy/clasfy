"use client"

import { useEffect, useState } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Target, Zap, ChevronRight, Lock } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
    const { students, badges, challenges } = useData()
    const [student, setStudent] = useState<any>(null)

    useEffect(() => {
        const session = localStorage.getItem("clasfy_student_session")
        if (session) {
            // Refresh data from context to get latest points/badges
            const sessionData = JSON.parse(session)
            // Use loose equality to handle string/number ID mismatch
            const freshData = students.find(s => s.id == sessionData.id)
            setStudent(freshData || sessionData)
        }
    }, [students])

    if (!student) return null

    const level = Math.floor((student.points || 0) / 100) + 1
    const progress = (student.points || 0) % 100
    const nextLevelPoints = level * 100

    // Get student's badges (handle string/array)
    const badgeIds = Array.isArray(student.badges)
        ? student.badges
        : (typeof student.badges === 'string' ? JSON.parse(student.badges) : [])

    const myBadges = badges.filter(b => badgeIds.includes(b.id))

    // Get active challenges (not completed yet)
    // Handle potential string/number mismatch in completions array
    console.log("[StudentDashboard] Student ID:", student.id, typeof student.id)
    console.log("[StudentDashboard] All Challenges:", challenges)

    const activeChallenges = challenges.filter(c => {
        const completions = Array.isArray(c.completions) ? c.completions : []
        const isCompleted = completions.some((id: any) => id == student.id)
        console.log(`[StudentDashboard] Challenge ${c.title} (${c.id}): Completed? ${isCompleted} (Completions: ${JSON.stringify(completions)})`)
        return !isCompleted
    })

    // Calculate Rank
    const sortedStudents = [...students].sort((a, b) => b.points - a.points)
    const rank = sortedStudents.findIndex(s => s.id == student.id) + 1

    // Calculate Completed Missions
    const completedChallengesCount = challenges.filter(c => {
        const completions = Array.isArray(c.completions) ? c.completions : []
        return completions.some((id: any) => id == student.id)
    }).length

    return (
        <div className="space-y-6 pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 p-6 text-white shadow-lg">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-2 text-sm font-medium text-blue-100 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">Level {level}</div>
                    <h2 className="text-2xl font-bold tracking-tight mb-1 text-white">Siap Level Up, {student.name.split(' ')[0]}? 🚀</h2>
                    <p className="text-blue-100 text-xs mb-6">Selesaikan misi & jadilah juara hari ini!</p>

                    <div className="w-full max-w-xs space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                            <span>{student.points || 0} XP</span>
                            <span>{nextLevelPoints} XP</span>
                        </div>
                        <Progress value={progress} className="h-3 bg-blue-950/50" indicatorClassName="bg-yellow-400" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white/50 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 group cursor-pointer">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
                    <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full relative z-10">
                        <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 border border-white/30 shadow-sm">
                            <Trophy className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white group-hover:scale-110 transition-transform duration-300">{(student.badges || []).length}</span>
                        <span className="text-[10px] text-amber-100 font-medium">Badges</span>
                    </CardContent>
                </Card>
                <Link href="/student/leaderboard">
                    <Card className="relative overflow-hidden bg-gradient-to-br from-sky-400 to-blue-500 border-2 border-white/50 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 group cursor-pointer h-full">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
                        <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full relative z-10">
                            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 border border-white/30 shadow-sm">
                                <Star className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white group-hover:scale-110 transition-transform duration-300">#{rank}</span>
                            <span className="text-[10px] text-sky-100 font-medium">Rank</span>
                        </CardContent>
                    </Card>
                </Link>
                <Card className="relative overflow-hidden bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white/50 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 group cursor-pointer">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
                    <CardContent className="p-3 flex flex-col items-center justify-center text-center h-full relative z-10">
                        <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 border border-white/30 shadow-sm">
                            <Target className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white group-hover:scale-110 transition-transform duration-300">{completedChallengesCount}</span>
                        <span className="text-[10px] text-violet-100 font-medium">Misi Selesai</span>
                    </CardContent>
                </Card>
            </div>

            {/* Active Quest / Challenge */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h3 className="font-semibold text-lg text-slate-900">Misi Aktif</h3>
                    <Link href="/student/misi" className="text-xs text-blue-600 hover:text-blue-700 font-medium group flex items-center gap-1 transition-colors">
                        Lihat Semua <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                {activeChallenges.length > 0 ? (
                    <Card className="bg-white border-slate-200 text-slate-900 overflow-hidden relative shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{activeChallenges[0].title}</h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{activeChallenges[0].description}</p>
                                </div>
                                <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100 whitespace-nowrap group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    +{activeChallenges[0].rewardPoints} XP
                                </Badge>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <Zap className="h-3 w-3 text-blue-500 group-hover:animate-pulse" />
                                    Tantangan Harian
                                </span>
                                <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-2 group-hover:bg-blue-50 group-hover:text-blue-700">
                                    Detail <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
                        <p className="text-sm">Tidak ada misi aktif saat ini.</p>
                    </div>
                )}
            </div>

            {/* My Badges */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h3 className="font-semibold text-lg text-slate-900">Koleksi Badge</h3>
                    <Link href="/student/badges" className="text-xs text-blue-600 hover:text-blue-700 font-medium group flex items-center gap-1 transition-colors">
                        Lihat Semua <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {myBadges.length > 0 ? (
                        myBadges.map((badge) => (
                            <div key={badge.id} className="flex-shrink-0 flex flex-col items-center gap-2 w-20 group cursor-pointer">
                                <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-white to-blue-50 border-2 border-white shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20 group-hover:border-blue-200">
                                    <div className="group-hover:animate-bounce text-blue-600 drop-shadow-sm">
                                        {badge.icon}
                                    </div>
                                </div>
                                <span className="text-[10px] text-center text-slate-500 font-medium line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                    {badge.name}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="w-full p-4 text-center text-slate-500 text-sm">
                            Belum ada badge yang didapatkan.
                        </div>
                    )}
                    {/* Locked Badge Placeholder */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-2 w-20 opacity-50 grayscale">
                        <div className="h-16 w-16 bg-slate-50 rounded-2xl border border-slate-200 border-dashed flex items-center justify-center shadow-sm">
                            <Lock className="h-6 w-6 text-slate-400" />
                        </div>
                        <span className="text-[10px] text-center text-slate-400 font-medium">
                            Locked
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Simple Button Component for this file to avoid import issues if not needed globally
function Button({ className, variant, size, children, ...props }: any) {
    return (
        <button className={className} {...props}>
            {children}
        </button>
    )
}
