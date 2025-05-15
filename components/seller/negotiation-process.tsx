"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { MessageSquare, DollarSign, Clock, CheckCircle2, XCircle, AlertCircle, Info, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Textarea,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  Separator,
} from "@/components/ui-kit"
import { useForm } from "react-hook-form"

// Mock data for negotiations
const mockNegotiations = [
  {
    id: "neg-1",
    buyer: "Metro Grocery",
    product: "Organic Apples (Case)",
    quantity: 50,
    initialPrice: 45.00,
    currentOffer: 40.00,
    counterOffer: null,
    status: "pending",
    messages: [
      {
        sender: "buyer",
        message: "We're interested in purchasing 50 cases of organic apples. Would you consider $40 per case for this bulk order?",
        timestamp: addDays(new Date(), -1),
      },
    ],
    expiresAt: addDays(new Date(), 2),
  },
  {
    id: "neg-2",
    buyer: "Sunshine Catering",
    product: "Premium Cheese (Box)",
    quantity: 25,
    initialPrice: 75.00,
    currentOffer: 65.00,
    counterOffer: 70.00,
    status: "countered",
    messages: [
      {
        sender: "buyer",
        message: "We'd like to order 25 boxes of premium cheese. Can you offer a discount at $65 per box?",
        timestamp: addDays(new Date(), -2),
      },
      {
        sender: "seller",
        message: "Thank you for your interest. We can offer these boxes at $70 each for this quantity, which is a 6.7% discount from our regular price.",
        timestamp: addDays(new Date(), -1),
      },
    ],
    expiresAt: addDays(new Date(), 1),
  },
  {
    id: "neg-3",
    buyer: "Health Foods Inc.",
    product: "Organic Spinach (Case)",
    quantity: 30,
    initialPrice: 36.00,
    currentOffer: 32.00,
    counterOffer: 34.00,
    status: "accepted",
    messages: [
      {
        sender: "buyer",
        message: "We're looking to purchase 30 cases of organic spinach. Would you accept $32 per case?",
        timestamp: addDays(new Date(), -3),
      },
      {
        sender: "seller",
        message: "We can offer $34 per case for this quantity, which includes free delivery.",
        timestamp: addDays(new Date(), -2),
      },
      {
        sender: "buyer",
        message: "That works for us. We accept your counter-offer of $34 per case with free delivery.",
        timestamp: addDays(new Date(), -1),
      },
    ],
    expiresAt: null,
  },
  {
    id: "neg-4",
    buyer: "Restaurant Supply Co.",
    product: "Grass-Fed Beef (Case)",
    quantity: 15,
    initialPrice: 120.00,
    currentOffer: 100.00,
    counterOffer: 115.00,
    status: "rejected",
    messages: [
      {
        sender: "buyer",
        message: "We'd like to order 15 cases of grass-fed beef. Would you consider $100 per case?",
        timestamp: addDays(new Date(), -4),
      },
      {
        sender: "seller",
        message: "Thank you for your interest. The lowest we can go is $115 per case due to our costs.",
        timestamp: addDays(new Date(), -3),
      },
      {
        sender: "buyer",
        message: "That's outside our budget. We'll have to pass for now.",
        timestamp: addDays(new Date(), -2),
      },
    ],
    expiresAt: null,
  },
  {
    id: "neg-5",
    buyer: "Coastal Restaurants",
    product: "Fresh Seafood (Box)",
    quantity: 20,
    initialPrice: 85.00,
    currentOffer: 75.00,
    counterOffer: 80.00,
    status: "accepted",
    messages: [
      {
        sender: "buyer",
        message: "We need 20 boxes of fresh seafood. Can you do $75 per box?",
        timestamp: addDays(new Date(), -5),
      },
      {
        sender: "seller",
        message: "We can meet you in the middle at $80 per box for this order.",
        timestamp: addDays(new Date(), -4),
      },
      {
        sender: "buyer",
        message: "That works for us. We'll take 20 boxes at $80 each.",
        timestamp: addDays(new Date(), -3),
      },
    ],
    expiresAt: null,
  },
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    countered: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    accepted: "bg-green-100 text-green-800 hover:bg-green-100",
    rejected: "bg-red-100 text-red-800 hover:bg-red-100",
    expired: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  }

  const statusLabels = {
    pending: "Pending Response",
    countered: "Counter Offered",
    accepted: "Accepted",
    rejected: "Rejected",
    expired: "Expired",
  }

  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles]}>
      {statusLabels[status as keyof typeof statusLabels]}
    </Badge>
  )
}

// Define a type for the negotiation object
type Negotiation = {
  id: string;
  buyer: string;
  product: string;
  quantity: number;
  initialPrice: number;
  currentOffer: number;
  counterOffer: number | null;
  status: string;
  messages: {
    sender: string;
    message: string;
    timestamp: Date;
  }[];
  expiresAt: Date | null;
}

export function NegotiationProcess() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>(mockNegotiations as Negotiation[])
  const [activeTab, setActiveTab] = useState("active")
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      message: "",
      counterOffer: "",
    },
  })

  // Filter negotiations based on active tab
  const filteredNegotiations = negotiations.filter(negotiation => {
    if (activeTab === "active") {
      return negotiation.status === "pending" || negotiation.status === "countered"
    }
    if (activeTab === "completed") {
      return negotiation.status === "accepted" || negotiation.status === "rejected"
    }
    return true
  })

  const handleViewNegotiation = (negotiation: Negotiation) => {
    setSelectedNegotiation(negotiation)
    setIsDialogOpen(true)
  }

  const handleAccept = (negotiationId: string) => {
    const updatedNegotiations = negotiations.map(negotiation =>
      negotiation.id === negotiationId
        ? {
            ...negotiation,
            status: "accepted",
            messages: [
              ...negotiation.messages,
              {
                sender: "seller",
                message: `We accept your offer of $${negotiation.currentOffer.toFixed(2)} per unit for ${negotiation.quantity} units of ${negotiation.product}.`,
                timestamp: new Date(),
              }
            ],
            expiresAt: null,
          }
        : negotiation
    )
    setNegotiations(updatedNegotiations)
    setIsDialogOpen(false)
  }

  const handleReject = (negotiationId: string) => {
    const updatedNegotiations = negotiations.map(negotiation =>
      negotiation.id === negotiationId
        ? {
            ...negotiation,
            status: "rejected",
            messages: [
              ...negotiation.messages,
              {
                sender: "seller",
                message: "We're unable to accept this offer at this time. Thank you for your interest.",
                timestamp: new Date(),
              }
            ],
            expiresAt: null,
          }
        : negotiation
    )
    setNegotiations(updatedNegotiations)
    setIsDialogOpen(false)
  }

  const onSubmit = (data: any) => {
    if (!selectedNegotiation) return

    const counterOffer = parseFloat(data.counterOffer)

    setNegotiations(negotiations.map(negotiation =>
      negotiation.id === selectedNegotiation.id
        ? {
            ...negotiation,
            status: "countered",
            counterOffer: counterOffer,
            messages: [
              ...negotiation.messages,
              {
                sender: "seller",
                message: data.message,
                timestamp: new Date(),
              }
            ],
            expiresAt: addDays(new Date(), 2),
          }
        : negotiation
    ))

    setIsDialogOpen(false)
    form.reset()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Negotiation Process</h2>
          <p className="text-muted-foreground">
            Manage price negotiations with buyers
          </p>
        </div>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Negotiations</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Negotiations</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">List Price</TableHead>
                  <TableHead className="text-right">Current Offer</TableHead>
                  <TableHead className="text-right">Your Counter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNegotiations.length > 0 ? (
                  filteredNegotiations.map((negotiation) => (
                    <TableRow key={negotiation.id}>
                      <TableCell className="font-medium">
                        {negotiation.buyer}
                      </TableCell>
                      <TableCell>{negotiation.product}</TableCell>
                      <TableCell>{negotiation.quantity} units</TableCell>
                      <TableCell className="text-right">${negotiation.initialPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <span className={negotiation.currentOffer < negotiation.initialPrice ? "text-amber-600 font-medium" : ""}>
                          ${negotiation.currentOffer.toFixed(2)}
                        </span>
                        {negotiation.currentOffer < negotiation.initialPrice && (
                          <span className="text-xs text-muted-foreground block">
                            ({((negotiation.initialPrice - negotiation.currentOffer) / negotiation.initialPrice * 100).toFixed(1)}% off)
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {negotiation.counterOffer ? (
                          <span className="text-blue-600 font-medium">
                            ${negotiation.counterOffer.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={negotiation.status} />
                      </TableCell>
                      <TableCell>
                        {negotiation.expiresAt ? (
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{format(negotiation.expiresAt, "MMM d, yyyy")}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewNegotiation(negotiation)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                      No negotiations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedNegotiation && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Negotiation Details</DialogTitle>
              <DialogDescription>
                Review and respond to the negotiation request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Buyer</h4>
                  <p>{selectedNegotiation.buyer}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Product</h4>
                  <p>{selectedNegotiation.product}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Quantity</h4>
                  <p>{selectedNegotiation.quantity} units</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <StatusBadge status={selectedNegotiation.status} />
                </div>
              </div>

              <div className="rounded-md border p-4 bg-muted/30">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">List Price</h4>
                    <p className="text-lg font-bold">${selectedNegotiation.initialPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Current Offer</h4>
                    <p className="text-lg font-bold text-amber-600">${selectedNegotiation.currentOffer.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      ({((selectedNegotiation.initialPrice - selectedNegotiation.currentOffer) / selectedNegotiation.initialPrice * 100).toFixed(1)}% discount)
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Your Counter</h4>
                    {selectedNegotiation.counterOffer ? (
                      <p className="text-lg font-bold text-blue-600">${selectedNegotiation.counterOffer.toFixed(2)}</p>
                    ) : (
                      <p className="text-muted-foreground">Not yet countered</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium">Total Order Value</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <div>
                      <p className="text-xs text-muted-foreground">At list price:</p>
                      <p className="font-medium">${(selectedNegotiation.initialPrice * selectedNegotiation.quantity).toFixed(2)}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">At current offer:</p>
                      <p className="font-medium">${(selectedNegotiation.currentOffer * selectedNegotiation.quantity).toFixed(2)}</p>
                    </div>
                    {selectedNegotiation.counterOffer && (
                      <>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">At your counter:</p>
                          <p className="font-medium">${(selectedNegotiation.counterOffer * selectedNegotiation.quantity).toFixed(2)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Conversation History</h4>
                <div className="space-y-3 max-h-[200px] overflow-y-auto p-2 border rounded-md">
                  {selectedNegotiation.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === "buyer" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "buyer"
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {format(message.timestamp, "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {(selectedNegotiation.status === "pending" || selectedNegotiation.status === "countered") && (
                <div className="space-y-4">
                  <Separator />

                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">Your Response</h4>
                    {selectedNegotiation.expiresAt && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Expires: {format(selectedNegotiation.expiresAt, "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleReject(selectedNegotiation.id)}
                    >
                      <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                      Decline Offer
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => handleAccept(selectedNegotiation.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Accept Offer
                    </Button>
                  </div>

                  <Separator />

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="counterOffer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Counter Offer (per unit)</FormLabel>
                            <div className="relative">
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="Enter your counter offer"
                                  className="pl-8"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormDescription>
                              Suggested counter: ${((selectedNegotiation.initialPrice + selectedNegotiation.currentOffer) / 2).toFixed(2)}
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message to Buyer</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Explain your counter offer or provide additional details"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Counter Offer
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Negotiation Guidelines</CardTitle>
            <CardDescription>
              Best practices for successful negotiations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                Respond Promptly
              </h4>
              <p className="text-sm text-muted-foreground">
                Aim to respond to negotiation requests within 24 hours. Quick responses show professionalism and keep buyers engaged.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                Be Clear and Professional
              </h4>
              <p className="text-sm text-muted-foreground">
                Clearly explain your counter offers and why they represent good value. Maintain a professional tone even when declining.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                Consider Volume Discounts
              </h4>
              <p className="text-sm text-muted-foreground">
                For larger orders, consider offering tiered discounts. This encourages buyers to increase their order size.
              </p>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Negotiation Limits</AlertTitle>
              <AlertDescription>
                Negotiations are limited to 3 rounds of offers and counter-offers to ensure efficient communication.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Negotiation Statistics</CardTitle>
            <CardDescription>
              Your negotiation performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-medium">Acceptance Rate</h4>
                <p className="text-2xl font-bold text-green-600">68%</p>
                <p className="text-xs text-muted-foreground">
                  Percentage of negotiations that result in a sale
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-medium">Avg. Discount</h4>
                <p className="text-2xl font-bold text-amber-600">8.5%</p>
                <p className="text-xs text-muted-foreground">
                  Average discount from list price
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-medium">Response Time</h4>
                <p className="text-2xl font-bold">5.2 hrs</p>
                <p className="text-xs text-muted-foreground">
                  Average time to respond to offers
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-medium">Negotiation Rounds</h4>
                <p className="text-2xl font-bold">1.8</p>
                <p className="text-xs text-muted-foreground">
                  Average rounds before resolution
                </p>
              </div>
            </div>

            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Improvement Opportunity</AlertTitle>
              <AlertDescription>
                Your response time is higher than the platform average of 3.5 hours. Faster responses can improve your acceptance rate.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
