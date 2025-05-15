import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS classes
 * @param inputs - Class names to combine
 * @returns Combined class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price as a currency string
 * @param price - Price to format
 * @param options - Formatting options
 * @returns Formatted price string
 */
export function formatPrice(
  price: number,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "CAD";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "USD", notation = "standard" } = options;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  });

  return formatter.format(price);
}

/**
 * Formats a date as a string
 * @param date - Date to format
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
) {
  return new Intl.DateTimeFormat("en-US", options).format(
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date
  );
}

/**
 * Truncates a string to a specified length
 * @param str - String to truncate
 * @param length - Maximum length
 * @returns Truncated string
 */
export function truncate(str: string, length: number) {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

/**
 * Generates a random ID
 * @param length - Length of the ID
 * @returns Random ID
 */
export function generateId(length: number = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Debounces a function
 * @param fn - Function to debounce
 * @param ms - Debounce delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
) {
  let timer: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Converts a hex color to HSL
 * @param hex - Hex color code
 * @returns HSL color values
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove the # if present
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find the min and max values to calculate the lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Calculate the lightness
  let l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    // Calculate the saturation
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);

    // Calculate the hue
    if (max === r) {
      h = ((g - b) / (max - min)) + (g < b ? 6 : 0);
    } else if (max === g) {
      h = ((b - r) / (max - min)) + 2;
    } else {
      h = ((r - g) / (max - min)) + 4;
    }

    h = h * 60;
  }

  // Round the values
  h = Math.round(h);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return { h, s, l };
}

/**
 * Converts HSL color to a CSS variable string
 * @param h - Hue
 * @param s - Saturation
 * @param l - Lightness
 * @returns CSS variable string
 */
export function hslToCssVar(h: number, s: number, l: number): string {
  return `${h} ${s}% ${l}%`;
}
