import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, MoreVertical, RefreshCcw, ArrowLeft, Trash2, AlertTriangle } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { StudentData, Chat, useData } from "@/lib/data-context"

interface ChatWindowProps {
    student: StudentData
    chats: Chat[]
    onSendMessage: (message: string) => void
    displayOverride?: {
        name: string
        avatar: string
        subtext: string
    }
    isTeacherView?: boolean
    onBack?: () => void
}

export function ChatWindow({ student, chats, onSendMessage, displayOverride, isTeacherView = true, onBack }: ChatWindowProps) {
    const [message, setMessage] = useState("")
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const { markChatRead, refreshData, clearChat } = useData()

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refreshData()
        setIsRefreshing(false)
    }

    // Filter chats for this student and sort by time
    const studentChats = useMemo(() => {
        return chats
            .filter(c => c.studentId === student.id)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    }, [chats, student.id])

    // Mark unread messages as read when viewing
    useEffect(() => {
        // If teacher view, mark messages NOT from teacher (student messages) as read
        // If student view, mark messages FROM teacher as read
        const shouldMarkRead = (c: Chat) => isTeacherView ? !c.isFromTeacher : c.isFromTeacher

        const unreadChats = studentChats.filter(c => shouldMarkRead(c) && !c.isRead)
        if (unreadChats.length > 0) {
            unreadChats.forEach(c => markChatRead(c.id))
        }
    }, [studentChats, markChatRead, isTeacherView])

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [studentChats])

    const handleSend = () => {
        if (!message.trim()) return
        onSendMessage(message)
        setMessage("")
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleDeleteChat = () => {
        clearChat(student.id)
        setIsDeleteDialogOpen(false)
    }

    const displayName = displayOverride?.name || student.name
    const displayAvatar = displayOverride?.avatar || student.avatar
    const displaySubtext = displayOverride?.subtext || `${student.class} • ${student.nis}`

    return (
        <>
            <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden -ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src={displayAvatar} />
                            <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-slate-900">{displayName}</h3>
                            <p className="text-xs text-muted-foreground">{displaySubtext}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`text-muted-foreground hover:text-blue-600 ${isRefreshing ? "animate-spin" : ""}`}
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            title="Refresh Chat"
                        >
                            <RefreshCcw className="h-5 w-5" />
                        </Button>
                        {isTeacherView && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Bersihkan Chat
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" ref={scrollRef}>
                    {studentChats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                            <p>Belum ada pesan.</p>
                            <p className="text-sm">Mulai percakapan dengan {displayName}</p>
                        </div>
                    ) : (
                        studentChats.map((chat) => {
                            const isMyMessage = isTeacherView ? chat.isFromTeacher : !chat.isFromTeacher
                            return (
                                <div
                                    key={chat.id}
                                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${isMyMessage
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white border text-slate-800 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="text-sm">{chat.message}</p>
                                        <p className={`text-[10px] mt-1 text-right ${isMyMessage ? 'text-blue-100' : 'text-slate-400'}`}>
                                            {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {isMyMessage && (
                                                <span className="ml-1">
                                                    {chat.isRead ? "✓✓" : "✓"}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Tulis pesan..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                        />
                        <Button onClick={handleSend} size="icon" className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Bersihkan Chat?
                        </DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus semua pesan dengan <strong>{displayName}</strong>?
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteChat}>
                            Ya, Hapus Semua
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
