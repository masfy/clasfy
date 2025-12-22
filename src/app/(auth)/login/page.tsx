"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, GraduationCap, School, BadgeCheck } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
    const router = useRouter()
    const { user: teacherData, students, isLoaded } = useData()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // Teacher Login State
    const [teacherId, setTeacherId] = useState("")
    const [teacherPassword, setTeacherPassword] = useState("")

    // Student Login State
    const [studentUsername, setStudentUsername] = useState("")
    const [studentPassword, setStudentPassword] = useState("")

    const handleTeacherLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            // Verify against loaded teacher data
            // In a real app, this should be an API call to /login endpoint
            // But since we sync data locally, we can check against the context

            // Normalize data for comparison (handle numbers from sheet, whitespace, etc.)
            const storedNip = String(teacherData?.nip || "").trim()
            const storedUsername = String(teacherData?.username || "").trim()
            const storedPassword = String(teacherData?.password || "").trim()

            const inputId = teacherId.trim()
            const inputPassword = teacherPassword.trim()

            if (teacherData && storedNip === inputId && storedPassword === inputPassword) {
                router.push("/dashboard")
            } else if (teacherData && storedUsername === inputId && storedPassword === inputPassword) {
                // Allow login with username as well
                router.push("/dashboard")
            } else {
                setError("NIP/Username atau Password salah")
                setIsLoading(false)
            }
        }, 1000)
    }

    const handleStudentLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            // Normalize inputs
            const inputUsername = studentUsername.trim()
            const inputPassword = studentPassword.trim()

            console.log("Attempting login with:", inputUsername, inputPassword)
            console.log("Available students:", students.length)

            const student = students.find(s => {
                // Allow login with username OR NIS
                const sUsername = (s.username || "").toString().trim()
                const sNis = (s.nis || "").toString().trim()
                const sPassword = (s.password || "").toString().trim()

                // Check username/NIS (case-insensitive) and password (exact)
                const isUsernameMatch = sUsername.toLowerCase() === inputUsername.toLowerCase()
                const isNisMatch = sNis === inputUsername
                const isPasswordMatch = sPassword === inputPassword

                return (isUsernameMatch || isNisMatch) && isPasswordMatch
            })

            if (student) {
                // Store student session (simplified)
                localStorage.setItem("clasfy_student_session", JSON.stringify(student))
                router.push("/student/dashboard")
            } else {
                console.log("Login failed. No matching student found.")
                setError("Username/NISN atau Password salah")
                setIsLoading(false)
            }
        }, 1000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-25%] left-[-25%] w-[600px] h-[600px] bg-sky-400/30 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="absolute top-[-25%] right-[-25%] w-[500px] h-[500px] bg-cyan-300/30 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-[-15%] right-[-30%] w-[400px] h-[400px] bg-blue-300/30 rounded-full blur-[90px]"
                />
            </div>

            {/* Login Card Container with Drop Shadow for Unified Shape */}
            <div className="w-full max-w-md relative z-10 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out filter drop-shadow-2xl">

                {/* Logo "Badge" - Positioned to fill the notch */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
                    <div className="h-24 w-24 flex items-center justify-center rounded-full bg-card/60 backdrop-blur-xl border border-white/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] relative overflow-hidden">
                        {/* Inner Shadow for depth */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                        {/* Logo Image */}
                        <div className="relative z-10 p-4">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>

                {/* Main Card with Notch Mask */}
                <Card
                    className="w-full bg-card/60 backdrop-blur-xl border-white/50 shadow-[0_0_20px_rgba(59,130,246,0.2)] text-foreground overflow-visible border"
                    style={{
                        maskImage: 'radial-gradient(circle at top center, transparent 3.2rem, black 3.25rem)',
                        WebkitMaskImage: 'radial-gradient(circle at top center, transparent 3.2rem, black 3.25rem)'
                    }}
                >
                    <CardHeader className="text-center space-y-2 pt-16">
                        <div className="flex flex-col items-center justify-center mb-2">
                            <p className="text-[10px] font-semibold text-muted-foreground tracking-[0.2em] uppercase">
                                Class Administration Simplify
                            </p>
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                            Selamat Datang Kembali
                        </CardTitle>
                        <CardDescription className="text-muted-foreground font-medium">
                            Silakan masuk ke akun Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="student" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl">
                                <TabsTrigger
                                    value="student"
                                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
                                >
                                    <GraduationCap className="mr-2 h-4 w-4" />
                                    Siswa
                                </TabsTrigger>
                                <TabsTrigger
                                    value="teacher"
                                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
                                >
                                    <School className="mr-2 h-4 w-4" />
                                    Guru
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="student" className="mt-6">
                                <form onSubmit={handleStudentLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="username"
                                                placeholder="Masukkan username"
                                                className="pl-9 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                                                value={studentUsername}
                                                onChange={(e) => setStudentUsername(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Masukkan password"
                                                className="pl-9 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                                                value={studentPassword}
                                                onChange={(e) => setStudentPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {error && <p className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" disabled={isLoading}>
                                        {isLoading ? "Memproses..." : "Masuk Sebagai Siswa"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="teacher" className="mt-6">
                                <form onSubmit={handleTeacherLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nip">Username</Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="nip"
                                                placeholder="Masukkan Username"
                                                className="pl-9 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                                                value={teacherId}
                                                onChange={(e) => setTeacherId(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="teacher-password">Password</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                id="teacher-password"
                                                type="password"
                                                placeholder="Masukkan password"
                                                className="pl-9 bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all duration-300"
                                                value={teacherPassword}
                                                onChange={(e) => setTeacherPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {error && <p className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" disabled={isLoading || !isLoaded}>
                                        {isLoading ? "Memproses..." : (!isLoaded ? "Menyinkronkan data..." : "Masuk Sebagai Guru")}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-border/50 pt-6">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            &copy; {new Date().getFullYear()} | Clasfy by Mas Alfy <BadgeCheck className="h-3 w-3 text-blue-500" />
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
