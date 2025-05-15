import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Edit, Lock, Unlock, Mail, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const metadata: Metadata = {
  title: 'User Details - Admin - Pickle B2B Marketplace',
  description: 'View and manage user details as an admin on Pickle B2B Marketplace.',
};

export default function AdminUserDetailsPage({ params }: { params: { id: string } }) {
  // Unwrap params with React.use()
  const { id } = React.use(Promise.resolve(params));

  // This would typically come from your data fetching logic
  const user = {
    id,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    role: 'Buyer',
    status: 'Active',
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date('2023-05-20'),
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'United States',
    },
    orders: [
      {
        id: 'ORD-001',
        date: new Date('2023-05-15'),
        total: 345.00,
        status: 'Delivered',
      },
      {
        id: 'ORD-008',
        date: new Date('2023-04-22'),
        total: 129.50,
        status: 'Delivered',
      },
      {
        id: 'ORD-015',
        date: new Date('2023-03-10'),
        total: 78.25,
        status: 'Delivered',
      },
    ],
    activity: [
      {
        action: 'Logged in',
        date: new Date('2023-05-20T14:30:00'),
        ip: '192.168.1.1',
      },
      {
        action: 'Updated profile',
        date: new Date('2023-05-18T10:15:00'),
        ip: '192.168.1.1',
      },
      {
        action: 'Placed order',
        date: new Date('2023-05-15T09:30:00'),
        ip: '192.168.1.1',
      },
      {
        action: 'Logged in',
        date: new Date('2023-05-15T09:25:00'),
        ip: '192.168.1.1',
      },
    ],
    notes: 'Regular customer with good payment history.',
  };

  return (
    <main className="space-y-6" data-testid="user-details">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold" data-testid="user-name">User: {user.name}</h1>
          <p className="text-muted-foreground">
            User ID: {user.id}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Email User
          </Button>
          <Button variant="outline" size="sm" data-testid="edit-user-button">
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </Button>
          {user.status === 'Active' ? (
            <Button variant="destructive" size="sm">
              <Lock className="mr-2 h-4 w-4" />
              Suspend User
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              <Unlock className="mr-2 h-4 w-4" />
              Activate User
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>User Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Current Status</p>
                <div className="flex items-center justify-between mt-1">
                  <Badge className={user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'} data-testid="user-status">
                    {user.status}
                  </Badge>
                  <Select defaultValue={user.status} data-testid="status-select">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">User Role</p>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="outline" data-testid="user-role">
                    {user.role}
                  </Badge>
                  <Select defaultValue={user.role} data-testid="role-select">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Seller">Seller</SelectItem>
                      <SelectItem value="Buyer">Buyer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Account Created</p>
                <p className="text-sm text-muted-foreground">
                  {user.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Login</p>
                <p className="text-sm text-muted-foreground">
                  {user.lastLogin.toLocaleDateString()} at {user.lastLogin.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/images/avatars/01.png" alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">
                {user.address.street}<br />
                {user.address.city}, {user.address.state} {user.address.zip}<br />
                {user.address.country}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Account Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Not enabled</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Password Reset</p>
                  <p className="text-xs text-muted-foreground">Last reset: Never</p>
                </div>
                <Button variant="outline" size="sm">Reset</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Login Attempts</p>
                  <p className="text-xs text-muted-foreground">No failed attempts</p>
                </div>
                <Button variant="ghost" size="sm">View Log</Button>
              </div>
              <div className="rounded-md bg-amber-50 p-3 flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Security Notice</p>
                  <p className="text-xs text-amber-700">
                    Changes to user security settings are logged and audited.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="notes">Admin Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                Recent orders placed by this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.orders.map((order) => (
                    <TableRow key={order.id} data-testid="order-row">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'Delivered' ? 'success' : 'default'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/orders/${order.id}`} data-testid="view-order-button">View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {user.orders.length === 0 && (
                <div className="flex items-center justify-center p-4 text-muted-foreground">
                  No orders found for this user.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Recent user activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.activity.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>
                        {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString()}
                      </TableCell>
                      <TableCell>{activity.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Admin Notes</CardTitle>
                <Button variant="ghost" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm">{user.notes || 'No notes available for this user.'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
