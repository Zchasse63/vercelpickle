"use client";

import React from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { BrandColorSwatches } from "@/components/shared/color-swatch";
import { BrandButtons, BrandButtonSizes } from "@/components/shared/brand-buttons";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { BRAND_COLORS } from "@/lib/constants";
import { ColorPalette, ThemeColorPalette } from "@/components/design-system/color-palette";
import { Typography } from "@/components/design-system/typography";
import { ButtonShowcase } from "@/components/design-system/button-showcase";
import { BadgeShowcase } from "@/components/design-system/badge-showcase";
import { AnimationShowcase } from "@/components/design-system/animation-showcase";

/**
 * Design system page for showcasing brand elements
 * @returns Design system page component
 */
export default function DesignSystemPage() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pickle B2B Marketplace Design System</h1>
        <Button onClick={toggleTheme} variant="outline">
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Brand Logo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 border rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <BrandLogo variant="small" />
            <span className="text-sm text-muted-foreground">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <BrandLogo variant="default" />
            <span className="text-sm text-muted-foreground">Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <BrandLogo variant="large" />
            <span className="text-sm text-muted-foreground">Large</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Brand Colors</h2>
        <div className="p-6 border rounded-lg">
          <BrandColorSwatches />
        </div>
        <div className="space-y-4 mt-4">
          <h3 className="text-xl font-bold">Enhanced Color Palette</h3>
          <ColorPalette />
          <ThemeColorPalette />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Typography</h2>
        <div className="p-6 border rounded-lg space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold" style={{ color: BRAND_COLORS.DILL_GREEN }}>Heading 1</h1>
            <p className="text-sm text-muted-foreground">text-4xl font-bold</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold" style={{ color: BRAND_COLORS.DILL_GREEN }}>Heading 2</h2>
            <p className="text-sm text-muted-foreground">text-3xl font-bold</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold" style={{ color: BRAND_COLORS.DILL_GREEN }}>Heading 3</h3>
            <p className="text-sm text-muted-foreground">text-2xl font-bold</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold" style={{ color: BRAND_COLORS.DILL_GREEN }}>Heading 4</h4>
            <p className="text-sm text-muted-foreground">text-xl font-bold</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-lg font-bold" style={{ color: BRAND_COLORS.DILL_GREEN }}>Heading 5</h5>
            <p className="text-sm text-muted-foreground">text-lg font-bold</p>
          </div>
          <div className="space-y-2">
            <h6 className="text-base font-bold" style={{ color: BRAND_COLORS.DILL_GREEN }}>Heading 6</h6>
            <p className="text-sm text-muted-foreground">text-base font-bold</p>
          </div>
          <div className="space-y-2">
            <p className="text-base">Body text - The quick brown fox jumps over the lazy dog.</p>
            <p className="text-sm text-muted-foreground">text-base</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm">Small text - The quick brown fox jumps over the lazy dog.</p>
            <p className="text-sm text-muted-foreground">text-sm</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs">Extra small text - The quick brown fox jumps over the lazy dog.</p>
            <p className="text-sm text-muted-foreground">text-xs</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-4">Enhanced Typography</h3>
          <Typography />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Buttons</h2>
        <div className="p-6 border rounded-lg space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Button Variants</h3>
            <BrandButtons />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Button Sizes</h3>
            <BrandButtonSizes variant="mustard" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-4">Enhanced Button Showcase</h3>
          <ButtonShowcase />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Badges</h2>
        <div className="mt-4">
          <BadgeShowcase />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Animations</h2>
        <div className="mt-4">
          <AnimationShowcase />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Color Mode</h2>
        <div className="p-6 border rounded-lg space-y-4">
          <p>
            The design system supports both light and dark modes. The dark mode uses a darker
            version of the Dill Green as the background and lighter versions of the brand colors
            for better contrast.
          </p>
          <Button onClick={toggleTheme} variant="mustard">
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Style Guide</h2>
        <div className="p-6 border rounded-lg space-y-4">
          <p>
            For more detailed information about the design system, please refer to the
            <a href="/docs/STYLE_GUIDE.md" className="text-primary hover:underline ml-1">Style Guide</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
