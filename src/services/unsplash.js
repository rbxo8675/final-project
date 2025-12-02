const UNSPLASH_API = 'https://api.unsplash.com';
const ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

// Available background categories
export const BACKGROUND_CATEGORIES = [
  { id: 'nature', label: { ko: '자연', en: 'Nature' } },
  { id: 'city', label: { ko: '도시', en: 'City' } },
  { id: 'architecture', label: { ko: '건축', en: 'Architecture' } },
  { id: 'minimal', label: { ko: '미니멀', en: 'Minimal' } },
  { id: 'abstract', label: { ko: '추상', en: 'Abstract' } },
  { id: 'space', label: { ko: '우주', en: 'Space' } },
  { id: 'ocean', label: { ko: '바다', en: 'Ocean' } },
  { id: 'mountain', label: { ko: '산', en: 'Mountain' } },
  { id: 'forest', label: { ko: '숲', en: 'Forest' } }
];

/**
 * Build optimized image URL from Unsplash raw URL
 * @param {string} rawUrl - The raw Unsplash URL
 * @param {object} options - Image options
 * @returns {string} Optimized image URL
 */
export const buildImageUrl = (rawUrl, options = {}) => {
  if (!rawUrl) return null;

  const {
    width = window.innerWidth,
    height = window.innerHeight,
    quality = 100,
    fit = 'crop',
    dpr = window.devicePixelRatio || 1
  } = options;

  // Calculate actual dimensions based on device pixel ratio (for retina displays)
  // Cap DPR at 2 to balance quality and performance
  const effectiveDpr = Math.min(dpr, 2);
  const actualWidth = Math.round(width * effectiveDpr);
  const actualHeight = Math.round(height * effectiveDpr);

  // Build URL with parameters
  const params = new URLSearchParams({
    w: actualWidth,
    h: actualHeight,
    q: quality,
    fit: fit,
    auto: 'format' // Auto-select best format (WebP if supported)
  });

  // Handle URL that might already have parameters
  const separator = rawUrl.includes('?') ? '&' : '?';
  return `${rawUrl}${separator}${params.toString()}`;
};

// Get random image from Unsplash
export const getRandomImage = async (category = 'nature') => {
  if (!ACCESS_KEY || ACCESS_KEY === 'your_unsplash_api_key_here') {
    console.warn('Unsplash API key not configured. Using placeholder.');
    const width = window.innerWidth * (window.devicePixelRatio || 1);
    const height = window.innerHeight * (window.devicePixelRatio || 1);
    return {
      url: `https://source.unsplash.com/random/${Math.round(width)}x${Math.round(height)}/?${category}`,
      thumbUrl: `https://source.unsplash.com/random/400x300/?${category}`,
      author: 'Unsplash',
      authorLink: 'https://unsplash.com',
      downloadLocation: null,
      isPlaceholder: true
    };
  }

  try {
    const response = await fetch(
      `${UNSPLASH_API}/photos/random?query=${category}&orientation=landscape&client_id=${ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();

    // Get the raw URL for maximum quality with custom parameters
    const rawUrl = data.urls.raw;

    return {
      id: data.id,
      // Raw URL - use buildImageUrl() to get optimized version
      rawUrl: rawUrl,
      // Pre-built high quality URL for the current screen
      url: buildImageUrl(rawUrl, { quality: 100 }),
      // Full resolution (original)
      fullUrl: data.urls.full,
      // Regular for fallback (~1080px)
      regularUrl: data.urls.regular,
      // Thumbnail for previews
      thumbUrl: data.urls.thumb,
      // Metadata
      author: data.user.name,
      authorLink: data.user.links.html,
      downloadLocation: data.links.download_location,
      color: data.color,
      description: data.description || data.alt_description,
      // Original dimensions
      width: data.width,
      height: data.height,
      isPlaceholder: false
    };
  } catch (error) {
    console.error('Failed to fetch image from Unsplash:', error);
    // Fallback to source.unsplash.com with high resolution
    const width = window.innerWidth * (window.devicePixelRatio || 1);
    const height = window.innerHeight * (window.devicePixelRatio || 1);
    return {
      url: `https://source.unsplash.com/random/${Math.round(width)}x${Math.round(height)}/?${category}`,
      thumbUrl: `https://source.unsplash.com/random/400x300/?${category}`,
      author: 'Unsplash',
      authorLink: 'https://unsplash.com',
      downloadLocation: null,
      isPlaceholder: true,
      error: error.message
    };
  }
};

// Trigger download (required by Unsplash API guidelines)
export const triggerDownload = async (downloadLocation) => {
  if (!downloadLocation || !ACCESS_KEY) return;

  try {
    await fetch(`${downloadLocation}?client_id=${ACCESS_KEY}`);
  } catch (error) {
    console.error('Failed to trigger download:', error);
  }
};

// Search images (for future use)
export const searchImages = async (query, page = 1, perPage = 10) => {
  if (!ACCESS_KEY || ACCESS_KEY === 'your_unsplash_api_key_here') {
    return { results: [], total: 0 };
  }

  try {
    const response = await fetch(
      `${UNSPLASH_API}/search/photos?query=${query}&page=${page}&per_page=${perPage}&orientation=landscape&client_id=${ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      results: data.results.map((photo) => ({
        id: photo.id,
        rawUrl: photo.urls.raw,
        url: buildImageUrl(photo.urls.raw, { quality: 100 }),
        fullUrl: photo.urls.full,
        regularUrl: photo.urls.regular,
        thumbUrl: photo.urls.thumb,
        author: photo.user.name,
        authorLink: photo.user.links.html,
        downloadLocation: photo.links.download_location,
        color: photo.color,
        description: photo.description || photo.alt_description,
        width: photo.width,
        height: photo.height
      })),
      total: data.total,
      totalPages: data.total_pages
    };
  } catch (error) {
    console.error('Failed to search images:', error);
    return { results: [], total: 0, error: error.message };
  }
};
