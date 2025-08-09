"use client"

import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

type Crumb = { label: string; href?: string }

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumb?: Crumb[]
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, breadcrumb, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1
              return (
                <React.Fragment key={`${item.label}-${index}`}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href || "#"}>{item.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export default PageHeader

