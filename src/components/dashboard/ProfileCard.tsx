"use client"

import * as React from "react"
import { Phone, Mail } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ProfileCard() {
    return (
        <Card className="relative overflow-hidden border-none bg-primary p-0 h-[320px]">
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

            {/* User Image (Mock) */}
            <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">Milena Page</h2>
                        <p className="text-sm text-gray-300">Frontend Developer</p>
                    </div>

                    <div className="flex gap-2">
                        <Button size="icon" className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border-none">
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="icon" className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 border-none">
                            <Mail className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
