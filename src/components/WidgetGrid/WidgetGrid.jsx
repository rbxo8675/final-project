import { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import { IoClose, IoAdd, IoCheckmark } from 'react-icons/io5';
import { useSettings } from '../../hooks/useSettings';
import Clock from '../Clock/Clock';
import Weather from '../Weather';
import Quote from '../Quote';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styles from './WidgetGrid.module.css';

// Grid configuration
const COLS = 12;
const ROW_HEIGHT = 60;
const MARGIN = [16, 16];

// Available widget types for gallery
const WIDGET_TYPES = [
  // Clock styles
  { type: 'clock', label: { ko: '디지털 시계 (큰)', en: 'Digital Clock (Large)' }, icon: '🕐', settings: { style: 'digital-large' } },
  { type: 'clock', label: { ko: '디지털 시계 (작은)', en: 'Digital Clock (Small)' }, icon: '🕑', settings: { style: 'digital-small' } },
  { type: 'clock', label: { ko: '아날로그 시계', en: 'Analog Clock' }, icon: '🕰️', settings: { style: 'analog' } },
  // Weather
  { type: 'weather', label: { ko: '날씨', en: 'Weather' }, icon: '🌤️', settings: {} },
  // Quote types
  { type: 'quote', label: { ko: '성경 구절', en: 'Bible Verse' }, icon: '✝️', settings: { type: 'bible' } },
  { type: 'quote', label: { ko: '명언', en: 'Quote' }, icon: '💬', settings: { type: 'quote' } }
];

const WidgetGrid = () => {
  const {
    widgetInstances,
    layout,
    updateLayout,
    uiSettings,
    language,
    addWidgetInstance,
    removeWidgetInstance,
    updateUiSettings
  } = useSettings();

  const [gridWidth, setGridWidth] = useState(window.innerWidth);
  const [showGallery, setShowGallery] = useState(false);

  // Get edit mode from settings
  const isEditing = uiSettings?.editMode || false;

  // Get current layout
  const currentLayout = layout || [];
  const instances = widgetInstances || [];

  // Update grid width on window resize
  useEffect(() => {
    const handleResize = () => {
      setGridWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle layout change
  const handleLayoutChange = (newLayout) => {
    updateLayout(newLayout);
  };

  // Add new widget
  const handleAddWidget = (widget) => {
    addWidgetInstance(widget.type, widget.settings || {});
    setShowGallery(false);
  };

  // Remove widget
  const handleRemoveWidget = (id) => {
    removeWidgetInstance(id);
  };

  // Exit edit mode
  const handleDoneEditing = () => {
    updateUiSettings({ editMode: false });
  };

  // Render widget by type
  const renderWidget = (instance) => {
    const { type, settings } = instance;

    switch (type) {
      case 'clock':
        return <Clock style={settings?.style} />;
      case 'weather':
        return <Weather />;
      case 'quote':
        return <Quote type={settings?.type} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.gridContainer}>
      {/* Edit mode indicator */}
      {isEditing && (
        <div className={styles.editIndicator}>
          {language === 'ko' ? '위젯을 드래그하여 이동하세요' : 'Drag widgets to move'}
        </div>
      )}

      {/* Add Widget Button - only in edit mode */}
      {isEditing && (
        <button
          className={styles.addButton}
          onClick={() => setShowGallery(true)}
          title={language === 'ko' ? '위젯 추가' : 'Add Widget'}
        >
          <IoAdd />
        </button>
      )}

      {/* Done Button - only in edit mode */}
      {isEditing && (
        <button
          className={styles.doneButton}
          onClick={handleDoneEditing}
        >
          <IoCheckmark />
          {language === 'ko' ? '완료' : 'Done'}
        </button>
      )}

      {/* Widget Gallery Modal */}
      {showGallery && (
        <div className={styles.galleryOverlay} onClick={() => setShowGallery(false)}>
          <div className={styles.gallery} onClick={(e) => e.stopPropagation()}>
            <h3>{language === 'ko' ? '위젯 추가' : 'Add Widget'}</h3>
            <div className={styles.galleryGrid}>
              {WIDGET_TYPES.map((widget, index) => (
                <button
                  key={`${widget.type}-${index}`}
                  className={styles.galleryItem}
                  onClick={() => handleAddWidget(widget)}
                >
                  <span className={styles.galleryIcon}>{widget.icon}</span>
                  <span className={styles.galleryLabel}>
                    {widget.label[language] || widget.label.ko}
                  </span>
                </button>
              ))}
            </div>
            <button
              className={styles.galleryClose}
              onClick={() => setShowGallery(false)}
            >
              {language === 'ko' ? '닫기' : 'Close'}
            </button>
          </div>
        </div>
      )}

      <GridLayout
        className={`${styles.grid} ${isEditing ? styles.editing : ''}`}
        layout={currentLayout}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        width={gridWidth}
        margin={MARGIN}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".widget-drag-handle"
        compactType={null}
        preventCollision={true}
        useCSSTransforms={true}
        isBounded={true}
      >
        {instances.map((instance) => {
          const layoutItem = currentLayout.find(l => l.i === instance.id);
          if (!layoutItem) return null;

          return (
            <div
              key={instance.id}
              className={`${styles.widgetWrapper} ${isEditing ? styles.editable : ''}`}
            >
              {/* Edit mode controls - only in edit mode */}
              {isEditing && (
                <>
                  {/* Delete button - outside drag handle */}
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleRemoveWidget(instance.id);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    title={language === 'ko' ? '삭제' : 'Delete'}
                  >
                    <IoClose />
                  </button>

                  {/* Drag overlay */}
                  <div className={`${styles.editOverlay} widget-drag-handle`}>
                    {/* Drag indicator */}
                    <div className={styles.dragIndicator}>
                      <span>⋮⋮</span>
                    </div>
                  </div>
                </>
              )}

              <div className={styles.widgetContent}>
                {renderWidget(instance)}
              </div>
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
};

export default WidgetGrid;
