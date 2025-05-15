"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, Send, Paperclip, Image as ImageIcon, File, MoreVertical, Search, Phone, Video, User, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DirectMessagingProps {
  className?: string
}

interface Contact {
  id: string
  name: string
  avatar: string
  company: string
  lastMessage: string
  lastMessageTime: Date
  unread: number
  online: boolean
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
  attachments?: {
    type: "image" | "file"
    url: string
    name: string
  }[]
}

export function DirectMessaging({ className }: DirectMessagingProps) {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.png",
      company: "Green Farms",
      lastMessage: "I can offer a 10% discount if you order 50 units or more.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      unread: 2,
      online: true
    },
    {
      id: "2",
      name: "Michael Chen",
      avatar: "/avatars/michael.png",
      company: "Valley Produce",
      lastMessage: "The shipment will be ready by Tuesday. Does that work for you?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unread: 0,
      online: true
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      avatar: "/avatars/emily.png",
      company: "Sunrise Bakery",
      lastMessage: "Thank you for your order! Let me know if you need anything else.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unread: 0,
      online: false
    },
    {
      id: "4",
      name: "David Kim",
      avatar: "/avatars/david.png",
      company: "Fresh Dairy Co.",
      lastMessage: "We have a new organic milk product that might interest you.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unread: 0,
      online: false
    },
    {
      id: "5",
      name: "Lisa Patel",
      avatar: "/avatars/lisa.png",
      company: "Organic Meats",
      lastMessage: "I've sent you the price list for our grass-fed beef products.",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      unread: 0,
      online: true
    }
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "1",
      receiverId: "current-user",
      content: "Hello! I saw you were interested in our organic apples.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: true
    },
    {
      id: "2",
      senderId: "current-user",
      receiverId: "1",
      content: "Yes, I'm looking to place a bulk order for my restaurant. What's your best price for 100 lbs?",
      timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
      read: true
    },
    {
      id: "3",
      senderId: "1",
      receiverId: "current-user",
      content: "For 100 lbs, I can offer $2.50 per lb, which is a 15% discount from our regular price.",
      timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
      read: true
    },
    {
      id: "4",
      senderId: "current-user",
      receiverId: "1",
      content: "That sounds good. What about delivery options?",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      read: true
    },
    {
      id: "5",
      senderId: "1",
      receiverId: "current-user",
      content: "We offer free delivery for orders over $200. Your order would qualify for that.",
      timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
      read: true
    },
    {
      id: "6",
      senderId: "1",
      receiverId: "current-user",
      content: "Here's a photo of this week's harvest:",
      timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
      read: true,
      attachments: [
        {
          type: "image",
          url: "/organic-apples.png",
          name: "apple-harvest.jpg"
        }
      ]
    },
    {
      id: "7",
      senderId: "current-user",
      receiverId: "1",
      content: "Those look great! I'd like to place the order. Can you also include some information about your farming practices?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: true
    },
    {
      id: "8",
      senderId: "1",
      receiverId: "current-user",
      content: "Absolutely! Here's our organic certification and a document about our sustainable farming practices.",
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      read: true,
      attachments: [
        {
          type: "file",
          url: "#",
          name: "organic-certification.pdf"
        },
        {
          type: "file",
          url: "#",
          name: "farming-practices.pdf"
        }
      ]
    },
    {
      id: "9",
      senderId: "1",
      receiverId: "current-user",
      content: "I can offer a 10% discount if you order 50 units or more.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false
    },
    {
      id: "10",
      senderId: "1",
      receiverId: "current-user",
      content: "Let me know if you're interested in this offer.",
      timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
      read: false
    }
  ])

  const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    const message: Message = {
      id: (messages.length + 1).toString(),
      senderId: "current-user",
      receiverId: selectedContact.id,
      content: newMessage,
      timestamp: new Date(),
      read: true
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Update last message in contacts
    setContacts(
      contacts.map((contact) =>
        contact.id === selectedContact.id
          ? {
              ...contact,
              lastMessage: newMessage,
              lastMessageTime: new Date()
            }
          : contact
      )
    )

    // Simulate reply after a delay
    if (selectedContact.id === "1") {
      setTimeout(() => {
        const reply: Message = {
          id: (messages.length + 2).toString(),
          senderId: selectedContact.id,
          receiverId: "current-user",
          content: "Thanks for your message. I'll get back to you shortly.",
          timestamp: new Date(),
          read: false
        }

        setMessages((prev) => [...prev, reply])

        // Update contact
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === selectedContact.id
              ? {
                  ...contact,
                  lastMessage: reply.content,
                  lastMessageTime: reply.timestamp,
                  unread: contact.unread + 1
                }
              : contact
          )
        )
      }, 5000)
    }
  }

  const handleContactSelect = (contact: Contact) => {
    // Mark messages as read
    setMessages(
      messages.map((message) =>
        message.senderId === contact.id && !message.read
          ? { ...message, read: true }
          : message
      )
    )

    // Reset unread count
    setContacts(
      contacts.map((c) =>
        c.id === contact.id ? { ...c, unread: 0 } : c
      )
    )

    setSelectedContact(contact)
  }

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMessages = messages.filter(
    (message) =>
      (message.senderId === selectedContact?.id && message.receiverId === "current-user") ||
      (message.senderId === "current-user" && message.receiverId === selectedContact?.id)
  )

  const formatMessageTime = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return format(date, "h:mm a")
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return format(date, "EEEE") // Day name
    } else {
      return format(date, "MMM d")
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Direct Messages
        </CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
        {/* Contacts sidebar */}
        <div className="border-r">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Tabs defaultValue="all">
            <div className="px-3 pt-3">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1 hover-scale">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1 hover-scale">Unread</TabsTrigger>
                <TabsTrigger value="sellers" className="flex-1 hover-scale">Sellers</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 p-2">
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      className={cn(
                        "w-full flex items-start gap-3 rounded-lg p-2 text-left hover:bg-accent",
                        selectedContact?.id === contact.id && "bg-accent"
                      )}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{contact.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(contact.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{contact.company}</p>
                        <p className="text-sm truncate">{contact.lastMessage}</p>
                      </div>
                      {contact.unread > 0 && (
                        <Badge className="ml-auto">{contact.unread}</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 p-2">
                  {filteredContacts
                    .filter((contact) => contact.unread > 0)
                    .map((contact) => (
                      <button
                        key={contact.id}
                        className={cn(
                          "w-full flex items-start gap-3 rounded-lg p-2 text-left hover:bg-accent",
                          selectedContact?.id === contact.id && "bg-accent"
                        )}
                        onClick={() => handleContactSelect(contact)}
                      >
                        <Avatar>
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(contact.lastMessageTime)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{contact.company}</p>
                          <p className="text-sm truncate">{contact.lastMessage}</p>
                        </div>
                        {contact.unread > 0 && (
                          <Badge className="ml-auto">{contact.unread}</Badge>
                        )}
                      </button>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="sellers" className="m-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 p-2">
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      className={cn(
                        "w-full flex items-start gap-3 rounded-lg p-2 text-left hover:bg-accent",
                        selectedContact?.id === contact.id && "bg-accent"
                      )}
                      onClick={() => handleContactSelect(contact)}
                    >
                      <Avatar>
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{contact.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(contact.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{contact.company}</p>
                        <p className="text-sm truncate">{contact.lastMessage}</p>
                      </div>
                      {contact.unread > 0 && (
                        <Badge className="ml-auto">{contact.unread}</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat area */}
        <div className="flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                    <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedContact.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      {selectedContact.online ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                          Online
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Last seen recently
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="hover-scale">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover-scale">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover-scale">
                    <User className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover-scale">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Search in conversation</DropdownMenuItem>
                      <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                      <DropdownMenuItem>Block contact</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.senderId === "current-user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3 animate-fade-up",
                          message.senderId === "current-user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <div className="space-y-2">
                          <p>{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="space-y-2 mt-2">
                              {message.attachments.map((attachment, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "flex items-center gap-2 p-2 rounded",
                                    message.senderId === "current-user"
                                      ? "bg-primary-foreground/10"
                                      : "bg-background"
                                  )}
                                >
                                  {attachment.type === "image" ? (
                                    <div className="relative h-32 w-32 rounded overflow-hidden">
                                      <img
                                        src={attachment.url}
                                        alt={attachment.name}
                                        className="object-cover h-full w-full"
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <File className="h-4 w-4" />
                                      <span className="text-sm">{attachment.name}</span>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div
                          className={cn(
                            "text-xs mt-1",
                            message.senderId === "current-user"
                              ? "text-primary-foreground/70 text-right"
                              : "text-muted-foreground"
                          )}
                        >
                          {format(message.timestamp, "h:mm a")}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-3 border-t">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type a message..."
                    className="min-h-[80px]"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="icon" className="hover-scale">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover-scale">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage} className="hover-scale">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div className="space-y-2">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">No conversation selected</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a contact from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
