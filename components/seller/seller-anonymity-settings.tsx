"use client"

import { useState } from "react"
import { Shield, Eye, EyeOff, Info } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Switch,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui-kit"
import { useForm } from "react-hook-form"

// Mock data for anonymity settings
const initialAnonymitySettings = {
  anonymousMode: true,
  displayName: "Fresh Produce Supplier #28491",
  locationPrivacy: "region", // "exact", "region", "hidden"
  contactPrivacy: "platform", // "direct", "platform", "request"
  inventoryVisibility: "verified", // "all", "verified", "request"
  allowDirectMessages: true,
  allowRatings: true,
  allowReviews: false,
}

export function SellerAnonymitySettings() {
  const [settings, setSettings] = useState(initialAnonymitySettings)
  
  const form = useForm({
    defaultValues: initialAnonymitySettings,
  })

  const onSubmit = (data: typeof initialAnonymitySettings) => {
    setSettings(data)
    // In a real app, this would save to the backend
    console.log("Saving anonymity settings:", data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Anonymity Settings</h2>
          <p className="text-muted-foreground">
            Control how your business information is displayed to buyers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Anonymous Mode</span>
          <Switch 
            checked={settings.anonymousMode} 
            onCheckedChange={(checked) => setSettings({...settings, anonymousMode: checked})}
          />
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile Visibility</TabsTrigger>
          <TabsTrigger value="contact">Contact Settings</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Visibility Settings</CardTitle>
              <CardDescription>
                Control how your business profile appears to buyers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the name that will be displayed to buyers. Use a generic name to maintain anonymity.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="locationPrivacy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Privacy</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location privacy level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="exact">Exact Location (City, State)</SelectItem>
                            <SelectItem value="region">Region Only (State/Province)</SelectItem>
                            <SelectItem value="hidden">Hidden Location</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Control how precisely your location is displayed to buyers
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="allowRatings"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Allow Ratings</FormLabel>
                            <FormDescription>
                              Let buyers rate their transaction experience
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="allowReviews"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Allow Reviews</FormLabel>
                            <FormDescription>
                              Let buyers leave written reviews about transactions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Save Profile Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Privacy Settings</CardTitle>
              <CardDescription>
                Control how buyers can contact you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="contactPrivacy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Method</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select contact privacy level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="direct">Direct Contact (Show Email/Phone)</SelectItem>
                            <SelectItem value="platform">Platform Messaging Only</SelectItem>
                            <SelectItem value="request">Require Contact Request</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Control how buyers can contact you about listings
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center space-x-4">
                    <FormField
                      control={form.control}
                      name="allowDirectMessages"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 w-full">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Allow Direct Messages</FormLabel>
                            <FormDescription>
                              Let buyers send you direct messages through the platform
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Save Contact Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Privacy Settings</CardTitle>
              <CardDescription>
                Control who can view your inventory and listings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="inventoryVisibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory Visibility</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select inventory visibility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">Visible to All Buyers</SelectItem>
                            <SelectItem value="verified">Verified Buyers Only</SelectItem>
                            <SelectItem value="request">Require Access Request</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Control which buyers can see your inventory listings
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Save Inventory Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader className="bg-amber-50 border-b">
          <div className="flex items-start space-x-4">
            <Shield className="h-6 w-6 text-amber-600" />
            <div>
              <CardTitle>Anonymity Protection</CardTitle>
              <CardDescription>
                Your business identity is protected by our anonymity system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Eye className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">What Buyers Can See</h4>
                  <p className="text-sm text-muted-foreground">
                    Your display name, general location, product listings, and transaction ratings
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <EyeOff className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium">What Buyers Cannot See</h4>
                  <p className="text-sm text-muted-foreground">
                    Your real business name, exact address, contact information, and financial details
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Anonymity Tip</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                For maximum anonymity, use a generic display name, set location privacy to "Region Only" or "Hidden", 
                and set contact privacy to "Platform Messaging Only".
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t">
          <div className="flex justify-between items-center w-full">
            <p className="text-sm text-muted-foreground">
              Last updated: May 6, 2025
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Anonymity Status
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">Your anonymity level: High</p>
                  <p className="text-xs text-muted-foreground">Based on your current settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
