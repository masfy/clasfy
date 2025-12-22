"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export function AttendanceRadialChart() {
    const data = [
        { name: "Hadir", value: 90, fill: "#4ade80" },
        { name: "Izin", value: 5, fill: "#60a5fa" },
        { name: "Sakit", value: 3, fill: "#facc15" },
        { name: "Alpha", value: 2, fill: "#f87171" },
    ]

    return (
        <Card className="bg-card border-none text-foreground h-full flex flex-col">
            <CardHeader className="pb-0">
                <CardTitle className="text-lg font-semibold">Rekap Kehadiran</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center pb-6">
                <div className="h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--popover)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--popover-foreground)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <p className="text-3xl font-bold">98%</p>
                        <p className="text-xs text-muted-foreground">Kehadiran</p>
                    </div>
                </div>

                {/* Custom Legend Bottom */}
                <div className="grid grid-cols-4 gap-2 w-full mt-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className="flex items-center gap-1 mb-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                                <span className="text-xs text-muted-foreground">{item.name}</span>
                            </div>
                            <span className="text-sm font-bold">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
