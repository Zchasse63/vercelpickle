"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BRAND_COLORS } from "@/lib/constants";

interface ColorSwatchProps {
  color: string;
  name: string;
  description: string;
  className?: string;
}

/**
 * Color swatch component for displaying brand colors
 * @param props - Color swatch props
 * @returns Color swatch component
 */
export function ColorSwatch({
  color,
  name,
  description,
  className,
}: ColorSwatchProps) {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div
        className="h-24 w-full rounded-md"
        style={{ backgroundColor: color }}
      />
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{name}</h3>
          <span className="text-xs font-mono uppercase">{color}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

/**
 * Brand color swatches component for displaying all brand colors
 * @param props - Brand color swatches props
 * @returns Brand color swatches component
 */
export function BrandColorSwatches({
  className,
}: {
  className?: string;
}) {
  const brandColors = [
    {
      color: BRAND_COLORS.DILL_GREEN,
      name: "Dill Green",
      description: "Primary brand color (logo, headings)",
    },
    {
      color: BRAND_COLORS.PICKLE_GREEN,
      name: "Pickle Green",
      description: "Character and icon accents",
    },
    {
      color: BRAND_COLORS.GOLDEN_MUSTARD,
      name: "Golden Mustard",
      description: "Call-to-action buttons, highlights",
    },
    {
      color: BRAND_COLORS.BRINED_BEIGE,
      name: "Brined Beige",
      description: "Backgrounds, subtle fills",
    },
    {
      color: BRAND_COLORS.SMOKED_OLIVE,
      name: "Smoked Olive",
      description: "Secondary text, borders, shadows",
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-5 gap-4", className)}>
      {brandColors.map((color) => (
        <ColorSwatch
          key={color.name}
          color={color.color}
          name={color.name}
          description={color.description}
        />
      ))}
    </div>
  );
}
