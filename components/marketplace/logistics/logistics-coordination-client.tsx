"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Truck, Package, Calendar, Info } from "lucide-react"
import { FreightArrangement } from "@/components/marketplace/logistics/freight-arrangement"
import { PickupScheduler } from "@/components/marketplace/logistics/pickup-scheduler"
import { SplitShipment } from "@/components/marketplace/logistics/split-shipment"

export function LogisticsCoordinationClient() {
  const [activeTab, setActiveTab] = useState("freight")
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Mock order items for split shipment
  const mockOrderItems = [
    { id: "1", name: "Organic Apples", quantity: 50, unit: "lb" },
    { id: "2", name: "Fresh Broccoli", quantity: 30, unit: "bunch" },
    { id: "3", name: "Artisan Bread", quantity: 20, unit: "loaf" },
    { id: "4", name: "Organic Milk", quantity: 15, unit: "gallon" }
  ]

  const handleFreightComplete = (data: any) => {
    console.log("Freight arrangement completed:", data)
    setSuccessMessage("Freight arrangement has been successfully submitted. You will receive confirmation details shortly.")
    setShowSuccess(true)
  }

  const handlePickupComplete = (data: any) => {
    console.log("Pickup scheduled:", data)
    setSuccessMessage("Pickup has been successfully scheduled. You will receive confirmation details shortly.")
    setShowSuccess(true)
  }

  const handleSplitShipmentComplete = (data: any) => {
    console.log("Split shipment completed:", data)
    setSuccessMessage("Split shipment has been successfully arranged. You will receive confirmation details for each destination shortly.")
    setShowSuccess(true)
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-2 animate-fade-up">
        <h1 className="text-3xl font-bold tracking-tight">Logistics Coordination</h1>
        <p className="text-muted-foreground">
          Arrange transportation, schedule pickups, and coordinate shipments for your orders
        </p>
      </div>

      {showSuccess ? (
        <Card className="mt-8 animate-fade-up">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center">
              <Info className="mr-2 h-5 w-5" />
              Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="bg-green-50">
              <AlertTitle>Logistics Request Submitted</AlertTitle>
              <AlertDescription>
                {successMessage}
              </AlertDescription>
            </Alert>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowSuccess(false)} className="hover-scale">
                Arrange Another Shipment
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8 animate-fade-up">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="freight" className="hover-scale">
              <Truck className="mr-2 h-4 w-4" />
              Freight Arrangement
            </TabsTrigger>
            <TabsTrigger value="pickup" className="hover-scale">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Pickup
            </TabsTrigger>
            <TabsTrigger value="split" className="hover-scale">
              <Package className="mr-2 h-4 w-4" />
              Split Shipment
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="freight" className="mt-6 animate-fade-up">
            <FreightArrangement 
              orderId="ORD-12345"
              onComplete={handleFreightComplete}
            />
          </TabsContent>
          
          <TabsContent value="pickup" className="mt-6 animate-fade-up">
            <PickupScheduler 
              orderId="ORD-12345"
              onComplete={handlePickupComplete}
            />
          </TabsContent>
          
          <TabsContent value="split" className="mt-6 animate-fade-up">
            <SplitShipment 
              orderId="ORD-12345"
              orderItems={mockOrderItems}
              onComplete={handleSplitShipmentComplete}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
