"use client"

import * as React from "react"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge as UiBadge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Plus, Trash2, Calendar, CheckCircle2, Star } from "lucide-react"

export default function TantanganPage() {
    const { students, challenges, addChallenge, deleteChallenge, markChallengeComplete, markBatchChallengeComplete } = useData()
    const [mounted, setMounted] = React.useState(false)

    // Add Challenge State
    const [isAddChallengeOpen, setIsAddChallengeOpen] = React.useState(false)
    const [newChallengeTitle, setNewChallengeTitle] = React.useState("")
    const [newChallengeDesc, setNewChallengeDesc] = React.useState("")
    const [newChallengePoints, setNewChallengePoints] = React.useState(100)
    const [newChallengeDate, setNewChallengeDate] = React.useState("")

    // Challenge Detail State
    const [selectedChallengeId, setSelectedChallengeId] = React.useState<number | null>(null)
    const [selectedStudentsForChallenge, setSelectedStudentsForChallenge] = React.useState<number[]>([])

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Reset selection when dialog closes or changes
    React.useEffect(() => {
        setSelectedStudentsForChallenge([])
    }, [selectedChallengeId])

    const handleAddChallenge = () => {
        if (newChallengeTitle && newChallengePoints > 0) {
            addChallenge({
                title: newChallengeTitle,
                description: newChallengeDesc,
                rewardPoints: newChallengePoints,
                status: "Active",
                dueDate: newChallengeDate || "2025-12-31"
            })
            setIsAddChallengeOpen(false)
            setNewChallengeTitle("")
            setNewChallengeDesc("")
            setNewChallengePoints(100)
            setNewChallengeDate("")
        }
    }

    const handleDeleteChallenge = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus tantangan ini?")) {
            deleteChallenge(id)
        }
    }

    const selectedChallenge = challenges.find(c => c.id === selectedChallengeId)

    if (!mounted) return null

    return (
        <div className="flex flex-col gap-6 pb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tantangan</h1>
                    <p className="text-slate-500">Kelola tantangan dan misi untuk siswa.</p>
                </div>
                <Dialog open={isAddChallengeOpen} onOpenChange={setIsAddChallengeOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                            <Plus className="h-4 w-4 mr-2" /> Tambah Tantangan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-slate-200 text-slate-900">
                        <DialogHeader>
                            <DialogTitle>Buat Tantangan Baru</DialogTitle>
                            <DialogDescription className="text-slate-500">Tantangan baru untuk memotivasi siswa.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Judul Tantangan</label>
                                <Input value={newChallengeTitle} onChange={e => setNewChallengeTitle(e.target.value)} className="bg-white border-slate-200 text-slate-900" placeholder="Contoh: Bersih-bersih Kelas" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Deskripsi</label>
                                <Input value={newChallengeDesc} onChange={e => setNewChallengeDesc(e.target.value)} className="bg-white border-slate-200 text-slate-900" placeholder="Deskripsi tugas..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Poin Reward</label>
                                    <Input type="number" value={newChallengePoints} onChange={e => setNewChallengePoints(parseInt(e.target.value))} className="bg-white border-slate-200 text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tenggat Waktu</label>
                                    <Input type="date" value={newChallengeDate} onChange={e => setNewChallengeDate(e.target.value)} className="bg-white border-slate-200 text-slate-900" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsAddChallengeOpen(false)} className="text-slate-500 hover:text-slate-900">Batal</Button>
                            <Button onClick={handleAddChallenge} className="bg-indigo-500 hover:bg-indigo-600 text-white">Simpan Tantangan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map(challenge => (
                    <Card
                        key={challenge.id}
                        className="bg-white border-slate-200 text-slate-900 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        onClick={() => setSelectedChallengeId(challenge.id)}
                    >
                        <CardHeader className="relative">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => handleDeleteChallenge(challenge.id)} className="p-1 hover:bg-red-500/20 rounded text-red-400">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Zap className="h-5 w-5 text-indigo-500" />
                                {challenge.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Calendar className="h-4 w-4" />
                                    {challenge.dueDate}
                                </div>
                                <UiBadge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                                    +{challenge.rewardPoints} XP
                                </UiBadge>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-sm">
                                <span className="text-emerald-600 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                    {challenge.completions?.length || 0} Selesai
                                </span>
                                <UiBadge variant="outline" className={challenge.status === 'Active' ? 'text-green-600 border-green-200 bg-green-50' : 'text-slate-500'}>
                                    {challenge.status}
                                </UiBadge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Challenge Detail Dialog */}
            <Dialog open={!!selectedChallengeId} onOpenChange={(open) => !open && setSelectedChallengeId(null)}>
                <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Zap className="h-6 w-6 text-orange-500" />
                            {selectedChallenge?.title}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            {selectedChallenge?.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center gap-4 py-2 border-b border-slate-200 mb-4">
                        <div className="flex items-center gap-2 text-yellow-500 font-bold">
                            <Star className="h-4 w-4 fill-yellow-500" />
                            {selectedChallenge?.rewardPoints} Poin
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Calendar className="h-4 w-4" />
                            Berakhir: {selectedChallenge?.dueDate}
                        </div>
                    </div>

                    <Tabs defaultValue="incomplete" className="w-full">
                        <TabsList className="bg-slate-100 w-full">
                            <TabsTrigger value="incomplete" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-slate-900">
                                Belum Selesai ({students.length - (selectedChallenge?.completions?.length || 0)})
                            </TabsTrigger>
                            <TabsTrigger value="completed" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-emerald-500">
                                Sudah Selesai ({selectedChallenge?.completions?.length || 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="incomplete" className="mt-4 max-h-[400px] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4 px-1">
                                <div className="text-sm text-slate-500">
                                    {selectedStudentsForChallenge.length} siswa dipilih
                                </div>
                                {selectedStudentsForChallenge.length > 0 && (
                                    <Button
                                        size="sm"
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                        onClick={() => {
                                            if (selectedChallengeId) {
                                                markBatchChallengeComplete(selectedChallengeId, selectedStudentsForChallenge)
                                                setSelectedStudentsForChallenge([])
                                            }
                                        }}
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Tandai {selectedStudentsForChallenge.length} Selesai
                                    </Button>
                                )}
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-200 hover:bg-transparent">
                                        <TableHead className="w-[50px]">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        const incompleteStudents = students.filter(s => !selectedChallenge?.completions?.includes(s.id))
                                                        setSelectedStudentsForChallenge(incompleteStudents.map(s => s.id))
                                                    } else {
                                                        setSelectedStudentsForChallenge([])
                                                    }
                                                }}
                                                checked={
                                                    students.filter(s => !selectedChallenge?.completions?.includes(s.id)).length > 0 &&
                                                    students.filter(s => !selectedChallenge?.completions?.includes(s.id)).every(s => selectedStudentsForChallenge.includes(s.id))
                                                }
                                            />
                                        </TableHead>
                                        <TableHead className="text-slate-500">Siswa</TableHead>
                                        <TableHead className="text-slate-500">Kelas</TableHead>
                                        <TableHead className="text-right text-slate-500">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students
                                        .filter(s => !selectedChallenge?.completions?.includes(s.id))
                                        .map(student => (
                                            <TableRow key={student.id} className="border-slate-200 hover:bg-slate-50">
                                                <TableCell>
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-slate-300"
                                                        checked={selectedStudentsForChallenge.includes(student.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedStudentsForChallenge([...selectedStudentsForChallenge, student.id])
                                                            } else {
                                                                setSelectedStudentsForChallenge(selectedStudentsForChallenge.filter(id => id !== student.id))
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium text-slate-900">{student.name}</TableCell>
                                                <TableCell className="text-slate-500">{student.class}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                                        onClick={() => selectedChallengeId && markChallengeComplete(selectedChallengeId, student.id)}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-1" /> Selesai
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        <TabsContent value="completed" className="mt-4 max-h-[400px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-200 hover:bg-transparent">
                                        <TableHead className="text-slate-500">Siswa</TableHead>
                                        <TableHead className="text-slate-500">Kelas</TableHead>
                                        <TableHead className="text-right text-slate-500">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students
                                        .filter(s => selectedChallenge?.completions?.includes(s.id))
                                        .map(student => (
                                            <TableRow key={student.id} className="border-slate-200 hover:bg-slate-50">
                                                <TableCell className="font-medium text-slate-900">{student.name}</TableCell>
                                                <TableCell className="text-slate-500">{student.class}</TableCell>
                                                <TableCell className="text-right">
                                                    <UiBadge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                                        Selesai
                                                    </UiBadge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </div>
    )
}
