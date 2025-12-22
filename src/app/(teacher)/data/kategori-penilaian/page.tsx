import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Tags } from "lucide-react"

export default function KategoriPenilaianPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Kategori Penilaian</h2>
                    <p className="text-slate-500">Atur jenis-jenis penilaian (UH, UTS, UAS, dll).</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Kategori
                </Button>
            </div>

            <div className="space-y-4">
                {["Ulangan Harian (UH)", "Tugas (TGS)", "Penilaian Tengah Semester (PTS)", "Penilaian Akhir Semester (PAS)"].map((kategori, i) => (
                    <Card key={i} className="bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Tags className="h-5 w-5 text-blue-600" />
                                </div>
                                <span className="font-medium text-slate-900">{kategori}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">Hapus</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
