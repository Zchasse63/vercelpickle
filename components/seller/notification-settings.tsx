"use client"

import { useState } from "react"
import { Bell, Mail, MessageSquare, Smartphone, Calendar, Clock, Settings, AlertCircle, Info } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Switch,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Alert,
  AlertDescription,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from "@/components/ui-kit"
import { useForm } from "react-hook-form"

// Mock notification settings
const initialNotificationSettings = {
  // Order notifications
  newOrderEmail: true,
  newOrderSms: true,
  newOrderPush: true,
  orderStatusChangeEmail: true,
  orderStatusChangeSms: false,
  orderStatusChangePush: true,
  orderCancellationEmail: true,
  orderCancellationSms: true,
  orderCancellationPush: true,
  
  // Inventory notifications
  lowStockEmail: true,
  lowStockSms: false,
  lowStockPush: true,
  lowStockThreshold: 10,
  outOfStockEmail: true,
  outOfStockSms: true,
  outOfStockPush: true,
  
  // Message notifications
  newMessageEmail: true,
  newMessageSms: false,
  newMessagePush: true,
  
  // Payment notifications
  paymentReceivedEmail: true,
  paymentReceivedSms: false,
  paymentReceivedPush: true,
  
  // Schedule
  doNotDisturbStart: "22:00",
  doNotDisturbEnd: "08:00",
  doNotDisturbEnabled: false,
  
  // Delivery preferences
  emailDigestFrequency: "daily", // "none", "daily", "weekly"
  emailDigestTime: "08:00",
}

// Mock recent notifications
const mockRecentNotifications = [
  {
    id: "notif-1",
    type: "order",
    title: "New Order Received",
    description: "Order #12345 received from Metro Grocery",
    timestamp: new Date("2025-05-05T10:30:00"),
    read: true,
  },
  {
    id: "notif-2",
    type: "inventory",
    title: "Low Stock Alert",
    description: "Organic Honeycrisp Apples (5 cases remaining)",
    timestamp: new Date("2025-05-05T09:15:00"),
    read: true,
  },
  {
    id: "notif-3",
    type: "message",
    title: "New Message",
    description: "Message from Sunshine Catering regarding order #12346",
    timestamp: new Date("2025-05-04T14:20:00"),
    read: false,
  },
  {
    id: "notif-4",
    type: "payment",
    title: "Payment Received",
    description: "Payment of $4,500.00 received for order #12347",
    timestamp: new Date("2025-05-03T16:45:00"),
    read: true,
  },
  {
    id: "notif-5",
    type: "order",
    title: "Order Status Updated",
    description: "Order #12348 status changed to 'Shipped'",
    timestamp: new Date("2025-05-02T11:30:00"),
    read: true,
  },
]

export function NotificationSettings() {
  const [settings, setSettings] = useState(initialNotificationSettings)
  const [activeTab, setActiveTab] = useState("settings")
  const [notifications, setNotifications] = useState(mockRecentNotifications)
  
  const form = useForm({
    defaultValues: initialNotificationSettings,
  })
  
  const onSubmit = (data: typeof initialNotificationSettings) => {
    setSettings(data)
    // In a real app, this would save to the backend
    console.log("Saving notification settings:", data)
  }
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }
  
  const clearAllNotifications = () => {
    setNotifications([])
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notification Settings</h2>
          <p className="text-muted-foreground">
            Manage how and when you receive notifications
          </p>
        </div>
      </div>

      <Tabs defaultValue="settings" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
          <TabsTrigger value="recent">
            Recent Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Notifications</CardTitle>
                  <CardDescription>
                    Notifications related to new orders and order status changes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">New Order</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="newOrderEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Email</FormLabel>
                              <FormDescription>
                                <Mail className="h-4 w-4 inline mr-1" />
                                Receive email notifications
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="newOrderSms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>SMS</FormLabel>
                              <FormDescription>
                                <Smartphone className="h-4 w-4 inline mr-1" />
                                Receive text message alerts
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="newOrderPush"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Push</FormLabel>
                              <FormDescription>
                                <Bell className="h-4 w-4 inline mr-1" />
                                Receive push notifications
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Order Status Change</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="orderStatusChangeEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Email</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="orderStatusChangeSms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>SMS</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="orderStatusChangePush"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Push</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Notifications</CardTitle>
                  <CardDescription>
                    Notifications related to inventory levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Low Stock Alerts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="lowStockEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Email</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lowStockSms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>SMS</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lowStockPush"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Push</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="lowStockThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Low Stock Threshold</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            You'll be notified when inventory falls below this level
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Preferences</CardTitle>
                  <CardDescription>
                    Control when and how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="doNotDisturbEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Do Not Disturb</FormLabel>
                          <FormDescription>
                            Pause notifications during specific hours
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("doNotDisturbEnabled") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="doNotDisturbStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="doNotDisturbEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="emailDigestFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Digest</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Receive a summary of all notifications
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("emailDigestFrequency") !== "none" && (
                    <FormField
                      control={form.control}
                      name="emailDigestTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Digest Delivery Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
              
              <Button type="submit">Save Notification Settings</Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recent Notifications</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All as Read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllNotifications}>
                Clear All
              </Button>
            </div>
          </div>
          
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border ${notification.read ? "" : "bg-muted/30"}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === "order" ? "bg-blue-100" :
                      notification.type === "inventory" ? "bg-yellow-100" :
                      notification.type === "message" ? "bg-green-100" :
                      "bg-purple-100"
                    }`}>
                      {notification.type === "order" ? <Bell className="h-4 w-4 text-blue-600" /> :
                       notification.type === "inventory" ? <AlertCircle className="h-4 w-4 text-yellow-600" /> :
                       notification.type === "message" ? <MessageSquare className="h-4 w-4 text-green-600" /> :
                       <Info className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No notifications to display</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
