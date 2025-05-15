"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, Settings } from "lucide-react"

export function ButtonShowcase() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buttons</CardTitle>
        <CardDescription>
          Button variants and sizes used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Brand Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Button brand="dill">Dill</Button>
            <Button brand="pickle">Pickle</Button>
            <Button brand="mustard">Mustard</Button>
            <Button brand="beige">Beige</Button>
            <Button brand="olive">Olive</Button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sizes</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
            <Button size="icon"><Settings /></Button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">States</h3>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">With Icons</h3>
          <div className="flex flex-wrap gap-4">
            <Button leftIcon={<Plus />}>Left Icon</Button>
            <Button rightIcon={<ArrowRight />}>Right Icon</Button>
            <Button leftIcon={<Settings />} rightIcon={<ArrowRight />}>Both Icons</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
