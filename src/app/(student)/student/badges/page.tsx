"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Lock } from "lucide-react"
import { useEffect, useState } from "react"

export default function StudentBadges() {
    const { badges, students } = useData()
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

    // Ensure badges is an array
    const myBadgeIds = Array.isArray(student.badges)
        ? student.badges
        : (typeof student.badges === 'string' ? JSON.parse(student.badges) : [])

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col items-center text-center space-y-2 pt-4">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Koleksi Badge</h2>
                <p className="text-slate-500 text-sm">Kumpulkan semua prestasinya!</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {badges.map((badge) => {
                    const isUnlocked = myBadgeIds.includes(badge.id)

                    return (
                        <Card
                            key={badge.id}
                            className={`border-2 overflow-hidden relative group transition-all duration-300 ${isUnlocked
                                ? 'bg-gradient-to-br from-white to-blue-50 border-white/60 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-105 hover:border-blue-200'
                                : 'bg-slate-50/50 border-slate-100 opacity-70 grayscale'
                                }`}
                        >
                            <CardContent className="p-3 flex flex-col items-center text-center h-full relative z-10">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-transform duration-300 group-hover:scale-110 border-2 ${isUnlocked
                                    ? 'bg-white border-blue-100 shadow-sm text-blue-600'
                                    : 'bg-slate-200 border-slate-300 text-slate-400'
                                    }`}>
                                    {isUnlocked ? badge.icon : <Lock className="h-5 w-5" />}
                                </div>
                                <h4 className={`text-xs font-bold mb-1 ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {badge.name}
                                </h4>
                                {isUnlocked && (
                                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                                        {badge.description}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
