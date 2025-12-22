"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CustomModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export function CustomModal({ isOpen, onClose, title, children }: CustomModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                <Card className="bg-background border-border text-foreground shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
                        <CardTitle className="text-lg font-bold">{title}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted">
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
