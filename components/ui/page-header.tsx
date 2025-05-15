import { cn } from "@/lib/utils"

interface PageHeaderProps {
  heading: string
  subheading?: string
  className?: string
}

export function PageHeader({ heading, subheading, className }: PageHeaderProps) {
  return (
    <div className={cn("bg-dill-green/10 py-8 md:py-12", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-dill-green md:text-4xl">
          {heading}
        </h1>
        {subheading && (
          <p className="mt-2 text-lg text-muted-foreground">
            {subheading}
          </p>
        )}
      </div>
    </div>
  )
}
