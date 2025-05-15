import { AdminFinancialDashboard } from "@/components/admin/lazy-admin-components"

export default function AdminFinancialPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Financial Dashboard</h1>
        <p className="text-muted-foreground">Manage your marketplace finances and revenue streams.</p>
      </div>

      <div className="space-y-4 animate-fade-up delay-100">
        <AdminFinancialDashboard />
      </div>
    </div>
  )
}
