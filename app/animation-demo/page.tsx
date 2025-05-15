import { PageTransition, StaggeredList } from "@/components/ui/page-transition"
import { animations } from "@/lib/animations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AnimationDemoPage() {
  return (
    <PageTransition>
      <div className="container py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Animation Demo</h1>
          <p className="text-muted-foreground">
            A demonstration of the CSS-based animation system.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Entrance Animations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Fade In</p>
                <div className="h-20 bg-muted rounded-md flex items-center justify-center">
                  <div className={animations.fadeIn}>
                    Fade In Animation
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Fade Up</p>
                <div className="h-20 bg-muted rounded-md flex items-center justify-center">
                  <div className={animations.fadeInUp}>
                    Fade Up Animation
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Scale</p>
                <div className="h-20 bg-muted rounded-md flex items-center justify-center">
                  <div className={animations.scale}>
                    Scale Animation
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Staggered List</CardTitle>
            </CardHeader>
            <CardContent>
              <StaggeredList>
                {Array.from({ length: 5 }).map((_, index) => (
                  <div 
                    key={index}
                    className="bg-card p-3 rounded-md mb-2 shadow-sm"
                  >
                    List Item {index + 1}
                  </div>
                ))}
              </StaggeredList>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hover Animations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Hover Scale</p>
                <div className="h-20 bg-muted rounded-md flex items-center justify-center">
                  <div className={animations.hoverScale}>
                    Hover Me (Scale)
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Hover Lift</p>
                <div className="h-20 bg-muted rounded-md flex items-center justify-center">
                  <div className={animations.hoverLift}>
                    Hover Me (Lift)
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Button with Hover</p>
                <div className="h-20 bg-muted rounded-md flex items-center justify-center">
                  <Button className={animations.hoverScale}>
                    Hover Scale Button
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Continuous Animations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Pulse</p>
                <div className="h-20 bg-muted rounded-md flex items-center justify-center">
                  <div className={animations.pulse}>
                    Pulse Animation
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Bounce</p>
                <div className="h-20 bg-muted rounded-md flex items-center justify-center">
                  <div className={animations.bounce}>
                    Bounce Animation
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
