"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_COLORS } from "@/lib/constants";

interface BrandLogoProps {
  variant?: "default" | "small" | "large";
  size?: "sm" | "md" | "lg"; // Added size prop for backward compatibility
  className?: string;
  showText?: boolean;
  href?: string;
}

/**
 * Brand logo component for the Pickle B2B Marketplace
 * @param props - Brand logo props
 * @returns Brand logo component
 */
export function BrandLogo({
  variant = "default",
  size, // Added size prop
  className,
  showText = true,
  href = "/",
}: BrandLogoProps) {
  // Map size prop to variant for backward compatibility
  let variantToUse = variant;
  if (size) {
    variantToUse = size === "sm" ? "small" : size === "lg" ? "large" : "default";
  }

  const sizes = {
    small: { icon: 24, text: "text-lg" },
    default: { icon: 32, text: "text-xl" },
    large: { icon: 48, text: "text-2xl" },
  };

  const { icon: iconSize, text: textSize } = sizes[variantToUse as keyof typeof sizes];

  const LogoContent = (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative" style={{ width: iconSize, height: iconSize }}>
        <img
          src="/pickle-logo.png"
          alt="Pickle Logo"
          className="object-contain w-full h-full"
        />
      </div>
      {showText && (
        <span
          className={cn("font-bold tracking-tight", textSize)}
          style={{ color: BRAND_COLORS.DILL_GREEN }}
        >
          Pickle
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{LogoContent}</Link>;
  }

  return LogoContent;
}
