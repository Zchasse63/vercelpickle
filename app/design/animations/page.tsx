import { AnimationShowcase } from "@/components/design-system/animation-showcase"
import { PageTransition } from "@/components/ui/page-transition"

export default function AnimationsPage() {
  return (
    <PageTransition>
      <div className="container py-10">
        <AnimationShowcase />
      </div>
    </PageTransition>
  )
}
