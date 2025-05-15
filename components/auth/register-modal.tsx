"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface RegisterModalProps {
  onOpenLogin?: () => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function RegisterModal({ onOpenLogin, trigger, open, onOpenChange }: RegisterModalProps) {
  const router = useRouter()
  const { register } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [company, setCompany] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeTerms) {
      setError("You must agree to the terms and conditions")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      // Use the register function from the auth provider
      // Combine first and last name
      const fullName = `${firstName} ${lastName}`
      const success = await register(fullName, email, password, "buyer")

      if (success) {
        // Close the modal
        if (onOpenChange) {
          onOpenChange(false)
        }

        // Refresh the page to update the UI with the logged-in state
        router.refresh()
      } else {
        setError("Registration failed. Email may already be in use.")
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchToLogin = () => {
    if (onOpenChange) {
      onOpenChange(false)
    }
    if (onOpenLogin) {
      onOpenLogin()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]" data-testid="register-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#194D33]">Create an Account</DialogTitle>
          <DialogDescription>
            Join Pickle to access quality food suppliers for your business
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4" data-testid="register-form">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm" data-testid="register-error">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="border-[#5A9A3D]/30 focus:border-[#5A9A3D] focus:ring-[#5A9A3D]/20"
                data-testid="first-name-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="border-[#5A9A3D]/30 focus:border-[#5A9A3D] focus:ring-[#5A9A3D]/20"
                data-testid="last-name-input"
              />
            </div>
          </div>
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
              data-testid="email-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#5A9A3D]/30 focus:border-[#5A9A3D] focus:ring-[#5A9A3D]/20"
              data-testid="password-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              type="text"
              placeholder="Your Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="border-[#5A9A3D]/30 focus:border-[#5A9A3D] focus:ring-[#5A9A3D]/20"
              data-testid="company-input"
            />
          </div>
          <div className="flex items-start space-x-2" data-testid="terms-section">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              className="border-[#5A9A3D]/30 data-[state=checked]:bg-[#5A9A3D] data-[state=checked]:border-[#5A9A3D] mt-1"
              data-testid="terms-checkbox"
            />
            <label
              htmlFor="terms"
              className="text-sm text-muted-foreground"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-[#5A9A3D] hover:underline" data-testid="terms-link">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#5A9A3D] hover:underline" data-testid="privacy-link">
                Privacy Policy
              </Link>
            </label>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#F3B522] hover:bg-[#F3B522]/90 text-[#194D33] font-medium"
            disabled={isLoading}
            data-testid="register-submit"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center sm:space-x-2">
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleSwitchToLogin}
              className="text-[#5A9A3D] hover:underline font-medium"
              data-testid="login-link"
            >
              Log in
            </button>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
