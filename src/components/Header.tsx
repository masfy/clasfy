"use client"

import * as React from "react"
import { useSync } from "@/hooks/use-sync"
import { Search, Bell, ChevronDown, Menu, BadgeCheck, User, Settings, HelpCircle, LogOut, Wifi, WifiOff, RefreshCw, Users } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface HeaderProps {
    onMenuClick?: () => void
}

interface SearchResult {
    type: 'Siswa' | 'Kelas' | 'Menu'
    title: string
    subtitle: string
    url: string
}

// ... imports

export function Header({ onMenuClick }: HeaderProps) {
    const { user, notifications, markNotificationAsRead, students, classes } = useData()
    const { isSyncing, isOnline } = useSync()
    const router = useRouter()
    const [isDropdownOpen, setIsDropdownOpen] = React.useState<string | boolean>(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const notificationRef = React.useRef<HTMLDivElement>(null)

    // Search State
    const [searchQuery, setSearchQuery] = React.useState("")
    const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])
    const [showResults, setShowResults] = React.useState(false)

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        if (!query.trim()) {
            setSearchResults([])
            return
        }

        const results: SearchResult[] = []
        const lowerQuery = query.toLowerCase()

        // Search Students
        students.forEach(student => {
            if (student.name.toLowerCase().includes(lowerQuery) || student.nis.includes(lowerQuery)) {
                results.push({
                    type: 'Siswa',
                    title: student.name,
                    subtitle: `${student.nis} • ${student.class}`,
                    url: `/data/siswa?search=${encodeURIComponent(student.name)}`
                })
            }
        })

        // Search Classes
        classes.forEach(cls => {
            if (cls.name.toLowerCase().includes(lowerQuery)) {
                results.push({
                    type: 'Kelas',
                    title: cls.name,
                    subtitle: `${cls.description || 'Tidak ada deskripsi'}`,
                    url: `/data/kelas` // Could be improved to filter class page if implemented
                })
            }
        })

        setSearchResults(results.slice(0, 5)) // Limit to 5 results
    }

    // Filter notifications: Hide own notifications and sort by date
    const userNotifications = notifications
        .filter(n => n.sender !== user.name)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <header className="flex h-20 items-center justify-between px-4 md:px-8 py-4 bg-background text-foreground border-b border-border transition-colors duration-300">
            {/* Left: Mobile Menu & Logo */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 md:h-10 md:w-10">
                        <img src="/logo.png" alt="Clasfy Logo" className="object-contain w-full h-full" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-wider hidden md:block leading-none">Clasfy</span>
                        <span className="font-bold text-lg tracking-wider md:hidden leading-none">Clasfy</span>
                        <span className="text-[10px] text-muted-foreground font-medium tracking-wide hidden md:block">Class Management System</span>
                    </div>
                </div>
            </div>

            {/* Center: Search (Hidden on mobile) */}
            <div className="hidden md:flex w-1/3 relative z-50">
                <div className="w-full flex items-center rounded-full bg-blue-50/50 px-4 py-2.5 border border-blue-100 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
                    <Search className="mr-2 h-4 w-4 text-blue-400" />
                    <input
                        type="text"
                        placeholder="Cari siswa, kelas, atau menu..."
                        className="flex-1 bg-transparent text-sm text-slate-700 placeholder-blue-300 focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => setShowResults(true)}
                    />
                    <div className="flex items-center gap-1 text-xs text-blue-300">
                        <span>⌘</span>
                        <span>K</span>
                    </div>
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                    {showResults && searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden max-h-[400px] overflow-y-auto"
                        >
                            {searchResults.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    Tidak ada hasil ditemukan
                                </div>
                            ) : (
                                <div className="py-2">
                                    {searchResults.map((result, index) => (
                                        <button
                                            key={`${result.type}-${index}`}
                                            className="w-full px-4 py-2 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                                            onClick={() => {
                                                router.push(result.url)
                                                setShowResults(false)
                                                setSearchQuery("")
                                            }}
                                        >
                                            <div className={`p-2 rounded-lg ${result.type === 'Siswa' ? 'bg-blue-100 text-blue-600' :
                                                result.type === 'Kelas' ? 'bg-purple-100 text-purple-600' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {result.type === 'Siswa' ? <User className="h-4 w-4" /> :
                                                    result.type === 'Kelas' ? <Users className="h-4 w-4" /> :
                                                        <Search className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-foreground">{result.title}</div>
                                                <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sync Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-medium shadow-sm">
                {isSyncing ? (
                    <>
                        <RefreshCw className="h-3 w-3 animate-spin text-blue-600" />
                        <span className="text-blue-600">Syncing...</span>
                    </>
                ) : isOnline ? (
                    <>
                        <Wifi className="h-3 w-3 text-emerald-500" />
                        <span className="text-emerald-500">Online</span>
                    </>
                ) : (
                    <>
                        <WifiOff className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-400">Offline</span>
                    </>
                )}
            </div>

            {/* Right: Profile & Actions */}
            <div className="flex items-center gap-2 md:gap-4">


                {/* Notification Dropdown */}
                <div className="relative" ref={notificationRef}>
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                            onClick={() => setIsDropdownOpen(isDropdownOpen === "notifications" ? false : "notifications")}
                        >
                            <Bell className="h-5 w-5" />
                            {userNotifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-background" />
                            )}
                        </Button>
                    </div>

                    <AnimatePresence>
                        {isDropdownOpen === "notifications" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-[90vw] md:w-80 max-w-[320px] rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50 fixed md:absolute top-16 md:top-auto right-4 md:right-0"
                            >
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <h3 className="font-semibold text-sm">Notifikasi</h3>
                                    {userNotifications.length > 0 && (
                                        <button
                                            onClick={() => {
                                                userNotifications.forEach(n => markNotificationAsRead(n.id))
                                            }}
                                            className="text-xs text-primary hover:text-primary/80"
                                        >
                                            Tandai semua dibaca
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {userNotifications.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground text-sm">
                                            Belum ada notifikasi
                                        </div>
                                    ) : (
                                        userNotifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border-b border-border hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" style={{ opacity: notification.read ? 0 : 1 }} />
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-sm leading-snug text-foreground">{notification.message}</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(notification.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(isDropdownOpen === "profile" ? false : "profile")}
                        className="flex items-center gap-3 hover:bg-muted p-1.5 rounded-full md:rounded-xl transition-colors focus:outline-none"
                    >
                        <div className="relative">
                            <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-blue-200 ring-2 ring-blue-50 shadow-sm">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="bg-blue-100 text-blue-600">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="hidden flex-col md:flex items-start">
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold text-foreground">{user.name}</span>
                                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-xs text-muted-foreground">Teacher</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground hidden md:block transition-transform duration-200 ${isDropdownOpen === "profile" ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen === "profile" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-xl overflow-hidden z-[100]"
                            >
                                <div className="p-2 space-y-1">
                                    <Link href="/pengaturan/akun" onClick={() => setIsDropdownOpen(false)}>
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
                                            <User className="h-4 w-4" />
                                            <span>Edit Profil</span>
                                        </button>
                                    </Link>
                                    <Link href="/bantuan" onClick={() => setIsDropdownOpen(false)}>
                                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
                                            <HelpCircle className="h-4 w-4" />
                                            <span>Pusat Bantuan</span>
                                        </button>
                                    </Link>
                                    <div className="h-px bg-border my-1" />
                                    <button
                                        onClick={() => {
                                            // In a real app, clear auth tokens here
                                            window.location.href = "/login"
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header >
    )
}
