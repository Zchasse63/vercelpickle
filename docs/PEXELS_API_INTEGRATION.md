# Pexels API Integration Guide

## Overview

This document outlines the integration of the Pexels API for product and category images in the Pickle B2B Marketplace platform. Pexels provides high-quality, royalty-free images that will enhance the visual appeal of our marketplace.

## API Key

The Pexels API key for this project is:

```
WvdmE8BBmfJxmj8uCSVrSJ8QkLiH3JRvQKsYygJn3Dj0V3z7fJDmsSgC
```

> ⚠️ **IMPORTANT**: This API key should be stored securely in environment variables and not committed directly to the codebase in production.

## Integration Requirements

1. **Product Images**: Replace placeholder product images with relevant, high-quality images from Pexels.
2. **Category Images**: Use Pexels API to fetch appropriate images for category displays on the home page.
3. **Featured Products**: Ensure featured products on the home page use Pexels images.

## Implementation Guide

### 1. Setting Up the Pexels Client

```typescript
// lib/pexels.ts
import { createClient } from 'pexels';

// Create a Pexels client instance
const pexelsClient = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY || 'WvdmE8BBmfJxmj8uCSVrSJ8QkLiH3JRvQKsYygJn3Dj0V3z7fJDmsSgC');

export default pexelsClient;
```

### 2. Fetching Product Images

```typescript
// lib/product-images.ts
import pexelsClient from './pexels';
import { Photo } from 'pexels';

// Cache for storing fetched images to reduce API calls
const imageCache: Record<string, Photo[]> = {};

/**
 * Fetch product images based on product category and name
 */
export async function getProductImages(
  category: string, 
  productName: string, 
  count: number = 1
): Promise<string[]> {
  const searchTerm = `${category} ${productName}`;
  
  // Check cache first
  if (imageCache[searchTerm] && imageCache[searchTerm].length >= count) {
    return imageCache[searchTerm].slice(0, count).map(photo => photo.src.large);
  }
  
  try {
    // Fetch images from Pexels
    const response = await pexelsClient.photos.search({ 
      query: searchTerm, 
      per_page: count,
      orientation: 'landscape'
    });
    
    if (response.photos && response.photos.length > 0) {
      // Store in cache
      imageCache[searchTerm] = response.photos;
      return response.photos.map(photo => photo.src.large);
    }
    
    // Fallback to category only if no results
    if (!response.photos || response.photos.length === 0) {
      return getCategoryImages(category, count);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching product images from Pexels:', error);
    return [];
  }
}
```

### 3. Fetching Category Images

```typescript
// lib/product-images.ts (continued)

/**
 * Fetch category images
 */
export async function getCategoryImages(
  category: string, 
  count: number = 1
): Promise<string[]> {
  // Check cache first
  if (imageCache[category] && imageCache[category].length >= count) {
    return imageCache[category].slice(0, count).map(photo => photo.src.large);
  }
  
  try {
    // Fetch images from Pexels
    const response = await pexelsClient.photos.search({ 
      query: category, 
      per_page: count,
      orientation: 'landscape'
    });
    
    if (response.photos && response.photos.length > 0) {
      // Store in cache
      imageCache[category] = response.photos;
      return response.photos.map(photo => photo.src.large);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching category images from Pexels:', error);
    return [];
  }
}
```

### 4. Using Images in Components

#### Product Card Component

```tsx
// components/product-card.tsx
import { useEffect, useState } from 'react';
import { getProductImages } from '@/lib/product-images';

export function ProductCard({ product }) {
  const [imageUrl, setImageUrl] = useState(product.image || '/placeholder.png');
  
  useEffect(() => {
    async function loadProductImage() {
      if (!product.usePexelsImage) return;
      
      const images = await getProductImages(
        product.category,
        product.name,
        1
      );
      
      if (images && images.length > 0) {
        setImageUrl(images[0]);
      }
    }
    
    loadProductImage();
  }, [product]);
  
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={product.name} />
      </div>
      {/* Rest of product card */}
    </div>
  );
}
```

#### Category Component

```tsx
// components/category-card.tsx
import { useEffect, useState } from 'react';
import { getCategoryImages } from '@/lib/product-images';

export function CategoryCard({ category }) {
  const [imageUrl, setImageUrl] = useState(category.image || '/placeholder-category.png');
  
  useEffect(() => {
    async function loadCategoryImage() {
      const images = await getCategoryImages(category.name, 1);
      
      if (images && images.length > 0) {
        setImageUrl(images[0]);
      }
    }
    
    loadCategoryImage();
  }, [category]);
  
  return (
    <div className="category-card">
      <div className="category-image">
        <img src={imageUrl} alt={category.name} />
      </div>
      <h3>{category.name}</h3>
    </div>
  );
}
```

## Best Practices

1. **Caching**: Implement caching to reduce API calls and improve performance.
2. **Error Handling**: Always include proper error handling for API calls.
3. **Fallbacks**: Provide fallback images in case the API call fails.
4. **Image Optimization**: Use Next.js Image component for optimized image loading.
5. **Rate Limiting**: Be mindful of Pexels API rate limits (200 requests per hour).

## Testing

Test the Pexels API integration thoroughly to ensure:

1. Images load correctly for products and categories
2. Fallback images display when API calls fail
3. Caching works as expected
4. Performance is not negatively impacted

## Resources

- [Pexels API Documentation](https://www.pexels.com/api/documentation/)
- [Pexels API JavaScript Client](https://github.com/pexels/pexels-javascript)
