/**
 * Test script for the Pexels API
 */

// The Pexels API key
const PEXELS_API_KEY = 'WvdmE8BBmfJxmj8uCSVrSJ8QkLiH3JRvQKsYygJn3Dj0V3z7fJDmsSgC';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

/**
 * Search for photos on Pexels
 */
async function searchPhotos(query, options = {}) {
  const { perPage = 1 } = options;
  
  // Build the query parameters
  const params = new URLSearchParams({
    query,
    per_page: perPage.toString(),
    page: '1',
  });
  
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
 * Run the test
 */
async function runTest() {
  console.log('Testing Pexels API...');
  
  try {
    // Test with a simple query
    const result = await searchPhotos('organic apples');
    
    console.log('✅ Pexels API Test Successful!');
    console.log('Total results:', result.total_results);
    
    if (result.photos && result.photos.length > 0) {
      const photo = result.photos[0];
      console.log('Photo ID:', photo.id);
      console.log('Photographer:', photo.photographer);
      console.log('Image URL (medium):', photo.src.medium);
      console.log('Image URL (large):', photo.src.large);
    } else {
      console.log('No photos found for the query.');
    }
  } catch (error) {
    console.error('❌ Pexels API Test Failed:', error);
  }
}

// Run the test
runTest();
