"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl font-bold text-red-500">Something went wrong!</h1>
      <p className="text-muted-foreground mt-4 max-w-md">
        We apologize for the inconvenience. Please try again or return to the home page.
      </p>
      <div className="flex gap-4 mt-8">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
        <Link href="/">
          <Button>
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
