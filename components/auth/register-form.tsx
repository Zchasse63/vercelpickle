"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loading } from "@/components/ui/loading";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await register(name, email, password, role);

      if (success) {
        // Redirect based on user role
        if (role === "seller") {
          router.push("/seller");
        } else if (role === "buyer") {
          router.push("/buyer");
        } else if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/marketplace");
        }
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md" data-testid="register-form-card">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
          {error && (
            <Alert variant="destructive" data-testid="register-error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              data-testid="name-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
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
              autoComplete="new-password"
              required
              data-testid="password-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              data-testid="confirm-password-input"
            />
          </div>
          <div className="space-y-2" data-testid="account-type-section">
            <Label>Account Type</Label>
            <RadioGroup value={role} onValueChange={setRole} className="flex flex-col space-y-1" data-testid="account-type-radio">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buyer" id="buyer" data-testid="buyer-radio" />
                <Label htmlFor="buyer" className="cursor-pointer">Buyer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="seller" id="seller" data-testid="seller-radio" />
                <Label htmlFor="seller" className="cursor-pointer">Seller</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="register-button">
            {isSubmitting ? <Loading size="sm" /> : "Register"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline" data-testid="login-link">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
