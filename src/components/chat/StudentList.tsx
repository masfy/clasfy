import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { StudentData, Chat } from "@/lib/data-context"

interface StudentListProps {
    students: StudentData[]
    chats: Chat[]
    selectedStudentId: number | null
    onSelectStudent: (id: number) => void
}

export function StudentList({ students, chats, selectedStudentId, onSelectStudent }: StudentListProps) {
    const [search, setSearch] = useState("")

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.class.toLowerCase().includes(search.toLowerCase())
    )

    const getUnreadCount = (studentId: number) => {
        return chats.filter(c => c.studentId === studentId && !c.isFromTeacher && !c.isRead).length
    }

    const getLastMessage = (studentId: number) => {
        const studentChats = chats.filter(c => c.studentId === studentId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        return studentChats.length > 0 ? studentChats[0] : null
    }

    return (
        <div className="h-full flex flex-col bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari siswa..."
                        className="pl-8 bg-slate-50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {filteredStudents.map(student => {
                    const unreadCount = getUnreadCount(student.id)
                    const lastMessage = getLastMessage(student.id)

                    return (
                        <div
                            key={student.id}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedStudentId === student.id ? 'bg-blue-50 border-blue-100 border' : 'hover:bg-slate-50'
                                }`}
                            onClick={() => onSelectStudent(student.id)}
                        >
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={student.avatar} />
                                <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <h4 className={`font-medium truncate ${selectedStudentId === student.id ? 'text-blue-700' : 'text-slate-900'}`}>
                                        {student.name}
                                    </h4>
                                    {lastMessage && (
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                                        {lastMessage ? (
                                            <span className={!lastMessage.isFromTeacher && !lastMessage.isRead ? "font-semibold text-slate-900" : ""}>
                                                {lastMessage.isFromTeacher ? "Anda: " : ""}{lastMessage.message}
                                            </span>
                                        ) : (
                                            <span className="italic">Belum ada pesan</span>
                                        )}
                                    </p>
                                    {unreadCount > 0 && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
