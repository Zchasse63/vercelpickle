/**
 * Animation utilities for the Pickle B2B Marketplace
 * This file contains CSS animation classes
 */

import { cn } from "@/lib/utils";
import { Variants } from "framer-motion";

/**
 * Animation class names
 */
export const animations = {
  // Entrance animations
  fadeIn: "animate-fade-in",
  fadeInUp: "animate-fade-in-up",
  fadeInDown: "animate-fade-in-down",
  fadeInLeft: "animate-fade-in-left",
  fadeInRight: "animate-fade-in-right",
  fadeOut: "animate-fade-out",
  scale: "animate-scale",

  // Hover animations
  hoverScale: "hover:scale-105 transition-transform duration-200",
  hoverLift: "hover:-translate-y-1 transition-transform duration-200",

  // Continuous animations
  pulse: "animate-pulse",
  bounce: "animate-bounce",

  // Delays
  delay100: "delay-100",
  delay200: "delay-200",
  delay300: "delay-300",
  delay400: "delay-400",
  delay500: "delay-500",
  delay1000: "delay-1000",

  // Durations
  duration100: "duration-100",
  duration200: "duration-200",
  duration300: "duration-300",
  duration500: "duration-500",
  duration1000: "duration-1000",
};

/**
 * Get animation class names
 * @param animation - Animation name
 * @param delay - Animation delay in milliseconds
 * @param duration - Animation duration in milliseconds
 * @returns Class names string
 */
export function getAnimationClass(
  animation: keyof typeof animations,
  delay?: 100 | 200 | 300 | 400 | 500 | 1000,
  duration?: 100 | 200 | 300 | 500 | 1000
): string {
  const classes = [animations[animation]];

  if (delay) {
    classes.push(animations[`delay${delay}` as keyof typeof animations]);
  }

  if (duration) {
    classes.push(animations[`duration${duration}` as keyof typeof animations]);
  }

  return cn(classes);
}

/**
 * Get staggered animation classes for children
 * @param animation - Animation name
 * @param count - Number of children
 * @param baseDelay - Base delay in milliseconds
 * @param step - Delay step in milliseconds
 * @returns Array of class names strings
 */
export function getStaggeredClasses(
  animation: keyof typeof animations,
  count: number,
  baseDelay = 0,
  step = 100
): string[] {
  return Array.from({ length: count }, (_, i) => {
    const delay = baseDelay + i * step;
    const delayKey = `delay${delay <= 1000 ? delay : 1000}` as keyof typeof animations;
    return cn(animations[animation], animations[delayKey]);
  });
}

/**
 * Framer Motion animation variants
 */

// Fade in animation
export const fadeIn = (duration = 0.5, delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  },
});

// Fade out animation
export const fadeOut = (duration = 0.5, delay = 0): Variants => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 0,
    transition: {
      duration,
      delay,
      ease: "easeIn",
    },
  },
});

// Fade in up animation
export const fadeInUp = (duration = 0.5, delay = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  },
});

// Fade in down animation
export const fadeInDown = (duration = 0.5, delay = 0): Variants => ({
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  },
});

// Fade in left animation
export const fadeInLeft = (duration = 0.5, delay = 0): Variants => ({
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  },
});

// Fade in right animation
export const fadeInRight = (duration = 0.5, delay = 0): Variants => ({
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  },
});

// Scale animation
export const scale = (duration = 0.5, delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  },
});

// Stagger container animation
export const staggerContainer = (duration = 0.1, delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: duration,
      delayChildren: delay,
    },
  },
});

// Hover scale animation
export const hoverScale = (): Variants => ({
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
});

// Hover lift animation
export const hoverLift = (): Variants => ({
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
});

// Pulse animation
export const pulse = (): Variants => ({
  hidden: { opacity: 1, scale: 1 },
  visible: {
    opacity: [1, 0.85, 1],
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  },
});

// Bounce animation
export const bounce = (): Variants => ({
  hidden: { y: 0 },
  visible: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  },
});
