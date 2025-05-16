"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  width?: string;
}

interface VirtualizedTableProps<T> {
  items: T[];
  columns: Column<T>[];
  rowHeight?: number;
  headerHeight?: number;
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
 * A virtualized table component that only renders rows that are visible in the viewport
 *
 * @param props - The component props
 * @returns A virtualized table component
 */
export function VirtualizedTable<T>({
  items,
  columns,
  rowHeight = 50,
  headerHeight = 40,
  overscan = 5,
  className,
  containerClassName,
  loadingPlaceholder,
  emptyPlaceholder,
  onEndReached,
  endReachedThreshold = 0.8,
  testId = "virtualized-table",
}: VirtualizedTableProps<T>) {
  // Create a ref for the container element
  const containerRef = useRef<HTMLDivElement>(null);

  // State for tracking scroll position and visible items
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Calculate the total height of all rows plus the header
  const totalHeight = items.length * rowHeight + headerHeight;

  // Calculate the range of visible rows
  const startIndex = Math.max(0, Math.floor((scrollTop - headerHeight) / rowHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight - headerHeight) / rowHeight) + overscan
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

  // Call onEndReached when the end of the table is visible
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
      <Table className={className}>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow style={{ height: headerHeight }}>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                style={{ width: column.width }}
                data-testid={`${testId}-header-${column.key}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody style={{ height: totalHeight - headerHeight, position: "relative" }}>
          {/* Render only the visible rows */}
          {visibleItems.map((item, index) => {
            const actualIndex = startIndex + index;

            return (
              <TableRow
                key={actualIndex}
                style={{
                  position: "absolute",
                  top: actualIndex * rowHeight,
                  height: rowHeight,
                  width: "100%",
                }}
                data-testid={`${testId}-row-${actualIndex}`}
              >
                {columns.map((column) => (
                  <TableCell
                    key={`${actualIndex}-${column.key}`}
                    style={{ width: column.width }}
                    data-testid={`${testId}-cell-${actualIndex}-${column.key}`}
                  >
                    {column.cell(item, actualIndex)}
                  </TableCell>
                ))}
              </TableRow>
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
        </TableBody>
      </Table>
    </div>
  );
}
