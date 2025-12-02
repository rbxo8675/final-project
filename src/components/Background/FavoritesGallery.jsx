import { useRef, useState, useEffect } from 'react';
import { IoClose, IoTrash, IoShuffle, IoCloudUpload } from 'react-icons/io5';
import { useSettings } from '../../hooks/useSettings';
import { saveImage, getImage, deleteImage, getAllImages } from '../../utils/indexedDB';
import styles from './FavoritesGallery.module.css';

const FavoritesGallery = ({ isOpen, onClose }) => {
  const {
    backgroundFavorites,
    currentBackground,
    language,
    removeBackgroundFavorite,
    setCurrentBackground,
    addBackgroundFavorite
  } = useSettings();

  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState({});

  // Load uploaded images from IndexedDB
  useEffect(() => {
    const loadUploadedImages = async () => {
      try {
        const images = await getAllImages();
        setUploadedImages(images);
      } catch (err) {
        console.error('Failed to load uploaded images:', err);
      }
    };

    if (isOpen) {
      loadUploadedImages();
    }
  }, [isOpen]);

  const handleSelect = async (favorite) => {
    // For uploaded images, load full image from IndexedDB
    if (favorite.type === 'upload') {
      try {
        const imageData = await getImage(favorite.id);
        setCurrentBackground({
          ...favorite,
          url: imageData || favorite.url
        });
      } catch (err) {
        console.error('Failed to load image:', err);
        setCurrentBackground(favorite);
      }
    } else {
      setCurrentBackground(favorite);
    }
    onClose();
  };

  const handleRemove = async (e, id, type) => {
    e.stopPropagation();

    // Delete from IndexedDB if it's an uploaded image
    if (type === 'upload') {
      try {
        await deleteImage(id);
        setUploadedImages(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } catch (err) {
        console.error('Failed to delete image from IndexedDB:', err);
      }
    }

    removeBackgroundFavorite(id);
  };

  const handleRandomMode = () => {
    setCurrentBackground(null);
    onClose();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File type validation
    if (!file.type.startsWith('image/')) {
      alert(
        language === 'ko'
          ? '이미지 파일만 업로드 가능합니다.'
          : 'Only image files can be uploaded.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target.result;
      const imageId = `upload-${Date.now()}`;

      try {
        // Save image to IndexedDB
        await saveImage(imageId, imageData);

        // Update local state
        setUploadedImages(prev => ({
          ...prev,
          [imageId]: imageData
        }));

        // Add to favorites (without the image data - only metadata)
        const newFavorite = {
          type: 'upload',
          url: '', // Will be loaded from IndexedDB
          thumbnail: '', // Will use IndexedDB data
          author: '',
          authorLink: '',
          name: file.name,
          originalId: imageId
        };
        addBackgroundFavorite(newFavorite);
      } catch (err) {
        console.error('Failed to save image:', err);
        alert(
          language === 'ko'
            ? '이미지 저장에 실패했습니다.'
            : 'Failed to save image.'
        );
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    event.target.value = '';
  };

  // Get thumbnail for display
  const getThumbnail = (fav) => {
    if (fav.type === 'upload') {
      return uploadedImages[fav.id] || fav.thumbnail || '';
    }
    return fav.thumbnail || fav.url;
  };

  if (!isOpen) return null;

  const labels = {
    title: language === 'ko' ? '즐겨찾기 배경' : 'Favorite Backgrounds',
    empty:
      language === 'ko'
        ? '즐겨찾기가 비어있습니다.\n하트 버튼을 눌러 현재 배경을 저장하세요.'
        : 'No favorites yet.\nClick the heart button to save the current background.',
    randomMode: language === 'ko' ? '랜덤 모드' : 'Random Mode',
    upload: language === 'ko' ? '이미지 업로드' : 'Upload Image',
    close: language === 'ko' ? '닫기' : 'Close'
  };

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} />

      {/* Gallery Modal */}
      <div className={styles.gallery}>
        {/* Header */}
        <div className={styles.header}>
          <h3>{labels.title}</h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label={labels.close}
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {backgroundFavorites.length === 0 ? (
            <div className={styles.empty}>
              <p>{labels.empty}</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {backgroundFavorites.map((fav) => (
                <div
                  key={fav.id}
                  className={`${styles.item} ${currentBackground?.id === fav.id ? styles.selected : ''}`}
                  onClick={() => handleSelect(fav)}
                >
                  <img
                    src={getThumbnail(fav)}
                    alt={fav.name || fav.description || 'Background'}
                    loading="lazy"
                  />
                  <button
                    className={styles.removeButton}
                    onClick={(e) => handleRemove(e, fav.id, fav.type)}
                    aria-label="Remove"
                  >
                    <IoTrash />
                  </button>
                  {(fav.type === 'pixabay' || fav.type === 'pexels' || fav.source) && fav.author && (
                    <span className={styles.author}>{fav.author}</span>
                  )}
                  {fav.type === 'upload' && (
                    <span className={styles.uploadBadge}>
                      {language === 'ko' ? '업로드' : 'Upload'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.uploadButton} onClick={handleUploadClick}>
            <IoCloudUpload />
            <span>{labels.upload}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <button className={styles.randomButton} onClick={handleRandomMode}>
            <IoShuffle />
            <span>{labels.randomMode}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default FavoritesGallery;
