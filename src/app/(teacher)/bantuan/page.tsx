"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, HelpCircle, MessageCircle, Mail, FileText, ChevronDown, ChevronUp, Send, Instagram, Facebook } from "lucide-react"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function BantuanPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: "Bagaimana cara menambahkan siswa baru?",
            answer: "Masuk ke menu 'Data Siswa', klik tombol 'Tambah Siswa' di pojok kanan atas. Pastikan Anda memasukkan NISN yang unik untuk setiap siswa."
        },
        {
            question: "Dimana fitur cetak Leger Nilai?",
            answer: "Fitur cetak Leger Nilai ada di menu 'Rekap Nilai'. Pilih kelas, lalu klik tombol 'Cetak' untuk mengunduh Leger Nilai atau 'Export Excel' untuk data mentah."
        },
        {
            question: "Bagaimana cara menghapus chat dengan siswa?",
            answer: "Buka menu 'Pesan Pribadi', pilih siswa, klik ikon titik tiga di pojok kanan atas chat, lalu pilih 'Bersihkan Chat'. Hati-hati, pesan akan terhapus permanen."
        },
        {
            question: "Bagaimana sistem leveling pada Gamifikasi bekerja?",
            answer: "Sistem leveling menggunakan perhitungan eksponensial. Level 1 butuh 100 poin, Level 2 butuh 200 poin tambahan (total 300), dan seterusnya."
        },
        {
            question: "Apakah saya bisa mengubah data sekolah?",
            answer: "Ya, masuk ke menu 'Data Sekolah'. Data ini penting karena akan muncul secara otomatis pada kop surat laporan nilai (Leger)."
        },
        {
            question: "Lupa password akun saya, apa yang harus dilakukan?",
            answer: "Silakan hubungi administrator sekolah untuk mereset password Anda. Untuk siswa, guru dapat mereset password melalui menu 'Data Siswa'."
        }
    ]

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bantuan & Dukungan</h2>
                <p className="text-slate-500">Temukan jawaban dan hubungi tim support kami.</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                    className="pl-10 bg-white border-slate-200 text-slate-900 h-12 text-lg placeholder:text-slate-400 shadow-sm"
                    placeholder="Cari pertanyaan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* FAQ Section */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-blue-500" />
                        Pertanyaan Umum (FAQ)
                    </h3>

                    {filteredFaqs.length > 0 ? (
                        <div className="space-y-2">
                            {filteredFaqs.map((faq, index) => (
                                <Card
                                    key={index}
                                    className={`bg-white border-slate-200 text-slate-900 cursor-pointer transition-all shadow-sm hover:shadow-md ${openFaqIndex === index ? 'border-blue-500 ring-1 ring-blue-500' : 'hover:border-blue-300'}`}
                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-medium text-base">{faq.question}</h4>
                                            {openFaqIndex === index ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                                        </div>
                                        {openFaqIndex === index && (
                                            <p className="mt-3 text-slate-500 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                                                {faq.answer}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            Tidak ada hasil ditemukan untuk "{searchTerm}"
                        </div>
                    )}
                </div>

                {/* Contact Support */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-emerald-500" />
                        Hubungi Kami
                    </h3>

                    <Card className="bg-white border-slate-200 text-slate-900 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-base">Butuh bantuan langsung?</CardTitle>
                            <CardDescription className="text-slate-500">Hubungi kami melalui media sosial berikut.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white justify-start" onClick={() => window.open('https://wa.me/6285249798788', '_blank')}>
                                <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp: 085249798788
                            </Button>
                            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white justify-start" onClick={() => window.open('https://t.me/masalfy', '_blank')}>
                                <Send className="h-4 w-4 mr-2" /> Telegram
                            </Button>
                            <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground justify-start" onClick={() => window.open('https://www.instagram.com/masalfy', '_blank')}>
                                <Instagram className="h-4 w-4 mr-2" /> Instagram: @masalfy
                            </Button>
                            <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white justify-start" onClick={() => window.open('https://facebook.com/alfiannoor.arnaim/', '_blank')}>
                                <Facebook className="h-4 w-4 mr-2" /> Facebook: Alfian Noor Arnaim
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 text-slate-900 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="h-4 w-4 text-yellow-500" />
                                Dokumentasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4">Pelajari cara menggunakan fitur-fitur Clasfy secara lengkap di panduan pengguna.</p>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200">
                                        Baca Panduan
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0 overflow-hidden">
                                    <DialogHeader className="p-6 pb-2">
                                        <DialogTitle className="flex items-center gap-2 text-2xl">
                                            <FileText className="h-6 w-6 text-blue-600" />
                                            Panduan Pengguna Clasfy
                                        </DialogTitle>
                                        <DialogDescription>
                                            Dokumentasi lengkap cara penggunaan aplikasi manajemen kelas.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-8">
                                        {/* 1. Dashboard */}
                                        <section className="space-y-3">
                                            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                                Dashboard
                                            </h3>
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                Halaman utama menampilkan ringkasan aktivitas kelas Anda. Anda dapat melihat statistik kehadiran hari ini,
                                                jumlah siswa, dan grafik perkembangan nilai. Gunakan widget cepat untuk akses instan ke fitur yang sering digunakan.
                                            </p>
                                        </section>

                                        {/* 2. Manajemen Data */}
                                        <section className="space-y-3">
                                            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                                Manajemen Data
                                            </h3>
                                            <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                                                <li><strong>Data Sekolah:</strong> Atur identitas sekolah, kepala sekolah, dan tahun pelajaran. Data ini akan muncul di kop surat laporan.</li>
                                                <li><strong>Data Kelas:</strong> Tambahkan daftar kelas yang Anda ajar.</li>
                                                <li><strong>Data Siswa:</strong> Input data siswa. Pastikan NISN unik.</li>
                                                <li><strong>Mata Pelajaran:</strong> Tentukan mata pelajaran yang diampu.</li>
                                                <li><strong>Kategori & Bobot:</strong> Atur jenis penilaian (misal: UH, Tugas, PAS) dan bobot persentasenya (Total harus 100%).</li>
                                            </ul>
                                        </section>

                                        {/* 3. Presensi */}
                                        <section className="space-y-3">
                                            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                                                Presensi (Absensi)
                                            </h3>
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                Catat kehadiran siswa setiap hari di menu <strong>Input Presensi</strong>.
                                                Pilih status: Hadir (H), Sakit (S), Izin (I), atau Alpha (A).
                                                Lihat rekapitulasi bulanan di menu <strong>Rekap Presensi</strong>.
                                            </p>
                                        </section>

                                        {/* 4. Penilaian & Laporan */}
                                        <section className="space-y-3">
                                            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                                                Penilaian & Laporan
                                            </h3>
                                            <div className="space-y-2 text-slate-600 text-sm">
                                                <p><strong>Input Tugas:</strong> Buat tugas baru di menu <strong>Tugas</strong>.</p>
                                                <p><strong>Input Nilai:</strong> Masukkan nilai siswa berdasarkan kategori yang sudah dibuat di menu <strong>Input Nilai</strong>.</p>
                                                <p><strong>Rekap Nilai (Cetak):</strong> Buka menu <strong>Rekap Nilai</strong> untuk melihat nilai akhir. Klik tombol <strong>Cetak</strong> untuk mencetak laporan nilai (Leger) atau <strong>Export Excel</strong> untuk mengunduh data.</p>
                                            </div>
                                        </section>

                                        {/* 5. Gamifikasi */}
                                        <section className="space-y-3">
                                            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span>
                                                Gamifikasi
                                            </h3>
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                Berikan poin pengalaman (XP) kepada siswa melalui penyelesaian <strong>Tantangan</strong>.
                                                Siswa yang mencapai poin tertentu akan naik level dan mendapatkan <strong>Lencana</strong>.
                                            </p>
                                        </section>

                                        {/* 6. Komunikasi */}
                                        <section className="space-y-3">
                                            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">6</span>
                                                Komunikasi
                                            </h3>
                                            <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                                                <li><strong>Pengumuman:</strong> Kirim informasi satu arah ke seluruh siswa.</li>
                                                <li><strong>Forum:</strong> Diskusi terbuka yang bisa dikomentari siswa.</li>
                                                <li><strong>Pesan Pribadi:</strong> Chat personal dengan siswa (Fitur <strong>Bersihkan Chat</strong> tersedia di menu titik tiga).</li>
                                            </ul>
                                        </section>
                                    </div>

                                    <DialogFooter className="p-4 border-t bg-slate-50">
                                        <DialogTrigger asChild>
                                            <Button className="w-full sm:w-auto">Tutup Panduan</Button>
                                        </DialogTrigger>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
