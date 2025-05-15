"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface SellerOrderActionsProps {
  orderId: string
}

export function SellerOrderActions({ orderId }: SellerOrderActionsProps) {
  const [status, setStatus] = useState("Processing")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [carrier, setCarrier] = useState("FedEx")
  const [note, setNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateStatus = async () => {
    setIsUpdating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsUpdating(false)
    // Reset note after update
    setNote("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Actions</CardTitle>
        <div className="mt-2">
          <span className="text-sm font-medium">Current Status: </span>
          <span className="text-sm font-medium text-primary" data-testid="fulfillment-status">{status}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="status"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Update Status
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status" data-testid="fulfillment-status-select">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {status === "Shipped" && (
          <>
            <div className="space-y-2">
              <label
                htmlFor="tracking"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tracking Number
              </label>
              <Input
                id="tracking"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                data-testid="tracking-number-input"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="carrier"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Shipping Carrier
              </label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger id="carrier" data-testid="carrier-select">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        <div className="space-y-2">
          <label
            htmlFor="note"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Add Note (Optional)
          </label>
          <Textarea
            id="note"
            placeholder="Add a note about this status update"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <Button className="w-full" onClick={handleUpdateStatus} disabled={isUpdating} data-testid="update-fulfillment-button">
          {isUpdating ? "Updating..." : "Update Order"}
        </Button>
        <div className="flex flex-col gap-2">
          <Button variant="outline">Print Invoice</Button>
          <Button variant="outline">Print Shipping Label</Button>
          <Button variant="outline">Contact Customer</Button>
        </div>
      </CardContent>
    </Card>
  )
}
