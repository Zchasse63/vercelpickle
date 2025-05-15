"use client"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { MessageSquare, Search, Phone, Video, Image, Paperclip, Send, Info, User, MoreHorizontal, ChevronRight, Package, FileText } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Separator,
  ScrollArea,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui-kit"

// Mock data for conversations
const mockConversations = [
  {
    id: "conv-1",
    contact: {
      id: "user-1",
      name: "Metro Grocery",
      avatar: null,
      status: "online",
      lastSeen: new Date(),
    },
    messages: [
      {
        id: "msg-1",
        sender: "them",
        content: "Hi there! I'm interested in your organic apples. Do you have any Honeycrisp variety available?",
        timestamp: new Date("2025-05-05T10:30:00"),
        read: true,
      },
      {
        id: "msg-2",
        sender: "me",
        content: "Hello! Yes, we currently have Honeycrisp apples in stock. They're available in 40lb cases. How many would you be interested in?",
        timestamp: new Date("2025-05-05T10:35:00"),
        read: true,
      },
      {
        id: "msg-3",
        sender: "them",
        content: "Great! We're looking to order about 20 cases for our stores. What's your current pricing?",
        timestamp: new Date("2025-05-05T10:40:00"),
        read: true,
      },
      {
        id: "msg-4",
        sender: "me",
        content: "For an order of 20 cases, we can offer them at $42 per case. That includes delivery within the metro area. Would that work for you?",
        timestamp: new Date("2025-05-05T10:45:00"),
        read: true,
      },
      {
        id: "msg-5",
        sender: "them",
        content: "That sounds reasonable. Can you deliver next Tuesday morning?",
        timestamp: new Date("2025-05-05T10:50:00"),
        read: false,
      },
    ],
    unreadCount: 1,
    relatedTo: {
      type: "product",
      id: "prod-1",
      name: "Organic Honeycrisp Apples",
    },
  },
  {
    id: "conv-2",
    contact: {
      id: "user-2",
      name: "Sunshine Catering",
      avatar: null,
      status: "offline",
      lastSeen: new Date("2025-05-04T16:45:00"),
    },
    messages: [
      {
        id: "msg-6",
        sender: "them",
        content: "Hello, we received our cheese order yesterday but noticed one box was damaged during shipping. Can we discuss a replacement?",
        timestamp: new Date("2025-05-04T14:20:00"),
        read: true,
      },
      {
        id: "msg-7",
        sender: "me",
        content: "I'm sorry to hear about the damaged box. We'd be happy to replace it. Can you send a photo of the damage for our records?",
        timestamp: new Date("2025-05-04T14:30:00"),
        read: true,
      },
      {
        id: "msg-8",
        sender: "them",
        content: "Of course, I'll send that right away. When can we expect the replacement?",
        timestamp: new Date("2025-05-04T14:35:00"),
        read: true,
      },
      {
        id: "msg-9",
        sender: "me",
        content: "Once we receive the photo, we can ship a replacement box tomorrow. You should receive it by Thursday at the latest.",
        timestamp: new Date("2025-05-04T14:40:00"),
        read: true,
      },
    ],
    unreadCount: 0,
    relatedTo: {
      type: "order",
      id: "order-1242",
      name: "Premium Cheese Order",
    },
  },
  {
    id: "conv-3",
    contact: {
      id: "user-3",
      name: "Health Foods Inc.",
      avatar: null,
      status: "online",
      lastSeen: new Date(),
    },
    messages: [
      {
        id: "msg-10",
        sender: "them",
        content: "Hi, I'd like to inquire about setting up a recurring order for your organic spinach. We need about 30 cases per week for our stores.",
        timestamp: new Date("2025-05-03T09:15:00"),
        read: true,
      },
      {
        id: "msg-11",
        sender: "me",
        content: "Hello! We'd be happy to set up a recurring order. For that volume, we can offer a 10% discount off our regular pricing. Would you like me to send over a formal proposal?",
        timestamp: new Date("2025-05-03T09:25:00"),
        read: true,
      },
      {
        id: "msg-12",
        sender: "them",
        content: "That sounds great. Yes, please send over a proposal with the pricing and delivery details.",
        timestamp: new Date("2025-05-03T09:30:00"),
        read: true,
      },
      {
        id: "msg-13",
        sender: "me",
        content: "Perfect! I'll prepare that today and send it over by end of day. Is there a specific day of the week that works best for deliveries?",
        timestamp: new Date("2025-05-03T09:35:00"),
        read: true,
      },
      {
        id: "msg-14",
        sender: "them",
        content: "Wednesdays would be ideal for our inventory cycle. Looking forward to receiving the proposal!",
        timestamp: new Date("2025-05-03T09:40:00"),
        read: true,
      },
      {
        id: "msg-15",
        sender: "me",
        content: "I've just sent the proposal to your email. Please let me know if you have any questions or if you'd like to make any adjustments.",
        timestamp: new Date("2025-05-03T16:30:00"),
        read: true,
      },
      {
        id: "msg-16",
        sender: "them",
        content: "Got it, thank you! We'll review it and get back to you tomorrow.",
        timestamp: new Date("2025-05-03T16:45:00"),
        read: true,
      },
    ],
    unreadCount: 0,
    relatedTo: {
      type: "product",
      id: "prod-3",
      name: "Organic Spinach",
    },
  },
]

export function DirectMessaging() {
  const [conversations, setConversations] = useState(mockConversations)
  const [activeConversation, setActiveConversation] = useState<typeof mockConversations[0] | null>(conversations[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation => 
    conversation.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conversation.relatedTo && conversation.relatedTo.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  
  // Scroll to bottom of messages when active conversation changes or new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeConversation])
  
  // Mark messages as read when conversation becomes active
  useEffect(() => {
    if (activeConversation) {
      setConversations(conversations.map(conversation => 
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              messages: conversation.messages.map(message => ({ ...message, read: true })),
              unreadCount: 0,
            }
          : conversation
      ))
    }
  }, [activeConversation])
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return
    
    const updatedConversations = conversations.map(conversation => 
      conversation.id === activeConversation.id
        ? {
            ...conversation,
            messages: [
              ...conversation.messages,
              {
                id: `msg-${Date.now()}`,
                sender: "me",
                content: newMessage,
                timestamp: new Date(),
                read: true,
              }
            ],
          }
        : conversation
    )
    
    setConversations(updatedConversations)
    setActiveConversation(updatedConversations.find(c => c.id === activeConversation.id) || null)
    setNewMessage("")
  }
  
  return (
    <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-lg border">
      {/* Conversations sidebar */}
      <div className="w-full max-w-xs border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
          <p className="text-sm text-muted-foreground">
            {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)} unread messages
          </p>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-1 p-2">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={`w-full text-left rounded-lg p-3 transition-colors ${
                        activeConversation?.id === conversation.id
                          ? "bg-muted"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {conversation.contact.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">
                              {conversation.contact.name}
                            </h3>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(conversation.messages[conversation.messages.length - 1].timestamp, "h:mm a")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.messages[conversation.messages.length - 1].content}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          {conversation.relatedTo && (
                            <div className="flex items-center mt-1">
                              {conversation.relatedTo.type === "product" ? (
                                <Package className="h-3 w-3 mr-1 text-muted-foreground" />
                              ) : (
                                <FileText className="h-3 w-3 mr-1 text-muted-foreground" />
                              )}
                              <span className="text-xs text-muted-foreground truncate">
                                {conversation.relatedTo.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No conversations found
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-1 p-2">
                {filteredConversations.filter(c => c.unreadCount > 0).length > 0 ? (
                  filteredConversations
                    .filter(c => c.unreadCount > 0)
                    .map((conversation) => (
                      <button
                        key={conversation.id}
                        className={`w-full text-left rounded-lg p-3 transition-colors ${
                          activeConversation?.id === conversation.id
                            ? "bg-muted"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setActiveConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {conversation.contact.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium truncate">
                                {conversation.contact.name}
                              </h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {format(conversation.messages[conversation.messages.length - 1].timestamp, "h:mm a")}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.messages[conversation.messages.length - 1].content}
                              </p>
                              <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                                {conversation.unreadCount}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No unread messages
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Active conversation */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {activeConversation.contact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{activeConversation.contact.name}</h3>
                <div className="flex items-center">
                  <span className={`h-2 w-2 rounded-full mr-1 ${
                    activeConversation.contact.status === "online" ? "bg-green-500" : "bg-gray-300"
                  }`} />
                  <span className="text-xs text-muted-foreground">
                    {activeConversation.contact.status === "online" 
                      ? "Online" 
                      : `Last seen ${format(activeConversation.contact.lastSeen, "h:mm a")}`
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
                <span className="sr-only">Call</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
                <span className="sr-only">Video call</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View contact info</DropdownMenuItem>
                  <DropdownMenuItem>View order history</DropdownMenuItem>
                  <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                  <DropdownMenuItem>Archive conversation</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {activeConversation.relatedTo && (
            <div className="p-2 bg-muted/30 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {activeConversation.relatedTo.type === "product" ? (
                    <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  )}
                  <span className="text-sm">
                    {activeConversation.relatedTo.type === "product" ? "Product: " : "Order: "}
                    <span className="font-medium">{activeConversation.relatedTo.name}</span>
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </div>
            </div>
          )}
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {activeConversation.messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "them" && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>
                        {activeConversation.contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div 
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "me" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className="flex items-center justify-end mt-1 gap-1">
                      <span className="text-xs opacity-70">
                        {format(message.timestamp, "h:mm a")}
                      </span>
                      {message.sender === "me" && (
                        <span className="text-xs opacity-70">
                          {message.read ? "Read" : "Sent"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Image className="h-4 w-4" />
                <span className="sr-only">Attach image</span>
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
              </div>
              <Button 
                size="icon" 
                disabled={!newMessage.trim()}
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No conversation selected</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Select a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
