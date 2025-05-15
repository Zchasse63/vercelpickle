/**
 * Animation presets for the Pickle B2B Marketplace
 *
 * This file contains standardized animation configurations for different UI elements.
 * Use these presets to maintain consistency across the application.
 */

import { animations } from "./animations";

/**
 * Animation preset configurations
 * Each preset contains the necessary CSS classes for animations
 */
export const presets = {
  // Page transitions
  pageEnter: {
    className: animations.fadeIn,
    delay: animations.delay300,
  },

  pageExit: {
    className: animations.fadeOut,
    delay: animations.delay200,
  },

  // List items
  listItem: {
    className: animations.fadeInUp,
    delay: animations.delay300,
  },

  // Buttons
  buttonHover: {
    className: animations.hoverScale,
  },

  // Product cards
  productCard: {
    className: animations.fadeIn,
    delay: animations.delay200,
    hoverClass: animations.hoverLift,
  },

  // Product images
  productImage: {
    className: animations.scale,
    delay: animations.delay300,
    hoverClass: animations.hoverScale,
  },

  // Notifications
  notification: {
    className: animations.fadeInLeft,
    delay: animations.delay200,
  },

  // Form elements
  formElement: {
    className: animations.fadeIn,
    delay: animations.delay100,
  },

  // Modal/dialog
  modal: {
    className: animations.scale,
    delay: animations.delay200,
  },

  // Sidebar/drawer
  drawer: {
    className: animations.fadeInRight,
    delay: animations.delay200,
  },
};

/**
 * Get animation preset with delay
 * @param presetName - Name of the preset to use
 * @param index - Index for calculating delay (for staggered animations)
 * @param baseDelay - Base delay before starting animation
 * @returns Animation preset with calculated delay
 */
export function getPresetWithDelay(
  presetName: keyof typeof presets,
  index: number = 0,
  baseDelay: number = 0
): { className: string } {
  const preset = { ...presets[presetName] };
  const delayClass = getStaggeredDelay(index, baseDelay);

  return {
    className: `${preset.className} ${delayClass}`,
  };
}

/**
 * Get staggered delay class
 * @param index - Index for calculating delay
 * @param baseDelay - Base delay in milliseconds
 * @returns Delay class name
 */
function getStaggeredDelay(index: number, baseDelay: number = 0): string {
  const totalDelay = baseDelay + (index * 100);

  if (totalDelay <= 0) return '';
  if (totalDelay <= 100) return animations.delay100;
  if (totalDelay <= 200) return animations.delay200;
  if (totalDelay <= 300) return animations.delay300;
  if (totalDelay <= 400) return animations.delay400;
  if (totalDelay <= 500) return animations.delay500;
  return animations.delay500; // Max delay
}
