"use client"

import { useState, useEffect } from "react"
import { useData } from "@/lib/data-context"
import { StudentList } from "@/components/chat/StudentList"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { Card } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ChatPage() {
    const { students, chats, addChat, user, isLoaded } = useData()
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

    // Sort students by latest message time or name
    const sortedStudents = [...students].sort((a, b) => {
        const lastChatA = chats
            .filter(c => c.studentId === a.id)
            .sort((x, y) => new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime())[0]

        const lastChatB = chats
            .filter(c => c.studentId === b.id)
            .sort((x, y) => new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime())[0]

        if (lastChatA && lastChatB) {
            return new Date(lastChatB.timestamp).getTime() - new Date(lastChatA.timestamp).getTime()
        }
        if (lastChatA) return -1
        if (lastChatB) return 1
        return a.name.localeCompare(b.name)
    })

    const selectedStudent = students.find(s => s.id === selectedStudentId)

    const handleSendMessage = (message: string) => {
        if (!selectedStudentId) return

        addChat({
            studentId: selectedStudentId,
            teacherId: Number(user.id) || 1, // Default to 1 if not set
            message: message,
            isFromTeacher: true
        })
    }

    if (!isLoaded) {
        return (
            <div className="h-[calc(100vh-120px)] flex gap-4 relative animate-in fade-in duration-700">
                <div className="w-full md:w-1/3 md:min-w-[300px] h-full border-r border-border pr-4">
                    <Skeleton className="h-10 w-full mb-4" />
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-2">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-12" />
                                    </div>
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden md:flex flex-1 h-full flex-col">
                    <div className="border-b border-border pb-4 mb-4 flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-4 p-4">
                        <div className="flex justify-start">
                            <Skeleton className="h-10 w-48 rounded-lg rounded-tl-none" />
                        </div>
                        <div className="flex justify-end">
                            <Skeleton className="h-10 w-48 rounded-lg rounded-tr-none" />
                        </div>
                        <div className="flex justify-start">
                            <Skeleton className="h-16 w-64 rounded-lg rounded-tl-none" />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-border">
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-120px)] flex gap-4 relative">
            {/* Student List - Hidden on mobile if student selected */}
            <div className={`w-full md:w-1/3 md:min-w-[300px] ${selectedStudentId ? 'hidden md:block' : 'block'}`}>
                <StudentList
                    students={sortedStudents}
                    chats={chats}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={setSelectedStudentId}
                />
            </div>

            {/* Chat Window - Hidden on mobile if NO student selected */}
            <div className={`flex-1 ${!selectedStudentId ? 'hidden md:block' : 'block'} h-full`}>
                {selectedStudent ? (
                    <ChatWindow
                        student={selectedStudent}
                        chats={chats}
                        onSendMessage={handleSendMessage}
                        onBack={() => setSelectedStudentId(null)}
                    />
                ) : (
                    <Card className="h-full flex flex-col items-center justify-center text-muted-foreground bg-slate-50/50 border-dashed">
                        <div className="p-4 rounded-full bg-slate-100 mb-4">
                            <MessageSquare className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">Pesan Pribadi</h3>
                        <p className="max-w-xs text-center mt-2">
                            Pilih siswa dari daftar di sebelah kiri untuk memulai percakapan pribadi.
                        </p>
                    </Card>
                )}
            </div>
        </div>
    )
}
