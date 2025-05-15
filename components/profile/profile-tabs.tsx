"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export interface ProfileTab {
  id: string
  label: string
  content: React.ReactNode
  testId?: string
}

interface ProfileTabsProps {
  tabs: ProfileTab[]
  defaultTab?: string
  className?: string
  testId?: string
}

/**
 * ProfileTabs component
 * 
 * A component for creating tabbed navigation in profile pages.
 */
export function ProfileTabs({
  tabs,
  defaultTab,
  className,
  testId,
}: ProfileTabsProps) {
  const defaultValue = defaultTab || tabs[0]?.id || ""
  
  return (
    <Tabs 
      defaultValue={defaultValue} 
      className={cn("space-y-6", className)}
      data-testid={testId}
    >
      <TabsList className={cn("grid", `grid-cols-${Math.min(tabs.length, 6)}`)}>
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id}
            data-testid={tab.testId || `${testId}-${tab.id}-tab`}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent 
          key={tab.id} 
          value={tab.id}
          data-testid={`${testId}-${tab.id}-content`}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
