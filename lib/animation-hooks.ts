/**
 * Animation hooks for the Pickle B2B Marketplace
 *
 * This file contains custom hooks for common animation patterns.
 * These hooks make animations more declarative and reusable.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { animations } from "./animations";
import { cn } from "./utils";
import { useMotionValue, useTransform, MotionValue } from "framer-motion";

/**
 * Hook to check if user prefers reduced motion
 * @returns Whether animations should be disabled
 */
export function useAnimationSettings() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    // Mark first load as complete after a short delay
    const timer = setTimeout(() => {
      setIsFirstLoad(false);
    }, 300);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      clearTimeout(timer);
    };
  }, []);

  return {
    // Disable animations if user prefers reduced motion or during first load
    shouldAnimate: !prefersReducedMotion && !isFirstLoad,
    prefersReducedMotion,
    isFirstLoad,
  };
}

/**
 * Hook for scroll-triggered animations
 * @param options - Configuration options
 * @returns Animation class names and ref to attach to the element
 */
export function useScrollAnimation(options: {
  animationClass?: string;
  threshold?: number;
  once?: boolean;
}) {
  const {
    animationClass = animations.fadeInUp,
    threshold = 0.1,
    once = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const { shouldAnimate } = useAnimationSettings();

  const callbackRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setRef(node);
    }
  }, []);

  useEffect(() => {
    if (!ref || !shouldAnimate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, once, shouldAnimate]);

  // We'll handle the animation state in the return statement

  return {
    ref: callbackRef,
    className: shouldAnimate && isVisible ? animationClass : "opacity-0",
  };
}

/**
 * Hook for staggered animations of list items
 * @param count - Number of items in the list
 * @param options - Configuration options
 * @returns Animation class names for container and items
 */
export function useStaggeredAnimation(
  count: number,
  options: {
    animationClass?: string;
    containerDelay?: number;
    once?: boolean;
  } = {}
) {
  const {
    animationClass = animations.fadeInUp,
    containerDelay = 0,
    once = true,
  } = options;

  const { shouldAnimate } = useAnimationSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  const callbackRef = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setRef(node);
    }
  }, []);

  useEffect(() => {
    if (!ref || !shouldAnimate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, once, shouldAnimate]);

  // We'll handle the animation state later, but keep the hook order consistent

  // Get delay class based on container delay
  let containerDelayClass = "";
  if (containerDelay > 0) {
    if (containerDelay <= 100) containerDelayClass = animations.delay100;
    else if (containerDelay <= 200) containerDelayClass = animations.delay200;
    else if (containerDelay <= 300) containerDelayClass = animations.delay300;
    else if (containerDelay <= 400) containerDelayClass = animations.delay400;
    else containerDelayClass = animations.delay500;
  }

  // Return appropriate values based on animation state
  return {
    containerRef: callbackRef,
    containerClassName: shouldAnimate && isVisible ? containerDelayClass : "opacity-0",
    getItemClassName: (index: number) => {
      if (!shouldAnimate || !isVisible) return "opacity-0";

      // Calculate delay based on index
      const delay = index * 100;
      let delayClass = "";

      if (delay <= 100) delayClass = animations.delay100;
      else if (delay <= 200) delayClass = animations.delay200;
      else if (delay <= 300) delayClass = animations.delay300;
      else if (delay <= 400) delayClass = animations.delay400;
      else delayClass = animations.delay500;

      return cn(animationClass, delayClass);
    },
  };
}

/**
 * Hook for tracking animation performance
 * @param id - Identifier for the animation
 * @returns Functions to start and end performance tracking
 */
export function useAnimationPerformance(id: string) {
  const [startTime, setStartTime] = useState<number | null>(null);

  const startTracking = () => {
    setStartTime(performance.now());
  };

  const endTracking = () => {
    if (startTime !== null) {
      const duration = performance.now() - startTime;
      console.log(`Animation ${id} took ${duration.toFixed(2)}ms`);

      // Log performance issues
      if (duration > 100) {
        console.warn(`Animation ${id} took longer than 100ms (${duration.toFixed(2)}ms)`);
        // Could send to analytics here
      }

      setStartTime(null);
    }
  };

  return { startTracking, endTracking };
}

/**
 * Hook for interactive animations
 * @param options - Configuration options
 * @returns Motion values and animation props
 */
export function useInteractiveAnimation(options: {
  initialScale?: number;
  hoverScale?: number;
  tapScale?: number;
} = {}) {
  const {
    initialScale = 1,
    hoverScale = 1.05,
    tapScale = 0.95,
  } = options;

  const { shouldAnimate } = useAnimationSettings();

  // Always create motion values to maintain hook order
  const scale = useMotionValue(initialScale);

  // Animation props - conditionally set based on shouldAnimate
  const animationProps = shouldAnimate ? {
    whileHover: { scale: hoverScale },
    whileTap: { scale: tapScale },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  } : {};

  return {
    scale,
    animationProps,
  };
}

/**
 * Hook for scroll-linked animations
 * @param options - Configuration options
 * @returns Motion value and ref to attach to the element
 */
export function useScrollLinkedAnimation(options: {
  inputRange?: [number, number];
  outputRange?: [number, number];
  property?: "opacity" | "scale" | "y" | "x" | "rotate";
} = {}) {
  const {
    inputRange = [0, 1],
    outputRange = [0, 1],
    property = "opacity",
  } = options;

  const { shouldAnimate } = useAnimationSettings();
  // Always create these refs and values to maintain hook order
  const ref = useRef<HTMLElement>(null);
  const scrollYProgress = useMotionValue(0);

  // Always transform scroll progress to maintain hook order
  const outputValue = useTransform(
    scrollYProgress,
    inputRange,
    outputRange
  );

  useEffect(() => {
    if (!ref.current || !shouldAnimate) return;

    const updateScrollValue = () => {
      if (!ref.current) return;

      const element = ref.current;
      const rect = element.getBoundingClientRect();

      // Calculate how far through the element we've scrolled
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate progress (0 when element enters viewport, 1 when it leaves)
      const progress = 1 - (elementTop + elementHeight) / (windowHeight + elementHeight);

      // Clamp between 0 and 1
      const clampedProgress = Math.min(Math.max(progress, 0), 1);
      scrollYProgress.set(clampedProgress);
    };

    // Update on scroll
    window.addEventListener("scroll", updateScrollValue);
    // Initial update
    updateScrollValue();

    return () => {
      window.removeEventListener("scroll", updateScrollValue);
    };
  }, [scrollYProgress, shouldAnimate]);

  return {
    ref,
    [property]: shouldAnimate ? outputValue : outputRange[1],
  };
}
