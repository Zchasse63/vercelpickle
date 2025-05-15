"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { Calendar, Clock, MapPin, Package, Truck, Plus, CheckCircle2, AlertCircle, Info } from "lucide-react"

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

// Mock data for pickup schedules
const mockPickupSchedules = [
  {
    id: "pickup-1",
    orderNumber: "ORD-12345",
    buyer: "Metro Grocery",
    location: "Warehouse A, Portland, OR",
    date: addDays(new Date(), 2),
    timeWindow: "9:00 AM - 12:00 PM",
    items: "Organic Apples (4 pallets)",
    status: "scheduled",
    notes: "Please use loading dock #3",
  },
  {
    id: "pickup-2",
    orderNumber: "ORD-12346",
    buyer: "Sunshine Catering",
    location: "Warehouse A, Portland, OR",
    date: addDays(new Date(), 3),
    timeWindow: "1:00 PM - 4:00 PM",
    items: "Premium Cheese (2 pallets), Artisan Bread (1 pallet)",
    status: "confirmed",
    notes: "Buyer will send their own truck",
  },
  {
    id: "pickup-3",
    orderNumber: "ORD-12347",
    buyer: "Health Foods Inc.",
    location: "Warehouse B, Portland, OR",
    date: addDays(new Date(), 5),
    timeWindow: "8:00 AM - 10:00 AM",
    items: "Organic Spinach (3 pallets)",
    status: "pending",
    notes: "Temperature-controlled vehicle required",
  },
  {
    id: "pickup-4",
    orderNumber: "ORD-12348",
    buyer: "Restaurant Supply Co.",
    location: "Warehouse A, Portland, OR",
    date: addDays(new Date(), 1),
    timeWindow: "2:00 PM - 5:00 PM",
    items: "Grass-Fed Beef (7 pallets)",
    status: "completed",
    notes: "Picked up at 3:30 PM",
  },
  {
    id: "pickup-5",
    orderNumber: "ORD-12349",
    buyer: "Coastal Restaurants",
    location: "Warehouse B, Portland, OR",
    date: addDays(new Date(), 4),
    timeWindow: "10:00 AM - 2:00 PM",
    items: "Fresh Seafood (5 pallets)",
    status: "scheduled",
    notes: "Expedited pickup, please have items ready by 9:30 AM",
  },
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    confirmed: "bg-green-100 text-green-800 hover:bg-green-100",
    completed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    canceled: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  const statusLabels = {
    pending: "Pending",
    scheduled: "Scheduled",
    confirmed: "Confirmed",
    completed: "Completed",
    canceled: "Canceled",
  }

  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles]}>
      {statusLabels[status as keyof typeof statusLabels]}
    </Badge>
  )
}

export function PickupScheduling() {
  const [pickupSchedules, setPickupSchedules] = useState(mockPickupSchedules)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  // Filter schedules based on active tab
  const filteredSchedules = pickupSchedules.filter(schedule => {
    if (activeTab === "upcoming") {
      return schedule.status === "scheduled" || schedule.status === "confirmed" || schedule.status === "pending"
    }
    if (activeTab === "completed") return schedule.status === "completed"
    if (activeTab === "canceled") return schedule.status === "canceled"
    return true
  })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pickup Scheduling</h2>
          <p className="text-muted-foreground">
            Manage pickup appointments for your orders
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Pickup
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Pickup</DialogTitle>
              <DialogDescription>
                Create a pickup appointment for an order
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="orderNumber" className="text-right text-sm font-medium">
                  Order Number
                </label>
                <Input
                  id="orderNumber"
                  placeholder="e.g., ORD-12345"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="buyer" className="text-right text-sm font-medium">
                  Buyer
                </label>
                <Input
                  id="buyer"
                  placeholder="Buyer name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="location" className="text-right text-sm font-medium">
                  Pickup Location
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse-a">Warehouse A, Portland, OR</SelectItem>
                    <SelectItem value="warehouse-b">Warehouse B, Portland, OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="date" className="text-right text-sm font-medium">
                  Pickup Date
                </label>
                <Input
                  id="date"
                  type="date"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="timeWindow" className="text-right text-sm font-medium">
                  Time Window
                </label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select time window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">9:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="afternoon">1:00 PM - 4:00 PM</SelectItem>
                    <SelectItem value="custom">Custom Time Window</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="items" className="text-right text-sm font-medium">
                  Items
                </label>
                <Input
                  id="items"
                  placeholder="Items and quantities"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="notes" className="text-right text-sm font-medium">
                  Notes
                </label>
                <Input
                  id="notes"
                  placeholder="Special instructions or requirements"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => setIsCreateDialogOpen(false)}>
                Schedule Pickup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Pickups</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
          <TabsTrigger value="all">All Pickups</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">
                        {schedule.orderNumber}
                      </TableCell>
                      <TableCell>{schedule.buyer}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{schedule.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{format(schedule.date, "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{schedule.timeWindow}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{schedule.items}</span>
                        </div>
                        {schedule.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Note: {schedule.notes}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={schedule.status} />
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
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No pickup schedules found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pickup Guidelines</CardTitle>
            <CardDescription>
              Important information for smooth pickups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                Scheduling Windows
              </h4>
              <p className="text-sm text-muted-foreground">
                Pickups can be scheduled Monday-Friday, 8:00 AM - 5:00 PM. Please schedule at least 24 hours in advance.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Truck className="h-4 w-4 mr-2 text-blue-600" />
                Loading Requirements
              </h4>
              <p className="text-sm text-muted-foreground">
                Our warehouses have standard loading docks. Please ensure your carrier has appropriate equipment.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Package className="h-4 w-4 mr-2 text-blue-600" />
                Preparation
              </h4>
              <p className="text-sm text-muted-foreground">
                All items will be palletized and ready for pickup during the scheduled window. Please arrive on time.
              </p>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Need to Reschedule?</AlertTitle>
              <AlertDescription>
                Please provide at least 12 hours notice for any schedule changes.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Locations</CardTitle>
            <CardDescription>
              Our pickup locations and hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 border-b pb-4">
              <h4 className="font-medium">Warehouse A</h4>
              <p className="text-sm text-muted-foreground">
                123 Distribution Way, Portland, OR 97230
              </p>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Hours: Monday-Friday, 7:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center text-sm">
                <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Loading Docks: 6 standard, 2 refrigerated</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Warehouse B</h4>
              <p className="text-sm text-muted-foreground">
                456 Logistics Parkway, Portland, OR 97211
              </p>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Hours: Monday-Friday, 8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-center text-sm">
                <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Loading Docks: 4 standard, 3 refrigerated</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              View Map & Directions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
