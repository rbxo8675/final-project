import { useState, useEffect, useCallback, useRef } from 'react';
import { IoSettingsSharp, IoHeart, IoHeartOutline, IoRefresh } from 'react-icons/io5';
import { AppProvider, AppContext } from './contexts/AppContext';
import { useContext } from 'react';
import Background from './components/Background';
import WidgetGrid from './components/WidgetGrid';
import Settings from './components/Settings';
import './App.css';

// Inner component to use context
const AppContent = () => {
  const {
    widgetStyle,
    uiSettings,
    backgroundMode,
    backgroundFavorites,
    addBackgroundFavorite,
    removeBackgroundFavorite,
    isBackgroundFavorited
  } = useContext(AppContext);

  const [currentImageData, setCurrentImageData] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const timeoutRef = useRef(null);
  const backgroundRef = useRef(null);

  const showControlsOnHover = uiSettings?.showControlsOnHover !== false;
  const controlsTimeout = uiSettings?.controlsTimeout || 3000;

  // Apply widget style to document
  useEffect(() => {
    document.documentElement.setAttribute('data-widget-style', widgetStyle || 'glass');
  }, [widgetStyle]);

  // Handle mouse movement for auto-hide
  const handleMouseMove = useCallback(() => {
    if (!showControlsOnHover) return;

    setControlsVisible(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, controlsTimeout);
  }, [showControlsOnHover, controlsTimeout]);

  // Set up mouse move listener
  useEffect(() => {
    if (showControlsOnHover) {
      window.addEventListener('mousemove', handleMouseMove);
      // Initial hide after timeout
      timeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, controlsTimeout);
    } else {
      setControlsVisible(true);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showControlsOnHover, controlsTimeout, handleMouseMove]);

  const isFavorited = currentImageData && isBackgroundFavorited(currentImageData.id);

  const handleFavorite = () => {
    if (!currentImageData) return;

    if (isFavorited) {
      // Find and remove the favorite
      const favorite = backgroundFavorites?.find(f => f.originalId === currentImageData.id);
      if (favorite) {
        removeBackgroundFavorite(favorite.id);
      }
    } else {
      // Add to favorites
      addBackgroundFavorite({
        ...currentImageData,
        originalId: currentImageData.id
      });
    }
  };

  const handleRefresh = () => {
    backgroundRef.current?.refresh();
  };

  return (
    <div className="App">
      {/* Background */}
      <Background
        ref={backgroundRef}
        onImageChange={setCurrentImageData}
      />

      {/* Widget Grid - Draggable widgets */}
      <WidgetGrid />

      {/* Control Buttons - hidden in edit mode */}
      {!uiSettings?.editMode && (
        <div className={`control-buttons ${controlsVisible ? 'visible' : 'hidden'}`}>
          {/* Favorite button - only in random mode */}
          {backgroundMode === 'random' && currentImageData && (
            <button
              className={`control-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={handleFavorite}
              title={isFavorited ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'}
            >
              {isFavorited ? <IoHeart /> : <IoHeartOutline />}
            </button>
          )}

          {/* Refresh button - only in random mode */}
          {backgroundMode === 'random' && (
            <button
              className="control-btn"
              onClick={handleRefresh}
              title="새 이미지"
            >
              <IoRefresh />
            </button>
          )}

          {/* Settings button */}
          <button
            className="control-btn settings"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            <IoSettingsSharp />
          </button>
        </div>
      )}

      {/* Settings Modal */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
