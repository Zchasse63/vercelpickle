"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Brand buttons component for showcasing brand-colored buttons
 * @param props - Brand buttons props
 * @returns Brand buttons component
 */
export function BrandButtons({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      <div className="flex flex-col gap-2 items-start">
        <Button variant="dill">Dill Green</Button>
        <span className="text-xs text-muted-foreground">Primary Action</span>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <Button variant="pickle">Pickle Green</Button>
        <span className="text-xs text-muted-foreground">Secondary Action</span>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <Button variant="mustard">Golden Mustard</Button>
        <span className="text-xs text-muted-foreground">Call to Action</span>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <Button variant="beige">Brined Beige</Button>
        <span className="text-xs text-muted-foreground">Subtle Action</span>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <Button variant="olive">Smoked Olive</Button>
        <span className="text-xs text-muted-foreground">Tertiary Action</span>
      </div>
    </div>
  );
}

/**
 * Brand button sizes component for showcasing different button sizes
 * @param props - Brand button sizes props
 * @returns Brand button sizes component
 */
export function BrandButtonSizes({
  className,
  variant = "dill",
}: {
  className?: string;
  variant?: "dill" | "pickle" | "mustard" | "beige" | "olive";
}) {
  return (
    <div className={cn("flex flex-wrap gap-4 items-end", className)}>
      <div className="flex flex-col gap-2 items-start">
        <Button variant={variant} size="sm">Small</Button>
        <span className="text-xs text-muted-foreground">Small</span>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <Button variant={variant} size="default">Default</Button>
        <span className="text-xs text-muted-foreground">Default</span>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <Button variant={variant} size="lg">Large</Button>
        <span className="text-xs text-muted-foreground">Large</span>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <Button variant={variant} size="xl">Extra Large</Button>
        <span className="text-xs text-muted-foreground">Extra Large</span>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <Button variant={variant} size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </Button>
        <span className="text-xs text-muted-foreground">Icon</span>
      </div>
    </div>
  );
}
