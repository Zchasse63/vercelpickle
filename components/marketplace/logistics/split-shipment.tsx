"use client"

import { useState } from "react"
import { Plus, Minus, Truck, Package, MapPin, Calendar, Clock, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SplitShipmentProps {
  orderId: string
  orderItems: OrderItem[]
  onComplete: (data: SplitShipmentDetails) => void
  className?: string
}

interface OrderItem {
  id: string
  name: string
  quantity: number
  unit: string
}

interface ShipmentDestination {
  id: string
  location: string
  date: Date | undefined
  timeSlot: string
  items: {
    itemId: string
    quantity: number
  }[]
}

interface SplitShipmentDetails {
  destinations: ShipmentDestination[]
  specialInstructions: string
}

export function SplitShipment({ orderId, orderItems, onComplete, className }: SplitShipmentProps) {
  const [destinations, setDestinations] = useState<ShipmentDestination[]>([
    {
      id: "1",
      location: "",
      date: undefined,
      timeSlot: "",
      items: []
    }
  ])
  const [specialInstructions, setSpecialInstructions] = useState("")

  // Time slots
  const timeSlots = [
    { value: "morning", label: "Morning (8am - 12pm)" },
    { value: "afternoon", label: "Afternoon (12pm - 4pm)" },
    { value: "evening", label: "Evening (4pm - 8pm)" }
  ]

  const addDestination = () => {
    setDestinations([
      ...destinations,
      {
        id: (destinations.length + 1).toString(),
        location: "",
        date: undefined,
        timeSlot: "",
        items: []
      }
    ])
  }

  const removeDestination = (id: string) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter(dest => dest.id !== id))
    }
  }

  const updateDestination = (id: string, field: keyof ShipmentDestination, value: any) => {
    setDestinations(destinations.map(dest => 
      dest.id === id ? { ...dest, [field]: value } : dest
    ))
  }

  const addItemToDestination = (destId: string, itemId: string, quantity: number) => {
    setDestinations(destinations.map(dest => {
      if (dest.id === destId) {
        // Check if item already exists
        const existingItemIndex = dest.items.findIndex(item => item.itemId === itemId)
        
        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...dest.items]
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity
          }
          return { ...dest, items: updatedItems }
        } else {
          // Add new item
          return {
            ...dest,
            items: [...dest.items, { itemId, quantity }]
          }
        }
      }
      return dest
    }))
  }

  const removeItemFromDestination = (destId: string, itemId: string) => {
    setDestinations(destinations.map(dest => 
      dest.id === destId 
        ? { ...dest, items: dest.items.filter(item => item.itemId !== itemId) } 
        : dest
    ))
  }

  const getItemQuantityInDestination = (destId: string, itemId: string) => {
    const destination = destinations.find(dest => dest.id === destId)
    if (!destination) return 0
    
    const item = destination.items.find(item => item.itemId === itemId)
    return item ? item.quantity : 0
  }

  const getTotalAllocatedQuantity = (itemId: string) => {
    return destinations.reduce((total, dest) => {
      const item = dest.items.find(item => item.itemId === itemId)
      return total + (item ? item.quantity : 0)
    }, 0)
  }

  const getRemainingQuantity = (itemId: string) => {
    const orderItem = orderItems.find(item => item.id === itemId)
    if (!orderItem) return 0
    
    return orderItem.quantity - getTotalAllocatedQuantity(itemId)
  }

  const handleSubmit = () => {
    onComplete({
      destinations,
      specialInstructions
    })
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Split Shipment
        </CardTitle>
        <CardDescription>
          Coordinate multiple destinations for order #{orderId}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Split Shipment Information</AlertTitle>
          <AlertDescription>
            Split your order into multiple shipments to different locations. Allocate items to each destination.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {destinations.map((destination, index) => (
            <Card key={destination.id} className="animate-fade-up">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Destination {index + 1}</CardTitle>
                  {destinations.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDestination(destination.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Delivery Location</Label>
                  <Textarea
                    placeholder="Enter full address"
                    value={destination.location}
                    onChange={(e) => updateDestination(destination.id, "location", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Delivery Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !destination.date && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {destination.date ? (
                            format(destination.date, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={destination.date}
                          onSelect={(date) => updateDestination(destination.id, "date", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Time</Label>
                    <Select
                      value={destination.timeSlot}
                      onValueChange={(value) => updateDestination(destination.id, "timeSlot", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Allocate Items</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => {
                        const allocatedQty = getItemQuantityInDestination(destination.id, item.id)
                        const remainingQty = getRemainingQuantity(item.id)
                        const isAllocated = allocatedQty > 0
                        
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{remainingQty + allocatedQty} {item.unit}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max={remainingQty + allocatedQty}
                                value={allocatedQty}
                                onChange={(e) => {
                                  const qty = parseInt(e.target.value) || 0
                                  if (qty <= (remainingQty + allocatedQty) && qty >= 0) {
                                    if (qty === 0) {
                                      removeItemFromDestination(destination.id, item.id)
                                    } else {
                                      addItemToDestination(destination.id, item.id, qty)
                                    }
                                  }
                                }}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              {isAllocated ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItemFromDestination(destination.id, item.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => addItemToDestination(destination.id, item.id, 1)}
                                  disabled={remainingQty === 0}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={addDestination}
            className="w-full hover-scale"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Destination
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Special Instructions</Label>
          <Textarea
            placeholder="Enter any special instructions for the split shipment"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} className="hover-scale">Complete Split Shipment</Button>
      </CardFooter>
    </Card>
  )
}
