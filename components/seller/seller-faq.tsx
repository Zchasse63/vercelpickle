"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function SellerFaq() {
  const [searchQuery, setSearchQuery] = useState("")

  // This would typically come from your data fetching logic
  const faqs = [
    {
      question: "How do I add a new product to my store?",
      answer:
        "To add a new product, go to the Products section in your seller dashboard and click on the 'Add Product' button. Fill out the product details form including name, description, price, inventory, and images. Once complete, click 'Save Product' to publish it to your store.",
      category: "Products",
    },
    {
      question: "How do I process an order?",
      answer:
        "When a new order comes in, you'll receive a notification. Go to the Orders section in your dashboard, find the order, and click to view details. You can update the order status as you process it, from 'Processing' to 'Shipped' and finally 'Delivered'. Make sure to add tracking information when shipping.",
      category: "Orders",
    },
    {
      question: "How are payments processed?",
      answer:
        "Payments are processed automatically through our platform. When a customer places an order, the payment is held until you fulfill the order. Once the order is marked as 'Shipped', the payment will be released to your account according to your payout schedule (weekly, bi-weekly, or monthly).",
      category: "Payments",
    },
    {
      question: "How do I handle returns or refunds?",
      answer:
        "If a customer requests a return or refund, you'll receive a notification. Go to the order details page and click on 'Process Return/Refund'. Follow the steps to approve the return, issue a refund, or resolve the issue in another way. All refunds must comply with your store's return policy.",
      category: "Orders",
    },
    {
      question: "How can I update my inventory in bulk?",
      answer:
        "To update multiple products at once, go to the Inventory section and click on 'Bulk Update'. You can download a CSV template, fill it with your updated inventory information, and then upload it back to the system. Alternatively, you can select multiple products and use the 'Bulk Edit' feature.",
      category: "Inventory",
    },
    {
      question: "How do I set up shipping rates?",
      answer:
        "Go to the Shipping section in your settings. You can set up different shipping methods based on weight, price, or location. You can create flat rates, tiered rates, or use real-time carrier rates. Make sure to specify any shipping restrictions or special handling requirements.",
      category: "Shipping",
    },
    {
      question: "How do I view my sales reports?",
      answer:
        "Sales reports are available in the Analytics section of your dashboard. You can view reports by day, week, month, or custom date ranges. Reports include revenue, order volume, average order value, top-selling products, and more. You can also export these reports as CSV or PDF files.",
      category: "Analytics",
    },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>Find answers to common seller questions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Search FAQs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <p>{faq.answer}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Category: {faq.category}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
