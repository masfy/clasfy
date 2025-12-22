"use client"

import * as React from "react"
import { useToast } from "@/components/ui/use-toast"
import { StorageManager } from "@/lib/storage-manager"
import { useSync } from "@/hooks/use-sync"
import { fetchFromGAS, postToGAS } from "@/lib/api"

// --- Types ---

export interface SekolahData {
    npsn: string
    nama: string
    alamat: string
    kepala: string
    nipKepala: string
    akreditasi: string
    tahunPelajaran: string
    kabupatenKota: string
}

export interface ClassData {
    id: number
    name: string
    description: string
    studentCount: number
    waliKelas: string
}

export interface StudentData {
    id: number
    name: string
    nis: string
    class: string
    status: string
    username?: string
    password?: string
    points: number
    level: number
    badges: number[] // Array of Badge IDs
    avatar?: string
}

export interface Badge {
    id: number
    name: string
    icon: string
    description: string
    points: number
}

export interface Challenge {
    id: number
    title: string
    description: string
    rewardPoints: number
    status: "Active" | "Completed" | "Expired"
    dueDate: string
    completions: number[] // Array of Student IDs who completed this (Derived from challenge_completions)
}

export interface ChallengeCompletion {
    id: string
    challengeId: number
    studentId: number
    timestamp: string
}

export interface MapelData {
    id: number
    name: string
    kkm: number
}

export interface UserData {
    name: string
    nip: string
    email: string
    username: string
    avatar: string
    motto: string
    id?: string | number
    password?: string
}

export interface AssessmentCategory {
    id: number
    name: string
    code: string
}

export interface AssessmentWeight {
    id?: number | string
    mapelId: number
    categoryId: number
    weight: number
}

export interface AttendanceRecord {
    id: string
    date: string // YYYY-MM-DD
    classId: number
    studentId: number
    status: "H" | "S" | "I" | "A"
    notes?: string
}

export interface Assignment {
    id: number
    title: string
    mapelId: number
    classId: number
    categoryId: number
    dueDate: string
    status: "Active" | "Closed" | "Draft"
}

export interface Grade {
    id: string
    assignmentId: number
    studentId: number
    score: number
}

export interface Comment {
    id: number
    author: string
    content: string
    date: string
}

export interface Post {
    id: number
    title: string
    content: string
    author: string
    date: string
    status: "Active" | "Closed"
    type: "announcement" | "discussion"
    comments: Comment[]
}

export interface Notification {
    id: number
    message: string
    read: boolean
    date: string
    link?: string
    sender?: string
}

export interface Chat {
    id: number
    studentId: number
    teacherId: number // Usually 0 or 1 for single teacher, or specific ID
    message: string
    isFromTeacher: boolean
    timestamp: string
    isRead: boolean
}

interface DataContextType {
    sekolah: SekolahData
    updateSekolah: (data: SekolahData) => void

    classes: ClassData[]
    addClass: (data: Omit<ClassData, "id" | "studentCount">) => void
    updateClass: (id: number, data: Partial<ClassData>) => void
    deleteClass: (id: number) => void

    students: StudentData[]
    addStudent: (data: Omit<StudentData, "id">) => void
    updateStudent: (id: number, data: Partial<StudentData>) => void
    deleteStudent: (id: number) => void

    mapel: MapelData[]
    addMapel: (data: Omit<MapelData, "id">) => void
    updateMapel: (id: number, data: Partial<MapelData>) => void
    deleteMapel: (id: number) => void

    user: UserData
    updateUser: (data: Partial<UserData>) => void

    categories: AssessmentCategory[]
    addCategory: (data: Omit<AssessmentCategory, "id">) => void
    updateCategory: (id: number, data: Partial<AssessmentCategory>) => void
    deleteCategory: (id: number) => void

    weights: AssessmentWeight[]
    saveWeights: (mapelId: number, newWeights: AssessmentWeight[]) => void

    attendance: AttendanceRecord[]
    saveAttendance: (records: AttendanceRecord[]) => void

    assignments: Assignment[]
    addAssignment: (data: Omit<Assignment, "id">) => void
    updateAssignment: (id: number, data: Partial<Assignment>) => void
    deleteAssignment: (id: number) => void

    grades: Grade[]
    saveGrades: (newGrades: Grade[]) => void

    badges: Badge[]
    challenges: Challenge[]
    addPoints: (studentId: number, amount: number) => void
    giveBadge: (studentId: number, badgeId: number) => void
    addBadge: (badge: Omit<Badge, "id">) => void
    editBadge: (id: number, data: Partial<Badge>) => void
    deleteBadge: (id: number) => void
    addChallenge: (challenge: Omit<Challenge, "id" | "completions">) => void
    deleteChallenge: (id: number) => void
    markChallengeComplete: (challengeId: number, studentId: number) => void
    markBatchChallengeComplete: (challengeId: number, studentIds: number[]) => void

    posts: Post[]
    addPost: (data: Omit<Post, "id" | "comments">) => void
    deletePost: (id: number) => void
    togglePostStatus: (id: number) => void
    addComment: (postId: number, comment: Omit<Comment, "id">) => void

    notifications: Notification[]
    addNotification: (data: Omit<Notification, "id" | "read" | "date">) => void
    markNotificationAsRead: (id: number) => void

    chats: Chat[]
    addChat: (chat: Omit<Chat, "id" | "timestamp" | "isRead">) => void
    markChatRead: (chatId: number) => void
    clearChat: (studentId: number) => Promise<void>

    isLoaded: boolean
    isSyncing: boolean
    syncError: string | null
    forceSync: () => Promise<void>
    refreshData: () => Promise<void>
}

// --- Initial Data ---

const initialSekolah: SekolahData = {
    npsn: "",
    nama: "",
    alamat: "",
    kepala: "",
    nipKepala: "",
    akreditasi: "A",
    tahunPelajaran: "2024/2025",
    kabupatenKota: ""
}



const initialUser: UserData = {
    name: "Alfian Noor Arnaim",
    nip: "19850101 201001 1 001",
    email: "alfian.noor@sekolah.sch.id",
    username: "alfian.guru",
    avatar: "/logo.png",
    motto: "Inspiring your minds, sharing knowledge",
    id: undefined,
    password: "password123" // Default password for initial user
}

const initialClasses: ClassData[] = []
const initialStudents: StudentData[] = []
const initialBadges: Badge[] = []
const initialChallenges: Challenge[] = []
const initialMapel: MapelData[] = []

const initialCategories: AssessmentCategory[] = [
    { id: 1, name: "Ulangan Harian", code: "UH" },
    { id: 2, name: "Tugas", code: "TGS" },
    { id: 3, name: "Penilaian Tengah Semester", code: "PTS" },
    { id: 4, name: "Penilaian Akhir Semester", code: "PAS" },
]

const initialWeights: AssessmentWeight[] = []

const initialAttendance: AttendanceRecord[] = []

const initialAssignments: Assignment[] = []
const initialGrades: Grade[] = []
const initialPosts: Post[] = [
    {
        id: 1,
        title: "Selamat Datang di Forum Diskusi",
        content: "Halo semuanya! Ini adalah tempat untuk berdiskusi tentang pelajaran dan kegiatan sekolah. Silakan gunakan dengan bijak.",
        author: "Alfian Noor Arnaim",
        date: "2025-12-01",
        status: "Active",
        type: "announcement",
        comments: [
            { id: 1, author: "Ahmad Rizky", content: "Siap pak!", date: "2025-12-01" }
        ]
    }
]
const initialNotifications: Notification[] = []
const initialChats: Chat[] = []

// --- Context ---

const DataContext = React.createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast()

    // State
    const [sekolah, setSekolah] = React.useState<SekolahData>(initialSekolah)
    const [classes, setClasses] = React.useState<ClassData[]>(initialClasses)
    const [students, setStudents] = React.useState<StudentData[]>(initialStudents)
    const [mapel, setMapel] = React.useState<MapelData[]>(initialMapel)
    const [user, setUser] = React.useState<UserData>(initialUser)
    const [categories, setCategories] = React.useState<AssessmentCategory[]>(initialCategories)
    const [weights, setWeights] = React.useState<AssessmentWeight[]>(initialWeights)
    const [attendance, setAttendance] = React.useState<AttendanceRecord[]>(initialAttendance)
    const [assignments, setAssignments] = React.useState<Assignment[]>(initialAssignments)
    const [grades, setGrades] = React.useState<Grade[]>(initialGrades)
    const [badges, setBadges] = React.useState<Badge[]>(initialBadges)
    const [challenges, setChallenges] = React.useState<Challenge[]>(initialChallenges)
    const [challengeCompletions, setChallengeCompletions] = React.useState<ChallengeCompletion[]>([])
    const [posts, setPosts] = React.useState<Post[]>(initialPosts)
    const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications)
    const [chats, setChats] = React.useState<Chat[]>(initialChats)
    const [isLoaded, setIsLoaded] = React.useState(false)

    const { isOnline, isSyncing, syncError, forceSync } = useSync()

    // Load from LocalStorage & API
    const refreshData = React.useCallback(async () => {
        // 1. Load from IndexedDB first (Async)
        const savedSekolah = await StorageManager.getData('sekolah')
        setSekolah(savedSekolah && savedSekolah.length > 0 ? savedSekolah[0] : initialSekolah)

        setClasses((await StorageManager.getData('classes')) || initialClasses)
        setStudents((await StorageManager.getData('students')) || initialStudents)
        setMapel((await StorageManager.getData('mapel')) || initialMapel)

        const savedUser = await StorageManager.getData('user')
        // Merge saved user with initialUser to ensure new fields (like password) are present
        if (savedUser && savedUser.length > 0) {
            setUser({ ...initialUser, ...savedUser[0] })
        } else {
            setUser(initialUser)
        }

        setCategories((await StorageManager.getData('categories')) || initialCategories)
        setWeights((await StorageManager.getData('weights')) || initialWeights)
        setAttendance((await StorageManager.getData('attendance')) || initialAttendance)
        setAssignments((await StorageManager.getData('assignments')) || initialAssignments)
        setGrades((await StorageManager.getData('grades')) || initialGrades)
        setBadges((await StorageManager.getData('badges')) || initialBadges)
        setChallenges((await StorageManager.getData('challenges')) || initialChallenges)
        setPosts((await StorageManager.getData('posts')) || initialPosts)
        setNotifications((await StorageManager.getData('notifications')) || initialNotifications)
        setChats((await StorageManager.getData('chats')) || initialChats)

        setIsLoaded(true)

        // 2. If online, fetch fresh data from GAS
        if (navigator.onLine) {
            try {
                const response = await fetchFromGAS('getAllData')
                console.log("[Data Context] fetchFromGAS response:", response)

                if (response.status === 'success' && response.data) {
                    let d = response.data

                    // Helper for safe JSON parsing
                    const safeParseArray = (value: any) => {
                        if (Array.isArray(value)) return value;
                        if (typeof value === 'string' && value.trim() && value !== "undefined") {
                            try {
                                return JSON.parse(value);
                            } catch (e) {
                                console.warn("JSON Parse Error:", value);
                                return [];
                            }
                        }
                        return [];
                    }

                    // --- SMART MERGE: Apply pending sync operations on top of server data ---
                    const queue = await StorageManager.getSyncQueue()
                    if (queue && queue.length > 0) {
                        console.log(`[Smart Merge] Applying ${queue.length} pending operations to server data...`)
                        console.log("[Smart Merge] Queue:", queue)

                        // Helper to apply op to a list
                        const applyOp = (list: any[], op: any) => {
                            if (!list) list = []
                            if (op.action === 'CREATE') return [...list, op.data]
                            // Use loose equality for ID matching
                            if (op.action === 'UPDATE') return list.map(item => item.id == op.data.id ? { ...item, ...op.data } : item)
                            if (op.action === 'DELETE') return list.filter(item => item.id != op.data.id)
                            return list
                        }

                        // Apply ops to respective tables
                        queue.forEach(op => {
                            if (op.table === 'students') d.students = applyOp(d.students, op)
                            if (op.table === 'classes') d.classes = applyOp(d.classes, op)
                            if (op.table === 'subjects') d.subjects = applyOp(d.subjects, op)
                            if (op.table === 'users') d.users = applyOp(d.users, op)
                            if (op.table === 'grades') d.grades = applyOp(d.grades, op)
                            if (op.table === 'comments') d.posts = d.posts?.map((p: any) => p.id === op.data.postId ? { ...p, comments: [...(p.comments || []), op.data] } : p)
                            if (op.table === 'posts') {
                                if (op.action === 'CREATE') d.posts = [op.data, ...(d.posts || [])]
                                if (op.action === 'DELETE') d.posts = d.posts?.filter((p: any) => p.id !== op.data.id)
                                if (op.action === 'UPDATE') d.posts = d.posts?.map((p: any) => p.id === op.data.id ? { ...p, ...op.data } : p)
                            }
                            if (op.table === 'chats') {
                                if (op.action === 'CREATE') d.chats = [...(d.chats || []), op.data]
                            }
                            // Add other tables as needed
                        })
                    } else {
                        console.log("[Smart Merge] No pending operations found.")
                    }
                    // -----------------------------------------------------------------------

                    // Sync all data tables
                    if (d.sekolah && d.sekolah.length > 0) setSekolah(d.sekolah[0])
                    if (d.classes) setClasses(d.classes || [])
                    if (d.students) {
                        setStudents(d.students.map((s: any) => ({
                            ...s,
                            badges: safeParseArray(s.badges)
                        })) || [])
                    }
                    if (d.subjects) setMapel(d.subjects || [])
                    if (d.categories) setCategories(d.categories || [])
                    if (d.weights) setWeights(d.weights || [])
                    if (d.attendance) setAttendance(d.attendance || [])
                    if (d.tasks) setAssignments(d.tasks || [])
                    if (d.grades) setGrades(d.grades || [])
                    if (d.badges) setBadges(d.badges || [])
                    if (d.challenges) {
                        // Challenges & Completions
                        const rawChallenges = (d.challenges || []).map((c: any) => ({
                            ...c,
                            // Ensure completions is initialized even if not in DB anymore
                            completions: []
                        }))

                        const rawCompletions = (d.challenge_completions || []).map((cc: any) => ({
                            ...cc,
                            challengeId: Number(cc.challengeId),
                            studentId: Number(cc.studentId)
                        }))

                        setChallengeCompletions(rawCompletions)

                        // Merge completions into challenges for UI compatibility
                        const mergedChallenges = rawChallenges.map((c: Challenge) => {
                            const challengeComps = rawCompletions
                                .filter((cc: ChallengeCompletion) => cc.challengeId === c.id)
                                .map((cc: ChallengeCompletion) => cc.studentId)

                            // Also check legacy 'completions' column if it exists and has data (backward compatibility)
                            const legacyComps = safeParseArray(c.completions)

                            return {
                                ...c,
                                completions: Array.from(new Set([...challengeComps, ...legacyComps]))
                            }
                        })

                        setChallenges(mergedChallenges)
                    }
                    if (d.posts) {
                        // Get current local posts to recover type if missing from backend
                        const localPosts = await StorageManager.getData('posts') || [];

                        const parsedPosts = (Array.isArray(d.posts) ? d.posts : []).map((p: any) => {
                            // Ensure comments is an array
                            let parsedComments: any[] = [];
                            if (Array.isArray(p.comments)) {
                                parsedComments = p.comments;
                            } else if (typeof p.comments === 'string') {
                                try {
                                    parsedComments = JSON.parse(p.comments);
                                } catch (e) {
                                    console.warn(`[Data Context] Failed to parse comments for post ${p.id}`, e);
                                }
                            }

                            // MERGE: Add comments from the separate 'comments' table
                            if (d.comments && Array.isArray(d.comments)) {
                                console.log(`[Data Context] Found ${d.comments.length} global comments from backend`);

                                // Filter comments for this specific post
                                // Handle potential type mismatch (string vs number) for postId
                                const linkedComments = d.comments.filter((c: any) =>
                                    String(c.postId) === String(p.id)
                                );

                                if (linkedComments.length > 0) {
                                    console.log(`[Data Context] Post ${p.id} has ${linkedComments.length} linked comments`);
                                }

                                // Avoid duplicates if they are already in p.comments (check by ID)
                                const existingIds = new Set(parsedComments.map(pc => String(pc.id)));

                                linkedComments.forEach((lc: any) => {
                                    // Ensure comment has required fields
                                    if (!lc.id || !lc.author || !lc.content) return;

                                    if (!existingIds.has(String(lc.id))) {
                                        parsedComments.push({
                                            ...lc,
                                            id: Number(lc.id) // Ensure ID is number
                                        });
                                    }
                                });
                            }

                            // Local Type Preservation:
                            // If backend returns no type (undefined/null/empty), try to find it in local storage
                            let postType = p.type;
                            if (!postType) {
                                const localPost = localPosts.find((lp: any) => lp.id == p.id);
                                if (localPost && localPost.type) {
                                    postType = localPost.type;
                                    console.log(`[Data Context] Recovered type '${postType}' for post ${p.id} from local storage`);
                                } else {
                                    console.warn(`[Data Context] Post ${p.id} missing type and not found locally, defaulting to discussion`);
                                    postType = 'discussion';
                                }
                            }

                            // Ensure date is valid
                            let postDate = p.date;
                            if (!postDate || isNaN(new Date(postDate).getTime())) {
                                console.warn(`[Data Context] Post ${p.id} has invalid date '${postDate}', defaulting to now`);
                                postDate = new Date().toISOString();
                            }

                            return {
                                ...p,
                                id: Number(p.id), // Ensure ID is number
                                comments: parsedComments,
                                type: postType,
                                date: postDate
                            };
                        });
                        console.log("[Data Context] Parsed posts:", parsedPosts);
                        setPosts(parsedPosts);

                        // Debug Feedback for User
                        const announcementCount = parsedPosts.filter((p: any) => p.type === 'announcement').length;
                        const discussionCount = parsedPosts.filter((p: any) => p.type === 'discussion').length;

                        if (parsedPosts.length > 0) {
                            toast({
                                title: "Terhubung • Data Terupdate",
                                variant: "dynamic-island"
                            });
                        }
                    }
                    if (d.notifications) setNotifications(d.notifications || [])
                    if (d.chats) {
                        const parsedChats = (d.chats || []).map((c: any) => ({
                            ...c,
                            id: Number(c.id),
                            studentId: Number(c.studentId),
                            teacherId: Number(c.teacherId),
                            isFromTeacher: c.isFromTeacher === true || c.isFromTeacher === "true" || c.isFromTeacher === 1,
                            isRead: c.isRead === true || c.isRead === "true" || c.isRead === 1
                        }))
                        setChats(parsedChats)
                    }

                    if (d.users) {
                        // Find current user by email (use saved email if available, else initial)
                        const emailToFind = (savedUser && savedUser.length > 0 && savedUser[0].email) ? savedUser[0].email : initialUser.email

                        let currentUser = d.users.find((u: any) => u.email === emailToFind)

                        // Fallback: If not found by email, try to find by role 'teacher' or just take the first user
                        if (!currentUser && d.users.length > 0) {
                            currentUser = d.users.find((u: any) => u.role === 'teacher') || d.users[0]
                        }
                        if (currentUser) {
                            setUser(prev => ({
                                ...prev,
                                id: currentUser.id,
                                name: currentUser.name || prev.name,
                                nip: currentUser.nip || prev.nip,
                                email: currentUser.email || prev.email, // Sync email too
                                username: currentUser.username || prev.username,
                                password: currentUser.password || prev.password, // Sync password for login check
                                motto: currentUser.motto || prev.motto,
                                avatar: currentUser.avatar || prev.avatar
                            }))
                        }
                    }
                } else {
                    console.warn("[Data Context] Fetch failed or no data returned:", response)
                }
            } catch (e) {
                console.error("Failed to fetch from GAS", e)
            }
        }
    }, [toast])

    React.useEffect(() => {
        refreshData()
    }, [refreshData])

    // Persist chats to local storage whenever they change
    React.useEffect(() => {
        if (chats.length > 0) {
            StorageManager.saveData("chats", chats).catch(console.error)
        }
    }, [chats])



    // --- Actions ---

    const updateSekolah = async (data: SekolahData) => {
        const updated = { ...sekolah, ...data }
        setSekolah(updated)

        try {
            await postToGAS({
                action: 'UPDATE',
                table: 'sekolah',
                data: updated
            })
            toast({ title: "Data sekolah berhasil diperbarui", variant: "success" })
        } catch (e) {
            console.error("Failed to update sekolah", e)
            toast({ title: "Gagal memperbarui data", variant: "destructive" })
        }
    }

    const addClass = async (data: Omit<ClassData, "id" | "studentCount">) => {
        const newClass = { ...data, id: Date.now(), studentCount: 0 }
        setClasses([...classes, newClass])

        try {
            await postToGAS({
                action: 'CREATE',
                table: 'classes',
                data: newClass
            })
            toast({ title: "Kelas berhasil ditambahkan", variant: "success" })
        } catch (e) {
            console.error("Failed to add class", e)
            toast({ title: "Gagal menambahkan kelas", variant: "destructive" })
        }
    }

    const updateClass = async (id: number, data: Partial<ClassData>) => {
        setClasses(classes.map(c => c.id === id ? { ...c, ...data } : c))

        try {
            await postToGAS({
                action: 'UPDATE',
                table: 'classes',
                data: { id, ...data }
            })
            toast({ title: "Data kelas berhasil diperbarui", variant: "success" })
        } catch (e) {
            console.error("Failed to update class", e)
            toast({ title: "Gagal memperbarui kelas", variant: "destructive" })
        }
    }

    const deleteClass = async (id: number) => {
        setClasses(classes.filter(c => c.id !== id))

        try {
            await postToGAS({
                action: 'DELETE',
                table: 'classes',
                data: { id }
            })
            toast({ title: "Kelas berhasil dihapus", variant: "success" })
        } catch (e) {
            console.error("Failed to delete class", e)
            toast({ title: "Gagal menghapus kelas", variant: "destructive" })
        }
    }

    const addStudent = async (data: Omit<StudentData, "id">) => {
        const newStudent = { ...data, id: Date.now() }
        setStudents([...students, newStudent])

        // Update class count
        const cls = classes.find(c => c.name === data.class)
        if (cls) {
            updateClass(cls.id, { studentCount: Number(cls.studentCount || 0) + 1 })
        }

        try {
            await postToGAS({
                action: 'CREATE',
                table: 'students',
                data: newStudent
            })
            toast({ title: "Siswa berhasil ditambahkan", variant: "success" })
        } catch (e) {
            console.error("Failed to add student", e)
            toast({ title: "Gagal menambahkan siswa", variant: "destructive" })
        }
    }

    const updateStudent = async (id: number, data: Partial<StudentData>) => {
        const oldStudent = students.find(s => s.id === id)
        setStudents(students.map(s => s.id === id ? { ...s, ...data } : s))

        // Handle class change count update
        if (oldStudent && data.class && oldStudent.class !== data.class) {
            const oldCls = classes.find(c => c.name === oldStudent.class)
            const newCls = classes.find(c => c.name === data.class)

            if (oldCls) updateClass(oldCls.id, { studentCount: Math.max(0, oldCls.studentCount - 1) })
            if (newCls) updateClass(newCls.id, { studentCount: newCls.studentCount + 1 })
        }

        try {
            await postToGAS({
                action: 'UPDATE',
                table: 'students',
                data: { id, ...data }
            })
            toast({ title: "Data siswa berhasil diperbarui", variant: "success" })
        } catch (e) {
            console.error("Failed to update student", e)
            toast({ title: "Gagal memperbarui siswa", variant: "destructive" })
        }
    }

    const deleteStudent = async (id: number) => {
        const student = students.find(s => s.id === id)
        setStudents(students.filter(s => s.id !== id))

        if (student) {
            const cls = classes.find(c => c.name === student.class)
            if (cls) updateClass(cls.id, { studentCount: Math.max(0, cls.studentCount - 1) })
        }

        try {
            await postToGAS({
                action: 'DELETE',
                table: 'students',
                data: { id }
            })
            toast({ title: "Siswa berhasil dihapus", variant: "success" })
        } catch (e) {
            console.error("Failed to delete student", e)
            toast({ title: "Gagal menghapus siswa", variant: "destructive" })
        }
    }

    const addMapel = async (data: Omit<MapelData, "id">) => {
        const newMapel = { ...data, id: Date.now() }
        setMapel([...mapel, newMapel])

        try {
            await postToGAS({
                action: 'CREATE',
                table: 'subjects',
                data: newMapel
            })
            toast({ title: "Mata pelajaran berhasil ditambahkan", variant: "success" })
        } catch (e) {
            console.error("Failed to add mapel", e)
            toast({ title: "Gagal menambahkan mapel", variant: "destructive" })
        }
    }

    const updateMapel = async (id: number, data: Partial<MapelData>) => {
        setMapel(mapel.map(m => m.id === id ? { ...m, ...data } : m))

        try {
            await postToGAS({
                action: 'UPDATE',
                table: 'subjects',
                data: { id, ...data }
            })
            toast({ title: "Mata pelajaran berhasil diperbarui", variant: "success" })
        } catch (e) {
            console.error("Failed to update mapel", e)
            toast({ title: "Gagal memperbarui mapel", variant: "destructive" })
        }
    }

    const deleteMapel = async (id: number) => {
        setMapel(mapel.filter(m => m.id !== id))

        try {
            await postToGAS({
                action: 'DELETE',
                table: 'subjects',
                data: { id }
            })
            toast({ title: "Mata pelajaran berhasil dihapus", variant: "success" })
        } catch (e) {
            console.error("Failed to delete mapel", e)
            toast({ title: "Gagal menghapus mapel", variant: "destructive" })
        }
    }

    const updateUser = async (data: Partial<UserData>) => {
        const updated = { ...user, ...data }

        // Guard: Ensure ID exists to prevent duplicates
        if (!updated.id) {
            if (updated.username === 'alfian.guru') {
                updated.id = '1'; // Force default ID for admin
            } else {
                console.error("Attempted to update user without ID:", updated);
                toast({ title: "Gagal memperbarui profil: ID pengguna tidak ditemukan. Silakan refresh halaman.", variant: "destructive" });
                return;
            }
        }

        setUser(updated)
        // Save user session locally for login persistence
        StorageManager.saveData("user", [updated]).catch(console.error)

        try {
            await postToGAS({
                action: 'UPDATE',
                table: 'users',
                data: updated
            })
            toast({ title: "Profil berhasil diperbarui", variant: "success" })
        } catch (e) {
            console.error("Failed to update user", e)
            toast({ title: "Gagal memperbarui profil", variant: "destructive" })
        }
    }

    const addCategory = async (data: Omit<AssessmentCategory, "id">) => {
        const newCategory = { ...data, id: Date.now() }
        setCategories([...categories, newCategory])

        try {
            await postToGAS({
                action: 'CREATE',
                table: 'categories',
                data: newCategory
            })
            toast({ title: "Kategori berhasil ditambahkan", variant: "success" })
        } catch (e) {
            console.error("Failed to add category", e)
            toast({ title: "Gagal menambahkan kategori", variant: "destructive" })
        }
    }

    const updateCategory = async (id: number, data: Partial<AssessmentCategory>) => {
        setCategories(categories.map(c => c.id === id ? { ...c, ...data } : c))

        try {
            await postToGAS({
                action: 'UPDATE',
                table: 'categories',
                data: { id, ...data }
            })
            toast({ title: "Kategori berhasil diperbarui", variant: "success" })
        } catch (e) {
            console.error("Failed to update category", e)
            toast({ title: "Gagal memperbarui kategori", variant: "destructive" })
        }
    }

    const deleteCategory = async (id: number) => {
        setCategories(categories.filter(c => c.id !== id))

        try {
            await postToGAS({
                action: 'DELETE',
                table: 'categories',
                data: { id }
            })
            toast({ title: "Kategori berhasil dihapus", variant: "success" })
        } catch (e) {
            console.error("Failed to delete category", e)
            toast({ title: "Gagal menghapus kategori", variant: "destructive" })
        }
    }



    const saveWeights = async (mapelId: number, newWeights: AssessmentWeight[]) => {
        // Get existing weights for this mapel to preserve IDs
        const existingMapelWeights = weights.filter(w => w.mapelId === mapelId)

        // Prepare operations
        const operations: Promise<any>[] = []
        const updatedWeightsList: AssessmentWeight[] = []

        newWeights.forEach(nw => {
            // Check if we already have a weight entry for this category
            const existing = existingMapelWeights.find(ew => ew.categoryId === nw.categoryId)

            if (existing && existing.id) {
                // UPDATE existing
                const updatedWeight = { ...nw, id: existing.id }
                updatedWeightsList.push(updatedWeight)
                operations.push(postToGAS({
                    action: 'UPDATE',
                    table: 'weights',
                    data: updatedWeight
                }))
            } else {
                // CREATE new
                const newId = Date.now() + Math.floor(Math.random() * 1000) // Simple ID generation
                const newWeight = { ...nw, id: newId }
                updatedWeightsList.push(newWeight)
                operations.push(postToGAS({
                    action: 'CREATE',
                    table: 'weights',
                    data: newWeight
                }))
            }
        })

        // Update local state: 
        // 1. Remove ALL old weights for this mapel
        // 2. Add the NEW/UPDATED weights
        const otherWeights = weights.filter(w => w.mapelId !== mapelId)
        setWeights([...otherWeights, ...updatedWeightsList])

        try {
            await Promise.all(operations)
            // if (navigator.onLine) forceSync()
            toast({ title: "Bobot penilaian berhasil disimpan", variant: "success" })
        } catch (e) {
            console.error("Failed to save weights", e)
            toast({ title: "Gagal menyimpan bobot", variant: "destructive" })
        }
    }

    const saveAttendance = async (records: AttendanceRecord[]) => {
        const newAttendance = [...attendance]

        const promises: Promise<any>[] = []

        records.forEach(record => {
            const index = newAttendance.findIndex(
                a => a.date === record.date && a.studentId === record.studentId
            )
            if (index >= 0) {
                newAttendance[index] = record
                promises.push(postToGAS({
                    action: 'UPDATE',
                    table: 'attendance',
                    data: record
                }))
            } else {
                newAttendance.push(record)
                promises.push(postToGAS({
                    action: 'CREATE',
                    table: 'attendance',
                    data: record
                }))
            }
        })

        setAttendance(newAttendance)

        try {
            await Promise.all(promises)
            // if (navigator.onLine) forceSync()
            toast({ title: "Data presensi berhasil disimpan", variant: "success" })
        } catch (e) {
            console.error("Failed to save attendance", e)
            toast({ title: "Gagal menyimpan presensi", variant: "destructive" })
        }
    }

    const addAssignment = async (data: Omit<Assignment, "id">) => {
        const newAssignment = { ...data, id: Date.now() }
        setAssignments([...assignments, newAssignment])

        try {
            await postToGAS({
                action: 'CREATE',
                table: 'tasks',
                data: newAssignment
            })
            // if (navigator.onLine) forceSync()
            toast({ title: "Tugas berhasil dibuat", variant: "success" })
        } catch (e) {
            console.error("Failed to add assignment", e)
            toast({ title: "Gagal membuat tugas", variant: "destructive" })
        }
    }

    const updateAssignment = async (id: number, data: Partial<Assignment>) => {
        setAssignments(assignments.map(a => a.id === id ? { ...a, ...data } : a))

        try {
            await postToGAS({
                action: 'UPDATE',
                table: 'tasks',
                data: { id, ...data }
            })
            // if (navigator.onLine) forceSync()
            toast({ title: "Tugas berhasil diperbarui", variant: "success" })
        } catch (e) {
            console.error("Failed to update assignment", e)
            toast({ title: "Gagal memperbarui tugas", variant: "destructive" })
        }
    }

    const deleteAssignment = async (id: number) => {
        setAssignments(assignments.filter(a => a.id !== id))

        try {
            await postToGAS({
                action: 'DELETE',
                table: 'tasks',
                data: { id }
            })
            // if (navigator.onLine) forceSync()
            toast({ title: "Tugas berhasil dihapus", variant: "success" })
        } catch (e) {
            console.error("Failed to delete assignment", e)
            toast({ title: "Gagal menghapus tugas", variant: "destructive" })
        }
    }

    const saveGrades = async (newGrades: Grade[]) => {
        const updatedGrades = [...grades]
        const promises: Promise<any>[] = []

        newGrades.forEach(grade => {
            const index = updatedGrades.findIndex(
                g => g.assignmentId === grade.assignmentId && g.studentId === grade.studentId
            )
            if (index >= 0) {
                updatedGrades[index] = grade
            } else {
                updatedGrades.push(grade)
            }

            // Sync: Queue each grade update
            promises.push(postToGAS({
                action: 'UPDATE', // Backend should handle upsert based on assignmentId + studentId
                table: 'grades',
                data: grade
            }))
        })

        setGrades(updatedGrades)

        try {
            await Promise.all(promises)
            // if (navigator.onLine) forceSync()
            toast({ title: "Nilai berhasil disimpan", variant: "success" })
        } catch (e) {
            console.error("Failed to save grades", e)
            toast({ title: "Gagal menyimpan nilai", variant: "destructive" })
        }
    }

    const addPoints = async (studentId: number, amount: number) => {
        let updatedStudent: StudentData | undefined;

        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                const newPoints = (s.points || 0) + amount
                const newLevel = Math.floor(Math.log2(newPoints / 100 + 1)) + 1

                updatedStudent = { ...s, points: newPoints, level: newLevel }
                return updatedStudent
            }
            return s
        }))

        if (updatedStudent) {
            try {
                await postToGAS({
                    action: 'UPDATE',
                    table: 'students',
                    data: updatedStudent
                })
                // Refresh data to ensure consistency
                // if (navigator.onLine) forceSync() // Removed to prevent stale data overwrite
                toast({ title: `Berhasil menambahkan ${amount} poin`, variant: "success" })
            } catch (e) {
                console.error("Failed to add points", e)
                toast({ title: "Gagal menambahkan poin", variant: "destructive" })
            }
        }
    }

    const giveBadge = async (studentId: number, badgeId: number) => {
        const student = students.find(s => s.id === studentId)
        const badge = badges.find(b => b.id === badgeId)

        if (!student || !badge) return

        if (student.badges?.includes(badgeId)) {
            toast({ title: "Siswa sudah memiliki badge ini" })
            return
        }

        // Add badge to student
        let updatedStudent: StudentData | undefined;
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                updatedStudent = { ...s, badges: [...(s.badges || []), badgeId] }
                return updatedStudent
            }
            return s
        }))

        if (updatedStudent) {
            try {
                await postToGAS({
                    action: 'UPDATE',
                    table: 'students',
                    data: updatedStudent
                })

                // Award points automatically
                await addPoints(studentId, badge.points)

                toast({ title: `Badge diberikan! +${badge.points} poin`, variant: "success" })
            } catch (e) {
                console.error("Failed to give badge", e)
                toast({ title: "Gagal memberikan badge", variant: "destructive" })
            }
        }
    }

    const addBadge = async (data: Omit<Badge, "id">) => {
        const newBadge = { ...data, id: Date.now() }
        setBadges([...badges, newBadge])

        try {
            await postToGAS({
                action: 'CREATE',
                table: 'badges',
                data: newBadge
            })
            // if (navigator.onLine) forceSync()
            toast({ title: "Badge baru berhasil dibuat", variant: "success" })
        } catch (e) {
            console.error("Failed to add badge", e)
            toast({ title: "Gagal membuat badge", variant: "destructive" })
        }
    }

    const editBadge = async (id: number, data: Partial<Badge>) => {
        setBadges(badges.map(b => b.id === id ? { ...b, ...data } : b))

        try {
            await postToGAS({
                action: 'UPDATE',
                table: 'badges',
                data: { id, ...data }
            })
            // if (navigator.onLine) forceSync()
            toast({ title: "Badge berhasil diperbarui", variant: "success" })
        } catch (e) {
            console.error("Failed to edit badge", e)
            toast({ title: "Gagal memperbarui badge", variant: "destructive" })
        }
    }

    const deleteBadge = async (id: number) => {
        setBadges(badges.filter(b => b.id !== id))

        try {
            await postToGAS({
                action: 'DELETE',
                table: 'badges',
                data: { id }
            })
            // if (navigator.onLine) forceSync()
            toast({ title: "Badge berhasil dihapus", variant: "success" })
        } catch (e) {
            console.error("Failed to delete badge", e)
            toast({ title: "Gagal menghapus badge", variant: "destructive" })
        }
    }

    const addChallenge = async (data: Omit<Challenge, "id" | "completions">) => {
        const newChallenge = { ...data, id: Date.now(), completions: [] }
        setChallenges([...challenges, newChallenge])

        try {
            await postToGAS({
                action: 'CREATE',
                table: 'challenges',
                data: { ...newChallenge, completions: JSON.stringify([]) } // Send as string "[]"
            })
            // if (navigator.onLine) forceSync()
            toast({ title: "Tantangan baru berhasil dibuat", variant: "success" })
        } catch (e) {
            console.error("Failed to add challenge", e)
            toast({ title: "Gagal membuat tantangan", variant: "destructive" })
        }
    }

    const deleteChallenge = async (id: number) => {
        setChallenges(challenges.filter(c => c.id !== id))

        try {
            await postToGAS({
                action: 'DELETE',
                table: 'challenges',
                data: { id }
            })
            toast({ title: "Tantangan berhasil dihapus", variant: "success" })
        } catch (e) {
            console.error("Failed to delete challenge", e)
            toast({ title: "Gagal menghapus tantangan", variant: "destructive" })
        }
    }

    const markChallengeComplete = async (challengeId: number, studentId: number) => {
        const challenge = challenges.find(c => c.id === challengeId)
        if (!challenge) return

        // Check if already completed (handle string/number mismatch)
        const isCompleted = challenge.completions.some((id: any) => id == studentId)
        if (isCompleted) {
            toast({ title: "Siswa sudah menyelesaikan tantangan ini" })
            return
        }

        // Update challenge completions
        setChallenges(prev => prev.map(c =>
            c.id === challengeId
                ? { ...c, completions: [...c.completions, studentId] }
                : c
        ))

        // Sync challenge update - NEW METHOD (Insert to challenge_completions)
        const completionId = `${challengeId}_${studentId}_${Date.now()}`
        const completionData: ChallengeCompletion = {
            id: completionId,
            challengeId: challengeId,
            studentId: studentId,
            timestamp: new Date().toISOString()
        }

        console.log("[markChallengeComplete] Syncing NEW completion:", completionData)
        toast({ title: "Syncing...", description: "Menyimpan data penyelesaian..." })

        try {
            await postToGAS({
                action: 'CREATE',
                table: 'challenge_completions',
                data: completionData
            })
            // if (navigator.onLine) forceSync()

            // Award points
            await addPoints(studentId, challenge.rewardPoints)
            toast({ title: `Tantangan selesai! +${challenge.rewardPoints} poin`, variant: "success" })
        } catch (e) {
            console.error("Error in markChallengeComplete:", e)
            toast({ title: "Gagal menyimpan tantangan", description: "Terjadi kesalahan sistem", variant: "destructive" })
        }
    }

    const markBatchChallengeComplete = async (challengeId: number, studentIds: number[]) => {
        const challenge = challenges.find(c => c.id === challengeId)
        if (!challenge) return

        // Filter out already completed students
        const currentCompletions = Array.isArray(challenge.completions) ? challenge.completions : []
        const newStudentIds = studentIds.filter(id => !currentCompletions.some((cId: any) => cId == id))

        if (newStudentIds.length === 0) return

        const newCompletions = [...currentCompletions, ...newStudentIds]

        // Update challenge completions locally
        setChallenges(prev => prev.map(c =>
            c.id === challengeId
                ? { ...c, completions: newCompletions }
                : c
        ))

        // Sync challenge update - NEW METHOD (Batch Insert)
        // We need to create multiple CREATE operations
        console.log("[markBatchChallengeComplete] Syncing batch completions:", newStudentIds)
        toast({ title: "Syncing Batch...", description: `Sending ${newStudentIds.length} completions` })

        try {
            const operations = newStudentIds.map(studentId => {
                const completionId = `${challengeId}_${studentId}_${Date.now()}`
                return postToGAS({
                    action: 'CREATE',
                    table: 'challenge_completions',
                    data: {
                        id: completionId,
                        challengeId: challengeId,
                        studentId: studentId,
                        timestamp: new Date().toISOString()
                    }
                })
            })

            // Add all to queue
            await Promise.all(operations)
            // if (navigator.onLine) forceSync()

            // Award points to all students
            for (const id of newStudentIds) {
                await addPoints(id, challenge.rewardPoints)
            }

            toast({ title: `${newStudentIds.length} siswa menyelesaikan tantangan!`, variant: "success" })
        } catch (e) {
            console.error("Error in markBatchChallengeComplete:", e)
            toast({ title: "Gagal menyimpan tantangan batch", description: "Terjadi kesalahan sistem", variant: "destructive" })
        }
    }



    const addPost = async (data: Omit<Post, "id" | "comments">) => {
        const newPost = { ...data, id: Date.now(), comments: [] }
        const updatedPosts = [newPost, ...posts]
        setPosts(updatedPosts)

        toast({ title: "Sedang mengirim...", description: "Mohon tunggu sebentar." })

        try {
            await postToGAS({
                action: 'CREATE',
                table: 'posts',
                data: newPost
            })

            // Notify all students about new post
            await addNotification({
                message: `${data.author} memposting pengumuman baru: "${data.title}"`,
                link: "/komunikasi",
                sender: data.author
            })

            // if (navigator.onLine) forceSync()
            toast({ title: "Pengumuman berhasil dibuat", variant: "success" })
        } catch (e) {
            console.error("Failed to add post", e)
            toast({ title: "Gagal mengirim data", variant: "destructive" })
        }
    }

    const deletePost = async (id: number) => {
        setPosts(posts.filter(p => p.id !== id))

        try {
            await postToGAS({
                action: 'DELETE',
                table: 'posts',
                data: { id }
            })
            // if (navigator.onLine) forceSync()
            toast({ title: "Postingan berhasil dihapus", variant: "success" })
        } catch (e) {
            console.error("Failed to delete post", e)
            toast({ title: "Gagal menghapus data", variant: "destructive" })
        }
    }

    const togglePostStatus = async (id: number) => {
        const updatedPosts = posts.map(p => {
            if (p.id === id) {
                const newStatus = p.status === "Active" ? "Closed" : "Active"
                return { ...p, status: newStatus as "Active" | "Closed" }
            }
            return p
        })
        setPosts(updatedPosts)

        const post = posts.find(p => p.id === id)
        if (post) {
            const newStatus = post.status === "Active" ? "Closed" : "Active"
            try {
                await postToGAS({
                    action: 'UPDATE',
                    table: 'posts',
                    data: { id, status: newStatus }
                })
                // if (navigator.onLine) forceSync()
                toast({ title: "Status diskusi berhasil diubah", variant: "success" })
            } catch (e) {
                console.error("Failed to update post status", e)
                toast({ title: "Gagal memperbarui status", variant: "destructive" })
            }
        }
    }

    const addComment = async (postId: number, comment: Omit<Comment, "id">) => {
        const newComment = { ...comment, id: Date.now() }

        // Find the post to get the author
        const post = posts.find(p => p.id === postId)

        setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))

        try {
            await postToGAS({
                action: 'CREATE',
                table: 'comments',
                data: { ...newComment, postId } // Ensure postId is sent to backend
            })

            // Notify the post author if someone else comments
            if (post && post.author !== comment.author) {
                await addNotification({
                    message: `${comment.author} mengomentari postingan "${post.title}"`,
                    link: post.type === 'announcement' ? '/komunikasi/pengumuman' : '/komunikasi/forum',
                    sender: comment.author
                })
            }

            // if (navigator.onLine) forceSync()
            toast({ title: "Komentar berhasil ditambahkan", variant: "success" })
        } catch (e) {
            console.error("Failed to add comment", e)
            toast({ title: "Gagal mengirim komentar", variant: "destructive" })
        }
    }

    const addNotification = async (data: Omit<Notification, "id" | "read" | "date">) => {
        const newNotification = { ...data, id: Date.now(), read: false, date: new Date().toISOString() }
        setNotifications([newNotification, ...notifications])

        try {
            await postToGAS({
                action: 'CREATE',
                table: 'notifications',
                data: newNotification
            })
        } catch (e) {
            console.error("Failed to send notification", e)
        }
    }

    const markNotificationAsRead = async (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))

        try {
            await postToGAS({
                action: 'UPDATE',
                table: 'notifications',
                data: { id, read: true }
            })
        } catch (e) {
            console.error("Failed to mark notification as read", e)
        }
    }

    const addChat = async (chat: Omit<Chat, "id" | "timestamp" | "isRead">) => {
        const newChat: Chat = {
            ...chat,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            isRead: false
        }
        setChats([...chats, newChat])

        try {
            await postToGAS({
                action: 'CREATE',
                table: 'chats',
                data: newChat
            })
        } catch (e) {
            console.error("Failed to send chat", e)
            toast({ title: "Gagal mengirim pesan", variant: "destructive" })
        }
    }

    const markChatRead = async (chatId: number) => {
        setChats(chats.map(c => c.id === chatId ? { ...c, isRead: true } : c))
        try {
            await postToGAS({
                action: 'UPDATE',
                table: 'chats',
                data: { id: chatId, isRead: true }
            })
        } catch (e) {
            console.error("Failed to mark chat read", e)
        }
    }

    const clearChat = async (studentId: number) => {
        // 1. Identify chats to delete
        const chatsToDelete = chats.filter(c => c.studentId === studentId)

        // 2. Update local state immediately
        setChats(chats.filter(c => c.studentId !== studentId))

        // 3. Sync deletions to backend
        // We send a batch of DELETE actions
        try {
            const deleteActions = chatsToDelete.map(chat => ({
                action: 'DELETE',
                table: 'chats',
                data: { id: chat.id }
            }))

            if (deleteActions.length > 0) {
                await postToGAS(deleteActions)
            }

            toast({ title: "Chat berhasil dibersihkan", variant: "success" })
        } catch (e) {
            console.error("Failed to clear chat", e)
            toast({ title: "Gagal membersihkan chat", variant: "destructive" })
            // Revert local state on error? For now, we assume success or user can refresh.
        }
    }

    return (
        <DataContext.Provider value={{
            sekolah, updateSekolah,
            classes, addClass, updateClass, deleteClass,
            students, addStudent, updateStudent, deleteStudent,
            mapel, addMapel, updateMapel, deleteMapel,
            user, updateUser,
            categories, addCategory, updateCategory, deleteCategory,
            weights, saveWeights,
            attendance, saveAttendance,
            assignments, addAssignment, updateAssignment, deleteAssignment,
            grades, saveGrades,
            badges, challenges, addPoints, giveBadge,
            addBadge, editBadge, deleteBadge,
            addChallenge, deleteChallenge, markChallengeComplete, markBatchChallengeComplete,
            posts, addPost, deletePost, togglePostStatus, addComment,
            notifications, addNotification, markNotificationAsRead,
            chats, addChat, markChatRead, clearChat,
            isLoaded,
            isSyncing, syncError, forceSync,
            refreshData
        }}>
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    const context = React.useContext(DataContext)
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider")
    }
    return context
}
