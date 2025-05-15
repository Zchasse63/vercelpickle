"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SimpleLoginModalProps {
  onOpenRegister?: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SimpleLoginModal({ onOpenRegister, open, onOpenChange }: SimpleLoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Mock login - in a real app, this would call an authentication API
      console.log("Logging in with:", { email, password, rememberMe })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Success - in a real app, this would store auth tokens, etc.
      onOpenChange(false)

      // Show success message
      alert("Login successful!")
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchToRegister = () => {
    onOpenChange(false)
    if (onOpenRegister) {
      onOpenRegister()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" data-testid="login-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#194D33]">Log in to Pickle</DialogTitle>
          <DialogDescription>
            Enter your email and password to access your account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4" data-testid="login-form">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm" data-testid="login-error">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#5A9A3D]/30 focus:border-[#5A9A3D] focus:ring-[#5A9A3D]/20"
              data-testid="login-email"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#5A9A3D] hover:underline"
                data-testid="forgot-password-link"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#5A9A3D]/30 focus:border-[#5A9A3D] focus:ring-[#5A9A3D]/20"
              data-testid="login-password"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="border-[#5A9A3D]/30 data-[state=checked]:bg-[#5A9A3D] data-[state=checked]:border-[#5A9A3D]"
              data-testid="remember-checkbox"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#5A9A3D] hover:bg-[#5A9A3D]/90 text-white"
            disabled={isLoading}
            data-testid="login-submit"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center sm:space-x-2">
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleSwitchToRegister}
              className="text-[#5A9A3D] hover:underline font-medium"
              data-testid="signup-link"
            >
              Sign up
            </button>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
