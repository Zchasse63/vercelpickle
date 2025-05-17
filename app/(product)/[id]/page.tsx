import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getProductById } from "@/lib/data-access/products";
import { ProductDetailSkeleton } from "@/components/marketplace/product-detail-skeleton";
import { LazyProductDetail } from "@/components/marketplace/lazy-product-detail";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    // Validate ID format
    let productId: Id<"products">;
    try {
      productId = params.id as Id<"products">;
    } catch (error) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    // Fetch product data
    const product = await getProductById(productId);

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    return {
      title: `${product.name} - Pickle B2B Marketplace`,
      description: product.description.substring(0, 160),
      openGraph: {
        title: product.name,
        description: product.description.substring(0, 160),
        images: product.images && product.images.length > 0 ? [product.images[0]] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Details - Pickle B2B Marketplace",
      description: "View detailed product information on Pickle B2B Marketplace.",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Validate ID format
  let productId: Id<"products">;
  try {
    productId = params.id as Id<"products">;
  } catch (error) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <LazyProductDetail productId={productId} />
    </Suspense>
  );
}
