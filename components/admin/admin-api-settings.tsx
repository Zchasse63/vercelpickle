"use client"

import { useState } from "react"
import { Copy, Eye, EyeOff, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AdminApiSettings() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState("sk_live_51NZgLpGIJMl5H7T6Uw5oGWZz7gKJEy")
  const [testApiKey, setTestApiKey] = useState("sk_test_51NZgLpGIJMl5H7T6Uw5oGWZz7gKJEy")

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey)
  }

  const generateNewApiKey = () => {
    // In a real app, you would call an API to generate a new key
    const newKey =
      "sk_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setApiKey(newKey)
  }

  const generateNewTestApiKey = () => {
    // In a real app, you would call an API to generate a new key
    const newKey =
      "sk_test_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setTestApiKey(newKey)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>API Keys</AlertTitle>
        <AlertDescription>
          Your API keys grant full access to your account through the API. Never share your API keys in public areas
          such as GitHub, client-side code, or in your browser.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="live" className="space-y-4">
        <TabsList>
          <TabsTrigger value="live">Live Keys</TabsTrigger>
          <TabsTrigger value="test">Test Keys</TabsTrigger>
        </TabsList>
        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live API Keys</CardTitle>
              <CardDescription>Use these keys for production environments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="live-api-key">API Key</Label>
                <div className="flex">
                  <Input
                    id="live-api-key"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    readOnly
                    className="flex-1 font-mono"
                  />
                  <Button variant="outline" size="icon" onClick={toggleApiKeyVisibility} className="ml-2">
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showApiKey ? "Hide API key" : "Show API key"}</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(apiKey)} className="ml-2">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy API key</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="live-webhook" />
                <Label htmlFor="live-webhook">Enable Webhooks</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="live-rate-limiting" defaultChecked />
                <Label htmlFor="live-rate-limiting">Enable Rate Limiting</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={generateNewApiKey}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate API Key
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test API Keys</CardTitle>
              <CardDescription>Use these keys for development and testing environments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-api-key">Test API Key</Label>
                <div className="flex">
                  <Input
                    id="test-api-key"
                    type={showApiKey ? "text" : "password"}
                    value={testApiKey}
                    readOnly
                    className="flex-1 font-mono"
                  />
                  <Button variant="outline" size="icon" onClick={toggleApiKeyVisibility} className="ml-2">
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showApiKey ? "Hide API key" : "Show API key"}</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(testApiKey)} className="ml-2">
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy API key</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="test-webhook" />
                <Label htmlFor="test-webhook">Enable Webhooks</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="test-rate-limiting" defaultChecked />
                <Label htmlFor="test-rate-limiting">Enable Rate Limiting</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={generateNewTestApiKey}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Test API Key
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>Access resources to help you integrate with our API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="rounded-md bg-muted p-4">
            <h4 className="mb-2 font-medium">Getting Started</h4>
            <p className="text-sm text-muted-foreground">Learn how to authenticate and make your first API request.</p>
            <Button variant="link" className="px-0">
              View Documentation
            </Button>
          </div>
          <div className="rounded-md bg-muted p-4">
            <h4 className="mb-2 font-medium">API Reference</h4>
            <p className="text-sm text-muted-foreground">Explore the complete API reference documentation.</p>
            <Button variant="link" className="px-0">
              View API Reference
            </Button>
          </div>
          <div className="rounded-md bg-muted p-4">
            <h4 className="mb-2 font-medium">Webhooks</h4>
            <p className="text-sm text-muted-foreground">Learn how to set up and use webhooks for real-time updates.</p>
            <Button variant="link" className="px-0">
              View Webhooks Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
