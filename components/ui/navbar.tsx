import * as React from "react"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

// Types for navbar props
type NavbarHeight = "sm" | "md" | "lg"
type NavbarPosition = "static" | "sticky" | "fixed"
type NavbarVariant = "default" | "floating" | "bordered" | "solid" | "transparent"
type NavbarContentJustify = "start" | "center" | "end" | "between" | "around" | "evenly"

// Props for Navbar component
interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  height?: NavbarHeight
  position?: NavbarPosition
  variant?: NavbarVariant
  isMenuOpen?: boolean
  onMenuOpenChange?: (open: boolean) => void
  className?: string
  children: React.ReactNode
}

// Props for NavbarContent component
interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: NavbarContentJustify
  className?: string
  children: React.ReactNode
}

// Props for NavbarItem component
interface NavbarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean
  className?: string
  children: React.ReactNode
}

// Props for NavbarBrand component
interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

// Props for NavbarMenuToggle component
interface NavbarMenuToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

// Props for NavbarMenu component
interface NavbarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

// Props for NavbarMenuItem component
interface NavbarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  className?: string
  children: React.ReactNode
}

// Helper function to get height classes
const getHeightClasses = (height?: NavbarHeight): string => {
  switch (height) {
    case "sm": return "h-12"
    case "lg": return "h-20"
    default: return "h-16" // md is default
  }
}

// Helper function to get position classes
const getPositionClasses = (position?: NavbarPosition): string => {
  switch (position) {
    case "sticky": return "sticky top-0 z-40"
    case "fixed": return "fixed top-0 left-0 right-0 z-40"
    default: return "relative" // static is default
  }
}

// Helper function to get variant classes
const getVariantClasses = (variant?: NavbarVariant): string => {
  switch (variant) {
    case "floating": return "bg-background/50 backdrop-blur-lg"
    case "bordered": return "border"
    case "solid": return "bg-background"
    case "transparent": return "bg-transparent"
    default: return "bg-background border-b" // default variant
  }
}

// Helper function to get justify classes
const getJustifyClasses = (justify?: NavbarContentJustify): string => {
  switch (justify) {
    case "center": return "justify-center"
    case "end": return "justify-end"
    case "between": return "justify-between"
    case "around": return "justify-around"
    case "evenly": return "justify-evenly"
    default: return "justify-start" // start is default
  }
}

// Create a context for the navbar
const NavbarContext = React.createContext<{
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
}>({
  isMenuOpen: false,
  setIsMenuOpen: () => {},
})

/**
 * Navbar component for creating navigation bars
 */
export function Navbar({
  height = "md",
  position = "static",
  variant = "default",
  isMenuOpen = false,
  onMenuOpenChange,
  className,
  children,
  ...props
}: NavbarProps) {
  // State for menu open
  const [menuOpen, setMenuOpen] = React.useState(isMenuOpen)
  
  // Update internal state when prop changes
  React.useEffect(() => {
    setMenuOpen(isMenuOpen)
  }, [isMenuOpen])
  
  // Handle menu open change
  const handleMenuOpenChange = React.useCallback((open: boolean) => {
    setMenuOpen(open)
    onMenuOpenChange?.(open)
  }, [onMenuOpenChange])
  
  // Get height classes
  const heightClasses = getHeightClasses(height)
  
  // Get position classes
  const positionClasses = getPositionClasses(position)
  
  // Get variant classes
  const variantClasses = getVariantClasses(variant)
  
  return (
    <NavbarContext.Provider value={{ isMenuOpen: menuOpen, setIsMenuOpen: handleMenuOpenChange }}>
      <nav
        className={cn(
          "w-full flex items-center",
          heightClasses,
          positionClasses,
          variantClasses,
          className
        )}
        role="navigation"
        {...props}
      >
        {children}
      </nav>
    </NavbarContext.Provider>
  )
}

/**
 * NavbarContent component for grouping navbar items
 */
export function NavbarContent({
  justify = "start",
  className,
  children,
  ...props
}: NavbarContentProps) {
  // Get justify classes
  const justifyClasses = getJustifyClasses(justify)
  
  return (
    <div
      className={cn(
        "flex items-center h-full gap-4",
        justifyClasses,
        className
      )}
      data-navbar-content
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * NavbarItem component for individual items in the navbar
 */
export function NavbarItem({
  isActive = false,
  className,
  children,
  ...props
}: NavbarItemProps) {
  return (
    <div
      className={cn(
        "flex items-center h-full",
        isActive && "text-primary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * NavbarBrand component for the brand/logo in the navbar
 */
export function NavbarBrand({
  className,
  children,
  ...props
}: NavbarBrandProps) {
  return (
    <div
      className={cn(
        "flex items-center h-full font-bold",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * NavbarMenuToggle component for toggling the mobile menu
 */
export function NavbarMenuToggle({
  className,
  ...props
}: NavbarMenuToggleProps) {
  const { isMenuOpen, setIsMenuOpen } = React.useContext(NavbarContext)
  
  return (
    <button
      className={cn(
        "p-2 rounded-md md:hidden",
        className
      )}
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      type="button"
      {...props}
    >
      {isMenuOpen ? <X data-testid="x-icon" /> : <Menu data-testid="menu-icon" />}
    </button>
  )
}

/**
 * NavbarMenu component for the mobile menu
 */
export function NavbarMenu({
  className,
  children,
  ...props
}: NavbarMenuProps) {
  const { isMenuOpen } = React.useContext(NavbarContext)
  
  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 bg-background border-b p-4 md:hidden",
        isMenuOpen ? "block" : "hidden",
        className
      )}
      {...props}
    >
      <ul className="flex flex-col gap-4">
        {children}
      </ul>
    </div>
  )
}

/**
 * NavbarMenuItem component for individual items in the mobile menu
 */
export function NavbarMenuItem({
  className,
  children,
  ...props
}: NavbarMenuItemProps) {
  return (
    <li
      className={cn(
        "flex items-center",
        className
      )}
      {...props}
    >
      {children}
    </li>
  )
}
