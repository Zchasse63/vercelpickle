/**
 * Skeleton Styles
 * 
 * This module provides standardized styles for skeleton loaders.
 */

/**
 * Standard sizes for skeleton elements
 */
export const skeletonSizes = {
  // Text sizes
  text: {
    xs: "h-3",
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
    xl: "h-8",
  },
  
  // Width presets
  width: {
    xs: "w-16",
    sm: "w-24",
    md: "w-32",
    lg: "w-48",
    xl: "w-64",
    xxl: "w-96",
    full: "w-full",
    half: "w-1/2",
    third: "w-1/3",
    quarter: "w-1/4",
  },
  
  // Height presets
  height: {
    xs: "h-4",
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
    xl: "h-24",
    xxl: "h-32",
    full: "h-full",
  },
  
  // Avatar/icon sizes
  avatar: {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  },
  
  // Button sizes
  button: {
    xs: "h-6 w-16",
    sm: "h-8 w-24",
    md: "h-10 w-32",
    lg: "h-12 w-40",
    icon: "h-8 w-8",
  },
  
  // Input sizes
  input: {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  },
};

/**
 * Standard shapes for skeleton elements
 */
export const skeletonShapes = {
  sharp: "",
  rounded: "rounded-md",
  pill: "rounded-full",
  circle: "rounded-full",
};

/**
 * Standard spacing for skeleton elements
 */
export const skeletonSpacing = {
  none: "",
  xs: "space-y-1",
  sm: "space-y-2",
  md: "space-y-4",
  lg: "space-y-6",
  xl: "space-y-8",
};

/**
 * Standard margins for skeleton elements
 */
export const skeletonMargins = {
  none: "",
  xs: "mb-1",
  sm: "mb-2",
  md: "mb-4",
  lg: "mb-6",
  xl: "mb-8",
};

/**
 * Standard grid layouts for skeleton elements
 */
export const skeletonGrids = {
  list: "grid grid-cols-1 gap-4",
  cards2: "grid grid-cols-1 md:grid-cols-2 gap-4",
  cards3: "grid grid-cols-1 md:grid-cols-3 gap-4",
  cards4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
  stats: "grid grid-cols-2 md:grid-cols-4 gap-4",
};

/**
 * Utility function to generate skeleton class names
 */
export function skeletonClass(options: {
  height?: keyof typeof skeletonSizes.text | string;
  width?: keyof typeof skeletonSizes.width | string;
  shape?: keyof typeof skeletonShapes;
  margin?: keyof typeof skeletonMargins;
  className?: string;
}) {
  const { height = "md", width = "md", shape = "rounded", margin = "none", className = "" } = options;
  
  const heightClass = skeletonSizes.text[height as keyof typeof skeletonSizes.text] || height;
  const widthClass = skeletonSizes.width[width as keyof typeof skeletonSizes.width] || width;
  const shapeClass = skeletonShapes[shape];
  const marginClass = skeletonMargins[margin];
  
  return `${heightClass} ${widthClass} ${shapeClass} ${marginClass} ${className}`;
}

/**
 * Utility function to generate an array of items with proper keys
 */
export function skeletonArray(length: number) {
  return Array.from({ length }, (_, index) => ({ id: `skeleton-${index}` }));
}
