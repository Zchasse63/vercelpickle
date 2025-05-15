import { PageTransition } from "@/components/ui/page-transition"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ComponentsPage() {
  return (
    <PageTransition>
      <div className="container py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Components</h1>
          <p className="text-muted-foreground">
            UI components used throughout the Pickle B2B Marketplace.
          </p>
        </div>
        
        <Tabs defaultValue="buttons" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buttons" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>
                  Button components with different variants and sizes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Button Variants</p>
                  <div className="flex flex-wrap gap-4">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Button Sizes</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="lg">Large</Button>
                    <Button>Default</Button>
                    <Button size="sm">Small</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cards" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cards</CardTitle>
                <CardDescription>
                  Card components for displaying content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card description</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Card content goes here.</p>
                    </CardContent>
                    <CardFooter>
                      <Button>Action</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card description</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Card content goes here.</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Cancel</Button>
                      <Button>Submit</Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="forms" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Forms</CardTitle>
                <CardDescription>
                  Form components for user input.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    
                    <Button className="w-full">Submit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
