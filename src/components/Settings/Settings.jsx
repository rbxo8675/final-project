import { useState, useRef, useEffect } from 'react';
import {
  IoClose,
  IoSunny,
  IoMoon,
  IoGlobe,
  IoColorPalette,
  IoImage,
  IoEye,
  IoMove,
  IoCloudUpload,
  IoTrash,
  IoCheckmarkCircle,
  IoShuffle
} from 'react-icons/io5';
import { useSettings } from '../../hooks/useSettings';
import { BACKGROUND_CATEGORIES } from '../../services/imageApi';
import { saveImage, deleteImage, getImage } from '../../utils/indexedDB';
import styles from './Settings.module.css';

// Widget style options
const WIDGET_STYLES = [
  { id: 'glass', label: { ko: '글래스', en: 'Glass' }, preview: 'rgba(255,255,255,0.15)' },
  { id: 'solid', label: { ko: '솔리드', en: 'Solid' }, preview: 'rgba(255,255,255,0.95)' },
  { id: 'minimal', label: { ko: '미니멀', en: 'Minimal' }, preview: 'transparent' },
  { id: 'neon', label: { ko: '네온', en: 'Neon' }, preview: 'rgba(0,0,0,0.6)' },
  { id: 'frosted', label: { ko: '프로스트', en: 'Frosted' }, preview: 'rgba(255,255,255,0.25)' }
];

// Common emoji icons for page favicon
const PAGE_ICONS = [
  '🏠', '⭐', '🌟', '💫', '✨', '🔥', '💡', '🎯',
  '📌', '🚀', '💻', '📱', '🎨', '🎵', '📚', '☕',
  '🌈', '🌙', '☀️', '🌸', '🍀', '💎', '🔔', '❤️'
];

const Settings = ({ isOpen, onClose }) => {
  const {
    theme,
    language,
    widgetStyle,
    uiSettings,
    widgets,
    backgroundFavorites,
    currentBackground,
    backgroundMode,
    updateTheme,
    updateLanguage,
    updateWidgetStyle,
    updateUiSettings,
    updateWidgetSettings,
    addBackgroundFavorite,
    removeBackgroundFavorite,
    setCurrentBackground,
    setBackgroundMode,
    backgroundPosition,
    setBackgroundPosition,
    pageTitle,
    pageIcon,
    updatePageTitle,
    updatePageIcon
  } = useSettings();

  const [activeTab, setActiveTab] = useState('appearance');
  const [favoriteThumbnails, setFavoriteThumbnails] = useState({});
  const [tempPageTitle, setTempPageTitle] = useState(pageTitle || 'My Start Page');
  const fileInputRef = useRef(null);

  // Sync tempPageTitle when pageTitle changes externally
  useEffect(() => {
    setTempPageTitle(pageTitle || 'My Start Page');
  }, [pageTitle]);

  // Load thumbnails for uploaded images
  useEffect(() => {
    const loadThumbnails = async () => {
      const thumbnails = {};
      for (const fav of backgroundFavorites || []) {
        if (fav.type === 'upload') {
          try {
            const imageData = await getImage(fav.id);
            if (imageData) {
              thumbnails[fav.id] = imageData;
            }
          } catch (err) {
            console.error('Failed to load thumbnail:', err);
          }
        }
      }
      setFavoriteThumbnails(thumbnails);
    };
    loadThumbnails();
  }, [backgroundFavorites]);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(language === 'ko' ? '이미지 파일만 업로드할 수 있습니다.' : 'Only image files can be uploaded.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(language === 'ko' ? '파일 크기는 10MB 이하여야 합니다.' : 'File size must be under 10MB.');
      return;
    }

    try {
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target.result;
        const id = `upload-${Date.now()}`;

        // Save to IndexedDB
        await saveImage(id, imageData);

        // Add to favorites
        addBackgroundFavorite({
          type: 'upload',
          url: imageData, // Store as data URL for immediate use
          thumbUrl: imageData,
          name: file.name,
          originalId: id
        });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert(language === 'ko' ? '이미지 업로드에 실패했습니다.' : 'Failed to upload image.');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle favorite deletion
  const handleDeleteFavorite = async (fav) => {
    if (fav.type === 'upload') {
      try {
        await deleteImage(fav.id);
      } catch (err) {
        console.error('Failed to delete from IndexedDB:', err);
      }
    }
    removeBackgroundFavorite(fav.id);
  };

  // Handle selecting a favorite as current background
  const handleSelectFavorite = (fav) => {
    setCurrentBackground(fav);
  };

  // Handle random mode toggle
  const handleRandomMode = () => {
    setBackgroundMode('random');
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const tabs = [
    { id: 'appearance', label: language === 'ko' ? '외관' : 'Appearance', icon: <IoColorPalette /> },
    { id: 'background', label: language === 'ko' ? '배경' : 'Background', icon: <IoImage /> },
    { id: 'ui', label: language === 'ko' ? '인터페이스' : 'Interface', icon: <IoEye /> }
  ];

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>{language === 'ko' ? '설정' : 'Settings'}</h2>
          </div>
          <nav className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className={styles.main}>
          <div className={styles.header}>
            <h3>{tabs.find(t => t.id === activeTab)?.label}</h3>
            <button className={styles.closeBtn} onClick={onClose}>
              <IoClose />
            </button>
          </div>
          <div className={styles.content}>
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className={styles.section}>
              {/* Page Title */}
              <div className={styles.settingGroup}>
                <label className={styles.label}>
                  {language === 'ko' ? '페이지 제목' : 'Page Title'}
                </label>
                <div className={styles.inputWithButton}>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={tempPageTitle}
                    onChange={(e) => setTempPageTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updatePageTitle(tempPageTitle);
                      }
                    }}
                    placeholder={language === 'ko' ? '페이지 제목 입력' : 'Enter page title'}
                  />
                  <button
                    className={styles.confirmBtn}
                    onClick={() => updatePageTitle(tempPageTitle)}
                    disabled={tempPageTitle === pageTitle}
                  >
                    <IoCheckmarkCircle />
                  </button>
                </div>
              </div>

              {/* Page Icon */}
              <div className={styles.settingGroup}>
                <label className={styles.label}>
                  {language === 'ko' ? '페이지 아이콘' : 'Page Icon'}
                </label>
                <div className={styles.iconSelector}>
                  {PAGE_ICONS.map((icon) => (
                    <button
                      key={icon}
                      className={`${styles.iconBtn} ${pageIcon === icon ? styles.active : ''}`}
                      onClick={() => updatePageIcon(icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className={styles.settingGroup}>
                <label className={styles.label}>
                  {language === 'ko' ? '테마' : 'Theme'}
                </label>
                <div className={styles.themeSelector}>
                  <button
                    className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
                    onClick={() => updateTheme('light')}
                  >
                    <IoSunny />
                    <span>{language === 'ko' ? '라이트' : 'Light'}</span>
                  </button>
                  <button
                    className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
                    onClick={() => updateTheme('dark')}
                  >
                    <IoMoon />
                    <span>{language === 'ko' ? '다크' : 'Dark'}</span>
                  </button>
                </div>
              </div>

              {/* Language */}
              <div className={styles.settingGroup}>
                <label className={styles.label}>
                  <IoGlobe />
                  {language === 'ko' ? '언어' : 'Language'}
                </label>
                <div className={styles.languageSelector}>
                  <button
                    className={`${styles.langBtn} ${language === 'ko' ? styles.active : ''}`}
                    onClick={() => updateLanguage('ko')}
                  >
                    한국어
                  </button>
                  <button
                    className={`${styles.langBtn} ${language === 'en' ? styles.active : ''}`}
                    onClick={() => updateLanguage('en')}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Widget Style */}
              <div className={styles.settingGroup}>
                <label className={styles.label}>
                  {language === 'ko' ? '위젯 스타일' : 'Widget Style'}
                </label>
                <div className={styles.styleGrid}>
                  {WIDGET_STYLES.map((style) => (
                    <button
                      key={style.id}
                      className={`${styles.styleBtn} ${widgetStyle === style.id ? styles.active : ''}`}
                      onClick={() => updateWidgetStyle(style.id)}
                      data-style={style.id}
                    >
                      <div
                        className={styles.stylePreview}
                        style={{
                          background: style.preview,
                          border: style.id === 'neon' ? '1px solid #00f5ff' : '1px solid rgba(255,255,255,0.3)',
                          boxShadow: style.id === 'neon' ? '0 0 10px rgba(0,245,255,0.3)' : 'none'
                        }}
                      />
                      <span>{style.label[language] || style.label.ko}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Background Tab */}
          {activeTab === 'background' && (
            <div className={styles.section}>
              {/* Background Mode */}
              <div className={styles.settingGroup}>
                <label className={styles.label}>
                  {language === 'ko' ? '배경 모드' : 'Background Mode'}
                </label>
                <div className={styles.modeSelector}>
                  <button
                    className={`${styles.modeBtn} ${backgroundMode === 'random' ? styles.active : ''}`}
                    onClick={handleRandomMode}
                  >
                    <IoShuffle />
                    <span>{language === 'ko' ? '랜덤' : 'Random'}</span>
                  </button>
                  <button
                    className={`${styles.modeBtn} ${backgroundMode === 'favorite' ? styles.active : ''}`}
                    onClick={() => setBackgroundMode('favorite')}
                    disabled={!backgroundFavorites?.length}
                  >
                    <IoImage />
                    <span>{language === 'ko' ? '즐겨찾기' : 'Favorite'}</span>
                  </button>
                </div>
              </div>

              {/* Category (only show in random mode) */}
              {backgroundMode === 'random' && (
                <div className={styles.settingGroup}>
                  <label className={styles.label}>
                    {language === 'ko' ? '배경 카테고리' : 'Background Category'}
                  </label>
                  <div className={styles.categoryGrid}>
                    {BACKGROUND_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        className={`${styles.categoryBtn} ${widgets?.background?.category === cat.id ? styles.active : ''}`}
                        onClick={() => updateWidgetSettings('background', { category: cat.id })}
                      >
                        {cat.label[language] || cat.label.ko}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div className={styles.settingGroup}>
                <label className={styles.label}>
                  <IoCloudUpload />
                  {language === 'ko' ? '이미지 업로드' : 'Upload Image'}
                </label>
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className={styles.fileInput}
                    id="background-upload"
                  />
                  <label htmlFor="background-upload" className={styles.uploadBtn}>
                    <IoCloudUpload />
                    <span>
                      {language === 'ko' ? '이미지 선택 (최대 10MB)' : 'Select Image (max 10MB)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Favorites List */}
              {backgroundFavorites && backgroundFavorites.length > 0 && (
                <div className={styles.settingGroup}>
                  <label className={styles.label}>
                    {language === 'ko' ? `저장된 이미지 (${backgroundFavorites.length})` : `Saved Images (${backgroundFavorites.length})`}
                  </label>
                  <div className={styles.favoritesGrid}>
                    {backgroundFavorites.map((fav) => (
                      <div
                        key={fav.id}
                        className={`${styles.favoriteItem} ${currentBackground?.id === fav.id ? styles.selected : ''}`}
                      >
                        <img
                          src={fav.type === 'upload' ? (favoriteThumbnails[fav.id] || fav.thumbUrl) : fav.thumbUrl}
                          alt={fav.name || 'Saved background'}
                          className={styles.favoriteThumbnail}
                          onClick={() => handleSelectFavorite(fav)}
                        />
                        {currentBackground?.id === fav.id && (
                          <div className={styles.selectedBadge}>
                            <IoCheckmarkCircle />
                          </div>
                        )}
                        <button
                          className={styles.favoriteDeleteBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFavorite(fav);
                          }}
                          title={language === 'ko' ? '삭제' : 'Delete'}
                        >
                          <IoTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Position - only in favorite mode */}
              {backgroundMode === 'favorite' && currentBackground && (
                <div className={styles.settingGroup}>
                  <label className={styles.label}>
                    {language === 'ko' ? '이미지 위치 조정' : 'Adjust Image Position'}
                  </label>
                  <div className={styles.positionControl}>
                    <div className={styles.positionSlider}>
                      <span>{language === 'ko' ? '가로' : 'Horizontal'}</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={backgroundPosition?.x ?? 50}
                        onChange={(e) =>
                          setBackgroundPosition({
                            ...backgroundPosition,
                            x: Number(e.target.value)
                          })
                        }
                        className={styles.slider}
                      />
                      <span>{backgroundPosition?.x ?? 50}%</span>
                    </div>
                    <div className={styles.positionSlider}>
                      <span>{language === 'ko' ? '세로' : 'Vertical'}</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={backgroundPosition?.y ?? 50}
                        onChange={(e) =>
                          setBackgroundPosition({
                            ...backgroundPosition,
                            y: Number(e.target.value)
                          })
                        }
                        className={styles.slider}
                      />
                      <span>{backgroundPosition?.y ?? 50}%</span>
                    </div>
                    <button
                      className={styles.resetBtn}
                      onClick={() => setBackgroundPosition({ x: 50, y: 50 })}
                    >
                      {language === 'ko' ? '중앙으로 초기화' : 'Reset to Center'}
                    </button>
                  </div>
                </div>
              )}

              {/* Background enabled */}
              <div className={styles.settingGroup}>
                <div className={styles.toggle}>
                  <span>{language === 'ko' ? '배경 이미지 사용' : 'Use Background Image'}</span>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={widgets?.background?.enabled !== false}
                      onChange={(e) =>
                        updateWidgetSettings('background', { enabled: e.target.checked })
                      }
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* UI Tab */}
          {activeTab === 'ui' && (
            <div className={styles.section}>
              {/* Edit Layout Mode */}
              <div className={styles.settingGroup}>
                <div className={styles.editLayoutBox}>
                  <div className={styles.editLayoutInfo}>
                    <IoMove className={styles.editLayoutIcon} />
                    <div>
                      <span>{language === 'ko' ? '위젯 레이아웃 편집' : 'Edit Widget Layout'}</span>
                      <p>
                        {language === 'ko'
                          ? '위젯 추가, 이동, 크기 조정, 삭제'
                          : 'Add, move, resize, delete widgets'}
                      </p>
                    </div>
                  </div>
                  <button
                    className={styles.editLayoutBtn}
                    onClick={() => {
                      updateUiSettings({ editMode: true });
                      onClose();
                    }}
                  >
                    {language === 'ko' ? '편집 모드' : 'Edit Mode'}
                  </button>
                </div>
              </div>

              {/* Show controls on hover */}
              <div className={styles.settingGroup}>
                <div className={styles.toggle}>
                  <div className={styles.toggleInfo}>
                    <span>{language === 'ko' ? '컨트롤 자동 숨김' : 'Auto-hide Controls'}</span>
                    <p className={styles.toggleDesc}>
                      {language === 'ko'
                        ? '마우스를 움직일 때만 설정 버튼이 표시됩니다'
                        : 'Settings button only shows when moving mouse'}
                    </p>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={uiSettings?.showControlsOnHover !== false}
                      onChange={(e) =>
                        updateUiSettings({ showControlsOnHover: e.target.checked })
                      }
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>

              {/* Controls timeout */}
              {uiSettings?.showControlsOnHover !== false && (
                <div className={styles.settingGroup}>
                  <label className={styles.label}>
                    {language === 'ko' ? '숨김 지연 시간' : 'Hide Delay'}
                  </label>
                  <select
                    value={uiSettings?.controlsTimeout || 3000}
                    onChange={(e) =>
                      updateUiSettings({ controlsTimeout: Number(e.target.value) })
                    }
                    className={styles.select}
                  >
                    <option value={1000}>1{language === 'ko' ? '초' : 's'}</option>
                    <option value={2000}>2{language === 'ko' ? '초' : 's'}</option>
                    <option value={3000}>3{language === 'ko' ? '초' : 's'}</option>
                    <option value={5000}>5{language === 'ko' ? '초' : 's'}</option>
                  </select>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
