import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { getRandomImage, buildImageUrl } from '../../services/imageApi';
import { getImage } from '../../utils/indexedDB';
import styles from './Background.module.css';

const Background = forwardRef(({ onImageChange }, ref) => {
  const {
    widgets,
    currentBackground,
    backgroundMode,
    backgroundPosition
  } = useSettings();

  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);

  const category = widgets?.background?.category || 'nature';
  const enabled = widgets?.background?.enabled ?? true;

  // Load random image function
  const loadRandomImage = async (cat) => {
    setLoading(true);
    setImageLoaded(false);
    setError(null);

    try {
      const data = await getRandomImage(cat);
      setImageData(data);
    } catch (err) {
      setError(err.message || 'Failed to load image');
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh function to parent
  useImperativeHandle(ref, () => ({
    refresh: () => loadRandomImage(category)
  }), [category]);

  // Notify parent when image changes
  useEffect(() => {
    if (onImageChange && imageData) {
      onImageChange(imageData);
    }
  }, [imageData, onImageChange]);

  // Load image based on mode
  useEffect(() => {
    if (!enabled) return;

    const loadFavoriteImage = async () => {
      if (backgroundMode === 'favorite' && currentBackground) {
        setLoading(true);

        // For uploaded images, load from IndexedDB
        if (currentBackground.type === 'upload') {
          try {
            const imageData = await getImage(currentBackground.id);
            setImageData({
              ...currentBackground,
              url: imageData || currentBackground.url
            });
          } catch (err) {
            console.error('Failed to load image from IndexedDB:', err);
            setImageData(currentBackground);
          }
        } else {
          // For API images, use the stored URL
          setImageData({
            ...currentBackground,
            url: currentBackground.rawUrl
              ? buildImageUrl(currentBackground.rawUrl, { quality: 100 })
              : currentBackground.url
          });
        }
        setLoading(false);
        setImageLoaded(false);
      } else {
        // Random mode - load new image
        loadRandomImage(category);
      }
    };

    loadFavoriteImage();
  }, [enabled, backgroundMode, currentBackground, category]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleRetry = () => {
    loadRandomImage(category);
  };

  if (!enabled) {
    return <div className={styles.background} />;
  }

  return (
    <div className={styles.background}>
      {/* Background color placeholder */}
      {imageData?.color && (
        <div
          className={styles.colorPlaceholder}
          style={{ backgroundColor: imageData.color }}
        />
      )}

      {/* Background image */}
      {imageData?.url && (
        <img
          src={imageData.url}
          alt={imageData.description || 'Background'}
          className={`${styles.image} ${imageLoaded ? styles.loaded : ''}`}
          style={{
            objectPosition: backgroundMode === 'favorite' && backgroundPosition
              ? `${backgroundPosition.x}% ${backgroundPosition.y}%`
              : '50% 50%'
          }}
          onLoad={handleImageLoad}
        />
      )}

      {/* Loading overlay */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
        </div>
      )}

      {/* Error message */}
      {error && !imageData && (
        <div className={styles.errorMessage}>
          <p>Failed to load background image</p>
          <button onClick={handleRetry}>Try Again</button>
        </div>
      )}

      {/* Attribution - required by Pexels/Pixabay */}
      {imageData && !imageData.isPlaceholder && imageData.author && (
        <div className={styles.attribution}>
          <a
            href={imageData.authorLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {imageData.author}
          </a>
          {' / '}
          <a
            href={
              imageData.source === 'pexels'
                ? 'https://www.pexels.com'
                : 'https://pixabay.com'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {imageData.source === 'pexels' ? 'Pexels' : 'Pixabay'}
          </a>
        </div>
      )}

    </div>
  );
});

export default Background;
