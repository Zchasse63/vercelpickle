/**
 * Pexels API Service
 * 
 * This service provides functions to interact with the Pexels API
 * for fetching high-quality product images.
 */

// The Pexels API key
const PEXELS_API_KEY = 'WvdmE8BBmfJxmj8uCSVrSJ8QkLiH3JRvQKsYygJn3Dj0V3z7fJDmsSgC';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

// Types for Pexels API responses
export interface PexelsPhoto {
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
  alt: string;
}

interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
  prev_page?: string;
}

/**
 * Search for photos on Pexels
 * @param query The search query
 * @param options Additional search options
 * @returns Promise with search results
 */
export async function searchPhotos(
  query: string,
  options: {
    perPage?: number;
    page?: number;
    orientation?: 'landscape' | 'portrait' | 'square';
    size?: 'large' | 'medium' | 'small';
    color?: string;
  } = {}
): Promise<PexelsSearchResponse> {
  const { perPage = 15, page = 1, orientation, size, color } = options;
  
  // Build the query parameters
  const params = new URLSearchParams({
    query,
    per_page: perPage.toString(),
    page: page.toString(),
  });
  
  if (orientation) params.append('orientation', orientation);
  if (size) params.append('size', size);
  if (color) params.append('color', color);
  
  try {
    const response = await fetch(`${PEXELS_API_URL}/search?${params.toString()}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching photos from Pexels:', error);
    throw error;
  }
}

/**
 * Get a single photo by ID
 * @param id The photo ID
 * @returns Promise with the photo
 */
export async function getPhoto(id: number): Promise<PexelsPhoto> {
  try {
    const response = await fetch(`${PEXELS_API_URL}/photos/${id}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching photo ${id} from Pexels:`, error);
    throw error;
  }
}

/**
 * Find the best product image based on product details
 * @param productName The product name
 * @param category The product category
 * @param subcategory The product subcategory (optional)
 * @returns Promise with the best matching photo
 */
export async function findProductImage(
  productName: string,
  category: string,
  subcategory?: string
): Promise<PexelsPhoto | null> {
  try {
    // Build a search query that combines product details for better results
    let query = productName;
    
    // Add category and subcategory for more specific results
    if (subcategory) {
      query = `${query} ${subcategory}`;
    } else if (category) {
      query = `${query} ${category}`;
    }
    
    // Search for photos with the combined query
    const result = await searchPhotos(query, {
      perPage: 5,
      orientation: 'square', // Square images work best for product thumbnails
    });
    
    // Return the first result, or null if no results
    return result.photos.length > 0 ? result.photos[0] : null;
  } catch (error) {
    console.error('Error finding product image:', error);
    return null;
  }
}

/**
 * Get a random food image from Pexels
 * This is useful for fallback images when specific searches don't yield results
 */
export async function getRandomFoodImage(): Promise<PexelsPhoto | null> {
  try {
    // Use a generic food-related search term
    const foodTerms = ['food', 'fresh food', 'grocery', 'produce', 'ingredients'];
    const randomTerm = foodTerms[Math.floor(Math.random() * foodTerms.length)];
    
    const result = await searchPhotos(randomTerm, {
      perPage: 20,
      orientation: 'square',
    });
    
    if (result.photos.length > 0) {
      // Get a random photo from the results
      const randomIndex = Math.floor(Math.random() * result.photos.length);
      return result.photos[randomIndex];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting random food image:', error);
    return null;
  }
}
