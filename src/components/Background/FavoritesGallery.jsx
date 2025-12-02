import { useRef } from 'react';
import { IoClose, IoTrash, IoShuffle, IoCloudUpload } from 'react-icons/io5';
import { useSettings } from '../../hooks/useSettings';
import { buildImageUrl } from '../../services/unsplash';
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

  const handleSelect = (favorite) => {
    setCurrentBackground(favorite);
    onClose();
  };

  const handleRemove = (e, id) => {
    e.stopPropagation();
    removeBackgroundFavorite(id);
  };

  const handleRandomMode = () => {
    setCurrentBackground(null);
    onClose();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event) => {
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
    reader.onload = (e) => {
      const newFavorite = {
        type: 'upload',
        url: e.target.result,
        thumbnail: e.target.result,
        author: '',
        authorLink: '',
        name: file.name,
        originalId: `upload-${Date.now()}`
      };
      addBackgroundFavorite(newFavorite);
    };
    reader.readAsDataURL(file);

    // Reset input
    event.target.value = '';
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
                    src={
                      fav.type === 'upload'
                        ? fav.thumbnail
                        : fav.rawUrl
                          ? buildImageUrl(fav.rawUrl, {
                              width: 200,
                              height: 120,
                              quality: 80
                            })
                          : fav.thumbnail
                    }
                    alt={fav.name || fav.description || 'Background'}
                    loading="lazy"
                  />
                  <button
                    className={styles.removeButton}
                    onClick={(e) => handleRemove(e, fav.id)}
                    aria-label="Remove"
                  >
                    <IoTrash />
                  </button>
                  {fav.type === 'unsplash' && fav.author && (
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
