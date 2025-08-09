"use client"

import React, { useMemo } from "react"
import { cn } from "@/lib/utils"
import { Check, X, Clock, Minus } from "lucide-react"

export type AttendanceStatus = "present" | "absent" | "late" | "excused"

export interface AttendanceRecord {
  date: string // ISO: YYYY-MM-DD
  status: AttendanceStatus
}

function getMonthMatrix(year: number, monthIndexZeroBased: number) {
  const firstDay = new Date(year, monthIndexZeroBased, 1)
  const lastDay = new Date(year, monthIndexZeroBased + 1, 0)
  const start = new Date(firstDay)
  start.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7)) // week starts Monday

  const end = new Date(lastDay)
  end.setDate(lastDay.getDate() + (7 - ((lastDay.getDay() + 6) % 7) - 1))

  const weeks: Date[][] = []
  let cursor = new Date(start)
  while (cursor <= end) {
    const week: Date[] = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

const STATUS_TO_BG: Record<AttendanceStatus, string> = {
  present: "bg-green-500/90",
  absent: "bg-red-500/90",
  late: "bg-yellow-500/90",
  excused: "bg-blue-500/90",
}

const STATUS_TO_LABEL: Record<AttendanceStatus, string> = {
  present: "Geldi",
  absent: "Gelmedi",
  late: "Geç",
  excused: "İzinli",
}

interface AttendanceCalendarProps {
  year?: number
  monthIndexZeroBased?: number
  records: AttendanceRecord[]
  className?: string
}

export function AttendanceCalendar({
  year,
  monthIndexZeroBased,
  records,
  className,
}: AttendanceCalendarProps) {
  const today = new Date()
  const y = year ?? today.getFullYear()
  const m = monthIndexZeroBased ?? today.getMonth()

  const recordMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>()
    for (const r of records) map.set(r.date, r.status)
    return map
  }, [records])

  const matrix = useMemo(() => getMonthMatrix(y, m), [y, m])

  const monthTitle = useMemo(() =>
    new Date(y, m, 1).toLocaleDateString("tr-TR", { month: "long", year: "numeric" }),
  [y, m])

  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold capitalize">{monthTitle}</h4>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground mb-2">
        {weekDays.map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-rows-6 gap-2">
        {matrix.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-2">
            {week.map((day, di) => {
              const inMonth = day.getMonth() === m
              const iso = day.toISOString().slice(0, 10)
              const status = recordMap.get(iso)
              // Monday-first: indices 0..6 → 5,6 are weekend
              const isWeekend = di >= 5

              const baseCircle = "h-7 w-7 rounded-full flex items-center justify-center"

              let circleClass = "bg-transparent border border-gray-200 text-gray-400"
              let Icon: React.ReactNode = null

              if (isWeekend) {
                circleClass = "bg-muted text-muted-foreground"
                Icon = <X className="h-3.5 w-3.5" />
              } else if (status === "present") {
                circleClass = "bg-green-400/80 text-white"
                Icon = <Check className="h-3.5 w-3.5" />
              } else if (status === "absent") {
                circleClass = "bg-orange-500/90 text-white"
                Icon = <X className="h-3.5 w-3.5" />
              } else if (status === "late") {
                circleClass = "bg-yellow-400/80 text-gray-900"
                Icon = <Clock className="h-3.5 w-3.5" />
              } else if (status === "excused") {
                circleClass = "bg-blue-400/80 text-white"
                Icon = <Minus className="h-3.5 w-3.5" />
              }

              return (
                <div key={`${wi}-${di}`} className="flex items-center justify-center">
                  <div className={cn(baseCircle, circleClass)} aria-label={status ? STATUS_TO_LABEL[status] : undefined}>
                    {Icon}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AttendanceCalendar

