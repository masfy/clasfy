"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Star } from "lucide-react"
import { useData } from "@/lib/data-context"

export function LeaderboardWidget() {
    const { students, grades } = useData()

    // Calculate average grade for each student
    const studentGrades = React.useMemo(() => {
        return students.map(student => {
            const studentScores = grades.filter(g => g.studentId === student.id)
            const totalScore = studentScores.reduce((sum, g) => sum + g.score, 0)
            const average = studentScores.length > 0 ? totalScore / studentScores.length : 0
            return { ...student, average }
        }).sort((a, b) => b.average - a.average).slice(0, 5)
    }, [students, grades])

    // Sort by points
    const studentPoints = React.useMemo(() => {
        return [...students].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5)
    }, [students])

    return (
        <Card className="relative h-full border-none bg-white text-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full blur-3xl pointer-events-none opacity-50" />

            <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <div className="p-1.5 rounded-lg bg-yellow-50 text-yellow-600 ring-1 ring-yellow-100">
                        <Trophy className="h-4 w-4" />
                    </div>
                    Peringkat Siswa
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <Tabs defaultValue="nilai" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-50 p-1 border border-slate-100 rounded-xl">
                        <TabsTrigger value="nilai" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-slate-500 hover:text-slate-700 transition-all rounded-lg">Nilai Tertinggi</TabsTrigger>
                        <TabsTrigger value="poin" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm text-slate-500 hover:text-slate-700 transition-all rounded-lg">Poin Tertinggi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="nilai" className="mt-4 space-y-3">
                        {studentGrades.map((student, index) => (
                            <div key={student.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shadow-sm ${index === 0 ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200" :
                                        index === 1 ? "bg-slate-100 text-slate-700 ring-1 ring-slate-200" :
                                            index === 2 ? "bg-orange-100 text-orange-700 ring-1 ring-orange-200" :
                                                "bg-slate-50 text-slate-400"
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <Avatar className="h-9 w-9 border-2 border-white ring-1 ring-slate-100 shadow-sm">
                                        <AvatarFallback className="text-xs bg-blue-50 text-blue-600 font-bold">
                                            {student.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-bold leading-none text-slate-700 group-hover:text-blue-600 transition-colors">{student.name}</p>
                                        <p className="text-xs text-slate-400">{student.class}</p>
                                    </div>
                                </div>
                                <div className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                                    {student.average.toFixed(1)}
                                </div>
                            </div>
                        ))}
                    </TabsContent>
                    <TabsContent value="poin" className="mt-4 space-y-3">
                        {studentPoints.map((student, index) => (
                            <div key={student.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shadow-sm ${index === 0 ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200" :
                                        index === 1 ? "bg-slate-100 text-slate-700 ring-1 ring-slate-200" :
                                            index === 2 ? "bg-orange-100 text-orange-700 ring-1 ring-orange-200" :
                                                "bg-slate-50 text-slate-400"
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <Avatar className="h-9 w-9 border-2 border-white ring-1 ring-slate-100 shadow-sm">
                                        <AvatarFallback className="text-xs bg-emerald-50 text-emerald-600 font-bold">
                                            {student.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-bold leading-none text-slate-700 group-hover:text-emerald-600 transition-colors">{student.name}</p>
                                        <p className="text-xs text-slate-400">{student.class}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                                    <Star className="h-3 w-3 fill-emerald-600" />
                                    {student.points || 0}
                                </div>
                            </div>
                        ))}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
