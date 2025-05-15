import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PageTransition } from "@/components/ui/page-transition"

export default function DesignPage() {
  return (
    <PageTransition>
      <div className="container py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Pickle Design System</h1>
          <p className="text-muted-foreground">
            A collection of design patterns, components, and animations used throughout the Pickle B2B Marketplace.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Animations</CardTitle>
              <CardDescription>
                Animation patterns and examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Explore the animation system used throughout the application, including entrance animations, 
                hover effects, and staggered animations.
              </p>
              <Button asChild>
                <Link href="/design/animations">View Animations</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Components</CardTitle>
              <CardDescription>
                UI components and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Browse the component library used to build the Pickle B2B Marketplace, including buttons, 
                cards, forms, and more.
              </p>
              <Button asChild>
                <Link href="/design/components">View Components</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
