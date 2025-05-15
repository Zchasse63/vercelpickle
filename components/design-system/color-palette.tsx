"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ColorSampleProps {
  name: string
  hex: string
  className: string
  textClassName?: string
}

export function ColorSample({ name, hex, className, textClassName }: ColorSampleProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className={cn("h-16 w-full rounded-md", className)} />
      <div className="space-y-1">
        <p className="font-medium">{name}</p>
        <p className={cn("text-sm text-muted-foreground", textClassName)}>{hex}</p>
      </div>
    </div>
  )
}

export function ColorPalette() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Color Palette</CardTitle>
        <CardDescription>
          The official color palette for the Pickle B2B Marketplace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <ColorSample
            name="Dill Green"
            hex="#194D33"
            className="bg-dill-green"
            textClassName="text-dill-green"
          />
          <ColorSample
            name="Pickle Green"
            hex="#5A9A3D"
            className="bg-pickle-green"
            textClassName="text-pickle-green"
          />
          <ColorSample
            name="Golden Mustard"
            hex="#F3B522"
            className="bg-golden-mustard"
            textClassName="text-golden-mustard"
          />
          <ColorSample
            name="Brined Beige"
            hex="#F1E5C3"
            className="bg-brined-beige"
            textClassName="text-brined-beige"
          />
          <ColorSample
            name="Smoked Olive"
            hex="#A09A84"
            className="bg-smoked-olive"
            textClassName="text-smoked-olive"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function ThemeColorPalette() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Colors</CardTitle>
        <CardDescription>
          Semantic colors used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <ColorSample
            name="Primary"
            hex="hsl(var(--primary))"
            className="bg-primary"
            textClassName="text-primary"
          />
          <ColorSample
            name="Secondary"
            hex="hsl(var(--secondary))"
            className="bg-secondary"
            textClassName="text-secondary"
          />
          <ColorSample
            name="Accent"
            hex="hsl(var(--accent))"
            className="bg-accent"
            textClassName="text-accent"
          />
          <ColorSample
            name="Muted"
            hex="hsl(var(--muted))"
            className="bg-muted"
            textClassName="text-muted"
          />
          <ColorSample
            name="Background"
            hex="hsl(var(--background))"
            className="bg-background border"
            textClassName="text-background"
          />
        </div>
      </CardContent>
    </Card>
  )
}
