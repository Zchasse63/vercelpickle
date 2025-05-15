"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Address {
  id: string
  name: string
  street: string
  street2?: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  isDefault: boolean
}

interface AddressCardProps {
  address: Address
  onEdit?: (address: Address) => void
  onDelete?: (id: string) => void
  onSetDefault?: (id: string) => void
  className?: string
  testId?: string
}

/**
 * AddressCard component
 * 
 * A component for displaying an address with actions for editing, deleting, and setting as default.
 */
export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  className,
  testId,
}: AddressCardProps) {
  return (
    <Card 
      className={cn(address.isDefault ? "border-green-500" : "", className)} 
      data-testid={testId || "address-card"}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{address.name}</CardTitle>
          <MapPin className="h-5 w-5 text-gray-500" />
        </div>
        <CardDescription>
          {address.isDefault && (
            <span 
              className="text-green-600 font-medium" 
              data-testid={`${testId}-default-badge`}
            >
              Default Address
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p>{address.street}</p>
          {address.street2 && <p>{address.street2}</p>}
          <p>
            {address.city}, {address.state} {address.zip}
          </p>
          <p>{address.country}</p>
          {address.phone && <p className="text-sm text-gray-500">{address.phone}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1" 
              onClick={() => onEdit(address)}
              data-testid={`${testId}-edit-button`}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
          {onSetDefault && !address.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(address.id)}
              data-testid={`${testId}-set-default-button`}
            >
              Set as Default
            </Button>
          )}
        </div>
        {onDelete && (
          address.isDefault ? (
            <Button variant="ghost" size="sm" disabled>
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => onDelete(address.id)}
              data-testid={`${testId}-delete-button`}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  )
}
