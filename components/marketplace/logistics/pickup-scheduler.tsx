"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, Clock, MapPin, Truck, User, Phone, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PickupSchedulerProps {
  orderId: string
  onComplete: (data: PickupDetails) => void
  className?: string
}

interface PickupDetails {
  date: Date | undefined
  timeSlot: string
  contactName: string
  contactPhone: string
  location: string
  instructions: string
  vehicleType: string
  quantity: number
}

export function PickupScheduler({ orderId, onComplete, className }: PickupSchedulerProps) {
  const [pickupDetails, setPickupDetails] = useState<PickupDetails>({
    date: undefined,
    timeSlot: "",
    contactName: "",
    contactPhone: "",
    location: "",
    instructions: "",
    vehicleType: "pickup",
    quantity: 1
  })

  const handleChange = (field: keyof PickupDetails, value: any) => {
    setPickupDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onComplete(pickupDetails)
  }

  // Available time slots
  const timeSlots = [
    { value: "8-10", label: "8:00 AM - 10:00 AM" },
    { value: "10-12", label: "10:00 AM - 12:00 PM" },
    { value: "12-2", label: "12:00 PM - 2:00 PM" },
    { value: "2-4", label: "2:00 PM - 4:00 PM" },
    { value: "4-6", label: "4:00 PM - 6:00 PM" }
  ]

  // Vehicle types
  const vehicleTypes = [
    { value: "pickup", label: "Pickup Truck" },
    { value: "van", label: "Van" },
    { value: "box-truck", label: "Box Truck" },
    { value: "semi", label: "Semi Truck" }
  ]

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Schedule Pickup
        </CardTitle>
        <CardDescription>
          Schedule a pickup for order #{orderId}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Pickup Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !pickupDetails.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {pickupDetails.date ? (
                    format(pickupDetails.date, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={pickupDetails.date}
                  onSelect={(date) => handleChange("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-slot">Time Slot</Label>
            <Select
              value={pickupDetails.timeSlot}
              onValueChange={(value) => handleChange("timeSlot", value)}
            >
              <SelectTrigger id="time-slot">
                <SelectValue placeholder="Select time slot" />
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

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="location">Pickup Location</Label>
          <Textarea
            id="location"
            placeholder="Enter full address"
            value={pickupDetails.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Contact Name</Label>
            <Input
              id="contact-name"
              placeholder="Enter contact name"
              value={pickupDetails.contactName}
              onChange={(e) => handleChange("contactName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">Contact Phone</Label>
            <Input
              id="contact-phone"
              placeholder="Enter phone number"
              value={pickupDetails.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vehicle-type">Vehicle Type</Label>
            <Select
              value={pickupDetails.vehicleType}
              onValueChange={(value) => handleChange("vehicleType", value)}
            >
              <SelectTrigger id="vehicle-type">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={pickupDetails.quantity}
              onChange={(e) => handleChange("quantity", parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Special Instructions</Label>
          <Textarea
            id="instructions"
            placeholder="Enter any special instructions for pickup"
            value={pickupDetails.instructions}
            onChange={(e) => handleChange("instructions", e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription>
            Please ensure someone is available at the pickup location during the selected time slot.
            The driver will call the contact number provided when they arrive.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} className="hover-scale">Schedule Pickup</Button>
      </CardFooter>
    </Card>
  )
}
