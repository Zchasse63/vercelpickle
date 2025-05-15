"use client"

import { useState } from "react"
import { format, addHours, addDays } from "date-fns"
import { Clock, Calendar, Tag, Percent, AlertTriangle, Plus, Trash2, Check, X } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
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
  Badge,
  Switch,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Textarea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui-kit"
import { useForm } from "react-hook-form"

// Mock data for time-sensitive deals
const mockDeals = [
  {
    id: "deal-1",
    title: "Overstock Organic Apples",
    description: "Organic Gala apples, 40 cases available, must sell within 48 hours",
    product: "Organic Gala Apples (Case)",
    originalPrice: 45.00,
    dealPrice: 32.50,
    discount: 28,
    quantity: 40,
    minOrder: 5,
    expiresAt: addHours(new Date(), 48),
    createdAt: new Date(),
    status: "active",
  },
  {
    id: "deal-2",
    title: "Premium Cheese Closeout",
    description: "Artisan cheddar cheese approaching best-by date, excellent condition",
    product: "Artisan Cheddar Cheese (Box)",
    originalPrice: 75.00,
    dealPrice: 52.50,
    discount: 30,
    quantity: 25,
    minOrder: 3,
    expiresAt: addHours(new Date(), 72),
    createdAt: new Date(),
    status: "active",
  },
  {
    id: "deal-3",
    title: "Seasonal Berries Surplus",
    description: "Fresh strawberries, excess inventory from large harvest",
    product: "Organic Strawberries (Flat)",
    originalPrice: 40.00,
    dealPrice: 30.00,
    discount: 25,
    quantity: 50,
    minOrder: 5,
    expiresAt: addHours(new Date(), 24),
    createdAt: new Date(),
    status: "active",
  },
  {
    id: "deal-4",
    title: "Bakery Closeout Special",
    description: "Artisan bread, baked today, must sell by tomorrow",
    product: "Artisan Sourdough Bread (Box)",
    originalPrice: 60.00,
    dealPrice: 36.00,
    discount: 40,
    quantity: 30,
    minOrder: 2,
    expiresAt: addHours(new Date(), 12),
    createdAt: new Date(),
    status: "active",
  },
  {
    id: "deal-5",
    title: "Premium Olive Oil Discount",
    description: "Extra virgin olive oil, bulk purchase opportunity",
    product: "Extra Virgin Olive Oil (Case)",
    originalPrice: 120.00,
    dealPrice: 96.00,
    discount: 20,
    quantity: 15,
    minOrder: 1,
    expiresAt: addDays(new Date(), 5),
    createdAt: new Date(),
    status: "active",
  },
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    expired: "bg-red-100 text-red-800 hover:bg-red-100",
    sold: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  }

  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

// Time remaining component
const TimeRemaining = ({ expiresAt }: { expiresAt: Date }) => {
  const now = new Date()
  const diffMs = expiresAt.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  let color = "text-green-600"
  if (diffHours < 12) color = "text-amber-600"
  if (diffHours < 4) color = "text-red-600"
  
  return (
    <div className="flex items-center">
      <Clock className={`h-4 w-4 mr-1 ${color}`} />
      <span className={`text-sm font-medium ${color}`}>
        {diffHours}h {diffMinutes}m remaining
      </span>
    </div>
  )
}

export function TimeDealsManager() {
  const [deals, setDeals] = useState(mockDeals)
  const [activeTab, setActiveTab] = useState("active")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      product: "",
      originalPrice: 0,
      dealPrice: 0,
      quantity: 0,
      minOrder: 1,
      expiryHours: 48,
      notifyBuyers: true,
      featured: false,
    },
  })
  
  const onSubmit = (data: any) => {
    const discount = Math.round(((data.originalPrice - data.dealPrice) / data.originalPrice) * 100)
    
    const newDeal = {
      id: `deal-${deals.length + 1}`,
      title: data.title,
      description: data.description,
      product: data.product,
      originalPrice: parseFloat(data.originalPrice),
      dealPrice: parseFloat(data.dealPrice),
      discount,
      quantity: parseInt(data.quantity),
      minOrder: parseInt(data.minOrder),
      expiresAt: addHours(new Date(), parseInt(data.expiryHours)),
      createdAt: new Date(),
      status: "active",
    }
    
    setDeals([newDeal, ...deals])
    setIsCreateDialogOpen(false)
    form.reset()
  }
  
  const calculateDiscount = () => {
    const originalPrice = form.watch("originalPrice")
    const dealPrice = form.watch("dealPrice")
    
    if (originalPrice && dealPrice) {
      return Math.round(((originalPrice - dealPrice) / originalPrice) * 100)
    }
    
    return 0
  }
  
  const discount = calculateDiscount()
  
  const filteredDeals = deals.filter(deal => {
    if (activeTab === "active") return deal.status === "active"
    if (activeTab === "expired") return deal.status === "expired"
    if (activeTab === "sold") return deal.status === "sold"
    return true
  })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Time-Sensitive Deals</h2>
          <p className="text-muted-foreground">
            Create and manage limited-time offers for your inventory
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Time-Sensitive Deal</DialogTitle>
              <DialogDescription>
                Create a limited-time offer for quick inventory turnover
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deal Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Overstock Organic Apples" {...field} />
                      </FormControl>
                      <FormDescription>
                        Create a compelling title that highlights the urgency
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the deal, reason for discount, and any important details" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <Input placeholder="Product name and unit" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity Available</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dealPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deal Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <div className="flex h-10 items-center rounded-md border bg-muted px-3">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <span className="ml-2 font-medium">{discount}%</span>
                    </div>
                  </FormItem>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Order Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum quantity a buyer must purchase
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expiryHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deal Duration (hours)</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="12">12 hours</SelectItem>
                            <SelectItem value="24">24 hours</SelectItem>
                            <SelectItem value="48">48 hours</SelectItem>
                            <SelectItem value="72">72 hours</SelectItem>
                            <SelectItem value="120">5 days</SelectItem>
                            <SelectItem value="168">7 days</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How long the deal will be available
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="notifyBuyers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notify Buyers</FormLabel>
                          <FormDescription>
                            Send notifications to relevant buyers
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
                  
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured Deal</FormLabel>
                          <FormDescription>
                            Highlight in the marketplace
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
                
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Time-sensitive deals cannot be edited after creation. They can only be canceled if no orders have been placed.
                  </AlertDescription>
                </Alert>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Deal</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Deals</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="sold">Sold Out</TabsTrigger>
          <TabsTrigger value="all">All Deals</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.length > 0 ? (
                  filteredDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell className="font-medium">
                        <div>
                          {deal.title}
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {deal.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{deal.product}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-medium">${deal.dealPrice.toFixed(2)}</span>
                          <span className="text-xs text-muted-foreground line-through">
                            ${deal.originalPrice.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-green-50">
                          {deal.discount}% OFF
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span>{deal.quantity} available</span>
                          <span className="text-xs text-muted-foreground">
                            Min order: {deal.minOrder}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{format(deal.expiresAt, "MMM d, h:mm a")}</span>
                          <TimeRemaining expiresAt={deal.expiresAt} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={deal.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                      No deals found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex items-start space-x-4">
            <Clock className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>About Time-Sensitive Deals</CardTitle>
              <CardDescription>
                Create limited-time offers to move inventory quickly
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-2 border rounded-lg p-4">
                <h4 className="font-medium flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-blue-600" />
                  Quick Inventory Turnover
                </h4>
                <p className="text-sm text-muted-foreground">
                  Perfect for moving overstock, seasonal items, or products approaching expiration dates.
                </p>
              </div>
              
              <div className="flex flex-col space-y-2 border rounded-lg p-4">
                <h4 className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  Limited-Time Offers
                </h4>
                <p className="text-sm text-muted-foreground">
                  Create urgency with time-limited deals that encourage quick purchasing decisions.
                </p>
              </div>
              
              <div className="flex flex-col space-y-2 border rounded-lg p-4">
                <h4 className="font-medium flex items-center">
                  <Percent className="h-4 w-4 mr-2 text-blue-600" />
                  Special Pricing
                </h4>
                <p className="text-sm text-muted-foreground">
                  Offer discounted prices to attract buyers while still maintaining reasonable margins.
                </p>
              </div>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Best Practices</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Set realistic timeframes based on product shelf life</li>
                  <li>Price deals competitively but maintain reasonable margins</li>
                  <li>Use compelling descriptions that explain the value and urgency</li>
                  <li>Consider minimum order quantities to ensure efficiency</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
