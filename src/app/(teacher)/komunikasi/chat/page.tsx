"use client"

import { useState, useEffect } from "react"
import { useData } from "@/lib/data-context"
import { StudentList } from "@/components/chat/StudentList"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { Card } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function ChatPage() {
    const { students, chats, addChat, user } = useData()
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
