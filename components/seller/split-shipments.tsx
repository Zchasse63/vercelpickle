"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Split, Truck, Calendar, MapPin, Package, Clock, AlertCircle, Info, Plus } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
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
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui-kit"

// Mock data for split shipments
const mockSplitShipments = [
  {
    id: "split-1",
    orderNumber: "ORD-12345",
    buyer: "Metro Grocery",
    totalItems: 6,
    shipments: [
      {
        id: "ship-1a",
        items: "Organic Apples (2 pallets)",
        destination: "Seattle, WA",
        date: new Date("2025-05-10"),
        status: "scheduled",
      },
      {
        id: "ship-1b",
        items: "Organic Berries (1 pallet)",
        destination: "Seattle, WA",
        date: new Date("2025-05-12"),
        status: "pending",
      },
      {
        id: "ship-1c",
        items: "Organic Citrus (3 pallets)",
        destination: "Tacoma, WA",
        date: new Date("2025-05-15"),
        status: "pending",
      },
    ],
    status: "in_progress",
  },
  {
    id: "split-2",
    orderNumber: "ORD-12346",
    buyer: "Sunshine Catering",
    totalItems: 4,
    shipments: [
      {
        id: "ship-2a",
        items: "Premium Cheese (2 pallets)",
        destination: "San Francisco, CA",
        date: new Date("2025-05-12"),
        status: "in_transit",
      },
      {
        id: "ship-2b",
        items: "Artisan Bread (2 pallets)",
        destination: "Oakland, CA",
        date: new Date("2025-05-14"),
        status: "scheduled",
      },
    ],
    status: "in_progress",
  },
  {
    id: "split-3",
    orderNumber: "ORD-12347",
    buyer: "Health Foods Inc.",
    totalItems: 3,
    shipments: [
      {
        id: "ship-3a",
        items: "Organic Spinach (1 pallet)",
        destination: "Boise, ID",
        date: new Date("2025-05-15"),
        status: "scheduled",
      },
      {
        id: "ship-3b",
        items: "Organic Kale (1 pallet)",
        destination: "Boise, ID",
        date: new Date("2025-05-16"),
        status: "scheduled",
      },
      {
        id: "ship-3c",
        items: "Organic Lettuce (1 pallet)",
        destination: "Boise, ID",
        date: new Date("2025-05-17"),
        status: "scheduled",
      },
    ],
    status: "scheduled",
  },
  {
    id: "split-4",
    orderNumber: "ORD-12348",
    buyer: "Restaurant Supply Co.",
    totalItems: 7,
    shipments: [
      {
        id: "ship-4a",
        items: "Grass-Fed Beef (3 pallets)",
        destination: "Los Angeles, CA",
        date: new Date("2025-05-08"),
        status: "delivered",
      },
      {
        id: "ship-4b",
        items: "Organic Chicken (2 pallets)",
        destination: "Los Angeles, CA",
        date: new Date("2025-05-09"),
        status: "delivered",
      },
      {
        id: "ship-4c",
        items: "Free-Range Turkey (2 pallets)",
        destination: "San Diego, CA",
        date: new Date("2025-05-10"),
        status: "delivered",
      },
    ],
    status: "completed",
  },
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    in_transit: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    delivered: "bg-green-100 text-green-800 hover:bg-green-100",
    in_progress: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    completed: "bg-green-100 text-green-800 hover:bg-green-100",
    canceled: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles]}>
      {status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </Badge>
  )
}

export function SplitShipments() {
  const [splitShipments, setSplitShipments] = useState(mockSplitShipments)
  const [activeTab, setActiveTab] = useState("active")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  
  // Filter shipments based on active tab
  const filteredShipments = splitShipments.filter(shipment => {
    if (activeTab === "active") {
      return shipment.status === "in_progress" || shipment.status === "scheduled"
    }
    if (activeTab === "completed") return shipment.status === "completed"
    if (activeTab === "canceled") return shipment.status === "canceled"
    return true
  })
  
  // Toggle expanded order
  const toggleExpandOrder = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Split Shipment Coordination</h2>
          <p className="text-muted-foreground">
            Manage orders with multiple shipments to different locations or dates
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Split Shipment
        </Button>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Shipments</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
          <TabsTrigger value="all">All Shipments</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Shipments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((order) => (
                    <>
                      <TableRow key={order.id} className={expandedOrder === order.id ? "bg-muted/50" : ""}>
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>{order.buyer}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Split className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{order.shipments.length} shipments ({order.totalItems} total items)</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleExpandOrder(order.id)}
                          >
                            {expandedOrder === order.id ? "Hide Details" : "View Details"}
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {expandedOrder === order.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/30 p-0">
                            <div className="p-4">
                              <h4 className="font-medium mb-2">Shipment Details</h4>
                              <div className="rounded-md border bg-background">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Items</TableHead>
                                      <TableHead>Destination</TableHead>
                                      <TableHead>Date</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {order.shipments.map((shipment) => (
                                      <TableRow key={shipment.id}>
                                        <TableCell>
                                          <div className="flex items-center">
                                            <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                                            <span>{shipment.items}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                            <span>{shipment.destination}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                            <span>{format(shipment.date, "MMM d, yyyy")}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <StatusBadge status={shipment.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <Button variant="ghost" size="sm">
                                            Edit
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              <div className="flex justify-end mt-4 gap-2">
                                <Button variant="outline" size="sm">
                                  Add Shipment
                                </Button>
                                <Button variant="outline" size="sm">
                                  Edit Order
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No split shipments found
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
            <CardTitle>About Split Shipments</CardTitle>
            <CardDescription>
              Efficiently manage complex orders with multiple shipments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Split className="h-4 w-4 mr-2 text-blue-600" />
                What are Split Shipments?
              </h4>
              <p className="text-sm text-muted-foreground">
                Split shipments allow you to divide a single order into multiple shipments that can be sent to different locations or on different dates.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Truck className="h-4 w-4 mr-2 text-blue-600" />
                Common Use Cases
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Different items shipping to multiple locations</li>
                <li>Staggered delivery dates for freshness</li>
                <li>Partial shipments due to inventory availability</li>
                <li>Different temperature requirements for items</li>
              </ul>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Buyer Communication</AlertTitle>
              <AlertDescription>
                When creating split shipments, buyers are automatically notified of the shipping plan and receive tracking information for each shipment.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Split Shipment Best Practices</CardTitle>
            <CardDescription>
              Tips for efficient split shipment management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Planning Split Shipments</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Group items by destination when possible</li>
                <li>Consider temperature requirements when splitting</li>
                <li>Optimize for carrier routes and rates</li>
                <li>Schedule shipments to minimize overall transit time</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Documentation</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Create separate BOLs for each shipment</li>
                <li>Reference the master order number on all documents</li>
                <li>Clearly label each shipment (e.g., "1 of 3", "2 of 3")</li>
                <li>Include detailed packing lists for each shipment</li>
              </ul>
            </div>
            
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                Split shipments may incur additional freight costs compared to single shipments. Consider consolidating when possible.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
