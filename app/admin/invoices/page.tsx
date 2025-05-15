import { AdminInvoiceManagementLazy } from "@/components/admin/lazy-admin-components"

export default function AdminInvoicesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Invoice Management</h1>
        <p className="text-muted-foreground">Create, view, and manage invoices for your marketplace.</p>
      </div>

      <div className="space-y-4 animate-fade-up delay-100">
        <AdminInvoiceManagementLazy />
      </div>
    </div>
  )
}
