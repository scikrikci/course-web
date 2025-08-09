"use client"

import React from "react"
import { cn } from "@/lib/utils"

type PageContainerProps = React.PropsWithChildren<{ className?: string }>

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("px-4 py-6 md:px-8 lg:px-10 space-y-6", className)}>
      {children}
    </div>
  )
}

export default PageContainer

