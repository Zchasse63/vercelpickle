import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight mb-2">Product Not Found</h1>
      
      <p className="text-muted-foreground max-w-md mb-8">
        We couldn't find the product you're looking for. It may have been removed or the URL might be incorrect.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <Button asChild>
          <Link href="/marketplace" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Browse Products
          </Link>
        </Button>
      </div>
    </Container>
  );
}
