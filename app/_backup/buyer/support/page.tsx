import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BuyerSupportTickets } from "@/components/buyer/buyer-support-tickets"
import { BuyerCreateTicket } from "@/components/buyer/buyer-create-ticket"
import { BuyerFaqList } from "@/components/buyer/buyer-faq-list"

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-gray-500">Get help with your orders and account.</p>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="create">Create Ticket</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Your Support Tickets</CardTitle>
              <CardDescription>View and manage your support requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <BuyerSupportTickets />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>Submit a new support request.</CardDescription>
            </CardHeader>
            <CardContent>
              <BuyerCreateTicket />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <BuyerFaqList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
