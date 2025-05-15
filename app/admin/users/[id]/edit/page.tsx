"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const unwrappedParams = use(Promise.resolve(params))
  const id = unwrappedParams.id
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    role: "Buyer",
    status: "Active",
    company: "Example Company",
    address: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "United States",
    },
    twoFactorEnabled: false,
    notes: "Regular customer with good payment history.",
  })
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setUserData(prev => ({
      ...prev,
      [id]: value
    }))
  }
  
  // Handle address input changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const field = id.split("-")[1] // Extract the address field from the id (e.g., "address-street" -> "street")
    
    setUserData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }))
  }
  
  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Handle switch changes
  const handleSwitchChange = (field: string, checked: boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: checked
    }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect back to user details page
      router.push(`/admin/users/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto py-10" data-testid="edit-user-page">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/users/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to user</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit User</h1>
          <p className="text-muted-foreground">Update user information</p>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update the user's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/images/avatars/01.png" alt={userData.name} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                </div>
                
                <Separator />
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      data-testid="user-name-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      data-testid="user-email-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      data-testid="user-phone-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={userData.company}
                      onChange={handleInputChange}
                      data-testid="user-company-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={userData.role}
                      onValueChange={(value) => handleSelectChange("role", value)}
                      data-testid="user-role-select"
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Seller">Seller</SelectItem>
                        <SelectItem value="Buyer">Buyer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={userData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                      data-testid="user-status-select"
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>Update the user's address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address-street">Street Address</Label>
                    <Input
                      id="address-street"
                      value={userData.address.street}
                      onChange={handleAddressChange}
                      data-testid="user-street-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-city">City</Label>
                    <Input
                      id="address-city"
                      value={userData.address.city}
                      onChange={handleAddressChange}
                      data-testid="user-city-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-state">State/Province</Label>
                    <Input
                      id="address-state"
                      value={userData.address.state}
                      onChange={handleAddressChange}
                      data-testid="user-state-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-zip">Postal Code</Label>
                    <Input
                      id="address-zip"
                      value={userData.address.zip}
                      onChange={handleAddressChange}
                      data-testid="user-zip-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-country">Country</Label>
                    <Input
                      id="address-country"
                      value={userData.address.country}
                      onChange={handleAddressChange}
                      data-testid="user-country-input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage the user's security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to the account
                      </p>
                    </div>
                    <Switch
                      checked={userData.twoFactorEnabled}
                      onCheckedChange={(checked) => handleSwitchChange("twoFactorEnabled", checked)}
                      data-testid="two-factor-switch"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-reset">Password Reset</Label>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-1">
                        Send Reset Link
                      </Button>
                      <Button type="button" variant="outline" className="flex-1">
                        Reset Password
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
                <CardDescription>Add private notes about this user</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    rows={5}
                    value={userData.notes}
                    onChange={handleInputChange}
                    placeholder="Add notes about this user..."
                    data-testid="user-notes-input"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href={`/admin/users/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} data-testid="save-user-button">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
