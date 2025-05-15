import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimpleDemo() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Simple Demo Page</h1>
      <p className="text-muted-foreground mb-8">
        This is a simple demo page that doesn't rely on complex components.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Feature 1</CardTitle>
            <CardDescription>Description of feature 1</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a simple card that demonstrates the UI components.</p>
          </CardContent>
          <CardFooter>
            <Button>Learn More</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Feature 2</CardTitle>
            <CardDescription>Description of feature 2</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a simple card that demonstrates the UI components.</p>
          </CardContent>
          <CardFooter>
            <Button>Learn More</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Feature 3</CardTitle>
            <CardDescription>Description of feature 3</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a simple card that demonstrates the UI components.</p>
          </CardContent>
          <CardFooter>
            <Button>Learn More</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
