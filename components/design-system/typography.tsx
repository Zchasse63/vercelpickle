"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Typography() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Typography</CardTitle>
        <CardDescription>
          Font styles used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Headings</h3>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <h1 className="text-5xl font-bold tracking-tighter">Heading 1</h1>
              <span className="text-sm text-muted-foreground">3rem / 48px</span>
            </div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-4xl font-bold tracking-tighter">Heading 2</h2>
              <span className="text-sm text-muted-foreground">2.25rem / 36px</span>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-3xl font-bold tracking-tighter">Heading 3</h3>
              <span className="text-sm text-muted-foreground">1.5rem / 24px</span>
            </div>
            <div className="flex items-baseline justify-between">
              <h4 className="text-2xl font-semibold tracking-tight">Heading 4</h4>
              <span className="text-sm text-muted-foreground">1.25rem / 20px</span>
            </div>
            <div className="flex items-baseline justify-between">
              <h5 className="text-xl font-semibold tracking-tight">Heading 5</h5>
              <span className="text-sm text-muted-foreground">1rem / 16px</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Body Text</h3>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <p className="text-lg">Large Body Text</p>
              <span className="text-sm text-muted-foreground">1.125rem / 18px</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p>Regular Body Text</p>
              <span className="text-sm text-muted-foreground">1rem / 16px</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-sm">Small Body Text</p>
              <span className="text-sm text-muted-foreground">0.875rem / 14px</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-xs">Extra Small Body Text</p>
              <span className="text-sm text-muted-foreground">0.75rem / 12px</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Font Weights</h3>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <p className="font-light">Light Text</p>
              <span className="text-sm text-muted-foreground">font-light (300)</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="font-normal">Regular Text</p>
              <span className="text-sm text-muted-foreground">font-normal (400)</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="font-medium">Medium Text</p>
              <span className="text-sm text-muted-foreground">font-medium (500)</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="font-semibold">Semibold Text</p>
              <span className="text-sm text-muted-foreground">font-semibold (600)</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="font-bold">Bold Text</p>
              <span className="text-sm text-muted-foreground">font-bold (700)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
