import { Id } from "@/convex/_generated/dataModel";

/**
 * Product dietary specifications
 */
export interface ProductDietary {
  organic?: boolean;
  glutenFree?: boolean;
  lactoseFree?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
  kosher?: boolean;
  kosherDairy?: boolean;
  halal?: boolean;
  nonGMO?: boolean;
  cholesterolFree?: boolean;
  sugarFree?: boolean;
  caffeineFree?: boolean;
}

/**
 * Product quality specifications
 */
export interface ProductQuality {
  grade?: string;
  inspectionDate?: number;
  shelfLife?: {
    value?: number;
    unit?: string;
  };
}

/**
 * Product specifications
 */
export interface ProductSpecifications {
  // General specifications
  packaging?: string;
  casePack?: string;
  quantity?: string;
  size?: string;
  diameter?: string;
  length?: string;
  width?: string;
  height?: string;
  weight?: string;
  color?: string;
  material?: string;
  handleMaterial?: string;
  handleColor?: string;

  // Product-specific specifications
  shape?: string;
  design?: string;
  pattern?: string;
  style?: string;
  flavor?: string;
  scent?: string;
  container?: string;

  // Physical properties
  bladeType?: string;
  handleType?: string;
  edgeType?: string;
  textured?: boolean;
  slipResistant?: boolean;
  greaseResistant?: boolean;
  microwavable?: boolean;
  dishwasherSafe?: boolean;

  // Food-specific specifications
  servingSize?: string;
  caloriesPerServing?: string;
  storage?: string;

  // Equipment specifications
  capacity?: string;
  speed?: string;
  power?: string;
  clutch?: string;
  control?: string;
  blades?: string;
  base?: string;
  compatibleWith?: string;

  // Chemical specifications
  activeIngredient?: string;
  formType?: string;
  usage?: string;
  dilutionRatio?: string;
  formula?: string;
  concentrate?: boolean;

  // Dietary information
  dietary?: ProductDietary;

  // Environmental specifications
  ecofriendly?: boolean;
  compostable?: boolean;
  biodegradable?: boolean;
  recyclable?: boolean;

  // Quality grading
  quality?: ProductQuality;

  // Certifications
  certifications?: string[];

  [key: string]: any;
}

/**
 * Product origin information
 */
export interface ProductOrigin {
  country?: string;
  region?: string;
  farm?: string;
  producer?: string;
}

/**
 * Product seller information
 */
export interface ProductSeller {
  id: string;
  name: string;
}

/**
 * Base product interface
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  specifications?: ProductSpecifications;
  features?: string[];
  unit?: string;
  seller?: ProductSeller;
  origin?: ProductOrigin;
  certifications?: string[];
  tags?: string[];
  status?: string;
  inventory?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  salePercentage?: number;
  isLimitedQuantity?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
}

/**
 * Product card props interface
 */
export interface ProductCardProps extends Product {
  onAddToCart?: () => void;
  onAddToComparison?: () => void;
  className?: string;
}

/**
 * Product quick view modal props interface
 */
export interface ProductQuickViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  specifications?: ProductSpecifications;
  features?: string[];
  unit?: string;
  seller?: ProductSeller;
  origin?: ProductOrigin;
  certifications?: string[];
  tags?: string[];
  status?: string;
  inventory?: number;
  onAddToCart?: () => void;
}
