import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Design System - Pickle B2B Marketplace",
  description: "Design system for the Pickle B2B Marketplace",
}

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold">Pickle Design System</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="/design/animations"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Animations
              </Link>
              <Link
                href="/design/components"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Components
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
