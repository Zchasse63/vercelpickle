"use client";

export { VirtualizedList } from "./virtualized-list";
export { VirtualizedGrid } from "./virtualized-grid";
export { VirtualizedTable } from "./virtualized-table";

export type { Column } from "./virtualized-table";

/**
 * Virtualized components for rendering large lists, grids, and tables efficiently.
 * 
 * These components only render items that are visible in the viewport, which
 * significantly improves performance when dealing with large datasets.
 * 
 * @example
 * ```tsx
 * // Virtualized List
 * <VirtualizedList
 *   items={items}
 *   renderItem={(item, index) => (
 *     <div key={index}>{item.name}</div>
 *   )}
 *   itemHeight={50}
 * />
 * 
 * // Virtualized Grid
 * <VirtualizedGrid
 *   items={products}
 *   renderItem={(product, index) => (
 *     <ProductCard key={index} product={product} />
 *   )}
 *   columnCount={4}
 *   rowHeight={300}
 * />
 * 
 * // Virtualized Table
 * <VirtualizedTable
 *   items={orders}
 *   columns={[
 *     {
 *       key: "id",
 *       header: "Order ID",
 *       cell: (order) => order.id,
 *     },
 *     {
 *       key: "customer",
 *       header: "Customer",
 *       cell: (order) => order.customer.name,
 *     },
 *     {
 *       key: "total",
 *       header: "Total",
 *       cell: (order) => formatPrice(order.total),
 *     },
 *   ]}
 * />
 * ```
 */
