import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ServerProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  unit?: string;
  specifications?: {
    dietary?: {
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
    };
    ecofriendly?: boolean;
    compostable?: boolean;
    biodegradable?: boolean;
    recyclable?: boolean;
    weight?: string;
    [key: string]: any;
  };
  className?: string;
}

/**
 * Server-rendered product card component
 * This version is optimized for server components and doesn't include client-side interactivity
 */
export function ServerProductCard({
  id,
  name,
  price,
  image,
  unit = "each",
  specifications,
  className,
}: ServerProductCardProps) {
  return (
    <Card
      className={`${className} border border-dill-green/20 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group`}
      data-testid="product-card"
      data-cy="product-card"
      data-product-id={id}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-white">
          <Link href={ROUTES.PRODUCT_DETAILS(id)} aria-label={`View details for ${name}`}>
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              data-testid="product-image"
              data-cy="product-image"
            />
          </Link>

          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1" data-testid="product-badges">
            {/* Dietary badges - limit to 2 most important */}
            {specifications?.dietary?.organic && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs" data-testid="badge-organic">
                Organic
              </Badge>
            )}
            {specifications?.dietary?.glutenFree && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs" data-testid="badge-gluten-free">
                Gluten-Free
              </Badge>
            )}

            {/* Environmental badge - show only if organic is not present */}
            {!specifications?.dietary?.organic && specifications?.ecofriendly && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs" data-testid="badge-eco-friendly">
                Eco-Friendly
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2.5 flex-grow">
        <div className="mb-1">
          <Link
            href={ROUTES.PRODUCT_DETAILS(id)}
            className="text-sm font-semibold truncate block hover:underline hover:text-dill-green transition-colors"
            aria-label={`View details for ${name}`}
            data-testid="product-name"
            data-cy="product-name"
          >
            {name.length > 30 ? name.substring(0, 30) + '...' : name}
          </Link>
          <div className="mt-1">
            <span className="text-sm font-bold text-dill-green" data-testid="product-price" data-cy="product-price">
              {formatPrice(price)} <span className="text-xs font-normal">/ {unit}</span>
            </span>
          </div>
        </div>

        {/* Display only the most important specification */}
        <div className="mt-0.5" data-testid="product-specs">
          {specifications?.weight && (
            <p className="text-xs text-muted-foreground truncate" data-testid="product-weight">
              <span className="font-medium">Weight:</span> {specifications.weight}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-2.5 pt-0 flex flex-col gap-1.5 mt-auto">
        <div className="w-full text-center py-1.5 bg-mustard text-white rounded-md text-xs font-medium">
          View Details
        </div>
      </CardFooter>
    </Card>
  );
}
