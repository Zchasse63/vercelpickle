import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SellerSupportTickets } from "@/components/seller/seller-support-tickets"
import { SellerCreateTicket } from "@/components/seller/seller-create-ticket"
import { SellerFaq } from "@/components/seller/seller-faq"

export default function SellerSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support</h1>
        <p className="text-muted-foreground">Get help with your seller account and store</p>
      </div>
      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="create">Create Ticket</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets" className="space-y-6">
          <SellerSupportTickets />
        </TabsContent>
        <TabsContent value="create" className="space-y-6">
          <SellerCreateTicket />
        </TabsContent>
        <TabsContent value="faq" className="space-y-6">
          <SellerFaq />
        </TabsContent>
      </Tabs>
    </div>
  )
}
