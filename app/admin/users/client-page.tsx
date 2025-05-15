"use client";

import { UsersTable } from "@/components/admin/users-table";
import { AdminConvexProvider } from "@/components/admin/admin-convex-provider";

export default function AdminUsersClientPage() {
  return (
    <AdminConvexProvider>
      <main className="flex flex-col gap-4" data-testid="admin-users-page">
        <div data-testid="admin-header">
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">View and manage all users on the platform.</p>
        </div>

        <UsersTable />
      </main>
    </AdminConvexProvider>
  );
}
