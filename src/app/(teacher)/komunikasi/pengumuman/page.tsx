"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, Plus, Trash2, Lock, Unlock, Send, MoreVertical, Megaphone } from "lucide-react"
import { CustomModal } from "@/components/ui/custom-modal"
import { useData, Post } from "@/lib/data-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export default function PengumumanPage() {
    const { user, posts, addPost, deletePost, togglePostStatus, addComment, addNotification, isLoaded } = useData()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [newPostTitle, setNewPostTitle] = useState("")
    const [newPostContent, setNewPostContent] = useState("")
    const [newComment, setNewComment] = useState("")

    // Filter for announcements and sort by date
    const sortedPosts = posts
        .filter(p => p.type === 'announcement')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPostTitle || !newPostContent) return

        addPost({
            title: newPostTitle,
            content: newPostContent,
            author: user.name,
            date: new Date().toISOString().split('T')[0],
            status: "Active",
            type: "announcement"
        })

        setNewPostTitle("")
        setNewPostContent("")
        setIsCreateModalOpen(false)
    }

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedPost || !newComment) return

        addComment(selectedPost.id, {
            author: user.name,
            content: newComment,
            date: new Date().toISOString()
        })

        if (user.name !== selectedPost.author) {
            addNotification({
                message: `${user.name} membalas pengumuman "${selectedPost.title}"`,
                link: "/komunikasi/pengumuman",
                sender: user.name
            })
        }

        setNewComment("")
    }

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase()
    }

    if (!isLoaded) {
        return (
            <div className="space-y-6 animate-in fade-in duration-700">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-40" />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="bg-card border-border flex flex-col">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div className="flex flex-col gap-1">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-2 w-16" />
                                        </div>
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-3/4 mt-2" />
                            </CardHeader>
                            <CardContent className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                            <CardFooter className="pt-2 border-t border-border flex justify-between">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-20" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Pengumuman</h2>
                    <p className="text-gray-400">Informasi resmi dan pemberitahuan penting.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Pengumuman
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedPosts.map((post) => (
                    <Card key={post.id} className="bg-card border-border text-foreground flex flex-col hover:border-blue-500/50 transition-colors cursor-pointer" onClick={() => setSelectedPost(post)}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-blue-600 text-white text-xs">{getInitials(post.author)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{post.author}</span>
                                        <span className="text-xs text-muted-foreground">{post.date}</span>
                                    </div>
                                </div>
                                {post.status === "Closed" && (
                                    <Badge variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none">
                                        <Lock className="h-3 w-3 mr-1" />
                                        Tutup
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-lg mt-2 line-clamp-1">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground text-sm line-clamp-3">{post.content}</p>
                        </CardContent>
                        <CardFooter className="pt-2 border-t border-border flex justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {post.comments.length} Komentar
                            </div>
                            <div className="flex items-center gap-1 text-blue-500">
                                <Megaphone className="h-3 w-3" />
                                Pengumuman
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Create Post Modal */}
            <CustomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Buat Pengumuman Baru"
            >
                <form onSubmit={handleCreatePost} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Pengumuman</Label>
                        <Input
                            id="title"
                            value={newPostTitle}
                            onChange={(e) => setNewPostTitle(e.target.value)}
                            placeholder="Contoh: Jadwal Ujian Semester"
                            className="bg-muted border-none text-foreground"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Isi Pengumuman</Label>
                        <Textarea
                            id="content"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Tuliskan isi pengumuman di sini..."
                            className="bg-muted border-none text-foreground min-h-[150px]"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="hover:bg-muted hover:text-foreground">Batal</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Posting</Button>
                    </div>
                </form>
            </CustomModal>

            {/* Detail Post Modal */}
            <CustomModal
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                title="Detail Pengumuman"
            >
                {(() => {
                    const activePost = posts.find(p => p.id === selectedPost?.id) || selectedPost
                    if (!activePost) return null

                    return (
                        <div className="space-y-6">
                            {/* Post Content */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback className="bg-blue-600 text-white">{getInitials(activePost.author)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-lg">{activePost.title}</h3>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{activePost.author}</span>
                                                <span>•</span>
                                                <span>{activePost.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                                            <DropdownMenuItem onClick={() => togglePostStatus(activePost.id)}>
                                                {activePost.status === "Active" ? (
                                                    <>
                                                        <Lock className="mr-2 h-4 w-4" />
                                                        Tutup Komentar
                                                    </>
                                                ) : (
                                                    <>
                                                        <Unlock className="mr-2 h-4 w-4" />
                                                        Buka Komentar
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                if (confirm("Hapus pengumuman ini?")) {
                                                    deletePost(activePost.id)
                                                    setSelectedPost(null)
                                                }
                                            }} className="text-red-500 focus:text-red-500">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="bg-muted/50 p-4 rounded-lg text-foreground whitespace-pre-wrap">
                                    {activePost.content}
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Komentar ({activePost.comments.length})
                                </h4>

                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                    {activePost.comments.length === 0 ? (
                                        <p className="text-center text-muted-foreground text-sm py-4">Belum ada komentar.</p>
                                    ) : (
                                        activePost.comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-3">
                                                <Avatar className="h-8 w-8 mt-1">
                                                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">{getInitials(comment.author)}</AvatarFallback>
                                                </Avatar>
                                                <div className="bg-muted p-3 rounded-lg rounded-tl-none flex-1">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <span className="font-semibold text-sm text-blue-400">{comment.author}</span>
                                                        <span className="text-[10px] text-muted-foreground">{new Date(comment.date).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Add Comment Input */}
                                {activePost.status === "Active" ? (
                                    <form onSubmit={handleAddComment} className="flex gap-2 items-end pt-2 border-t border-border">
                                        <Avatar className="h-8 w-8 hidden md:block">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 relative">
                                            <Textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Tulis komentar..."
                                                className="bg-muted border-none text-foreground min-h-[40px] max-h-[100px] pr-10 resize-none py-3"
                                            />
                                            <Button
                                                type="submit"
                                                size="icon"
                                                className="absolute right-1 bottom-1 h-8 w-8 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                                disabled={!newComment.trim()}
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center text-red-400 text-sm flex items-center justify-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        Komentar ditutup.
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })()}
            </CustomModal>
        </div>
    )
}
