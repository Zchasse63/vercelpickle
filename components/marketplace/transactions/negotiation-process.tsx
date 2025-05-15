"use client"

import { useState } from "react"
import { MessageSquare, Send, Clock, AlertCircle, CheckCircle, XCircle, DollarSign, Percent, Calendar, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface NegotiationProcessProps {
  productId: string
  productName: string
  sellerName: string
  initialPrice: number
  unit: string
  onComplete: (data: NegotiationResult) => void
  className?: string
}

interface NegotiationMessage {
  id: string
  sender: "buyer" | "seller"
  message: string
  timestamp: Date
  offer?: {
    price: number
    quantity: number
    deliveryDate?: Date
  }
  status?: "pending" | "accepted" | "rejected"
}

interface NegotiationResult {
  finalPrice: number
  quantity: number
  deliveryDate?: Date
  messages: NegotiationMessage[]
}

export function NegotiationProcess({
  productId,
  productName,
  sellerName,
  initialPrice,
  unit,
  onComplete,
  className,
}: NegotiationProcessProps) {
  const [messages, setMessages] = useState<NegotiationMessage[]>([
    {
      id: "1",
      sender: "seller",
      message: `Thank you for your interest in our ${productName}. The listed price is $${initialPrice.toFixed(2)} per ${unit}. We're open to discussing volume discounts for larger orders.`,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      offer: {
        price: initialPrice,
        quantity: 1
      },
      status: "pending"
    }
  ])

  const [newMessage, setNewMessage] = useState("")
  const [offerPrice, setOfferPrice] = useState<number | "">("")
  const [offerQuantity, setOfferQuantity] = useState<number>(10)
  const [offerDeliveryDate, setOfferDeliveryDate] = useState<string>("")
  const [showOffer, setShowOffer] = useState(false)

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: NegotiationMessage = {
      id: (messages.length + 1).toString(),
      sender: "buyer",
      message: newMessage,
      timestamp: new Date()
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate seller response after a delay
    setTimeout(() => {
      const sellerResponse: NegotiationMessage = {
        id: (messages.length + 2).toString(),
        sender: "seller",
        message: "Thank you for your message. I'm reviewing your inquiry and will get back to you shortly.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, sellerResponse])
    }, 2000)
  }

  const handleSendOffer = () => {
    if (offerPrice === "") return

    const message: NegotiationMessage = {
      id: (messages.length + 1).toString(),
      sender: "buyer",
      message: `I would like to offer $${offerPrice.toFixed(2)} per ${unit} for a quantity of ${offerQuantity} units${offerDeliveryDate ? ` with delivery by ${offerDeliveryDate}` : ""}.`,
      timestamp: new Date(),
      offer: {
        price: offerPrice as number,
        quantity: offerQuantity,
        deliveryDate: offerDeliveryDate ? new Date(offerDeliveryDate) : undefined
      },
      status: "pending"
    }

    setMessages([...messages, message])
    setOfferPrice("")
    setOfferQuantity(10)
    setOfferDeliveryDate("")
    setShowOffer(false)

    // Simulate seller response after a delay
    setTimeout(() => {
      // Determine if the offer is accepted, rejected, or countered
      const priceRatio = (offerPrice as number) / initialPrice
      let sellerResponse: NegotiationMessage

      if (priceRatio >= 0.9 && offerQuantity >= 10) {
        // Accept offer if it's at least 90% of initial price and quantity is 10+
        sellerResponse = {
          id: (messages.length + 2).toString(),
          sender: "seller",
          message: `Thank you for your offer. I'm pleased to accept your offer of $${(offerPrice as number).toFixed(2)} per ${unit} for ${offerQuantity} units.`,
          timestamp: new Date(),
          offer: {
            price: offerPrice as number,
            quantity: offerQuantity,
            deliveryDate: offerDeliveryDate ? new Date(offerDeliveryDate) : undefined
          },
          status: "accepted"
        }

        // After a delay, complete the negotiation
        setTimeout(() => {
          onComplete({
            finalPrice: offerPrice as number,
            quantity: offerQuantity,
            deliveryDate: offerDeliveryDate ? new Date(offerDeliveryDate) : undefined,
            messages: [...messages, message, sellerResponse]
          })
        }, 3000)
      } else if (priceRatio >= 0.8) {
        // Counter offer if it's at least 80% of initial price
        const counterPrice = initialPrice * 0.95 // 5% discount
        sellerResponse = {
          id: (messages.length + 2).toString(),
          sender: "seller",
          message: `Thank you for your offer. I can offer a 5% discount at $${counterPrice.toFixed(2)} per ${unit} for a quantity of ${offerQuantity} units.`,
          timestamp: new Date(),
          offer: {
            price: counterPrice,
            quantity: offerQuantity,
            deliveryDate: offerDeliveryDate ? new Date(offerDeliveryDate) : undefined
          },
          status: "pending"
        }
      } else {
        // Reject if too low
        sellerResponse = {
          id: (messages.length + 2).toString(),
          sender: "seller",
          message: `Thank you for your offer. Unfortunately, I cannot accept that price. The lowest I can go is $${(initialPrice * 0.9).toFixed(2)} per ${unit} for that quantity.`,
          timestamp: new Date(),
          status: "rejected"
        }
      }

      setMessages(prev => [...prev, sellerResponse])
    }, 3000)
  }

  const handleAcceptOffer = (offerId: string) => {
    const offerMessage = messages.find(m => m.id === offerId)
    if (!offerMessage || !offerMessage.offer) return

    const acceptMessage: NegotiationMessage = {
      id: (messages.length + 1).toString(),
      sender: "buyer",
      message: `I accept your offer of $${offerMessage.offer.price.toFixed(2)} per ${unit} for ${offerMessage.offer.quantity} units.`,
      timestamp: new Date(),
      offer: offerMessage.offer,
      status: "accepted"
    }

    const updatedMessages = [...messages, acceptMessage]
    setMessages(updatedMessages)

    // Complete the negotiation
    setTimeout(() => {
      onComplete({
        finalPrice: offerMessage.offer?.price || initialPrice,
        quantity: offerMessage.offer?.quantity || 1,
        deliveryDate: offerMessage.offer?.deliveryDate || new Date(),
        messages: updatedMessages
      })
    }, 1000)
  }

  const handleRejectOffer = (offerId: string) => {
    const rejectMessage: NegotiationMessage = {
      id: (messages.length + 1).toString(),
      sender: "buyer",
      message: "I'm sorry, but I cannot accept this offer. Let's continue negotiating.",
      timestamp: new Date(),
      status: "rejected"
    }

    setMessages([...messages, rejectMessage])
  }

  const formatTimestamp = (date: Date) => {
    return format(date, "MMM d, h:mm a")
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Negotiation: {productName}
        </CardTitle>
        <CardDescription>
          Negotiate with {sellerName} on price, quantity, and delivery terms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Negotiation Guidelines</AlertTitle>
          <AlertDescription>
            Be clear about your requirements. Sellers are more likely to offer discounts for larger quantities or flexible delivery dates.
          </AlertDescription>
        </Alert>

        <div className="rounded-md border h-[400px] flex flex-col">
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {sellerName}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Product: {productName}
                </span>
              </div>
              <Badge variant="outline">
                List Price: ${initialPrice.toFixed(2)} / {unit}
              </Badge>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col max-w-[80%] rounded-lg p-3 animate-fade-up",
                  message.sender === "buyer"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <div className="space-y-2">
                  <p>{message.message}</p>

                  {message.offer && (
                    <div className={cn(
                      "mt-2 p-2 rounded",
                      message.sender === "buyer"
                        ? "bg-primary-foreground/10 text-primary-foreground"
                        : "bg-background"
                    )}>
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-3 w-3 mr-1" />
                        <span>Price: ${message.offer.price.toFixed(2)} / {unit}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Package className="h-3 w-3 mr-1" />
                        <span>Quantity: {message.offer.quantity} {unit}s</span>
                      </div>
                      {message.offer.deliveryDate && (
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Delivery by: {format(message.offer.deliveryDate, "MMM d, yyyy")}</span>
                        </div>
                      )}

                      {message.sender === "seller" && message.status === "pending" && (
                        <div className="flex items-center mt-2 space-x-2">
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-xs"
                            onClick={() => handleAcceptOffer(message.id)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleRejectOffer(message.id)}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {message.status === "accepted" && (
                        <div className="flex items-center mt-2 text-sm">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          <span className="text-green-500">Offer accepted</span>
                        </div>
                      )}

                      {message.status === "rejected" && (
                        <div className="flex items-center mt-2 text-sm">
                          <XCircle className="h-3 w-3 mr-1 text-red-500" />
                          <span className="text-red-500">Offer rejected</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-1",
                  message.sender === "buyer"
                    ? "text-primary-foreground/70 text-right"
                    : "text-muted-foreground"
                )}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <Tabs defaultValue="message">
              <TabsList className="mb-2">
                <TabsTrigger value="message" className="hover-scale">Message</TabsTrigger>
                <TabsTrigger value="offer" className="hover-scale">Make Offer</TabsTrigger>
              </TabsList>

              <TabsContent value="message">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button size="icon" onClick={handleSendMessage} className="hover-scale">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="offer">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="price">Your Price (per {unit})</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder={initialPrice.toFixed(2)}
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(e.target.value ? parseFloat(e.target.value) : "")}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={offerQuantity}
                        onChange={(e) => setOfferQuantity(parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="delivery-date">Requested Delivery Date (Optional)</Label>
                    <Input
                      id="delivery-date"
                      type="date"
                      value={offerDeliveryDate}
                      onChange={(e) => setOfferDeliveryDate(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleSendOffer} className="w-full hover-scale">
                    Send Offer
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
