import { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the LoginForm component
const LoginForm = dynamic(() => import("@/components/auth/login-form").then(mod => ({ default: mod.LoginForm })), {
  loading: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  ),
  ssr: false
});

export const metadata: Metadata = {
  title: "Login | Pickle B2B Marketplace",
  description: "Login to your Pickle B2B Marketplace account",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>
      
      <Suspense fallback={
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      }>
        <LoginForm />
      </Suspense>
      
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/register" className="underline underline-offset-4 hover:text-primary">
          Sign up
        </Link>
      </p>
      
      <p className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
