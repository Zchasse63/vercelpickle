"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function BuyerCreateTicket() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <Card className="border-green-500">
        <CardHeader>
          <CardTitle className="text-green-600">Ticket Submitted Successfully</CardTitle>
          <CardDescription>
            Your support ticket has been created. Our team will respond as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Ticket ID: <span className="font-medium">TKT-1239</span>
          </p>
          <p className="text-sm text-gray-500">You will receive email notifications about updates to your ticket.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setIsSubmitted(false)}>Create Another Ticket</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="Brief description of your issue" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order">Order Issue</SelectItem>
                <SelectItem value="product">Product Issue</SelectItem>
                <SelectItem value="shipping">Shipping Issue</SelectItem>
                <SelectItem value="billing">Billing Issue</SelectItem>
                <SelectItem value="account">Account Issue</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select defaultValue="medium" required>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="order">Related Order (Optional)</Label>
          <Select>
            <SelectTrigger id="order">
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="ord-1234">ORD-1234</SelectItem>
              <SelectItem value="ord-1235">ORD-1235</SelectItem>
              <SelectItem value="ord-1236">ORD-1236</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Please provide details about your issue" rows={6} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="attachment">Attachment (Optional)</Label>
          <Input id="attachment" type="file" />
          <p className="text-xs text-gray-500">Max file size: 10MB. Supported formats: JPG, PNG, PDF.</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Ticket"}
        </Button>
      </div>
    </form>
  )
}
