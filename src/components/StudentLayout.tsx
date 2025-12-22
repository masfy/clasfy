"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, MessageSquare, User, Trophy, Bell, LogOut, Calendar, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useData } from "@/lib/data-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface StudentLayoutProps {
    children: React.ReactNode
}

export function StudentLayout({ children }: StudentLayoutProps) {
    const pathname = usePathname()
    const { students, notifications, markNotificationAsRead } = useData()
    // Simplified session retrieval (in real app use proper auth context)
    const [student, setStudent] = React.useState<any>(null)

    React.useEffect(() => {
        const session = localStorage.getItem("clasfy_student_session")
        if (session) {
            const sessionData = JSON.parse(session)
            // Find fresh data from context to ensure updates (like avatar) are reflected
            const freshData = students.find(s => s.id === sessionData.id)
            setStudent(freshData || sessionData)
        }
    }, [students])

    // Filter notifications:
    // 1. Show notifications from teacher (sender is undefined or teacher's name)
    // 2. Show notifications from other students (sender !== current student name)
    // 3. Hide own notifications (sender === current student name)
    const studentNotifications = [...notifications]
        .filter(n => n.sender !== student?.name)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const navItems = [
        { id: "home", icon: Home, label: "Home", href: "/student/dashboard" },
        { id: "tugas", icon: BookOpen, label: "Tugas", href: "/student/tugas" },
        { id: "presensi", icon: Calendar, label: "Presensi", href: "/student/presensi" },
        { id: "komunikasi", icon: MessageSquare, label: "Forum", href: "/student/komunikasi" },
        { id: "leaderboard", icon: Trophy, label: "Rank", href: "/student/leaderboard" },
        { id: "profil", icon: User, label: "Profil", href: "/student/profil" },
    ]

    if (!student) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>

    return (
        <div className="h-screen w-full overflow-y-auto bg-slate-50 text-slate-900 pb-32 scrollbar-hide">
            {/* Mobile Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-300 px-4 py-3 flex items-center justify-between shadow-sm">
                {/* Left: Brand */}
                <div className="flex items-center gap-2">
                    <img src="/clasfy-logo.png" alt="Clasfy Logo" className="h-8 w-8 object-contain" />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold leading-none tracking-tight text-slate-900">Clasfy</span>
                        <span className="text-[10px] text-slate-500 font-medium">Student Area</span>
                    </div>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-3">
                    <div className="hidden xs:flex bg-blue-50 px-2 py-1 rounded-full text-[10px] font-medium text-blue-600 border border-blue-200">
                        {student.points || 0} XP
                    </div>

                    {/* Notification */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                {studentNotifications.filter(n => !n.read).length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-background" />
                                )}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-card border-border text-card-foreground p-0 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200" align="end">
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <h3 className="font-semibold text-sm">Notifikasi</h3>
                                {studentNotifications.length > 0 && (
                                    <button
                                        onClick={() => studentNotifications.forEach(n => markNotificationAsRead(n.id))}
                                        className="text-xs text-primary hover:text-primary/80"
                                    >
                                        Tandai dibaca
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {studentNotifications.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground text-sm">
                                        Belum ada notifikasi
                                    </div>
                                ) : (
                                    studentNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-border hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}
                                            onClick={() => markNotificationAsRead(notification.id)}
                                        >
                                            <p className="text-sm leading-snug text-foreground">{notification.message}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(notification.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Avatar */}
                    <Link href="/student/profil">
                        <Avatar className="h-10 w-10 border border-blue-200 cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarImage src={student.avatar} className="object-cover" />
                            <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={() => {
                            localStorage.removeItem("clasfy_student_session")
                            window.location.href = "/login"
                        }}
                        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-red-400"
                        title="Keluar"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4">
                {children}
            </main>



            {/* Bottom Navigation & Footer (Floating Dock) */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none flex flex-col items-center gap-2">
                <nav className="pointer-events-auto mx-auto flex items-center justify-between bg-white/90 backdrop-blur-xl border border-blue-400 shadow-2xl shadow-blue-900/10 rounded-full px-6 py-3 gap-2 w-full">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center justify-center transition-all duration-300 ease-out group",
                                    isActive
                                        ? "w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30 -translate-y-6 scale-110 ring-4 ring-slate-50"
                                        : "w-10 h-10 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                                )}
                            >
                                <item.icon className={cn("transition-all", isActive ? "h-5 w-5" : "h-5 w-5")} />
                                {isActive && (
                                    <span className="absolute -bottom-6 text-[10px] font-bold text-blue-600 whitespace-nowrap animate-in fade-in slide-in-from-top-1">
                                        {item.label}
                                    </span>
                                )}
                                {!isActive && (
                                    <span className="absolute -top-8 text-[10px] font-medium text-white bg-blue-600 border border-blue-600 px-2 py-0.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap z-50">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer inside fixed container */}
                <div className="pointer-events-auto py-1 px-3 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 shadow-sm text-[8px] text-blue-600 font-medium flex items-center justify-center gap-1">
                    <span>© {new Date().getFullYear()} | Clasfy by Mas Alfy</span>
                    <BadgeCheck className="h-2.5 w-2.5 text-blue-600" />
                </div>
            </div>
        </div>
    )
}
