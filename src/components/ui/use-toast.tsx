"use client"

import * as React from "react"
import { X } from "lucide-react"

type ToastType = "default" | "destructive" | "success" | "dynamic-island"

interface Toast {
    id: string
    title?: string
    description?: string
    variant?: ToastType
}

interface ToastContextType {
    toasts: Toast[]
    toast: (props: Omit<Toast, "id">) => void
    dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([])

    const toast = React.useCallback(({ title, description, variant = "default" }: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { id, title, description, variant }])

        // Auto dismiss after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 3000)
    }, [])

    const dismiss = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center w-full max-w-md px-4 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              shadow-lg transition-all animate-in slide-in-from-top-full pointer-events-auto
              flex items-center justify-between gap-4 border
              ${t.variant === "success" ? "w-full rounded-lg p-4 bg-emerald-50 border-emerald-200 text-emerald-900" : ""}
              ${t.variant === "destructive" ? "w-full rounded-lg p-4 bg-red-50 border-red-200 text-red-900" : ""}
              ${t.variant === "default" ? "w-full rounded-lg p-4 bg-white border-slate-200 text-slate-900" : ""}
              ${t.variant === "dynamic-island" ? "w-auto min-w-[200px] rounded-full py-3 px-6 bg-primary border-primary/20 text-primary-foreground shadow-xl shadow-primary/20" : ""}
            `}
                    >
                        <div className="grid gap-1">
                            {t.title && <h5 className={`text-sm font-semibold ${t.variant === "dynamic-island" ? "text-center text-xs tracking-wide" : ""}`}>{t.title}</h5>}
                            {t.description && <p className={`text-sm opacity-90 ${t.variant === "dynamic-island" ? "hidden" : ""}`}>{t.description}</p>}
                        </div>
                        {t.variant !== "dynamic-island" && (
                            <button
                                onClick={() => dismiss(t.id)}
                                className={`
                                hover:opacity-70 transition-opacity
                                ${t.variant === "default" ? "text-slate-500" : "text-current"}
                            `}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = React.useContext(ToastContext)
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
