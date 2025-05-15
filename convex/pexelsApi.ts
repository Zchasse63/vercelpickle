import { action } from "./_generated/server";
import { v } from "convex/values";

// Pexels API key from user's requirements
const PEXELS_API_KEY = "WvdmE8BBmfJxmj8uCSVrSJ8QkLiH3JRvQKsYygJn3Dj0V3z7fJDmsSgC";

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page: string;
}

/**
 * Search for images on Pexels
 * @param query - Search query
 * @param perPage - Number of results per page
 * @param page - Page number
 * @returns Array of image URLs
 */
export const searchImages = action({
  args: {
    query: v.string(),
    perPage: v.optional(v.number()),
    page: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const perPage = args.perPage || 10;
    const page = args.page || 1;

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(args.query)}&per_page=${perPage}&page=${page}`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.statusText}`);
      }

      const data: PexelsSearchResponse = await response.json();

      // Extract image URLs
      const images = data.photos.map(photo => ({
        id: photo.id,
        url: photo.src.large,
        thumbnail: photo.src.medium,
        original: photo.src.original,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        alt: photo.alt,
      }));

      return {
        success: true,
        images,
        totalResults: data.total_results,
        page: data.page,
        perPage: data.per_page,
        hasNextPage: !!data.next_page,
      };
    } catch (error) {
      console.error("Error searching Pexels:", error);
      return {
        success: false,
        error: `Failed to search Pexels: ${error}`,
        images: [],
      };
    }
  },
});

/**
 * Get images for a product based on its name and category
 * @param productName - Name of the product
 * @param category - Category of the product
 * @returns Array of image URLs
 */
export const getProductImages = action({
  args: {
    productName: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Construct a search query based on product name and category
    let query = args.productName;
    if (args.category) {
      query = `${args.category} ${query}`;
    }

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&page=1`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.statusText}`);
      }

      const data: PexelsSearchResponse = await response.json();

      // Extract image URLs
      const imageUrls = data.photos.map(photo => photo.src.large);

      // If no images found, try with just the category
      if (imageUrls.length === 0 && args.category) {
        const fallbackResponse = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(args.category)}&per_page=3&page=1`,
          {
            headers: {
              Authorization: PEXELS_API_KEY,
            },
          }
        );

        if (fallbackResponse.ok) {
          const fallbackData: PexelsSearchResponse = await fallbackResponse.json();
          return fallbackData.photos.map(photo => photo.src.large);
        }
      }

      return imageUrls;
    } catch (error) {
      console.error("Error fetching product images from Pexels:", error);
      // Return placeholder images on error
      return [
        "/placeholder-product.jpg",
        "/placeholder-product-2.jpg",
        "/placeholder-product-3.jpg",
      ];
    }
  },
});

/**
 * Get curated photos from Pexels
 * @param perPage - Number of results per page
 * @param page - Page number
 * @returns Array of image data
 */
export const getCuratedPhotos = action({
  args: {
    perPage: v.optional(v.number()),
    page: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const perPage = args.perPage || 10;
    const page = args.page || 1;

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.statusText}`);
      }

      const data: PexelsSearchResponse = await response.json();

      // Extract image data
      const images = data.photos.map(photo => ({
        id: photo.id,
        url: photo.src.large,
        thumbnail: photo.src.medium,
        original: photo.src.original,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        alt: photo.alt || photo.url,
      }));

      return {
        success: true,
        images,
        totalResults: data.total_results,
        page: data.page,
        perPage: data.per_page,
        hasNextPage: !!data.next_page,
      };
    } catch (error) {
      console.error("Error fetching curated photos from Pexels:", error);
      return {
        success: false,
        error: `Failed to fetch curated photos: ${error}`,
        images: [],
        totalResults: 0,
        page,
        perPage,
        hasNextPage: false,
      };
    }
  },
});

/**
 * Get photos for a specific category
 * @param category - Category to search for
 * @param perPage - Number of results per page
 * @param page - Page number
 * @returns Array of image data
 */
export const getPhotosByCategory = action({
  args: {
    category: v.string(),
    perPage: v.optional(v.number()),
    page: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Use the search endpoint with the category as the query
    return searchImages({
      query: args.category,
      perPage: args.perPage,
      page: args.page,
    });
  },
});

/**
 * Update a product's images with Pexels images
 * @param id - Product ID
 * @param images - Array of image URLs
 * @returns Updated product
 */
export const updateProductImages = action({
  args: {
    id: v.id("products"),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Import the products module
      const { update } = await import("./products");

      // Update the product with the new images
      const updatedProduct = await update({
        id: args.id,
        images: args.images,
      });

      return {
        success: true,
        product: updatedProduct,
      };
    } catch (error) {
      console.error("Error updating product images:", error);
      return {
        success: false,
        error: `Failed to update product images: ${error}`,
      };
    }
  },
});