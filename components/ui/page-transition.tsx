"use client"

import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { animations } from "@/lib/animations"
import { useAnimationSettings } from "@/lib/animation-hooks"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
  /**
   * Whether this is a critical page that should animate on first load
   */
  isCritical?: boolean
}

/**
 * Page transition component
 * Wraps page content with a fade-in animation
 *
 * @param props - Component props
 * @returns Animated page component
 */
export function PageTransition({
  children,
  className,
  isCritical = false,
}: PageTransitionProps) {
  const { shouldAnimate, isFirstLoad } = useAnimationSettings();
  const [isVisible, setIsVisible] = useState(false);

  // Determine if we should animate this page
  const shouldAnimateThis = shouldAnimate && (isCritical || !isFirstLoad);

  useEffect(() => {
    if (shouldAnimateThis) {
      // Small delay to ensure the animation runs after the component mounts
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [shouldAnimateThis]);

  // If animations are disabled, render without animation
  if (!shouldAnimateThis) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        isVisible ? animations.fadeIn : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Staggered list component
 * Animates list items with a staggered effect
 *
 * @param props - Component props
 * @returns Animated list component
 */
export function StaggeredList({
  children,
  className,
  itemDelay = 100,
  containerDelay = 0,
  isCritical = false,
}: {
  children: React.ReactNode
  className?: string
  itemDelay?: number
  containerDelay?: number
  isCritical?: boolean
}) {
  const { shouldAnimate, isFirstLoad } = useAnimationSettings();
  const [isVisible, setIsVisible] = useState(false);

  // Determine if we should animate this list
  const shouldAnimateThis = shouldAnimate && (isCritical || !isFirstLoad);

  useEffect(() => {
    if (shouldAnimateThis) {
      // Small delay to ensure the animation runs after the component mounts
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [shouldAnimateThis]);

  // If animations are disabled, render without animation
  if (!shouldAnimateThis) {
    return <div className={className}>{children}</div>;
  }

  // Get container delay class
  let containerDelayClass = "";
  if (containerDelay > 0) {
    if (containerDelay <= 100) containerDelayClass = animations.delay100;
    else if (containerDelay <= 200) containerDelayClass = animations.delay200;
    else if (containerDelay <= 300) containerDelayClass = animations.delay300;
    else if (containerDelay <= 400) containerDelayClass = animations.delay400;
    else containerDelayClass = animations.delay500;
  }

  // Create staggered children
  const staggeredChildren = React.Children.map(children, (child, index) => {
    // Calculate delay class based on index
    let delayClass = "";
    const delay = index * itemDelay;

    if (delay <= 100) delayClass = animations.delay100;
    else if (delay <= 200) delayClass = animations.delay200;
    else if (delay <= 300) delayClass = animations.delay300;
    else if (delay <= 400) delayClass = animations.delay400;
    else delayClass = animations.delay500;

    return (
      <div
        className={cn(
          isVisible ? cn(animations.fadeInUp, delayClass) : "opacity-0"
        )}
      >
        {child}
      </div>
    );
  });

  return (
    <div
      className={cn(
        isVisible ? containerDelayClass : "opacity-0",
        className
      )}
    >
      {staggeredChildren}
    </div>
  );
}
