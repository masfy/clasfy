"use client"

import { useData } from "@/lib/data-context"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export default function GlobalLoader() {
    const { isLoaded } = useData()
    const [show, setShow] = useState(true)

    useEffect(() => {
        if (isLoaded) {
            // Add a small delay before hiding to ensure smooth transition
            const timer = setTimeout(() => setShow(false), 800)
            return () => clearTimeout(timer)
        }
    }, [isLoaded])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md"
                >
                    <div className="relative flex flex-col items-center justify-center">
                        {/* Animated Background Blobs (Mini Version) */}
                        <div className="absolute inset-0 overflow-visible">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/30 rounded-full blur-xl"
                            />
                            <motion.div
                                animate={{
                                    scale: [1.2, 1, 1.2],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5
                                }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-400/20 rounded-full blur-xl"
                            />
                        </div>

                        {/* Logo & Spinner */}
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="relative">
                                {/* Rotating Ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-8px] rounded-full border-2 border-primary/30 border-t-primary w-[calc(100%+16px)] h-[calc(100%+16px)]"
                                />

                                {/* Logo Container */}
                                <div className="h-20 w-20 bg-card rounded-full flex items-center justify-center shadow-lg border border-border relative overflow-hidden">
                                    <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain relative z-10" />
                                </div>
                            </div>

                            {/* Text */}
                            <div className="flex flex-col items-center gap-1">
                                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                                    Clasfy
                                </h3>
                                <p className="text-xs text-muted-foreground animate-pulse">
                                    Menyiapkan Data...
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
