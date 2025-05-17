"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  overscan?: number;
  className?: string;
  containerClassName?: string;
  loadingPlaceholder?: React.ReactNode;
  emptyPlaceholder?: React.ReactNode;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  testId?: string;
}

/**
 * A virtualized list component that only renders items that are visible in the viewport
 * 
 * @param props - The component props
 * @returns A virtualized list component
 */
export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight = 50,
  overscan = 5,
  className,
  containerClassName,
  loadingPlaceholder,
  emptyPlaceholder,
  onEndReached,
  endReachedThreshold = 0.8,
  testId = "virtualized-list",
}: VirtualizedListProps<T>) {
  // Create a ref for the container element
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for tracking scroll position and visible items
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  
  // Calculate the total height of all items
  const totalHeight = items.length * itemHeight;
  
  // Calculate the range of visible items
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  // Create an array of visible items
  const visibleItems = items.slice(startIndex, endIndex + 1);
  
  // Set up intersection observer for infinite scrolling
  const { ref: endRef, inView: isEndVisible } = useInView({
    threshold: endReachedThreshold,
  });
  
  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);
  
  // Update container height on resize
  const updateContainerHeight = useCallback(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);
  
  // Initialize container height and set up resize observer
  useEffect(() => {
    updateContainerHeight();
    
    const resizeObserver = new ResizeObserver(updateContainerHeight);
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [updateContainerHeight]);
  
  // Call onEndReached when the end of the list is visible
  useEffect(() => {
    if (isEndVisible && onEndReached) {
      onEndReached();
    }
  }, [isEndVisible, onEndReached]);
  
  // If there are no items, show the empty placeholder
  if (items.length === 0) {
    return emptyPlaceholder || (
      <div 
        className={cn("flex items-center justify-center p-4", className)}
        data-testid={`${testId}-empty`}
      >
        No items to display
      </div>
    );
  }
  
  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto relative", containerClassName)}
      onScroll={handleScroll}
      data-testid={testId}
    >
      {/* Spacer div to maintain scroll position */}
      <div
        style={{ height: totalHeight }}
        className="relative w-full"
        data-testid={`${testId}-spacer`}
      >
        {/* Render only the visible items */}
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          
          return (
            <div
              key={actualIndex}
              style={{
                position: "absolute",
                top: actualIndex * itemHeight,
                height: itemHeight,
                width: "100%",
              }}
              data-testid={`${testId}-item-${actualIndex}`}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
        
        {/* End marker for infinite scrolling */}
        {onEndReached && (
          <div
            ref={endRef}
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: 1,
            }}
            data-testid={`${testId}-end-marker`}
          />
        )}
      </div>
    </div>
  );
}
