import Link from "next/link"
import Image from "next/image"
import { MarketplaceLoginForm } from "@/components/marketplace/marketplace-login-form"

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/marketplace" className="absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8">
        <div className="relative h-8 w-8">
          <Image src="/pickle-logo.png" alt="Pickle" fill sizes="32px" className="object-contain" />
        </div>
        <span className="text-lg font-bold text-[#194D33]">Pickle</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
        </div>
        <MarketplaceLoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/marketplace/auth/reset-password" className="hover:text-brand underline underline-offset-4">
            Forgot your password?
          </Link>
        </p>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/marketplace/auth/signup" className="hover:text-brand underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
