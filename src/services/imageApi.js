// Image API Service - Pixabay (primary) + Pexels (fallback)

const PIXABAY_API_KEY = process.env.REACT_APP_PIXABAY_API_KEY;
const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;

const PIXABAY_BASE_URL = 'https://pixabay.com/api/';
const PEXELS_BASE_URL = 'https://api.pexels.com/v1/';

// Category configuration with labels
export const BACKGROUND_CATEGORIES = [
  { id: 'nature', label: { ko: '자연', en: 'Nature' }, pixabay: 'nature', pexels: 'nature' },
  { id: 'city', label: { ko: '도시', en: 'City' }, pixabay: 'buildings', pexels: 'city' },
  { id: 'architecture', label: { ko: '건축', en: 'Architecture' }, pixabay: 'buildings', pexels: 'architecture' },
  { id: 'ocean', label: { ko: '바다', en: 'Ocean' }, pixabay: 'nature', pexels: 'ocean', query: 'ocean' },
  { id: 'mountain', label: { ko: '산', en: 'Mountain' }, pixabay: 'nature', pexels: 'mountain', query: 'mountain' },
  { id: 'forest', label: { ko: '숲', en: 'Forest' }, pixabay: 'nature', pexels: 'forest', query: 'forest' },
  { id: 'travel', label: { ko: '여행', en: 'Travel' }, pixabay: 'travel', pexels: 'travel' },
  { id: 'space', label: { ko: '우주', en: 'Space' }, pixabay: 'science', pexels: 'space', query: 'space galaxy' },
  { id: 'animals', label: { ko: '동물', en: 'Animals' }, pixabay: 'animals', pexels: 'animals' },
  { id: 'abstract', label: { ko: '추상', en: 'Abstract' }, pixabay: 'backgrounds', pexels: 'abstract', query: 'abstract' }
];

// Get random image from Pixabay
const getPixabayImage = async (category, editorsChoice = true) => {
  if (!PIXABAY_API_KEY) {
    throw new Error('Pixabay API key not configured');
  }

  const categoryConfig = BACKGROUND_CATEGORIES.find(c => c.id === category) || BACKGROUND_CATEGORIES[0];
  const query = categoryConfig.query || categoryConfig.id;

  const params = new URLSearchParams({
    key: PIXABAY_API_KEY,
    q: query,
    category: categoryConfig.pixabay,
    orientation: 'horizontal',
    min_width: 2560,  // Require at least 2K width
    min_height: 1440, // Require at least 2K height
    image_type: 'photo',
    safesearch: 'true',
    per_page: 100,
    page: Math.floor(Math.random() * 3) + 1 // Random page 1-3
  });

  // Only add editors_choice if requested
  if (editorsChoice) {
    params.set('editors_choice', 'true');
  }

  const response = await fetch(`${PIXABAY_BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Pixabay API error: ${response.status}`);
  }

  const data = await response.json();

  // If no editor's choice images, try without that filter
  if ((!data.hits || data.hits.length === 0) && editorsChoice) {
    console.log('No editor\'s choice images, trying regular images...');
    return getPixabayImage(category, false);
  }

  if (!data.hits || data.hits.length === 0) {
    throw new Error('No images found from Pixabay');
  }

  // Get random image from results
  const randomIndex = Math.floor(Math.random() * data.hits.length);
  const image = data.hits[randomIndex];

  // Use highest resolution available
  // Pixabay provides: fullHDURL (1920px), largeImageURL (1280px), imageURL (640px)
  const highResUrl = image.fullHDURL || image.largeImageURL;

  return {
    id: `pixabay-${image.id}`,
    url: highResUrl, // Use Full HD (1920px) when available
    fullUrl: highResUrl,
    thumbUrl: image.previewURL,
    rawUrl: highResUrl,
    author: image.user,
    authorLink: `https://pixabay.com/users/${image.user}-${image.user_id}/`,
    description: image.tags,
    color: '#1a1a1a',
    source: 'pixabay',
    sourceLink: image.pageURL,
    width: image.imageWidth,
    height: image.imageHeight
  };
};

// Get random image from Pexels
const getPexelsImage = async (category) => {
  if (!PEXELS_API_KEY) {
    throw new Error('Pexels API key not configured');
  }

  const categoryConfig = BACKGROUND_CATEGORIES.find(c => c.id === category) || BACKGROUND_CATEGORIES[0];
  const query = categoryConfig.query || categoryConfig.pexels || categoryConfig.id;

  const params = new URLSearchParams({
    query: query,
    orientation: 'landscape',
    size: 'large',
    per_page: 80,
    page: Math.floor(Math.random() * 5) + 1 // Random page 1-5
  });

  const response = await fetch(`${PEXELS_BASE_URL}search?${params}`, {
    headers: {
      Authorization: PEXELS_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.photos || data.photos.length === 0) {
    throw new Error('No images found from Pexels');
  }

  // Get random image from results
  const randomIndex = Math.floor(Math.random() * data.photos.length);
  const image = data.photos[randomIndex];

  // Use original resolution for best quality
  // Pexels provides: original (full res), large2x (1880px), large (940px)
  return {
    id: `pexels-${image.id}`,
    url: image.src.original, // Use original full resolution
    fullUrl: image.src.original,
    thumbUrl: image.src.medium,
    rawUrl: image.src.original,
    author: image.photographer,
    authorLink: image.photographer_url,
    description: image.alt || '',
    color: image.avg_color || '#1a1a1a',
    source: 'pexels',
    sourceLink: image.url,
    width: image.width,
    height: image.height
  };
};

// Get random image with fallback
export const getRandomImage = async (category = 'nature') => {
  // Try Pixabay first
  try {
    const image = await getPixabayImage(category);
    console.log('Image loaded from Pixabay');
    return image;
  } catch (pixabayError) {
    console.warn('Pixabay failed, trying Pexels:', pixabayError.message);

    // Fallback to Pexels
    try {
      const image = await getPexelsImage(category);
      console.log('Image loaded from Pexels');
      return image;
    } catch (pexelsError) {
      console.error('Both APIs failed:', pexelsError.message);
      throw new Error('Failed to load image from any source');
    }
  }
};

// Build optimized image URL (for compatibility with existing code)
export const buildImageUrl = (rawUrl, options = {}) => {
  // For Pixabay/Pexels, URLs are already optimized
  // Just return the URL as-is
  return rawUrl;
};

// Trigger download for API guidelines (placeholder - not needed for Pixabay/Pexels)
export const triggerDownload = (downloadLocation) => {
  // Pixabay and Pexels don't require download tracking
  // This is kept for API compatibility
};
