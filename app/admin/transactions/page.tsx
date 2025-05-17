import { AdminTransactionHistory } from "@/components/admin/lazy-admin-components"

export default function AdminTransactionsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground">View and manage all transactions across your marketplace.</p>
      </div>

      <div className="space-y-4 animate-fade-up delay-100">
        <AdminTransactionHistory />
      </div>
    </div>
  )
}
