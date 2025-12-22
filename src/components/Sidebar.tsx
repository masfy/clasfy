"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import {
    LayoutDashboard,
    Database,
    ClipboardCheck,
    GraduationCap,
    Trophy,
    Settings,
    LogOut,
    ChevronRight,
    MessageSquare,
    X,
    School,
    Users,
    User,
    BookOpen,
    Tags,
    Scale,
    CalendarCheck,
    FileText,
    BarChart,
    ClipboardList,
    PenTool,
    FileSpreadsheet,
    UserCog,
    Settings2,

    HelpCircle,
    Zap,
    Medal,
    Crown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useData } from "@/lib/data-context"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen?: boolean
    onClose?: () => void
}

type SubMenuItem = {
    label: string
    icon: React.ElementType
    href: string
}

type MenuItem = {
    id: string
    icon: React.ElementType
    label: string
    href?: string
    submenus?: SubMenuItem[]
}

export function Sidebar({ className, isOpen, onClose, ...props }: SidebarProps) {
    const { user } = useData()
    const pathname = usePathname()
    const [active, setActive] = React.useState("dashboard")
    const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null)

    // Sync active state with current path
    React.useEffect(() => {
        if (pathname === "/dashboard" || pathname === "/") {
            setActive("dashboard")
        } else if (pathname.startsWith("/data")) {
            setActive("data")
        } else if (pathname.startsWith("/presensi")) {
            setActive("presensi")
        } else if (pathname.startsWith("/penilaian")) {
            setActive("penilaian")
        } else if (pathname.startsWith("/gamifikasi")) {
            setActive("gamifikasi")
        } else if (pathname.startsWith("/komunikasi")) {
            setActive("komunikasi")
        } else if (pathname.startsWith("/bantuan")) {
            setActive("bantuan")
        } else if (pathname.startsWith("/pengaturan")) {
            setActive("pengaturan")
        }
    }, [pathname])

    const navItems: MenuItem[] = [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        {
            id: "data",
            icon: Database,
            label: "Data",
            submenus: [
                { label: "Sekolah", icon: School, href: "/data/sekolah" },
                { label: "Kelas", icon: Users, href: "/data/kelas" },
                { label: "Siswa", icon: User, href: "/data/siswa" },
                { label: "Mata Pelajaran", icon: BookOpen, href: "/data/mata-pelajaran" },
                { label: "Kategori & Bobot", icon: Tags, href: "/data/kategori-bobot" }
            ]
        },
        {
            id: "presensi",
            icon: ClipboardCheck,
            label: "Presensi",
            submenus: [
                { label: "Input Presensi", icon: CalendarCheck, href: "/presensi/input" },
                { label: "Rekap Presensi", icon: FileText, href: "/presensi/rekap" },
                { label: "Statistik Kehadiran", icon: BarChart, href: "/presensi/statistik" }
            ]
        },
        {
            id: "penilaian",
            icon: GraduationCap,
            label: "Penilaian",
            submenus: [
                { label: "Tugas", icon: ClipboardList, href: "/penilaian/tugas" },
                { label: "Input Nilai", icon: PenTool, href: "/penilaian/input" },
                { label: "Rekap Nilai", icon: FileSpreadsheet, href: "/penilaian/rekap" }
            ]
        },
        {
            id: "gamifikasi",
            icon: Trophy,
            label: "Gamifikasi",
            submenus: [
                { label: "Tantangan", icon: Zap, href: "/gamifikasi/tantangan" },
                { label: "Lencana", icon: Medal, href: "/gamifikasi/lencana" },
                { label: "Peringkat", icon: Crown, href: "/gamifikasi/peringkat" }
            ]
        },
        {
            id: "komunikasi",
            icon: MessageSquare,
            label: "Komunikasi",
            submenus: [
                { label: "Pengumuman", icon: MessageSquare, href: "/komunikasi/pengumuman" },
                { label: "Forum", icon: Users, href: "/komunikasi/forum" },
                { label: "Pesan Pribadi", icon: MessageSquare, href: "/komunikasi/chat" }
            ]
        },
        { id: "bantuan", icon: HelpCircle, label: "Bantuan", href: "/bantuan" },
        {
            id: "pengaturan",
            icon: Settings,
            label: "Pengaturan",
            submenus: [
                { label: "Server Database", icon: Database, href: "/pengaturan/server" }
            ]
        },
    ]

    const sidebarRef = React.useRef<HTMLDivElement>(null)

    // Close submenu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setOpenSubmenu(null)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleMenuClick = (item: MenuItem) => {
        setActive(item.id)
        if (item.submenus) {
            setOpenSubmenu(openSubmenu === item.id ? null : item.id)
        } else {
            setOpenSubmenu(null)
        }
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={cn(
                    "fixed left-0 top-0 h-full w-20 flex flex-col items-center bg-background pt-24 pb-4 z-40 transition-transform duration-300 ease-in-out border-r border-border",
                    "md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    className
                )}
                {...props}
            >
                {/* Close Button (Mobile) */}
                <button
                    className="absolute top-4 right-4 md:hidden text-muted-foreground hover:text-foreground"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Navigation */}
                <nav className="flex flex-1 flex-col items-center gap-6 w-full">
                    {navItems.map((item) => (
                        <div key={item.id} className="relative group">
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    onClick={() => handleMenuClick(item)}
                                    className={cn(
                                        "relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-primary hover:text-primary-foreground",
                                        active === item.id ? "text-primary-foreground bg-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {active === item.id && (
                                        <div className="absolute left-0 h-8 w-1 rounded-r-full bg-primary-foreground" />
                                    )}
                                    <item.icon className="h-5 w-5" />
                                </Link>
                            ) : (
                                <button
                                    onClick={() => handleMenuClick(item)}
                                    className={cn(
                                        "relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-primary hover:text-primary-foreground",
                                        active === item.id ? "text-primary-foreground bg-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {active === item.id && (
                                        <div className="absolute left-0 h-8 w-1 rounded-r-full bg-primary-foreground" />
                                    )}
                                    <item.icon className="h-5 w-5" />
                                </button>
                            )}

                            {/* Hover Tooltip (Desktop only) */}
                            <div className="hidden md:block absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                                {item.label}
                            </div>

                            {/* Submenu Popup */}
                            {item.submenus && openSubmenu === item.id && (
                                <div className="absolute left-14 top-0 bg-white/90 backdrop-blur-md rounded-xl p-2 min-w-[200px] shadow-lg border border-blue-200 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-200 ease-out">
                                    <div className="px-3 py-2 text-xs font-bold text-blue-600 uppercase tracking-wider border-b border-blue-100 mb-1">
                                        {item.label}
                                    </div>
                                    {item.submenus.map((sub) => (
                                        <Link
                                            key={sub.label}
                                            href={sub.href}
                                            onClick={() => setOpenSubmenu(null)}
                                            className="text-left px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors flex items-center justify-between group/sub"
                                        >
                                            <div className="flex items-center gap-2">
                                                <sub.icon className="h-4 w-4 text-slate-500 group-hover/sub:text-blue-600" />
                                                <span>{sub.label}</span>
                                            </div>
                                            <ChevronRight className="h-3 w-3 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="mt-auto flex flex-col items-center gap-4 mb-4">
                    <div className="relative group">
                        <button
                            onClick={() => window.location.href = "/login"}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                        <div className="hidden md:block absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-lg">
                            Logout
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
