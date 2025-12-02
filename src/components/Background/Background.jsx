import { useState, useEffect, useCallback } from 'react';
import { IoRefresh } from 'react-icons/io5';
import { useSettings } from '../../hooks/useSettings';
import { getRandomImage, triggerDownload } from '../../services/unsplash';
import styles from './Background.module.css';

const Background = () => {
  const { widgets } = useSettings();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);

  const category = widgets?.background?.category || 'nature';
  const enabled = widgets?.background?.enabled ?? true;

  const loadImage = useCallback(async () => {
    setLoading(true);
    setImageLoaded(false);
    setError(null);

    try {
      const data = await getRandomImage(category);
      setImageData(data);

      // Trigger download for Unsplash API guidelines
      if (data.downloadLocation) {
        triggerDownload(data.downloadLocation);
      }
    } catch (err) {
      setError(err.message || 'Failed to load image');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (enabled) {
      loadImage();
    }
  }, [enabled, loadImage]);

  const handleRefresh = () => {
    loadImage();
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
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
          src={imageData.regularUrl || imageData.url}
          alt={imageData.description || 'Background'}
          className={`${styles.image} ${imageLoaded ? styles.loaded : ''}`}
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
          <button onClick={handleRefresh}>Try Again</button>
        </div>
      )}

      {/* Attribution */}
      {imageData && !imageData.isPlaceholder && (
        <div className={styles.attribution}>
          Photo by{' '}
          <a
            href={`${imageData.authorLink}?utm_source=startpage&utm_medium=referral`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {imageData.author}
          </a>{' '}
          on{' '}
          <a
            href="https://unsplash.com?utm_source=startpage&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
        </div>
      )}

      {/* Refresh button */}
      <button
        className={styles.refreshButton}
        onClick={handleRefresh}
        disabled={loading}
        aria-label="Refresh background image"
      >
        <IoRefresh className={loading ? styles.spinning : ''} />
      </button>
    </div>
  );
};

export default Background;
