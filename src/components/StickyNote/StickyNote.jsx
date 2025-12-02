import { useState, useRef, useEffect } from 'react';
import { IoColorPalette } from 'react-icons/io5';
import { useSettings } from '../../hooks/useSettings';
import styles from './StickyNote.module.css';

// Available colors for sticky notes
const COLORS = [
  { id: 'yellow', name: 'Yellow', bg: '#fef3c7', text: '#92400e' },
  { id: 'pink', name: 'Pink', bg: '#fce7f3', text: '#9d174d' },
  { id: 'blue', name: 'Blue', bg: '#dbeafe', text: '#1e40af' },
  { id: 'green', name: 'Green', bg: '#d1fae5', text: '#065f46' },
  { id: 'purple', name: 'Purple', bg: '#ede9fe', text: '#5b21b6' },
  { id: 'orange', name: 'Orange', bg: '#ffedd5', text: '#c2410c' }
];

const StickyNote = ({ widgetId, color = 'yellow' }) => {
  const {
    language,
    uiSettings,
    widgetData,
    setWidgetData,
    updateWidgetData,
    updateWidgetInstance
  } = useSettings();

  const isEditing = uiSettings?.editMode || false;

  // Get data for this widget instance
  const data = widgetData?.[widgetId] || { content: '' };
  const content = data.content || '';

  const [showColorPicker, setShowColorPicker] = useState(false);
  const textareaRef = useRef(null);
  const colorPickerRef = useRef(null);

  // Initialize widget data if not exists
  useEffect(() => {
    if (!widgetData?.[widgetId]) {
      setWidgetData(widgetId, { content: '' });
    }
  }, [widgetId, widgetData, setWidgetData]);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

  // Handle content change
  const handleContentChange = (e) => {
    updateWidgetData(widgetId, { content: e.target.value });
  };

  // Handle color change
  const handleColorChange = (colorId) => {
    updateWidgetInstance(widgetId, { color: colorId });
    setShowColorPicker(false);
  };

  // Get current color scheme
  const currentColor = COLORS.find(c => c.id === color) || COLORS[0];

  return (
    <div
      className={`${styles.container} ${isEditing ? styles.editMode : ''}`}
      style={{
        '--sticky-bg': currentColor.bg,
        '--sticky-text': currentColor.text
      }}
    >
      {/* Color picker button - only in edit mode */}
      {isEditing && (
        <div className={styles.colorPickerWrapper} ref={colorPickerRef}>
          <button
            className={styles.colorPickerBtn}
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
            }}
            title={language === 'ko' ? '색상 변경' : 'Change color'}
          >
            <IoColorPalette />
          </button>

          {showColorPicker && (
            <div className={styles.colorPicker}>
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.colorOption} ${c.id === color ? styles.active : ''}`}
                  style={{ backgroundColor: c.bg }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorChange(c.id);
                  }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Note content */}
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={content}
        onChange={handleContentChange}
        placeholder={language === 'ko' ? '메모를 입력하세요...' : 'Write a note...'}
      />

      {/* Decorative corner fold */}
      <div className={styles.cornerFold} />
    </div>
  );
};

export default StickyNote;
