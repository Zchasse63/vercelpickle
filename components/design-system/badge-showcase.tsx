"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function BadgeShowcase() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Badges</CardTitle>
        <CardDescription>
          Badge variants used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Brand Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Badge variant="dill">Dill</Badge>
            <Badge variant="pickle">Pickle</Badge>
            <Badge variant="mustard">Mustard</Badge>
            <Badge variant="beige">Beige</Badge>
            <Badge variant="olive">Olive</Badge>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Usage Examples</h3>
          <div className="flex flex-wrap gap-4">
            <Badge>New</Badge>
            <Badge variant="secondary">Featured</Badge>
            <Badge variant="destructive">Out of Stock</Badge>
            <Badge variant="outline">12</Badge>
            <Badge variant="dill">Organic</Badge>
            <Badge variant="pickle">Local</Badge>
            <Badge variant="mustard">Sale</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
