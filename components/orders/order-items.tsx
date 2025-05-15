"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatPrice } from "@/lib/utils"
import { OrderItem } from "@/lib/store/order-store"

interface OrderItemsProps {
  items: OrderItem[]
  showActions?: boolean
  className?: string
  testId?: string
}

/**
 * OrderItems component
 * 
 * A component for displaying order items in a table.
 */
export function OrderItems({
  items,
  showActions = true,
  className,
  testId,
}: OrderItemsProps) {
  return (
    <div className={className} data-testid={testId}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Total</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index} data-testid={`${testId}-item-${index}`}>
              <TableCell>
                <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={"/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    data-testid={`${testId}-item-image-${index}`}
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium" data-testid={`${testId}-item-name-${index}`}>
                {item.name}
              </TableCell>
              <TableCell className="text-right" data-testid={`${testId}-item-price-${index}`}>
                {formatPrice(item.price)}
              </TableCell>
              <TableCell className="text-right" data-testid={`${testId}-item-quantity-${index}`}>
                {item.quantity}
              </TableCell>
              <TableCell className="text-right" data-testid={`${testId}-item-total-${index}`}>
                {formatPrice(item.price * item.quantity)}
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/marketplace/products/${item.productId}`}>
                      <Button variant="ghost" size="sm" data-testid={`${testId}-item-view-${index}`}>
                        View
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      data-testid={`${testId}-item-buy-again-${index}`}
                    >
                      Buy Again
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
