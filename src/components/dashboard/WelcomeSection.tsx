"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Quote, Calendar, Clock, BadgeCheck } from "lucide-react"
import { useData } from "@/lib/data-context"

const QUOTES = [
    "Pendidikan adalah senjata paling mematikan di dunia, karena dengan pendidikan, Anda dapat mengubah dunia. - Nelson Mandela",
    "Hiduplah seolah engkau mati besok. Belajarlah seolah engkau hidup selamanya. - Mahatma Gandhi",
    "Pendidikan bukan persiapan untuk hidup. Pendidikan adalah hidup itu sendiri. - John Dewey",
    "Akar pendidikan itu pahit, tapi buahnya manis. - Aristoteles",
    "Tujuan pendidikan itu untuk mempertajam kecerdasan, memperkukuh kemauan serta memperhalus perasaan. - Tan Malaka",
    "Ing ngarso sung tulodo, ing madyo mangun karso, tut wuri handayani. - Ki Hajar Dewantara",
    "Barangsiapa tidak mau merasakan pahitnya belajar, ia akan merasakan hinanya kebodohan sepanjang hidupnya. - Imam Syafi'i"
]

export function WelcomeSection() {
    const { user } = useData()
    const [time, setTime] = React.useState<Date | null>(null)
    const [quote, setQuote] = React.useState(QUOTES[0])

    React.useEffect(() => {
        setTime(new Date())
        const timer = setInterval(() => setTime(new Date()), 1000)

        // Random quote on mount
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])

        return () => clearInterval(timer)
    }, [])

    if (!time) return null // Prevent hydration mismatch by not rendering until client-side

    return (
        <div className="relative overflow-hidden rounded-[24px] p-[1px] shadow-sm hover:shadow-md transition-shadow duration-300 h-full group bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            <Card className="relative bg-white/80 backdrop-blur-xl border-white/50 text-slate-800 h-full rounded-[23px] overflow-hidden flex items-center">
                {/* Background Effects - Clean Colorful */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

                <CardContent className="p-6 w-full flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">

                    {/* Left: Profile & Info */}
                    <div className="flex items-center gap-5 w-full md:w-auto">
                        <div className="relative group/avatar">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-40 group-hover/avatar:opacity-75 transition duration-500 animate-pulse" />
                            <Avatar className="h-20 w-20 border-4 border-white shadow-lg relative z-10">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-1 right-1 h-5 w-5 bg-emerald-400 border-4 border-white rounded-full z-20 shadow-sm" />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                                    Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user.name.split(' ')[0]}</span>
                                    <BadgeCheck className="h-6 w-6 text-blue-500" />
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 uppercase tracking-wider shadow-sm">
                                    Teacher
                                </span>
                                <p className="text-slate-500 text-sm font-medium italic truncate max-w-[200px]">
                                    "{user.motto || "Inspiring minds..."}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Time & Quote */}
                    <div className="hidden md:flex flex-col items-end gap-3 max-w-md">
                        <div className="flex items-center gap-4 text-slate-600 bg-white/50 px-4 py-2 rounded-2xl border border-white/60 backdrop-blur-md shadow-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">{time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="w-px h-4 bg-slate-200" />
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-purple-500" />
                                <span className="tabular-nums text-sm font-bold tracking-widest">{time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        <div className="relative bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl p-3 w-full border-l-4 border-blue-400 pl-4">
                            <div className="flex gap-2">
                                <Quote className="h-4 w-4 text-blue-400 flex-shrink-0 -mt-1" />
                                <p className="text-xs text-slate-600 italic w-full leading-relaxed">
                                    "{quote}"
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
