import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { IoClose, IoAdd, IoCheckmark } from 'react-icons/io5';
import { useSettings } from '../../hooks/useSettings';
import Clock from '../Clock/Clock';
import Weather from '../Weather';
import Quote from '../Quote';
import Bookmarks from '../Bookmarks';
import TodoList from '../TodoList';
import StickyNote from '../StickyNote';
import Kanban from '../Kanban';
import styles from './WidgetGrid.module.css';

// Grid configuration
const COLS = 12;
const ROWS = 8;
const GAP = 16;

// Available widget types
const WIDGET_TYPES = [
  { type: 'clock', label: { ko: '디지털 시계 (큰)', en: 'Digital Clock (Large)' }, icon: '🕐', settings: { style: 'digital-large' }, defaultSize: { w: 4, h: 3 } },
  { type: 'clock', label: { ko: '디지털 시계 (작은)', en: 'Digital Clock (Small)' }, icon: '🕑', settings: { style: 'digital-small' }, defaultSize: { w: 3, h: 2 } },
  { type: 'clock', label: { ko: '아날로그 시계', en: 'Analog Clock' }, icon: '🕰️', settings: { style: 'analog' }, defaultSize: { w: 3, h: 3 } },
  { type: 'weather', label: { ko: '날씨', en: 'Weather' }, icon: '🌤️', settings: {}, defaultSize: { w: 3, h: 3 } },
  { type: 'quote', label: { ko: '성경 구절', en: 'Bible Verse' }, icon: '✝️', settings: { type: 'bible' }, defaultSize: { w: 6, h: 2 } },
  { type: 'quote', label: { ko: '명언', en: 'Quote' }, icon: '💬', settings: { type: 'quote' }, defaultSize: { w: 6, h: 2 } },
  { type: 'bookmarks', label: { ko: '북마크 (큰)', en: 'Bookmarks (Large)' }, icon: '🔖', settings: { size: 'large' }, defaultSize: { w: 4, h: 4 } },
  { type: 'bookmarks', label: { ko: '북마크 (중간)', en: 'Bookmarks (Medium)' }, icon: '📑', settings: { size: 'medium' }, defaultSize: { w: 3, h: 3 } },
  { type: 'bookmarks', label: { ko: '북마크 (작은)', en: 'Bookmarks (Small)' }, icon: '📌', settings: { size: 'small' }, defaultSize: { w: 2, h: 2 } },
  { type: 'todo', label: { ko: '할 일 목록', en: 'Todo List' }, icon: '✅', settings: {}, defaultSize: { w: 3, h: 4 } },
  { type: 'sticky', label: { ko: '스티키 노트', en: 'Sticky Note' }, icon: '📝', settings: { color: 'yellow' }, defaultSize: { w: 3, h: 3 } },
  { type: 'kanban', label: { ko: '칸반 보드', en: 'Kanban Board' }, icon: '📋', settings: {}, defaultSize: { w: 6, h: 4 } }
];

// Check if two rectangles overlap
const checkOverlap = (rect1, rect2) => {
  return !(
    rect1.x + rect1.w <= rect2.x ||
    rect2.x + rect2.w <= rect1.x ||
    rect1.y + rect1.h <= rect2.y ||
    rect2.y + rect2.h <= rect1.y
  );
};

// Check if a widget position is valid (no overlap with others)
const isValidPosition = (layout, widgetId, newPos) => {
  // Check bounds
  if (newPos.x < 0 || newPos.y < 0) return false;
  if (newPos.x + newPos.w > COLS) return false;
  if (newPos.y + newPos.h > ROWS) return false;

  // Check overlap with other widgets
  for (const item of layout) {
    if (item.i === widgetId) continue;
    if (checkOverlap(newPos, { x: item.x, y: item.y, w: item.w, h: item.h })) {
      return false;
    }
  }
  return true;
};

// Find first available position for new widget
const findAvailablePosition = (layout, size) => {
  for (let y = 0; y <= ROWS - size.h; y++) {
    for (let x = 0; x <= COLS - size.w; x++) {
      const testPos = { x, y, w: size.w, h: size.h };
      const overlaps = layout.some(item =>
        checkOverlap(testPos, { x: item.x, y: item.y, w: item.w, h: item.h })
      );
      if (!overlaps) {
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 }; // Fallback
};

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

  const gridRef = useRef(null);
  const [showGallery, setShowGallery] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [resizing, setResizing] = useState(null);
  const [previewPos, setPreviewPos] = useState(null);
  const [cellSize, setCellSize] = useState({ width: 0, height: 0 });

  const isEditing = uiSettings?.editMode || false;
  const currentLayout = useMemo(() => layout || [], [layout]);
  const instances = useMemo(() => widgetInstances || [], [widgetInstances]);

  // Calculate cell size based on window (square cells)
  useEffect(() => {
    const updateCellSize = () => {
      // Calculate based on width to make square cells
      const cellWidth = (window.innerWidth - GAP * (COLS + 1)) / COLS;
      setCellSize({ width: cellWidth, height: cellWidth });
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

  // Get grid position from mouse coordinates
  const getGridPos = useCallback((clientX, clientY) => {
    const x = Math.floor((clientX - GAP) / (cellSize.width + GAP));
    const y = Math.floor((clientY - GAP) / (cellSize.height + GAP));
    return {
      x: Math.max(0, Math.min(x, COLS - 1)),
      y: Math.max(0, Math.min(y, ROWS - 1))
    };
  }, [cellSize]);

  // Handle drag start
  const handleDragStart = (e, widgetId) => {
    if (!isEditing) return;

    const layoutItem = currentLayout.find(l => l.i === widgetId);
    if (!layoutItem) return;

    setDragging({
      id: widgetId,
      startX: layoutItem.x,
      startY: layoutItem.y,
      w: layoutItem.w,
      h: layoutItem.h,
      offsetX: e.clientX,
      offsetY: e.clientY
    });

    setPreviewPos({ x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h });
  };

  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!dragging) return;

    const pos = getGridPos(e.clientX, e.clientY);
    const newPos = {
      x: Math.max(0, Math.min(pos.x, COLS - dragging.w)),
      y: Math.max(0, Math.min(pos.y, ROWS - dragging.h)),
      w: dragging.w,
      h: dragging.h
    };

    // Check if position is valid
    const valid = isValidPosition(currentLayout, dragging.id, newPos);
    setPreviewPos({ ...newPos, valid });
  }, [dragging, currentLayout, getGridPos]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!dragging || !previewPos) {
      setDragging(null);
      setPreviewPos(null);
      return;
    }

    if (previewPos.valid !== false) {
      // Update layout with new position
      const newLayout = currentLayout.map(item =>
        item.i === dragging.id
          ? { ...item, x: previewPos.x, y: previewPos.y }
          : item
      );
      updateLayout(newLayout);
    }

    setDragging(null);
    setPreviewPos(null);
  }, [dragging, previewPos, currentLayout, updateLayout]);

  // Handle resize start
  const handleResizeStart = (e, widgetId) => {
    e.stopPropagation();
    if (!isEditing) return;

    const layoutItem = currentLayout.find(l => l.i === widgetId);
    if (!layoutItem) return;

    setResizing({
      id: widgetId,
      startW: layoutItem.w,
      startH: layoutItem.h,
      x: layoutItem.x,
      y: layoutItem.y,
      startMouseX: e.clientX,
      startMouseY: e.clientY
    });

    setPreviewPos({ x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h });
  };

  // Handle resize move
  const handleResizeMove = useCallback((e) => {
    if (!resizing) return;

    const deltaX = e.clientX - resizing.startMouseX;
    const deltaY = e.clientY - resizing.startMouseY;

    const deltaW = Math.round(deltaX / (cellSize.width + GAP));
    const deltaH = Math.round(deltaY / (cellSize.height + GAP));

    const newW = Math.max(2, Math.min(resizing.startW + deltaW, COLS - resizing.x));
    const newH = Math.max(2, Math.min(resizing.startH + deltaH, ROWS - resizing.y));

    const newPos = {
      x: resizing.x,
      y: resizing.y,
      w: newW,
      h: newH
    };

    const valid = isValidPosition(currentLayout, resizing.id, newPos);
    setPreviewPos({ ...newPos, valid });
  }, [resizing, cellSize, currentLayout]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    if (!resizing || !previewPos) {
      setResizing(null);
      setPreviewPos(null);
      return;
    }

    if (previewPos.valid !== false) {
      const newLayout = currentLayout.map(item =>
        item.i === resizing.id
          ? { ...item, w: previewPos.w, h: previewPos.h }
          : item
      );
      updateLayout(newLayout);
    }

    setResizing(null);
    setPreviewPos(null);
  }, [resizing, previewPos, currentLayout, updateLayout]);

  // Global mouse move/up handlers
  useEffect(() => {
    if (dragging || resizing) {
      const handleMove = (e) => {
        if (dragging) handleDragMove(e);
        if (resizing) handleResizeMove(e);
      };

      const handleUp = () => {
        if (dragging) handleDragEnd();
        if (resizing) handleResizeEnd();
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);

      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };
    }
  }, [dragging, resizing, handleDragMove, handleDragEnd, handleResizeMove, handleResizeEnd]);

  // Add new widget
  const handleAddWidget = (widgetType) => {
    const id = `${widgetType.type}-${Date.now()}`;
    const size = widgetType.defaultSize;
    const pos = findAvailablePosition(currentLayout, size);

    // Add instance
    addWidgetInstance(widgetType.type, widgetType.settings || {});

    // Update layout with new position
    const lastInstance = instances[instances.length - 1];
    if (lastInstance) {
      setTimeout(() => {
        const newLayout = [...currentLayout, {
          i: id,
          x: pos.x,
          y: pos.y,
          w: size.w,
          h: size.h
        }];
        updateLayout(newLayout);
      }, 0);
    }

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

  // Render widget content
  const renderWidget = (instance) => {
    const { id, type, settings } = instance;

    switch (type) {
      case 'clock':
        return <Clock style={settings?.style} />;
      case 'weather':
        return <Weather />;
      case 'quote':
        return <Quote type={settings?.type} />;
      case 'bookmarks':
        return <Bookmarks size={settings?.size} />;
      case 'todo':
        return <TodoList widgetId={id} />;
      case 'sticky':
        return <StickyNote widgetId={id} color={settings?.color} />;
      case 'kanban':
        return <Kanban widgetId={id} />;
      default:
        return null;
    }
  };

  // Calculate widget style from layout
  const getWidgetStyle = (layoutItem) => {
    if (!layoutItem) return {};

    return {
      gridColumn: `${layoutItem.x + 1} / span ${layoutItem.w}`,
      gridRow: `${layoutItem.y + 1} / span ${layoutItem.h}`
    };
  };

  return (
    <div className={styles.gridContainer}>
      {/* Edit mode indicator */}
      {isEditing && (
        <div className={styles.editIndicator}>
          {language === 'ko' ? '위젯을 드래그하여 이동하세요' : 'Drag widgets to move'}
        </div>
      )}

      {/* Add Widget Button */}
      {isEditing && (
        <button
          className={styles.addButton}
          onClick={() => setShowGallery(true)}
          title={language === 'ko' ? '위젯 추가' : 'Add Widget'}
        >
          <IoAdd />
        </button>
      )}

      {/* Done Button */}
      {isEditing && (
        <button className={styles.doneButton} onClick={handleDoneEditing}>
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
            <button className={styles.galleryClose} onClick={() => setShowGallery(false)}>
              {language === 'ko' ? '닫기' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div
        ref={gridRef}
        className={`${styles.grid} ${isEditing ? styles.editing : ''}`}
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${cellSize.width}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${cellSize.height}px)`,
          gap: `${GAP}px`,
          padding: `${GAP}px`
        }}
      >
        {/* Grid cells (for editing visualization) */}
        {isEditing && Array.from({ length: COLS * ROWS }).map((_, i) => (
          <div key={`cell-${i}`} className={styles.gridCell} />
        ))}

        {/* Preview placeholder */}
        {previewPos && (
          <div
            className={`${styles.preview} ${previewPos.valid === false ? styles.invalid : ''}`}
            style={getWidgetStyle(previewPos)}
          />
        )}

        {/* Widgets */}
        {instances.map((instance) => {
          const layoutItem = currentLayout.find(l => l.i === instance.id);
          if (!layoutItem) return null;

          const isDragging = dragging?.id === instance.id;
          const isResizingThis = resizing?.id === instance.id;

          return (
            <div
              key={instance.id}
              className={`${styles.widget} ${isEditing ? styles.editable : ''} ${isDragging || isResizingThis ? styles.active : ''}`}
              style={getWidgetStyle(layoutItem)}
            >
              {/* Delete button */}
              {isEditing && (
                <button
                  className={styles.deleteButton}
                  onClick={() => handleRemoveWidget(instance.id)}
                >
                  <IoClose />
                </button>
              )}

              {/* Drag handle */}
              {isEditing && (
                <div
                  className={styles.dragHandle}
                  onMouseDown={(e) => handleDragStart(e, instance.id)}
                >
                  <span>⋮⋮</span>
                </div>
              )}

              {/* Widget content */}
              <div className={styles.widgetContent}>
                {renderWidget(instance)}
              </div>

              {/* Resize handle */}
              {isEditing && (
                <div
                  className={styles.resizeHandle}
                  onMouseDown={(e) => handleResizeStart(e, instance.id)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WidgetGrid;
