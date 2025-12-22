"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, School, BookOpen, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import { AreaChart, Area, ResponsiveContainer } from "recharts"

import { useData } from "@/lib/data-context"

export function DataSummaryCards() {
    const { classes, students, mapel } = useData()

    const data = [
        {
            title: "Total Kelas",
            value: classes.length.toString(),
            icon: School,
            gradient: "from-blue-600 to-blue-400",
            shadow: "shadow-blue-500/20",
            iconColor: "text-blue-100",
            bgIcon: "bg-white/20",
        },
        {
            title: "Total Siswa",
            value: students.length.toString(),
            icon: Users,
            gradient: "from-emerald-600 to-emerald-400",
            shadow: "shadow-emerald-500/20",
            iconColor: "text-emerald-100",
            bgIcon: "bg-white/20",
        },
        {
            title: "Mata Pelajaran",
            value: mapel.length.toString(),
            icon: BookOpen,
            gradient: "from-indigo-600 to-cyan-500",
            shadow: "shadow-indigo-500/20",
            iconColor: "text-indigo-100",
            bgIcon: "bg-white/20",
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {data.map((item, index) => (
                <div key={index} className="relative group h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-[24px] blur-xl opacity-40 group-hover:opacity-60 transition duration-500`} />
                    <Card className={`relative h-full border-none bg-gradient-to-br ${item.gradient} text-white hover:-translate-y-1 transition-all duration-300 rounded-[24px] overflow-hidden ${item.shadow}`}>
                        <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-2xl ${item.bgIcon} backdrop-blur-sm ring-1 ring-white/30`}>
                                    <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                    <span>Lihat Detail</span>
                                    <ArrowUpRight className="h-3 w-3" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-4xl font-bold tracking-tight text-white drop-shadow-sm">{item.value}</h3>
                                <p className="text-white/80 font-medium text-sm mt-1">{item.title}</p>
                            </div>
                        </CardContent>

                        {/* Watermark Icon */}
                        <item.icon className="absolute -bottom-6 -right-6 h-32 w-32 text-white/10 rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-out" />

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    </Card>
                </div>
            ))}
        </div>
    )
}
