"use client"

import { useState, useEffect } from "react"
import { Search, X, Package, ShoppingCart, User, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

// Sample search results data
const sampleResults = {
  products: [
    { id: "prod-1", name: "Organic Carrots (5lb)", category: "Vegetables", price: "$4.99" },
    { id: "prod-2", name: "Artisan Sourdough Bread", category: "Bakery", price: "$6.99" },
    { id: "prod-3", name: "Free-Range Eggs (Dozen)", category: "Dairy & Eggs", price: "$5.49" },
  ],
  orders: [
    { id: "ord-1", number: "#12345", customer: "John Doe", status: "Processing", total: "$45.97" },
    { id: "ord-2", number: "#12346", customer: "Jane Smith", status: "Shipped", total: "$32.50" },
  ],
  users: [
    { id: "user-1", name: "John Doe", email: "john@example.com", role: "Buyer" },
    { id: "user-2", name: "Green Farms", email: "contact@greenfarms.com", role: "Seller" },
  ],
  documents: [
    { id: "doc-1", name: "April 2023 Sales Report", type: "Report", date: "Apr 30, 2023" },
    { id: "doc-2", name: "Seller Agreement", type: "Contract", date: "Jan 15, 2023" },
  ]
}

export function AdminSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  
  // Simulate search functionality
  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true)
      const timer = setTimeout(() => {
        // Filter results based on query
        const filteredResults = {
          products: sampleResults.products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
          ),
          orders: sampleResults.orders.filter(o => 
            o.number.toLowerCase().includes(query.toLowerCase()) ||
            o.customer.toLowerCase().includes(query.toLowerCase()) ||
            o.status.toLowerCase().includes(query.toLowerCase())
          ),
          users: sampleResults.users.filter(u => 
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase()) ||
            u.role.toLowerCase().includes(query.toLowerCase())
          ),
          documents: sampleResults.documents.filter(d => 
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.type.toLowerCase().includes(query.toLowerCase())
          )
        }
        
        setResults(filteredResults)
        setIsSearching(false)
      }, 500)
      
      return () => clearTimeout(timer)
    } else {
      setResults(null)
    }
  }, [query])
  
  const clearSearch = () => {
    setQuery("")
    setResults(null)
  }
  
  const hasResults = results && (
    results.products.length > 0 || 
    results.orders.length > 0 || 
    results.users.length > 0 || 
    results.documents.length > 0
  )
  
  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="pl-8 pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="search-input"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-9 w-9"
            onClick={clearSearch}
            data-testid="clear-search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {query.length > 2 && (
        <div 
          className="absolute left-0 top-10 z-50 w-full rounded-md border bg-white shadow-lg"
          data-testid="search-results"
        >
          <div className="p-4">
            <h3 className="font-medium">Search Results</h3>
            {isSearching ? (
              <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
            ) : hasResults ? (
              <ScrollArea className="h-[400px] mt-2">
                {results.products.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-medium">Products</h4>
                    </div>
                    {results.products.map((product: any) => (
                      <Link 
                        key={product.id} 
                        href={`/admin/products/${product.id}`}
                        className="block p-2 rounded-md hover:bg-gray-50"
                        data-testid="search-result-item"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-muted-foreground">{product.price}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </Link>
                    ))}
                  </div>
                )}
                
                {results.orders.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-medium">Orders</h4>
                    </div>
                    {results.orders.map((order: any) => (
                      <Link 
                        key={order.id} 
                        href={`/admin/orders/${order.id}`}
                        className="block p-2 rounded-md hover:bg-gray-50"
                        data-testid="search-result-item"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{order.number}</span>
                          <span className="text-sm text-muted-foreground">{order.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.status}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                
                {results.users.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-medium">Users</h4>
                    </div>
                    {results.users.map((user: any) => (
                      <Link 
                        key={user.id} 
                        href={`/admin/users/${user.id}`}
                        className="block p-2 rounded-md hover:bg-gray-50"
                        data-testid="search-result-item"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100">{user.role}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </Link>
                    ))}
                  </div>
                )}
                
                {results.documents.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-medium">Documents</h4>
                    </div>
                    {results.documents.map((doc: any) => (
                      <Link 
                        key={doc.id} 
                        href={`/admin/documents/${doc.id}`}
                        className="block p-2 rounded-md hover:bg-gray-50"
                        data-testid="search-result-item"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{doc.name}</span>
                          <span className="text-xs text-muted-foreground">{doc.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{doc.type}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </ScrollArea>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No results found for "{query}"</p>
            )}
          </div>
          <Separator />
          <div className="p-2">
            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={clearSearch}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
