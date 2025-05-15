"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function AnimationShowcase() {
  const [key, setKey] = useState(0)

  const resetAnimations = () => {
    setKey(prev => prev + 1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Animations</CardTitle>
        <CardDescription>
          Animation variants used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex justify-end">
          <Button onClick={resetAnimations} variant="outline" size="sm">
            Reset Animations
          </Button>
        </div>

        <Tabs defaultValue="entrance" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="entrance">Entrance Animations</TabsTrigger>
            <TabsTrigger value="hover">Hover Animations</TabsTrigger>
            <TabsTrigger value="continuous">Continuous Animations</TabsTrigger>
            <TabsTrigger value="stagger">Stagger Animations</TabsTrigger>
          </TabsList>

          <TabsContent value="entrance" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2">
                <p className="font-medium">Fade In</p>
                <div className="h-32 rounded-md border bg-card p-4">
                  <div key={`fade-in-${key}`} className={cn("h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-fade-in")}>
                    <span>Fade In</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Fade Up</p>
                <div className="h-32 rounded-md border bg-card p-4">
                  <div key={`fade-up-${key}`} className={cn("h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-fade-up")}>
                    <span>Fade Up</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Fade Down</p>
                <div className="h-32 rounded-md border bg-card p-4">
                  <div key={`fade-down-${key}`} className={cn("h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-fade-down")}>
                    <span>Fade Down</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Fade Left</p>
                <div className="h-32 rounded-md border bg-card p-4">
                  <div key={`fade-left-${key}`} className={cn("h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-fade-left")}>
                    <span>Fade Left</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Fade Right</p>
                <div className="h-32 rounded-md border bg-card p-4">
                  <div key={`fade-right-${key}`} className={cn("h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-fade-right")}>
                    <span>Fade Right</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Scale</p>
                <div className="h-32 rounded-md border bg-card p-4">
                  <div key={`scale-${key}`} className={cn("h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-scale")}>
                    <span>Scale</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hover" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2">
                <p className="font-medium">Hover Scale</p>
                <div className="h-32 rounded-md border bg-card p-4">
                  <div className="h-full w-full rounded-md bg-primary/20 flex items-center justify-center hover-scale cursor-pointer">
                    <span>Hover Me</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Hover Lift</p>
                <div className="h-32 rounded-md border bg-card p-4">
                  <div className="h-full w-full rounded-md bg-primary/20 flex items-center justify-center hover-lift cursor-pointer">
                    <span>Hover Me</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Button with Hover</p>
                <div className="h-32 rounded-md border bg-card p-4 flex items-center justify-center">
                  <Button className="hover-scale">Hover Scale Button</Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Image with Hover</p>
                <div className="h-32 rounded-md border bg-card p-4 flex items-center justify-center">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden hover-scale">
                    <Image
                      src="/placeholder.svg"
                      alt="Placeholder"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="continuous" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2">
                <p className="font-medium">Pulse</p>
                <div className="h-32 rounded-md border bg-card p-4">
                  <div className="h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-pulse">
                    <span>Pulse</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Bounce</p>
                <div className="h-32 rounded-md border bg-card p-4">
                  <div className="h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-bounce">
                    <span>Bounce</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stagger" className="mt-6 space-y-6">
            <div className="space-y-2">
              <p className="font-medium">Stagger Animation</p>
              <div className="rounded-md border bg-card p-4">
                <div key={`stagger-${key}`} className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-stagger-fade-in">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="h-16 rounded-md bg-primary/20 flex items-center justify-center">
                      <span>Item {item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Delayed Animations</p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
                <div className="space-y-2">
                  <p className="text-sm text-center">Delay 100ms</p>
                  <div className="h-16 rounded-md border bg-card p-4">
                    <div key={`delay-100-${key}`} className="h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-fade-in delay-100">
                      <span>100ms</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-center">Delay 200ms</p>
                  <div className="h-16 rounded-md border bg-card p-4">
                    <div key={`delay-200-${key}`} className="h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-fade-in delay-200">
                      <span>200ms</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-center">Delay 300ms</p>
                  <div className="h-16 rounded-md border bg-card p-4">
                    <div key={`delay-300-${key}`} className="h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-fade-in delay-300">
                      <span>300ms</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-center">Delay 400ms</p>
                  <div className="h-16 rounded-md border bg-card p-4">
                    <div key={`delay-400-${key}`} className="h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-fade-in delay-400">
                      <span>400ms</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-center">Delay 500ms</p>
                  <div className="h-16 rounded-md border bg-card p-4">
                    <div key={`delay-500-${key}`} className="h-full w-full rounded-md bg-primary/20 flex items-center justify-center animate-fade-in delay-500">
                      <span>500ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
