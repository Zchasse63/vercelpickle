import Image from "next/image"

import { SafeLink } from "@/components/ui/safe-link"
import { Button } from "@/components/ui/button"
import { SafeButton } from "@/components/ui/safe-button"

export function MarketplaceHero() {
  return (
    <section className="container px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Fresh Ingredients for Your Business
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Connect with quality food suppliers and get the best ingredients delivered to your doorstep.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <SafeButton size="lg" asChild>
              <SafeLink href="/marketplace/categories">Shop Now</SafeLink>
            </SafeButton>
            <SafeButton size="lg" variant="outline" asChild>
              <SafeLink href="/marketplace/become-seller">Become a Seller</SafeLink>
            </SafeButton>
          </div>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted lg:aspect-auto">
          <Image src="/marketplace-hero.jpg" alt="Fresh food ingredients" fill sizes="(max-width: 768px) 100vw, 600px" className="object-cover" priority />
        </div>
      </div>
    </section>
  )
}
