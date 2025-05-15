"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { CheckoutState } from "@/lib/store/order-store"

interface CheckoutStepsProps {
  currentStep: CheckoutState["step"]
  className?: string
  testId?: string
}

/**
 * CheckoutSteps component
 * 
 * A component to display the checkout progress steps.
 */
export function CheckoutSteps({
  currentStep,
  className,
  testId,
}: CheckoutStepsProps) {
  // Define the steps
  const steps = [
    { id: "shipping" as const, label: "Shipping", number: 1 },
    { id: "payment" as const, label: "Payment", number: 2 },
    { id: "review" as const, label: "Review", number: 3 },
    { id: "confirmation" as const, label: "Confirmation", number: 4 },
  ]
  
  // Get the current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)
  
  // Calculate progress percentage
  const progressPercentage = currentStepIndex === 0 ? 0 : 
                             currentStepIndex === 1 ? 33 : 
                             currentStepIndex === 2 ? 66 : 100
  
  return (
    <div className={cn("mb-8", className)} data-testid={testId}>
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={cn(
              "flex flex-col items-center",
              index <= currentStepIndex ? "text-primary font-medium" : "text-muted-foreground"
            )}
            data-testid={`${testId}-step-${step.id}`}
          >
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                index < currentStepIndex ? "bg-primary text-primary-foreground" : 
                index === currentStepIndex ? "bg-primary text-primary-foreground" : 
                "bg-muted border border-muted-foreground/30"
              )}
            >
              {step.number}
            </div>
            <span className="text-sm">{step.label}</span>
          </div>
        ))}
        
        {/* Progress line */}
        <div 
          className="absolute top-5 left-0 w-full h-0.5 bg-muted -z-10"
          data-testid={`${testId}-progress-line`}
        >
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
