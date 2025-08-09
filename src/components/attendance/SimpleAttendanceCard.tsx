"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface SimpleAttendanceCardProps {
  className?: string
}

// 7 sütun (Mon..Sun), 4 satır: ilk satır gün başlıkları, sonraki 3 satır etkileşimli günler
export default function SimpleAttendanceCard({ className }: SimpleAttendanceCardProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // 3 hafta x 7 gün; sadece Mon–Fri tıklanabilir. true = present, false = absent
  const [grid, setGrid] = useState<boolean[][]>([
    Array.from({ length: 7 }, (_, i) => i < 5),
    Array.from({ length: 7 }, (_, i) => i < 5),
    Array.from({ length: 7 }, (_, i) => i < 5),
  ])

  const toggle = (rowIndex: number, colIndex: number) => {
    if (colIndex >= 5) return // weekend pasif
    setGrid(prev => prev.map((row, r) => (
      r === rowIndex ? row.map((val, c) => (c === colIndex ? !val : val)) : row
    )))
  }

  const GREEN = "#b9fbc0"
  const RED = "#ff8fa3"
  const GREY = "#e0e0e0"

  return (
    <div className={cn(
      "rounded-2xl shadow-sm border border-gray-200 bg-white p-4 md:p-5",
      "bg-gradient-to-br from-white to-green-50/30",
      className,
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Class attendance</h3>
        <select
          className="text-xs rounded-full border border-gray-300 px-3 py-1 bg-white text-gray-700 cursor-not-allowed"
          disabled
        >
          <option>month</option>
        </select>
      </div>

      {/* Gün başlıkları */}
      <div className="grid grid-cols-7 gap-3 text-xs text-gray-500 mb-2">
        {days.map((d) => (
          <div key={d} className="text-center select-none">{d}</div>
        ))}
      </div>

      {/* 3 satır etkileşimli grid */}
      <div className="grid grid-rows-3 gap-3">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-7 gap-3">
            {row.map((isPresent, cIdx) => {
              const isWeekend = cIdx >= 5
              const bg = isWeekend ? GREY : isPresent ? GREEN : RED
              const symbol = isWeekend ? "✖" : isPresent ? "✔" : "✖"

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  type="button"
                  onClick={() => toggle(rIdx, cIdx)}
                  disabled={isWeekend}
                  className={cn(
                    "h-10 w-10 md:h-11 md:w-11 rounded-full flex items-center justify-center",
                    "transition-transform duration-150",
                    isWeekend ? "cursor-not-allowed opacity-80" : "hover:scale-[1.03] active:scale-95",
                  )}
                  style={{ backgroundColor: bg }}
                  aria-label={isWeekend ? "Weekend" : isPresent ? "Present" : "Absent"}
                >
                  <span className={cn("text-sm md:text-base", isWeekend ? "text-gray-600" : "text-gray-800")}>{symbol}</span>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

