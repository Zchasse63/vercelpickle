import { SafeLink } from "@/components/ui/safe-link"
import { Button } from "@/components/ui/button"

export function MarketplaceCTA() {
  return (
    <section className="container px-4 md:px-6">
      <div className="rounded-xl bg-primary/10 px-6 py-12 text-center md:px-12 md:py-16">
        <div className="mx-auto max-w-[800px] space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Transform Your Food Sourcing?</h2>
          <p className="text-muted-foreground md:text-lg">
            Join thousands of businesses that have simplified their supply chain with Pickle.
          </p>
          <div className="flex flex-col justify-center gap-2 min-[400px]:flex-row">
            <SafeLink href="/marketplace/auth/signup">
              <Button size="lg">Sign Up Now</Button>
            </SafeLink>
            <SafeLink href="/marketplace/contact">
              <Button size="lg" variant="outline">Contact Sales</Button>
            </SafeLink>
          </div>
        </div>
      </div>
    </section>
  )
}
