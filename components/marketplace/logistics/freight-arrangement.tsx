"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Truck, TruckIcon, Info, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface FreightArrangementProps {
  orderId: string
  onComplete: (data: FreightDetails) => void
  className?: string
}

interface FreightDetails {
  transportType: string
  pickupDate: Date | undefined
  pickupTime: string
  pickupLocation: string
  deliveryDate: Date | undefined
  deliveryTime: string
  deliveryLocation: string
  specialInstructions: string
  carrierPreference: string
  loadingDockRequired: boolean
  palletJackRequired: boolean
  liftGateRequired: boolean
}

export function FreightArrangement({ orderId, onComplete, className }: FreightArrangementProps) {
  const [step, setStep] = useState(1)
  const [freightDetails, setFreightDetails] = useState<FreightDetails>({
    transportType: "ltl",
    pickupDate: undefined,
    pickupTime: "",
    pickupLocation: "",
    deliveryDate: undefined,
    deliveryTime: "",
    deliveryLocation: "",
    specialInstructions: "",
    carrierPreference: "",
    loadingDockRequired: false,
    palletJackRequired: false,
    liftGateRequired: false,
  })

  const handleChange = (field: keyof FreightDetails, value: any) => {
    setFreightDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = () => {
    onComplete(freightDetails)
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Freight Arrangement
        </CardTitle>
        <CardDescription>
          Arrange freight transportation for order #{orderId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Badge variant={step >= 1 ? "default" : "outline"} className="mr-2">1</Badge>
              <span className={step >= 1 ? "font-medium" : "text-muted-foreground"}>Transport Type</span>
            </div>
            <Separator className="flex-1 mx-4" />
            <div className="flex items-center">
              <Badge variant={step >= 2 ? "default" : "outline"} className="mr-2">2</Badge>
              <span className={step >= 2 ? "font-medium" : "text-muted-foreground"}>Pickup Details</span>
            </div>
            <Separator className="flex-1 mx-4" />
            <div className="flex items-center">
              <Badge variant={step >= 3 ? "default" : "outline"} className="mr-2">3</Badge>
              <span className={step >= 3 ? "font-medium" : "text-muted-foreground"}>Delivery Details</span>
            </div>
            <Separator className="flex-1 mx-4" />
            <div className="flex items-center">
              <Badge variant={step >= 4 ? "default" : "outline"} className="mr-2">4</Badge>
              <span className={step >= 4 ? "font-medium" : "text-muted-foreground"}>Requirements</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-up">
            <div className="space-y-2">
              <Label>Transport Type</Label>
              <RadioGroup
                value={freightDetails.transportType}
                onValueChange={(value) => handleChange("transportType", value)}
                className="grid grid-cols-1 gap-4 md:grid-cols-3"
              >
                <div>
                  <RadioGroupItem
                    value="ltl"
                    id="ltl"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="ltl"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <TruckIcon className="mb-3 h-6 w-6" />
                    <span className="font-medium">LTL Freight</span>
                    <span className="text-xs text-muted-foreground">
                      Less than truckload
                    </span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="ftl"
                    id="ftl"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="ftl"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Truck className="mb-3 h-6 w-6" />
                    <span className="font-medium">FTL Freight</span>
                    <span className="text-xs text-muted-foreground">
                      Full truckload
                    </span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="expedited"
                    id="expedited"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="expedited"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Truck className="mb-3 h-6 w-6" />
                    <span className="font-medium">Expedited</span>
                    <span className="text-xs text-muted-foreground">
                      Faster delivery
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Carrier Preference (Optional)</Label>
              <Select
                value={freightDetails.carrierPreference}
                onValueChange={(value) => handleChange("carrierPreference", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-preference">No Preference</SelectItem>
                  <SelectItem value="xpo">XPO Logistics</SelectItem>
                  <SelectItem value="fedex">FedEx Freight</SelectItem>
                  <SelectItem value="ups">UPS Freight</SelectItem>
                  <SelectItem value="estes">Estes Express</SelectItem>
                  <SelectItem value="yrc">YRC Freight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-up">
            <div className="space-y-2">
              <Label>Pickup Location</Label>
              <Textarea 
                placeholder="Enter full address"
                value={freightDetails.pickupLocation}
                onChange={(e) => handleChange("pickupLocation", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Pickup Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !freightDetails.pickupDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {freightDetails.pickupDate ? (
                        format(freightDetails.pickupDate, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={freightDetails.pickupDate}
                      onSelect={(date) => handleChange("pickupDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Pickup Time</Label>
                <Select
                  value={freightDetails.pickupTime}
                  onValueChange={(value) => handleChange("pickupTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12pm - 4pm)</SelectItem>
                    <SelectItem value="evening">Evening (4pm - 8pm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-up">
            <div className="space-y-2">
              <Label>Delivery Location</Label>
              <Textarea 
                placeholder="Enter full address"
                value={freightDetails.deliveryLocation}
                onChange={(e) => handleChange("deliveryLocation", e.target.value)}
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
                        !freightDetails.deliveryDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {freightDetails.deliveryDate ? (
                        format(freightDetails.deliveryDate, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={freightDetails.deliveryDate}
                      onSelect={(date) => handleChange("deliveryDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Delivery Time</Label>
                <Select
                  value={freightDetails.deliveryTime}
                  onValueChange={(value) => handleChange("deliveryTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12pm - 4pm)</SelectItem>
                    <SelectItem value="evening">Evening (4pm - 8pm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-up">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Special Requirements</AlertTitle>
              <AlertDescription>
                Please specify any special requirements for pickup and delivery.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="loading-dock"
                  checked={freightDetails.loadingDockRequired}
                  onChange={(e) => handleChange("loadingDockRequired", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="loading-dock">Loading Dock Required</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pallet-jack"
                  checked={freightDetails.palletJackRequired}
                  onChange={(e) => handleChange("palletJackRequired", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="pallet-jack">Pallet Jack Required</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="lift-gate"
                  checked={freightDetails.liftGateRequired}
                  onChange={(e) => handleChange("liftGateRequired", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="lift-gate">Lift Gate Required</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea 
                placeholder="Enter any special instructions for the carrier"
                value={freightDetails.specialInstructions}
                onChange={(e) => handleChange("specialInstructions", e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <div></div>
        )}
        {step < 4 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Complete Arrangement</Button>
        )}
      </CardFooter>
    </Card>
  )
}
