import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "bg-transparent text-foreground hover:bg-muted",
        // Status variants
        success: "border-transparent bg-green-500 text-white hover:bg-green-500/80",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-500/80",
        // Brand-specific variants
        dill: "border-transparent bg-dill-green text-white hover:bg-dill-green/80",
        pickle: "border-transparent bg-pickle-green text-white hover:bg-pickle-green/80",
        mustard: "border-transparent bg-golden-mustard text-dill-green hover:bg-golden-mustard/80",
        beige: "border-transparent bg-brined-beige text-dill-green hover:bg-brined-beige/80",
        olive: "border-transparent bg-smoked-olive text-white hover:bg-smoked-olive/80",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      shape: {
        rounded: "rounded-full",
        square: "rounded-md",
      },
      color: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        accent: "bg-accent text-accent-foreground",
        muted: "bg-muted text-muted-foreground",
        brand: "bg-pickle-green text-white",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "rounded",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({ className, variant, size, shape, color, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp className={cn(badgeVariants({ variant, size, shape, color }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
