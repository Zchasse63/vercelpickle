"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "You can track your order by going to the Orders section in your dashboard and clicking on the specific order. There you'll find real-time tracking information and delivery updates.",
    category: "orders",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit cards (Visa, Mastercard, American Express), bank transfers, and invoicing for approved business accounts. You can manage your payment methods in the Payment Methods section.",
    category: "billing",
  },
  {
    question: "How do I return a product?",
    answer:
      "To return a product, go to your Orders section, find the order containing the item you want to return, and click the 'Return Item' button. Follow the instructions to complete the return process.",
    category: "returns",
  },
  {
    question: "What is your shipping policy?",
    answer:
      "We offer standard shipping (3-5 business days), express shipping (1-2 business days), and same-day delivery for select areas. Shipping costs are calculated based on weight, dimensions, and delivery location.",
    category: "shipping",
  },
  {
    question: "How do I change my shipping address?",
    answer:
      "You can update your shipping addresses in the Shipping Addresses section of your dashboard. For orders that haven't shipped yet, you can also update the shipping address from the order details page.",
    category: "shipping",
  },
  {
    question: "Can I cancel an order?",
    answer:
      "Yes, you can cancel an order as long as it hasn't been processed for shipping. Go to the order details page and click the 'Cancel Order' button. If the order has already been processed, you'll need to contact support.",
    category: "orders",
  },
  {
    question: "How do I update my account information?",
    answer:
      "You can update your account information in the Settings section of your dashboard. This includes your personal details, company information, and password.",
    category: "account",
  },
  {
    question: "What should I do if I receive damaged goods?",
    answer:
      "If you receive damaged goods, please take photos of the damage and contact our support team immediately. You can create a support ticket with the photos attached for the fastest resolution.",
    category: "products",
  },
  {
    question: "How do I find specific products?",
    answer:
      "You can use the search bar at the top of the marketplace to find specific products. You can also browse by category, filter by various attributes, and sort results according to your preferences.",
    category: "products",
  },
  {
    question: "Do you offer bulk discounts?",
    answer:
      "Yes, we offer volume-based discounts for bulk orders. The discounts are automatically applied at checkout based on the quantity ordered. For large custom orders, please contact our sales team.",
    category: "billing",
  },
]

export function BuyerFaqList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = activeCategory === "all" || faq.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: "all", name: "All" },
    { id: "orders", name: "Orders" },
    { id: "shipping", name: "Shipping" },
    { id: "returns", name: "Returns" },
    { id: "billing", name: "Billing" },
    { id: "products", name: "Products" },
    { id: "account", name: "Account" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Input placeholder="Search FAQs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {filteredFaqs.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-gray-500">No FAQs found matching your search.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("")
              setActiveCategory("all")
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  )
}
