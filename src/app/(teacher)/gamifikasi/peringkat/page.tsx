"use client"

import * as React from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Crown, Star, Search, Gift, Medal } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function PeringkatPage() {
    const { students, badges, classes, addPoints, giveBadge, isLoaded } = useData()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedClass, setSelectedClass] = React.useState<string>("all")
    const [selectedStudent, setSelectedStudent] = React.useState<number | null>(null)
    const [rewardPoints, setRewardPoints] = React.useState(50)
    const [rewardReason, setRewardReason] = React.useState("")
    const [selectedBadge, setSelectedBadge] = React.useState<string>("")
    const [isRewardOpen, setIsRewardOpen] = React.useState(false)
    const [isBadgeOpen, setIsBadgeOpen] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Filter and Sort Students for Hall of Fame
    const sortedStudents = React.useMemo(() => {
        return students
            .filter(s => {
                const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.class.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesClass = selectedClass === "all" || s.class === selectedClass
                return matchesSearch && matchesClass
            })
            .sort((a, b) => (b.points || 0) - (a.points || 0))
    }, [students, searchTerm, selectedClass])

    const handleGiveReward = () => {
        if (selectedStudent && rewardPoints > 0) {
            addPoints(selectedStudent, rewardPoints)
            setIsRewardOpen(false)
            setRewardPoints(50)
            setRewardReason("")
            setSelectedStudent(null)
        }
    }

    const handleGiveBadge = () => {
        if (selectedStudent && selectedBadge) {
            giveBadge(selectedStudent, parseInt(selectedBadge))
            setIsBadgeOpen(false)
            setSelectedBadge("")
            setSelectedStudent(null)
        }
    }

    if (!mounted) return null

    if (!isLoaded) {
        return (
            <div className="flex flex-col gap-6 pb-8 animate-in fade-in duration-700">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>

                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-64" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="flex items-center justify-between gap-4">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <div className="flex items-center gap-3 flex-1">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-4 w-24 hidden sm:block" />
                                    <Skeleton className="h-4 w-16 hidden sm:block" />
                                    <div className="flex gap-1">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-8 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 pb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Peringkat</h1>
                <p className="text-slate-500">Hall of Fame dan statistik siswa.</p>
            </div>

            <Card className="bg-white border-slate-200 text-slate-900 shadow-md">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Crown className="h-5 w-5 text-yellow-500" />
                            Hall of Fame
                        </CardTitle>
                        <CardDescription className="text-slate-500">Daftar peringkat siswa berdasarkan poin dan level.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[140px] bg-white border-slate-200 text-slate-900">
                                <SelectValue placeholder="Semua Kelas" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-900">
                                <SelectItem value="all">Semua Kelas</SelectItem>
                                {classes.map(c => (
                                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Cari siswa..."
                                className="pl-8 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-200 hover:bg-transparent">
                                <TableHead className="w-[50px] text-slate-500">#</TableHead>
                                <TableHead className="text-slate-500">Siswa</TableHead>
                                <TableHead className="text-slate-500">Level</TableHead>
                                <TableHead className="text-slate-500">Poin</TableHead>
                                <TableHead className="text-slate-500">Badges</TableHead>
                                <TableHead className="text-right text-slate-500">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedStudents.map((student, index) => (
                                <TableRow key={student.id} className="border-slate-200 hover:bg-slate-50">
                                    <TableCell className="font-medium">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${index === 0 ? "bg-yellow-500 text-black" :
                                            index === 1 ? "bg-gray-300 text-black" :
                                                index === 2 ? "bg-orange-500 text-black" :
                                                    "bg-slate-100 text-slate-500"
                                            }`}>
                                            {index + 1}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-slate-200">
                                                <AvatarFallback className="bg-blue-500/10 text-blue-400">
                                                    {student.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-slate-900">{student.name}</p>
                                                <p className="text-xs text-slate-500">{student.class}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1 w-32">
                                            <div className="flex justify-between text-xs">
                                                <span className="font-bold text-emerald-600">Lvl {student.level || 1}</span>
                                                <span className="text-slate-500">
                                                    {(() => {
                                                        const level = student.level || 1
                                                        const currentLevelBase = 100 * (Math.pow(2, level - 1) - 1)
                                                        const nextLevelThreshold = 100 * (Math.pow(2, level) - 1)
                                                        const pointsInLevel = (student.points || 0) - currentLevelBase
                                                        const pointsNeeded = nextLevelThreshold - currentLevelBase
                                                        return `${pointsInLevel}/${pointsNeeded}`
                                                    })()}
                                                </span>
                                            </div>
                                            <Progress
                                                value={(() => {
                                                    const level = student.level || 1
                                                    const currentLevelBase = 100 * (Math.pow(2, level - 1) - 1)
                                                    const nextLevelThreshold = 100 * (Math.pow(2, level) - 1)
                                                    const progress = ((student.points || 0) - currentLevelBase) / (nextLevelThreshold - currentLevelBase) * 100
                                                    return Math.min(Math.max(progress, 0), 100)
                                                })()}
                                                className="h-1.5 bg-slate-100"
                                                indicatorClassName="bg-emerald-500"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 font-bold text-yellow-500">
                                            <Star className="h-4 w-4 fill-yellow-500" />
                                            {student.points || 0}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {student.badges && student.badges.length > 0 ? (
                                                student.badges.map((badgeId, i) => {
                                                    const badge = badges.find(b => b.id === badgeId)
                                                    if (!badge) return null
                                                    return (
                                                        <div key={i} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-lg" title={badge.name}>
                                                            {badge.icon}
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Belum ada badge</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Dialog open={isRewardOpen && selectedStudent === student.id} onOpenChange={(open) => {
                                                setIsRewardOpen(open)
                                                if (open) setSelectedStudent(student.id)
                                                else setSelectedStudent(null)
                                            }}>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">
                                                        <Gift className="h-4 w-4 mr-1" /> Reward
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-white border-slate-200 text-slate-900">
                                                    <DialogHeader>
                                                        <DialogTitle>Berikan Poin Reward</DialogTitle>
                                                        <DialogDescription className="text-slate-500">
                                                            Berikan poin tambahan kepada <b>{student.name}</b>.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Jumlah Poin</label>
                                                            <Input
                                                                type="number"
                                                                value={rewardPoints}
                                                                onChange={(e) => {
                                                                    const val = parseInt(e.target.value)
                                                                    setRewardPoints(isNaN(val) ? 0 : val)
                                                                }}
                                                                className="bg-white border-slate-200 text-slate-900"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Alasan (Opsional)</label>
                                                            <Input
                                                                placeholder="Contoh: Keaktifan di kelas"
                                                                value={rewardReason}
                                                                onChange={(e) => setRewardReason(e.target.value)}
                                                                className="bg-white border-slate-200 text-slate-900"
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="ghost" onClick={() => setIsRewardOpen(false)} className="text-slate-500 hover:text-slate-900">Batal</Button>
                                                        <Button onClick={handleGiveReward} className="bg-emerald-500 hover:bg-emerald-600 text-white">Kirim Poin</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog open={isBadgeOpen && selectedStudent === student.id} onOpenChange={(open) => {
                                                setIsBadgeOpen(open)
                                                if (open) setSelectedStudent(student.id)
                                                else setSelectedStudent(null)
                                            }}>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20">
                                                        <Medal className="h-4 w-4 mr-1" /> Badge
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-white border-slate-200 text-slate-900">
                                                    <DialogHeader>
                                                        <DialogTitle>Berikan Badge</DialogTitle>
                                                        <DialogDescription className="text-slate-500">
                                                            Pilih badge untuk diberikan kepada <b>{student.name}</b>.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Pilih Badge</label>
                                                            <Select value={selectedBadge} onValueChange={setSelectedBadge}>
                                                                <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                                                                    <SelectValue placeholder="Pilih badge..." />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-white border-slate-200 text-slate-900">
                                                                    {badges.map(badge => (
                                                                        <SelectItem key={badge.id} value={badge.id.toString()}>
                                                                            <span className="mr-2">{badge.icon}</span> {badge.name} (+{badge.points || 0})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="ghost" onClick={() => setIsBadgeOpen(false)} className="text-slate-500 hover:text-slate-900">Batal</Button>
                                                        <Button onClick={handleGiveBadge} className="bg-yellow-500 hover:bg-yellow-600 text-black">Berikan Badge</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
