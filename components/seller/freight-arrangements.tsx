"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Truck, Calendar, MapPin, Package, Clock, DollarSign, Building, Info, Plus, CheckCircle2, AlertCircle } from "lucide-react"

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Textarea,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
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

// Mock data for freight arrangements
const mockFreightArrangements = [
  {
    id: "freight-1",
    orderNumber: "ORD-12345",
    buyer: "Metro Grocery",
    origin: "Portland, OR",
    destination: "Seattle, WA",
    pickupDate: new Date("2025-05-10"),
    deliveryDate: new Date("2025-05-11"),
    weight: 2500,
    palletCount: 4,
    freightType: "LTL",
    carrier: "XYZ Logistics",
    status: "scheduled",
    cost: 450.00,
  },
  {
    id: "freight-2",
    orderNumber: "ORD-12346",
    buyer: "Sunshine Catering",
    origin: "Portland, OR",
    destination: "San Francisco, CA",
    pickupDate: new Date("2025-05-12"),
    deliveryDate: new Date("2025-05-14"),
    weight: 5000,
    palletCount: 8,
    freightType: "FTL",
    carrier: "ABC Transport",
    status: "in_transit",
    cost: 1200.00,
  },
  {
    id: "freight-3",
    orderNumber: "ORD-12347",
    buyer: "Health Foods Inc.",
    origin: "Portland, OR",
    destination: "Boise, ID",
    pickupDate: new Date("2025-05-15"),
    deliveryDate: new Date("2025-05-16"),
    weight: 1800,
    palletCount: 3,
    freightType: "LTL",
    carrier: "Regional Freight",
    status: "pending",
    cost: 380.00,
  },
  {
    id: "freight-4",
    orderNumber: "ORD-12348",
    buyer: "Restaurant Supply Co.",
    origin: "Portland, OR",
    destination: "Los Angeles, CA",
    pickupDate: new Date("2025-05-08"),
    deliveryDate: new Date("2025-05-10"),
    weight: 4200,
    palletCount: 7,
    freightType: "FTL",
    carrier: "West Coast Shipping",
    status: "delivered",
    cost: 1500.00,
  },
  {
    id: "freight-5",
    orderNumber: "ORD-12349",
    buyer: "Coastal Restaurants",
    origin: "Portland, OR",
    destination: "Vancouver, BC",
    pickupDate: new Date("2025-05-18"),
    deliveryDate: new Date("2025-05-20"),
    weight: 3000,
    palletCount: 5,
    freightType: "LTL",
    carrier: "Northern Express",
    status: "pending",
    cost: 750.00,
  },
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    in_transit: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    delivered: "bg-green-100 text-green-800 hover:bg-green-100",
    canceled: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  const statusLabels = {
    pending: "Pending",
    scheduled: "Scheduled",
    in_transit: "In Transit",
    delivered: "Delivered",
    canceled: "Canceled",
  }

  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles]}>
      {statusLabels[status as keyof typeof statusLabels]}
    </Badge>
  )
}

export function FreightArrangements() {
  const [freightArrangements, setFreightArrangements] = useState(mockFreightArrangements)
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  const form = useForm({
    defaultValues: {
      orderNumber: "",
      buyer: "",
      origin: "Portland, OR",
      destination: "",
      pickupDate: "",
      deliveryDate: "",
      weight: 0,
      palletCount: 0,
      freightType: "LTL",
      carrier: "",
      specialInstructions: "",
      liftGateRequired: false,
      appointmentRequired: true,
      residentialDelivery: false,
      hazardousMaterials: false,
      temperatureControlled: false,
    },
  })
  
  const onSubmit = (data: any) => {
    const newFreightArrangement = {
      id: `freight-${freightArrangements.length + 1}`,
      orderNumber: data.orderNumber,
      buyer: data.buyer,
      origin: data.origin,
      destination: data.destination,
      pickupDate: new Date(data.pickupDate),
      deliveryDate: new Date(data.deliveryDate),
      weight: parseFloat(data.weight),
      palletCount: parseInt(data.palletCount),
      freightType: data.freightType,
      carrier: data.carrier,
      status: "pending",
      cost: 0, // To be calculated or updated later
    }
    
    setFreightArrangements([newFreightArrangement, ...freightArrangements])
    setIsCreateDialogOpen(false)
    form.reset()
  }
  
  const filteredArrangements = freightArrangements.filter(arrangement => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return arrangement.status === "pending"
    if (activeTab === "scheduled") return arrangement.status === "scheduled"
    if (activeTab === "in_transit") return arrangement.status === "in_transit"
    if (activeTab === "delivered") return arrangement.status === "delivered"
    return true
  })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Freight Arrangements</h2>
          <p className="text-muted-foreground">
            Manage shipping and logistics for your orders
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Freight Arrangement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Freight Arrangement</DialogTitle>
              <DialogDescription>
                Set up shipping details for an order
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="orderNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., ORD-12345" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="buyer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buyer</FormLabel>
                        <FormControl>
                          <Input placeholder="Buyer name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pickupDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (lbs)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="palletCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pallet Count</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="freightType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Freight Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select freight type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LTL">Less Than Truckload (LTL)</SelectItem>
                            <SelectItem value="FTL">Full Truckload (FTL)</SelectItem>
                            <SelectItem value="Parcel">Parcel</SelectItem>
                            <SelectItem value="Expedited">Expedited</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="carrier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Carrier (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Carrier name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Leave blank to use our recommended carriers
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="specialInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special handling or delivery instructions" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Additional Requirements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="liftGateRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Lift Gate Required</FormLabel>
                            <FormDescription>
                              Delivery location does not have a loading dock
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="appointmentRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Appointment Required</FormLabel>
                            <FormDescription>
                              Delivery requires scheduled appointment
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="residentialDelivery"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Residential Delivery</FormLabel>
                            <FormDescription>
                              Delivery to a residential address
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="temperatureControlled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Temperature Controlled</FormLabel>
                            <FormDescription>
                              Requires refrigerated or temperature-controlled transport
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Freight Quote</AlertTitle>
                  <AlertDescription>
                    After submitting this form, we'll provide freight quotes from our carrier network.
                    You'll be able to select and book the preferred option.
                  </AlertDescription>
                </Alert>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Arrangement</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Shipments</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="in_transit">In Transit</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArrangements.length > 0 ? (
                  filteredArrangements.map((arrangement) => (
                    <TableRow key={arrangement.id}>
                      <TableCell className="font-medium">
                        {arrangement.orderNumber}
                      </TableCell>
                      <TableCell>{arrangement.buyer}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>From: {arrangement.origin}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>To: {arrangement.destination}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>Pickup: {format(arrangement.pickupDate, "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>Delivery: {format(arrangement.deliveryDate, "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm">
                            <Package className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{arrangement.weight} lbs, {arrangement.palletCount} pallets</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Truck className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{arrangement.freightType}, {arrangement.carrier}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${arrangement.cost.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={arrangement.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                      No freight arrangements found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Freight Options</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Less Than Truckload (LTL)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Full Truckload (FTL)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Parcel Shipping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Expedited Shipping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Temperature-Controlled</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <Building className="h-4 w-4 text-green-600" />
              </div>
              <CardTitle className="text-lg">Carrier Network</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>50+ vetted carriers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Nationwide coverage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Competitive rates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Real-time tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Insurance options</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-2 rounded-full">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Pricing Benefits</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Volume discounts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Transparent pricing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>No hidden fees</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Multiple quotes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Consolidated billing</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Need Help?</AlertTitle>
        <AlertDescription>
          Our logistics team is available to assist with complex shipping arrangements.
          Contact us at <span className="font-medium">logistics@pickle.com</span> or call <span className="font-medium">(800) 555-1234</span>.
        </AlertDescription>
      </Alert>
    </div>
  )
}
