import { BuyerFavoriteProducts } from "@/components/buyer/buyer-favorite-products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BuyerFavoriteSellers } from "@/components/buyer/buyer-favorite-sellers"

export default function FavoritesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
        <p className="text-gray-500">Products and sellers you've saved for quick access.</p>
      </div>
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Products</CardTitle>
              <CardDescription>Products you've saved for quick access.</CardDescription>
            </CardHeader>
            <CardContent>
              <BuyerFavoriteProducts />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sellers">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Sellers</CardTitle>
              <CardDescription>Sellers you've saved for quick access.</CardDescription>
            </CardHeader>
            <CardContent>
              <BuyerFavoriteSellers />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
