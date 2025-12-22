"use client"

import { useEffect, useState } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Crown } from "lucide-react"

export default function StudentLeaderboard() {
    const { students } = useData()
    const [student, setStudent] = useState<any>(null)

    useEffect(() => {
        const session = localStorage.getItem("clasfy_student_session")
        if (session) {
            const sessionData = JSON.parse(session)
            // Use loose equality to handle string/number ID mismatch
            const freshData = students.find(s => s.id == sessionData.id)
            setStudent(freshData || sessionData)
        }
    }, [students])

    if (!student) return null

    // Filter students by class and sort by points
    const classMates = students
        .filter(s => s.class === student.class)
        .sort((a, b) => (b.points || 0) - (a.points || 0))

    return (
        <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-in-out">
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-2 pt-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 border-4 border-white">
                    <Trophy className="h-8 w-8 text-white drop-shadow-sm" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Hall of Fame</h2>
                <p className="text-slate-500 text-sm">Top Score Siswa dengan Poin Terbanyak</p>
            </div>

            {/* Top 3 Podium */}
            <div className="flex justify-center items-end gap-3 pt-4 pb-8">
                {/* 2nd Place */}
                {classMates[1] && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                            <Avatar className="h-16 w-16 border-4 border-slate-200 shadow-md">
                                <AvatarImage src={classMates[1].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${classMates[1].name}`} />
                                <AvatarFallback>{classMates[1].name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                                #2
                            </div>
                        </div>
                        <div className="text-center mt-1">
                            <p className="text-xs font-bold text-slate-700 w-20 truncate">{classMates[1].name.split(' ')[0]}</p>
                            <p className="text-[10px] text-slate-500">{classMates[1].points} XP</p>
                        </div>
                        <div className="h-24 w-16 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-lg border-t border-x border-white/50 shadow-inner flex items-end justify-center pb-2">
                            <Medal className="h-6 w-6 text-slate-400" />
                        </div>
                    </div>
                )}

                {/* 1st Place */}
                {classMates[0] && (
                    <div className="flex flex-col items-center gap-2 -mb-4 z-10">
                        <div className="relative">
                            <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 h-8 w-8 text-yellow-500 fill-yellow-500 animate-bounce" />
                            <Avatar className="h-20 w-20 border-4 border-yellow-400 shadow-lg shadow-yellow-500/20">
                                <AvatarImage src={classMates[0].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${classMates[0].name}`} />
                                <AvatarFallback>{classMates[0].name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                                #1
                            </div>
                        </div>
                        <div className="text-center mt-1">
                            <p className="text-sm font-bold text-slate-900 w-24 truncate">{classMates[0].name.split(' ')[0]}</p>
                            <p className="text-xs text-yellow-600 font-bold">{classMates[0].points} XP</p>
                        </div>
                        <div className="h-32 w-20 bg-gradient-to-t from-yellow-300 to-amber-200 rounded-t-lg border-t border-x border-white/50 shadow-inner flex items-end justify-center pb-4">
                            <Trophy className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {classMates[2] && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                            <Avatar className="h-16 w-16 border-4 border-orange-200 shadow-md">
                                <AvatarImage src={classMates[2].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${classMates[2].name}`} />
                                <AvatarFallback>{classMates[2].name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-200 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                                #3
                            </div>
                        </div>
                        <div className="text-center mt-1">
                            <p className="text-xs font-bold text-slate-700 w-20 truncate">{classMates[2].name.split(' ')[0]}</p>
                            <p className="text-[10px] text-slate-500">{classMates[2].points} XP</p>
                        </div>
                        <div className="h-20 w-16 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-lg border-t border-x border-white/50 shadow-inner flex items-end justify-center pb-2">
                            <Medal className="h-6 w-6 text-orange-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* List */}
            <div className="space-y-3 px-1">
                {classMates.map((mate, index) => {
                    const isMe = mate.id === student.id
                    return (
                        <Card
                            key={mate.id}
                            className={`border-none shadow-sm hover:shadow-md transition-all duration-300 ${isMe
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white ring-2 ring-blue-200 ring-offset-2'
                                : 'bg-white text-slate-900'
                                }`}
                        >
                            <CardContent className="p-3 flex items-center gap-4">
                                <div className={`font-bold text-lg w-6 text-center ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {index + 1}
                                </div>
                                <Avatar className={`h-10 w-10 border-2 ${isMe ? 'border-white/50' : 'border-slate-100'}`}>
                                    <AvatarImage src={mate.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mate.name}`} />
                                    <AvatarFallback>{mate.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold truncate ${isMe ? 'text-white' : 'text-slate-900'}`}>
                                        {mate.name}
                                        {isMe && <span className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-normal">Kamu</span>}
                                    </p>
                                    <p className={`text-xs ${isMe ? 'text-blue-100' : 'text-slate-500'}`}>
                                        Level {Math.floor((mate.points || 0) / 100) + 1}
                                    </p>
                                </div>
                                <div className={`font-bold ${isMe ? 'text-white' : 'text-blue-600'}`}>
                                    {mate.points} XP
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
