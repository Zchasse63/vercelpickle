"use client"

import type React from "react"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function MarketplaceProductQuantity() {
  const [quantity, setQuantity] = useState(1)

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    } else if (e.target.value === "") {
      setQuantity(1)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="quantity">Quantity</Label>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-r-none"
          onClick={decreaseQuantity}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease quantity</span>
        </Button>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={handleChange}
          className="h-10 w-16 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-l-none" onClick={increaseQuantity}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </div>
    </div>
  )
}
