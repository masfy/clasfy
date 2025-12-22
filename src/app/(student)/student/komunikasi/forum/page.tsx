"use client"

import { useState, useEffect } from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, User, Calendar, Lock, ArrowLeft, Users, Plus } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function StudentForumPage() {
    const { posts, addComment, addNotification, addPost, user: teacher } = useData()
    const router = useRouter()
    const [student, setStudent] = useState<any>(null)
    const [selectedPost, setSelectedPost] = useState<any>(null)
    const [commentText, setCommentText] = useState("")

    // Create Post State
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    const [newContent, setNewContent] = useState("")

    useEffect(() => {
        const session = localStorage.getItem("clasfy_student_session")
        if (session) {
            setStudent(JSON.parse(session))
        }
    }, [])

    // Filter for discussions
    const discussions = posts
        .filter(p => p.type === 'discussion' || !p.type)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const handleAddComment = () => {
        if (!commentText.trim() || !student || !selectedPost) return

        addComment(selectedPost.id, {
            author: student.name,
            content: commentText,
            date: new Date().toISOString()
        })

        addNotification({
            message: `${student.name} mengomentari diskusi "${selectedPost.title}"`,
            link: "/komunikasi/forum",
            sender: student.name
        })

        setCommentText("")
    }

    const handleCreatePost = () => {
        if (!newTitle.trim() || !newContent.trim() || !student) return

        addPost({
            title: newTitle,
            content: newContent,
            author: student.name,
            date: new Date().toISOString().split('T')[0],
            status: "Active",
            type: "discussion"
        })

        addNotification({
            message: `${student.name} membuat diskusi baru: "${newTitle}"`,
            link: "/komunikasi/forum",
            sender: student.name
        })

        setNewTitle("")
        setNewContent("")
        setIsCreateOpen(false)
    }

    if (!student) return null

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-in-out">
            <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ArrowLeft className="h-6 w-6 text-slate-700" />
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Forum Diskusi</h2>
                        <p className="text-slate-500 text-sm">Diskusi kelas</p>
                    </div>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
                            <Plus className="h-4 w-4 mr-1" /> Buat
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-md w-[95%] rounded-xl">
                        <DialogHeader>
                            <DialogTitle>Buat Diskusi Baru</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label>Judul</Label>
                                <Input
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    placeholder="Topik diskusi..."
                                    className="bg-slate-50 border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Isi</Label>
                                <Textarea
                                    value={newContent}
                                    onChange={e => setNewContent(e.target.value)}
                                    placeholder="Apa yang ingin didiskusikan?"
                                    className="bg-slate-50 border-slate-200 min-h-[100px]"
                                />
                            </div>
                            <Button onClick={handleCreatePost} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                Posting
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {discussions.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        <Users className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                        <p>Belum ada diskusi.</p>
                    </div>
                ) : (
                    discussions.map((post) => (
                        <Dialog key={post.id} onOpenChange={(open) => {
                            if (open) setSelectedPost(post)
                            else setSelectedPost(null)
                        }}>
                            <DialogTrigger asChild>
                                <Card className="bg-white border-indigo-100 text-slate-900 hover:bg-indigo-50/50 transition-colors cursor-pointer shadow-sm">
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8 border border-indigo-100">
                                                    <AvatarImage src={post.author === teacher.name && teacher.avatar ? teacher.avatar : undefined} />
                                                    <AvatarFallback className="bg-indigo-100 text-indigo-600"><User className="h-4 w-4" /></AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-900">{post.author}</p>
                                                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {(() => {
                                                            try {
                                                                return format(new Date(post.date), "d MMM yyyy", { locale: id })
                                                            } catch (e) {
                                                                return "Tanggal tidak valid"
                                                            }
                                                        })()}
                                                    </p>
                                                </div>
                                            </div>
                                            {post.status === "Closed" && (
                                                <div className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 border border-red-100">
                                                    <Lock className="h-3 w-3" /> Tutup
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2">
                                        <h3 className="font-bold text-sm mb-1 text-slate-900">{post.title}</h3>
                                        <p className="text-xs text-slate-600 line-clamp-2">{post.content}</p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex items-center gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="h-3 w-3" />
                                            {post.comments.length} Komentar
                                        </div>
                                    </CardFooter>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-md w-[95%] rounded-xl">
                                <DialogHeader>
                                    <DialogTitle className="text-left text-slate-900 flex items-center gap-2">
                                        <Users className="h-5 w-5 text-indigo-500" />
                                        {post.title}
                                    </DialogTitle>
                                </DialogHeader>

                                <ScrollArea className="h-[50vh] pr-4">
                                    <div className="space-y-4">
                                        {/* Post Content */}
                                        <div className="bg-indigo-50/50 p-3 rounded-lg space-y-2 border border-indigo-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={post.author === teacher.name && teacher.avatar ? teacher.avatar : undefined} />
                                                    <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs font-semibold text-slate-900">{post.author}</span>
                                                <span className="text-[10px] text-slate-500 ml-auto">
                                                    {format(new Date(post.date), "d MMM yyyy", { locale: id })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{post.content}</p>
                                        </div>

                                        {/* Comments */}
                                        <div className="space-y-3 pt-2">
                                            <h4 className="text-xs font-semibold text-slate-500">Komentar ({post.comments.length})</h4>
                                            {post.comments.length === 0 ? (
                                                <p className="text-xs text-slate-500 text-center py-4">Belum ada komentar.</p>
                                            ) : (
                                                post.comments.map((comment: any) => (
                                                    <div key={comment.id} className="flex gap-2">
                                                        <Avatar className="h-6 w-6 mt-1">
                                                            <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-600">{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg rounded-tl-none flex-1">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs font-bold text-indigo-600">{comment.author}</span>
                                                                <span className="text-[10px] text-slate-500">
                                                                    {format(new Date(comment.date), "d MMM HH:mm", { locale: id })}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-700">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </ScrollArea>

                                {/* Comment Input */}
                                {post.status === "Active" ? (
                                    <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100">
                                        <Input
                                            placeholder="Tulis komentar..."
                                            className="bg-slate-50 border-slate-200 text-xs h-9 text-slate-900 placeholder:text-slate-400"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                        />
                                        <Button size="icon" className="h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleAddComment}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="mt-2 pt-2 border-t border-slate-100 text-center text-xs text-red-500 flex items-center justify-center gap-2">
                                        <Lock className="h-3 w-3" />
                                        Diskusi ini telah ditutup
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    ))
                )}
            </div>
        </div>
    )
}
