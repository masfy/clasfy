"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, CheckCircle, Clock, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export default function StudentMissions() {
    const { challenges, students } = useData()
    const [student, setStudent] = useState<any>(null)

    useEffect(() => {
        const session = localStorage.getItem("clasfy_student_session")
        if (session) {
            const sessionData = JSON.parse(session)
            const freshData = students.find(s => s.id === sessionData.id)
            setStudent(freshData || sessionData)
        }
    }, [students])

    if (!student) return null

    // Separate active and completed challenges
    // Separate active and completed challenges (robust check)
    const activeChallenges = challenges.filter(c => {
        const completions = Array.isArray(c.completions) ? c.completions : []
        return !completions.some((id: any) => id == student.id)
    })
    const completedChallenges = challenges.filter(c => {
        const completions = Array.isArray(c.completions) ? c.completions : []
        return completions.some((id: any) => id == student.id)
    })

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col items-center text-center space-y-2 pt-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Misi & Tantangan</h2>
                <p className="text-slate-500 text-sm">Selesaikan misi untuk dapat XP!</p>
            </div>

            {/* Active Missions */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-900">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Misi Aktif
                </h3>
                {activeChallenges.length > 0 ? (
                    activeChallenges.map((challenge) => (
                        <Card key={challenge.id} className="bg-white border-slate-200 text-slate-900 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">{challenge.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{challenge.description}</p>
                                    </div>
                                    <Badge className="bg-purple-50 text-purple-600 border-purple-100 whitespace-nowrap">
                                        +{challenge.rewardPoints} XP
                                    </Badge>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                                    <Clock className="h-3 w-3" />
                                    <span>Berakhir: {challenge.dueDate}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="p-6 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed text-sm">
                        Tidak ada misi aktif saat ini.
                    </div>
                )}
            </div>

            {/* Completed Missions */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-900">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Selesai
                </h3>
                {completedChallenges.length > 0 ? (
                    completedChallenges.map((challenge) => (
                        <Card key={challenge.id} className="bg-slate-50 border-slate-200 text-slate-500">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-sm">{challenge.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1">Selesai</p>
                                </div>
                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                    +{challenge.rewardPoints} XP
                                </Badge>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="p-6 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed text-sm">
                        Belum ada misi yang diselesaikan.
                    </div>
                )}
            </div>
        </div>
    )
}
