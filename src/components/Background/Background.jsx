import { useState, useEffect, useRef } from 'react';
import {
  IoRefresh,
  IoChevronDown,
  IoHeart,
  IoHeartOutline,
  IoGrid
} from 'react-icons/io5';
import { useSettings } from '../../hooks/useSettings';
import {
  getRandomImage,
  triggerDownload,
  BACKGROUND_CATEGORIES,
  buildImageUrl
} from '../../services/unsplash';
import FavoritesGallery from './FavoritesGallery';
import styles from './Background.module.css';

const Background = () => {
  const {
    widgets,
    language,
    updateWidgetSettings,
    backgroundFavorites,
    currentBackground,
    backgroundMode,
    addBackgroundFavorite,
    isBackgroundFavorited
  } = useSettings();

  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const categoryMenuRef = useRef(null);

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

  // Load image based on mode
  useEffect(() => {
    if (!enabled) return;

    if (backgroundMode === 'favorite' && currentBackground) {
      // Use favorite image
      setImageData({
        ...currentBackground,
        url:
          currentBackground.type === 'upload'
            ? currentBackground.url
            : currentBackground.rawUrl
              ? buildImageUrl(currentBackground.rawUrl, { quality: 100 })
              : currentBackground.url
      });
      setLoading(false);
      setImageLoaded(false);
    } else {
      // Random mode - load new image
      loadRandomImage(category);
    }
  }, [enabled, backgroundMode, currentBackground, category]);

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
    loadRandomImage(category);
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

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!imageData || imageData.isPlaceholder) return;

    const isFavorited = isBackgroundFavorited(imageData.id);

    if (!isFavorited) {
      const newFavorite = {
        type: 'unsplash',
        originalId: imageData.id,
        url: imageData.url,
        rawUrl: imageData.rawUrl,
        thumbnail: imageData.thumbUrl,
        author: imageData.author,
        authorLink: imageData.authorLink,
        description: imageData.description,
        color: imageData.color
      };
      addBackgroundFavorite(newFavorite);
    }
  };

  const isFavorited = imageData?.id && isBackgroundFavorited(imageData.id);

  if (!enabled) {
    return <div className={styles.background} />;
  }

  return (
    <>
      {/* Background Layer - z-index: -1 */}
      <div className={styles.background}>
        {/* Background color placeholder */}
        {imageData?.color && (
          <div
            className={styles.colorPlaceholder}
            style={{ backgroundColor: imageData.color }}
          />
        )}

        {/* Background image - using high quality optimized URL */}
        {imageData?.url && (
          <img
            src={imageData.url}
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
      </div>

      {/* Controls Layer - z-index: 10 (separate from background) */}
      <div className={styles.controlsLayer}>
        {/* Left side controls */}
        <div className={styles.leftControls}>
          {/* Attribution */}
          {imageData && !imageData.isPlaceholder && imageData.author && (
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

          {/* Favorite button */}
          {imageData &&
            !imageData.isPlaceholder &&
            backgroundMode === 'random' && (
              <button
                className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ''}`}
                onClick={handleFavoriteToggle}
                disabled={isFavorited}
                aria-label={
                  isFavorited ? 'Already in favorites' : 'Add to favorites'
                }
                title={
                  language === 'ko'
                    ? isFavorited
                      ? '즐겨찾기에 추가됨'
                      : '즐겨찾기에 추가'
                    : isFavorited
                      ? 'Already in favorites'
                      : 'Add to favorites'
                }
              >
                {isFavorited ? <IoHeart /> : <IoHeartOutline />}
              </button>
            )}
        </div>

        {/* Right side controls */}
        <div className={styles.controls}>
          {/* Gallery button */}
          <button
            className={`${styles.galleryButton} ${backgroundMode === 'favorite' ? styles.active : ''}`}
            onClick={() => setShowGallery(true)}
            aria-label="Open favorites gallery"
            title={language === 'ko' ? '즐겨찾기' : 'Favorites'}
          >
            <IoGrid />
            {backgroundFavorites.length > 0 && (
              <span className={styles.badge}>{backgroundFavorites.length}</span>
            )}
          </button>

          {/* Category selector - only in random mode */}
          {backgroundMode === 'random' && (
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
          )}

          {/* Refresh button - only in random mode */}
          {backgroundMode === 'random' && (
            <button
              className={styles.refreshButton}
              onClick={handleRefresh}
              disabled={loading}
              aria-label="Refresh background image"
            >
              <IoRefresh className={loading ? styles.spinning : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Favorites Gallery Modal */}
      <FavoritesGallery
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
      />
    </>
  );
};

export default Background;
