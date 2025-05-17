"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columnCount?: number;
  rowHeight?: number;
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
 * A virtualized grid component that only renders items that are visible in the viewport
 * 
 * @param props - The component props
 * @returns A virtualized grid component
 */
export function VirtualizedGrid<T>({
  items,
  renderItem,
  columnCount = 4,
  rowHeight = 300,
  overscan = 1,
  className,
  containerClassName,
  loadingPlaceholder,
  emptyPlaceholder,
  onEndReached,
  endReachedThreshold = 0.8,
  testId = "virtualized-grid",
}: VirtualizedGridProps<T>) {
  // Create a ref for the container element
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for tracking scroll position and visible items
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  
  // Calculate the number of rows
  const rowCount = Math.ceil(items.length / columnCount);
  
  // Calculate the total height of all rows
  const totalHeight = rowCount * rowHeight;
  
  // Calculate the range of visible rows
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    rowCount - 1,
    Math.floor((scrollTop + containerHeight) / rowHeight) + overscan
  );
  
  // Calculate the range of visible items
  const startIndex = startRow * columnCount;
  const endIndex = Math.min(items.length - 1, (endRow + 1) * columnCount - 1);
  
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
  
  // Call onEndReached when the end of the grid is visible
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
  
  // Responsive column classes
  const gridColumnClass = cn(
    "grid gap-4",
    columnCount === 2 && "grid-cols-1 sm:grid-cols-2",
    columnCount === 3 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    columnCount === 4 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    columnCount === 5 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    className
  );
  
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
        {/* Render visible rows */}
        {Array.from({ length: endRow - startRow + 1 }).map((_, rowIndex) => {
          const actualRowIndex = startRow + rowIndex;
          const rowStartIndex = actualRowIndex * columnCount;
          const rowItems = items.slice(
            rowStartIndex,
            Math.min(rowStartIndex + columnCount, items.length)
          );
          
          return (
            <div
              key={actualRowIndex}
              className={gridColumnClass}
              style={{
                position: "absolute",
                top: actualRowIndex * rowHeight,
                width: "100%",
              }}
              data-testid={`${testId}-row-${actualRowIndex}`}
            >
              {rowItems.map((item, colIndex) => {
                const itemIndex = rowStartIndex + colIndex;
                return (
                  <div 
                    key={itemIndex}
                    data-testid={`${testId}-item-${itemIndex}`}
                  >
                    {renderItem(item, itemIndex)}
                  </div>
                );
              })}
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
