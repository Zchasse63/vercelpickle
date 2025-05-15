import { cn } from "@/lib/utils"

export type SkeletonAnimation = "pulse" | "wave" | "shimmer" | "none";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The animation type for the skeleton
   * @default "pulse"
   */
  animation?: SkeletonAnimation;

  /**
   * Whether to show the skeleton with a slight gradient
   * @default false
   */
  gradient?: boolean;
}

function Skeleton({
  className,
  animation = "pulse",
  gradient = false,
  ...props
}: SkeletonProps) {
  // Define animation classes
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-skeleton-wave",
    shimmer: "animate-skeleton-shimmer before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
    none: "",
  };

  // Define gradient class
  const gradientClass = gradient ? "bg-gradient-to-r from-muted to-muted/80" : "bg-muted";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md",
        gradientClass,
        animationClasses[animation],
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
