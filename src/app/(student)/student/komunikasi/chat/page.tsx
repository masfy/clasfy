"use client"

import { useState, useEffect } from "react"
import { useData } from "@/lib/data-context"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { Card } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function StudentChatPage() {
    const { students, chats, addChat, user } = useData()
    const [student, setStudent] = useState<any>(null)

    // Load current student session
    useEffect(() => {
        const session = localStorage.getItem("clasfy_student_session")
        if (session) {
            const sessionData = JSON.parse(session)
            // Use loose equality to handle string/number ID mismatch
            const freshData = students.find(s => s.id == sessionData.id)
            setStudent(freshData || sessionData)
        }
    }, [students])

    if (!student) {
        return <div className="p-4 text-center">Loading...</div>
    }

    const handleSendMessage = (message: string) => {
        addChat({
            studentId: Number(student.id),
            teacherId: 1, // Default teacher ID
            message: message,
            isFromTeacher: false
        })
    }

    // Mock teacher data for the chat window
    // In a real app, we might fetch teacher data, but here we assume one teacher
    const teacherAsStudent = {
        id: 1,
        name: "Guru",
        class: "Pengajar",
        nis: "NIP. 1985...",
        status: "Active",
        points: 0,
        level: 0,
        badges: [],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher"
    }

    return (
        <div className="fixed left-0 right-0 top-[80px] bottom-[120px] px-4 z-0">
            <ChatWindow
                student={student}
                chats={chats}
                onSendMessage={handleSendMessage}
                displayOverride={{
                    name: "Guru",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher",
                    subtext: "Pengajar"
                }}
                isTeacherView={false}
            />
        </div>
    )
}
