import { useState, useEffect, useRef } from 'react';
import { IoRefresh, IoChevronDown } from 'react-icons/io5';
import { useSettings } from '../../hooks/useSettings';
import {
  getRandomImage,
  triggerDownload,
  BACKGROUND_CATEGORIES
} from '../../services/unsplash';
import styles from './Background.module.css';

const Background = () => {
  const { widgets, language, updateWidgetSettings } = useSettings();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const categoryMenuRef = useRef(null);

  const category = widgets?.background?.category || 'nature';
  const enabled = widgets?.background?.enabled ?? true;

  // Load image function
  const loadImage = async (cat) => {
    setLoading(true);
    setImageLoaded(false);
    setError(null);

    try {
      const data = await getRandomImage(cat);
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
  };

  // Load image on mount and when category changes
  useEffect(() => {
    if (enabled) {
      loadImage(category);
    }
  }, [enabled, category]);

  // Close category menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target)
      ) {
        setShowCategoryMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefresh = () => {
    loadImage(category);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleCategoryChange = (newCategory) => {
    updateWidgetSettings('background', { category: newCategory });
    setShowCategoryMenu(false);
  };

  const toggleCategoryMenu = () => {
    setShowCategoryMenu((prev) => !prev);
  };

  const getCurrentCategoryLabel = () => {
    const cat = BACKGROUND_CATEGORIES.find((c) => c.id === category);
    return cat ? cat.label[language] || cat.label.ko : category;
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

      {/* Controls */}
      <div className={styles.controls}>
        {/* Category selector */}
        <div className={styles.categorySelector} ref={categoryMenuRef}>
          <button
            className={styles.categoryButton}
            onClick={toggleCategoryMenu}
            aria-label="Select category"
          >
            <span>{getCurrentCategoryLabel()}</span>
            <IoChevronDown
              className={`${styles.chevron} ${showCategoryMenu ? styles.open : ''}`}
            />
          </button>

          {showCategoryMenu && (
            <div className={styles.categoryMenu}>
              {BACKGROUND_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.categoryItem} ${category === cat.id ? styles.active : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.label[language] || cat.label.ko}
                </button>
              ))}
            </div>
          )}
        </div>

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
    </div>
  );
};

export default Background;
