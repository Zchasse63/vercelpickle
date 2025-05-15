"use client"

import React from "react"
import { motion, MotionProps, Variants, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import * as animations from "@/lib/animations"
import { useAnimationSettings } from "@/lib/animation-hooks"

export type AnimationVariant =
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "fadeOut"
  | "scale"
  | "staggerContainer"
  | "hoverScale"
  | "hoverLift"
  | "pulse"
  | "bounce"

export interface AnimatedProps extends MotionProps {
  children: React.ReactNode
  className?: string
  variant?: AnimationVariant
  delay?: number
  duration?: number
  custom?: any
  as?: React.ElementType
  whileHover?: AnimationVariant
  whileTap?: AnimationVariant
  animate?: AnimationVariant | string
  /**
   * Whether to force disable animations regardless of user preferences
   */
  disableAnimation?: boolean
  /**
   * Whether this is a critical animation that should run on first load
   */
  isCritical?: boolean
}

/**
 * Animated component wrapper
 * @param props - Component props
 * @returns Animated component
 */
export function Animated({
  children,
  className,
  variant = "fadeIn",
  delay = 0,
  duration = 0.5,
  custom,
  as = "div",
  whileHover,
  whileTap,
  animate = "visible",
  disableAnimation,
  isCritical = false,
  ...props
}: AnimatedProps) {
  // Check user preferences for animations
  const { shouldAnimate, isFirstLoad } = useAnimationSettings();

  // Determine if we should animate this component
  const shouldAnimateThis =
    !disableAnimation && // Not explicitly disabled
    shouldAnimate && // User doesn't prefer reduced motion
    (isCritical || !isFirstLoad); // Either critical or not first load

  // Get animation variants
  const getVariants = (type: AnimationVariant): Variants => {
    // If we shouldn't animate, return instant transitions
    if (!shouldAnimateThis) {
      return {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
        hover: {},
        tap: {},
      };
    }

    switch (type) {
      case "fadeIn":
        return animations.fadeIn(duration, delay)
      case "fadeInUp":
        return animations.fadeInUp(duration, delay)
      case "fadeInDown":
        return animations.fadeInDown(duration, delay)
      case "fadeInLeft":
        return animations.fadeInLeft(duration, delay)
      case "fadeInRight":
        return animations.fadeInRight(duration, delay)
      case "fadeOut":
        return animations.fadeOut(duration, delay)
      case "scale":
        return animations.scale(duration, delay)
      case "staggerContainer":
        return animations.staggerContainer(duration, delay)
      case "hoverScale":
        return animations.hoverScale()
      case "hoverLift":
        return animations.hoverLift()
      case "pulse":
        return animations.pulse()
      case "bounce":
        return animations.bounce()
      default:
        return animations.fadeIn(duration, delay)
    }
  }

  // Get hover and tap variants
  const hoverVariants = whileHover && shouldAnimateThis ? getVariants(whileHover) : undefined
  const tapVariants = whileTap && shouldAnimateThis ? getVariants(whileTap) : undefined

  // Create motion component
  const MotionComponent = motion[as as keyof typeof motion] || motion.div

  // If animations are disabled, render without animation props
  if (!shouldAnimateThis) {
    return (
      <div className={cn(className)} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  // Cast the MotionComponent to any to avoid TypeScript errors
  const AnimatedComponent = MotionComponent as any;

  return (
    <AnimatedComponent
      className={cn(className)}
      initial="hidden"
      animate={animate}
      variants={getVariants(variant)}
      custom={custom}
      whileHover={whileHover ? "hover" : undefined}
      whileTap={whileTap ? "tap" : undefined}
      {...props}
    >
      {children}
    </AnimatedComponent>
  )
}

/**
 * Animated container component
 * @param props - Component props
 * @returns Animated container component
 */
export function AnimatedContainer({
  children,
  className,
  delay = 0,
  duration = 0.1,
  ...props
}: AnimatedProps) {
  return (
    <Animated
      className={cn("w-full", className)}
      variant="staggerContainer"
      delay={delay}
      duration={duration}
      {...props}
    >
      {children}
    </Animated>
  )
}

/**
 * Animated item component
 * @param props - Component props
 * @returns Animated item component
 */
export function AnimatedItem({
  children,
  className,
  variant = "fadeInUp",
  delay = 0,
  duration = 0.5,
  ...props
}: AnimatedProps) {
  return (
    <Animated
      className={className}
      variant={variant}
      delay={delay}
      duration={duration}
      {...props}
    >
      {children}
    </Animated>
  )
}

/**
 * Animated image component
 * @param props - Component props
 * @returns Animated image component
 */
export function AnimatedImage({
  children,
  className,
  variant = "scale",
  delay = 0,
  duration = 0.5,
  whileHover = "hoverScale",
  ...props
}: AnimatedProps) {
  return (
    <Animated
      className={cn("overflow-hidden", className)}
      variant={variant}
      delay={delay}
      duration={duration}
      whileHover={whileHover}
      {...props}
    >
      {children}
    </Animated>
  )
}

/**
 * Animated button component
 * @param props - Component props
 * @returns Animated button component
 */
export function AnimatedButton({
  children,
  className,
  variant = "fadeIn",
  delay = 0,
  duration = 0.3,
  whileHover = "hoverScale",
  whileTap = "scale",
  ...props
}: AnimatedProps) {
  return (
    <Animated
      className={className}
      variant={variant}
      delay={delay}
      duration={duration}
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
    >
      {children}
    </Animated>
  )
}
