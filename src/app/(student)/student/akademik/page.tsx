"use client"

import { useData } from "@/lib/data-context"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap } from "lucide-react"

export default function StudentAkademik() {
    const { mapel, assignments, grades, students } = useData()
    const [student, setStudent] = useState<any>(null)

    useEffect(() => {
        const session = localStorage.getItem("clasfy_student_session")
        if (session) {
            const sessionData = JSON.parse(session)
            // Refresh data from context
            const freshData = students.find(s => s.id == sessionData.id)
            setStudent(freshData || sessionData)
        }
    }, [students])

    if (!student) return null

    // Calculate grades for each subject
    const getSubjectScore = (mapelId: number) => {
        // Get all assignments for this subject
        const subjectAssignments = assignments.filter(a => a.mapelId === mapelId)

        if (subjectAssignments.length === 0) return 0

        // Get grades for these assignments for the current student
        const studentGrades = grades.filter(g =>
            g.studentId == student.id &&
            subjectAssignments.some(a => a.id === g.assignmentId)
        )

        if (studentGrades.length === 0) return 0

        // Calculate average
        const totalScore = studentGrades.reduce((sum, g) => sum + g.score, 0)
        return Math.round(totalScore / studentGrades.length)
    }

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-in-out">
            <div className="flex flex-col items-center text-center space-y-2 pt-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Akademik</h2>
                <p className="text-slate-500 text-sm">Pantau nilai dan mata pelajaranmu</p>
            </div>

            <div className="grid gap-4">
                {mapel.map((subject) => {
                    const score = getSubjectScore(subject.id)
                    const hasScore = score > 0

                    return (
                        <Card key={subject.id} className="bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <GraduationCap className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm text-slate-900">{subject.name}</h3>
                                            <p className="text-xs text-slate-500">KKM: {subject.kkm}</p>
                                        </div>
                                    </div>
                                    <div className={`text-lg font-bold ${score >= subject.kkm ? 'text-green-600' : (hasScore ? 'text-red-600' : 'text-slate-400')}`}>
                                        {hasScore ? score : '-'}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Rata-rata Nilai</span>
                                        <span>{hasScore ? `${score}/100` : 'Belum ada nilai'}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${score >= subject.kkm ? 'bg-green-500' : 'bg-red-500'}`}
                                            style={{ width: `${hasScore ? score : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
