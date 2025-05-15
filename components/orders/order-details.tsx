"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import { Order } from "@/lib/store/order-store"
import { OrderStatus } from "./order-status"

interface OrderDetailsProps {
  order: Order
  className?: string
  testId?: string
}

/**
 * OrderDetails component
 * 
 * A component for displaying order details.
 */
export function OrderDetails({
  order,
  className,
  testId,
}: OrderDetailsProps) {
  return (
    <Card className={className} data-testid={testId}>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Information */}
        <div className="space-y-2" data-testid={`${testId}-info`}>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-medium" data-testid={`${testId}-id`}>{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span data-testid={`${testId}-date`}>{formatDate(new Date(order.createdAt))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <OrderStatus 
              status={order.status} 
              testId={`${testId}-status`}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Status</span>
            <span 
              className={`capitalize ${
                order.paymentStatus === "paid" 
                  ? "text-green-500" 
                  : order.paymentStatus === "failed" 
                    ? "text-red-500" 
                    : ""
              }`}
              data-testid={`${testId}-payment-status`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>
        
        <Separator />
        
        {/* Shipping Address */}
        <div className="space-y-2" data-testid={`${testId}-shipping-address`}>
          <h3 className="font-medium">Shipping Address</h3>
          <div className="text-sm space-y-1">
            <p data-testid={`${testId}-shipping-name`}>{order.shippingAddress.name}</p>
            <p data-testid={`${testId}-shipping-street`}>{order.shippingAddress.street}</p>
            {order.shippingAddress.street2 && (
              <p data-testid={`${testId}-shipping-street2`}>{order.shippingAddress.street2}</p>
            )}
            <p data-testid={`${testId}-shipping-city-state`}>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
            <p data-testid={`${testId}-shipping-country`}>{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && (
              <p data-testid={`${testId}-shipping-phone`}>{order.shippingAddress.phone}</p>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Billing Address */}
        <div className="space-y-2" data-testid={`${testId}-billing-address`}>
          <h3 className="font-medium">Billing Address</h3>
          <div className="text-sm space-y-1">
            <p data-testid={`${testId}-billing-name`}>{order.billingAddress.name}</p>
            <p data-testid={`${testId}-billing-street`}>{order.billingAddress.street}</p>
            {order.billingAddress.street2 && (
              <p data-testid={`${testId}-billing-street2`}>{order.billingAddress.street2}</p>
            )}
            <p data-testid={`${testId}-billing-city-state`}>
              {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}
            </p>
            <p data-testid={`${testId}-billing-country`}>{order.billingAddress.country}</p>
            {order.billingAddress.phone && (
              <p data-testid={`${testId}-billing-phone`}>{order.billingAddress.phone}</p>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Payment Method */}
        <div className="space-y-2" data-testid={`${testId}-payment-method`}>
          <h3 className="font-medium">Payment Method</h3>
          <div className="text-sm space-y-1">
            <p data-testid={`${testId}-payment-brand`}>{order.paymentMethod.brand}</p>
            <p data-testid={`${testId}-payment-last4`}>**** **** **** {order.paymentMethod.last4}</p>
            <p data-testid={`${testId}-payment-expiry`}>
              Expires {order.paymentMethod.expMonth}/{order.paymentMethod.expYear}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
