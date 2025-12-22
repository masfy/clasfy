"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react"
import { useEffect, useState } from "react"

export default function StudentTugas() {
    const { students, assignments, grades, mapel, classes } = useData()
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

    // Find student's class ID
    const studentClass = classes.find(c => c.name === student.class)

    // Filter assignments for this class
    const myAssignments = assignments
        .filter(a => a.classId === studentClass?.id && a.status === "Active")
        .map(assignment => {
            const grade = grades.find(g => g.assignmentId === assignment.id && g.studentId === student.id)
            const subject = mapel.find(m => m.id === assignment.mapelId)

            let status = "Pending"
            let score = 0

            if (grade) {
                status = "Graded" // Simplified: If grade exists, it's graded/submitted
                score = grade.score
            } else {
                // Check if late
                if (new Date(assignment.dueDate) < new Date()) {
                    status = "Late"
                }
            }

            return {
                id: assignment.id,
                mapel: subject?.name || "Unknown Subject",
                title: assignment.title,
                dueDate: assignment.dueDate,
                status,
                score,
                type: "Tugas" // Default type for now
            }
        })

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
            case "Submitted": return "text-primary bg-primary/10 border-primary/20"
            case "Graded": return "text-green-500 bg-green-500/10 border-green-500/20"
            case "Late": return "text-red-500 bg-red-500/10 border-red-500/20"
            default: return "text-gray-500 bg-gray-500/10 border-gray-500/20"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Pending": return <Clock className="h-3 w-3" />
            case "Submitted": return <CheckCircle className="h-3 w-3" />
            case "Graded": return <CheckCircle className="h-3 w-3" />
            case "Late": return <AlertCircle className="h-3 w-3" />
            default: return <FileText className="h-3 w-3" />
        }
    }

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-in-out">
            <div className="flex flex-col items-center text-center space-y-2 pt-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Daftar Tugas</h2>
                <p className="text-slate-500 text-sm">Selesaikan tugasmu tepat waktu!</p>
            </div>

            <div className="space-y-3">
                {myAssignments.length > 0 ? (
                    myAssignments.map((tugas) => (
                        <Card key={tugas.id} className="bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                                                {tugas.mapel}
                                            </Badge>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{tugas.type}</span>
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">{tugas.title}</h4>
                                    </div>
                                    <Badge className={`border ${getStatusColor(tugas.status)} flex items-center gap-1`}>
                                        {getStatusIcon(tugas.status)}
                                        {tugas.status === "Graded" ? `Nilai: ${tugas.score}` : tugas.status}
                                    </Badge>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>Tenggat: {new Date(tugas.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    {tugas.status === "Pending" && (
                                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                                            Kerjakan
                                        </button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        <p>Belum ada tugas untuk kelasmu.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
