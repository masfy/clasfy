import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scale } from "lucide-react"

export default function BobotPenilaianPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Bobot Penilaian</h2>
                    <p className="text-slate-500">Atur persentase bobot untuk setiap kategori penilaian.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Simpan Bobot</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-white border-slate-200 text-slate-900 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-green-600" />
                            Pengetahuan (70%)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Label className="w-32 text-slate-700">Rata-rata UH</Label>
                            <Input type="number" defaultValue={40} className="bg-white border-slate-200 text-slate-900 w-24 focus:ring-blue-500" />
                            <span className="text-slate-500">%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label className="w-32 text-slate-700">Nilai PTS</Label>
                            <Input type="number" defaultValue={30} className="bg-white border-slate-200 text-slate-900 w-24 focus:ring-blue-500" />
                            <span className="text-slate-500">%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label className="w-32 text-slate-700">Nilai PAS</Label>
                            <Input type="number" defaultValue={30} className="bg-white border-slate-200 text-slate-900 w-24 focus:ring-blue-500" />
                            <span className="text-slate-500">%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 text-slate-900 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-orange-500" />
                            Keterampilan (30%)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Label className="w-32 text-slate-700">Praktik</Label>
                            <Input type="number" defaultValue={50} className="bg-white border-slate-200 text-slate-900 w-24 focus:ring-blue-500" />
                            <span className="text-slate-500">%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label className="w-32 text-slate-700">Proyek</Label>
                            <Input type="number" defaultValue={30} className="bg-white border-slate-200 text-slate-900 w-24 focus:ring-blue-500" />
                            <span className="text-slate-500">%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Label className="w-32 text-slate-700">Portofolio</Label>
                            <Input type="number" defaultValue={20} className="bg-white border-slate-200 text-slate-900 w-24 focus:ring-blue-500" />
                            <span className="text-slate-500">%</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
