import { SupportTicketsTable } from "@/components/admin/support-tickets-table"

export default function AdminSupportPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
        <p className="text-muted-foreground">Manage and respond to customer support tickets.</p>
      </div>

      <SupportTicketsTable />
    </div>
  )
}
