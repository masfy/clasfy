"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const members = [
    { id: 1, name: "Alice", image: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Bob", image: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Charlie", image: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "David", image: "https://i.pravatar.cc/150?u=4" },
    { id: 5, name: "Eve", image: "https://i.pravatar.cc/150?u=5" },
]

export function MemberSection() {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Clasfy <span className="text-muted-foreground font-normal text-lg">• Class Administration Simplify</span></h1>
                <p className="text-sm text-primary mt-1">Integrasi Kelas, Koneksi Tanpa Batas.</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80">
                        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                    </Button>

                    <div className="flex -space-x-2">
                        {members.map((member) => (
                            <Avatar key={member.id} className="border-2 border-background h-10 w-10">
                                <AvatarImage src={member.image} alt={member.name} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>

                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>

                <Button className="bg-muted text-foreground hover:bg-muted/80 rounded-full px-6">
                    <Plus className="mr-2 h-4 w-4" />
                    Add employee
                </Button>
            </div>
        </div>
    )
}
