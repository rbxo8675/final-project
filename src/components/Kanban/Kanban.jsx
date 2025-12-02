import { useState, useRef, useEffect } from 'react';
import { IoAdd, IoClose, IoCheckmarkCircle } from 'react-icons/io5';
import { useSettings } from '../../hooks/useSettings';
import styles from './Kanban.module.css';

// Default columns (no "done" column - items get deleted when completed)
const DEFAULT_COLUMNS = [
  { id: 'todo', title: { ko: '할 일', en: 'To Do' }, items: [] },
  { id: 'progress', title: { ko: '진행 중', en: 'In Progress' }, items: [] }
];

const Kanban = ({ widgetId }) => {
  const {
    language,
    uiSettings,
    widgetStyle,
    widgetData,
    setWidgetData,
    updateWidgetData
  } = useSettings();

  const isEditing = uiSettings?.editMode || false;
  const styleClass = styles[`style_${widgetStyle}`] || '';

  // Get data for this widget instance
  const data = widgetData?.[widgetId] || { columns: DEFAULT_COLUMNS };
  const columns = data.columns || DEFAULT_COLUMNS;

  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [dragOverComplete, setDragOverComplete] = useState(false);
  const [showCompleteEffect, setShowCompleteEffect] = useState(false);
  const [showAddInput, setShowAddInput] = useState(null); // Column ID where add input is shown
  const [newCardText, setNewCardText] = useState('');
  const inputRef = useRef(null);

  // Initialize widget data if not exists
  useEffect(() => {
    if (!widgetData?.[widgetId]) {
      setWidgetData(widgetId, { columns: DEFAULT_COLUMNS });
    }
  }, [widgetId, widgetData, setWidgetData]);

  // Focus input when showing add form
  useEffect(() => {
    if (showAddInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddInput]);

  // Add new card
  const handleAddCard = (columnId) => {
    if (!newCardText.trim()) {
      setShowAddInput(null);
      return;
    }

    const newCard = {
      id: Date.now(),
      text: newCardText.trim(),
      createdAt: Date.now()
    };

    const newColumns = columns.map(col =>
      col.id === columnId
        ? { ...col, items: [...col.items, newCard] }
        : col
    );

    updateWidgetData(widgetId, { columns: newColumns });
    setNewCardText('');
    setShowAddInput(null);
  };

  // Delete card
  const handleDeleteCard = (columnId, cardId) => {
    const newColumns = columns.map(col =>
      col.id === columnId
        ? { ...col, items: col.items.filter(item => item.id !== cardId) }
        : col
    );

    updateWidgetData(widgetId, { columns: newColumns });
  };

  // Drag handlers
  const handleDragStart = (e, columnId, card) => {
    setDraggedCard({ columnId, card });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.id.toString());
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (columnId !== dragOverColumn) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedCard) return;

    const { columnId: sourceColumnId, card } = draggedCard;

    if (sourceColumnId === targetColumnId) {
      setDraggedCard(null);
      return;
    }

    // Remove from source column, add to target column
    const newColumns = columns.map(col => {
      if (col.id === sourceColumnId) {
        return { ...col, items: col.items.filter(item => item.id !== card.id) };
      }
      if (col.id === targetColumnId) {
        return { ...col, items: [...col.items, card] };
      }
      return col;
    });

    updateWidgetData(widgetId, { columns: newColumns });
    setDraggedCard(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverColumn(null);
    setDragOverComplete(false);
  };

  // Complete zone handlers
  const handleCompleteDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverComplete(true);
  };

  const handleCompleteDragLeave = () => {
    setDragOverComplete(false);
  };

  const handleCompleteDrop = (e) => {
    e.preventDefault();
    setDragOverComplete(false);

    if (!draggedCard) return;

    const { columnId: sourceColumnId, card } = draggedCard;

    // Remove card from source column (complete it)
    const newColumns = columns.map(col =>
      col.id === sourceColumnId
        ? { ...col, items: col.items.filter(item => item.id !== card.id) }
        : col
    );

    updateWidgetData(widgetId, { columns: newColumns });
    setDraggedCard(null);

    // Show completion effect
    setShowCompleteEffect(true);
    setTimeout(() => setShowCompleteEffect(false), 800);
  };

  // Handle key press for add input
  const handleKeyDown = (e, columnId) => {
    if (e.key === 'Enter') {
      handleAddCard(columnId);
    } else if (e.key === 'Escape') {
      setShowAddInput(null);
      setNewCardText('');
    }
  };

  return (
    <div className={`${styles.container} ${styleClass} ${isEditing ? styles.editMode : ''}`}>
      {columns.map((column) => (
        <div
          key={column.id}
          className={`${styles.column} ${dragOverColumn === column.id ? styles.dragOver : ''}`}
          onDragOver={!isEditing ? (e) => handleDragOver(e, column.id) : undefined}
          onDragLeave={!isEditing ? handleDragLeave : undefined}
          onDrop={!isEditing ? (e) => handleDrop(e, column.id) : undefined}
        >
          {/* Column Header */}
          <div className={styles.columnHeader}>
            <h4 className={styles.columnTitle}>
              {column.title[language] || column.title.ko}
            </h4>
            <span className={styles.itemCount}>{column.items.length}</span>
          </div>

          {/* Cards */}
          <div className={styles.cards}>
            {column.items.map((card) => (
              <div
                key={card.id}
                className={`${styles.card} ${draggedCard?.card.id === card.id ? styles.dragging : ''}`}
                draggable={!isEditing}
                onDragStart={!isEditing ? (e) => handleDragStart(e, column.id, card) : undefined}
                onDragEnd={!isEditing ? handleDragEnd : undefined}
              >
                <span className={styles.cardText}>{card.text}</span>
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCard(column.id, card.id);
                  }}
                  title={language === 'ko' ? '삭제' : 'Delete'}
                >
                  <IoClose />
                </button>
              </div>
            ))}

            {/* Add Card Form */}
            {showAddInput === column.id ? (
              <div className={styles.addForm}>
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.addInput}
                  value={newCardText}
                  onChange={(e) => setNewCardText(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, column.id)}
                  onBlur={() => {
                    if (!newCardText.trim()) {
                      setShowAddInput(null);
                    }
                  }}
                  placeholder={language === 'ko' ? '카드 추가...' : 'Add card...'}
                />
                <div className={styles.addFormActions}>
                  <button
                    className={styles.addConfirmBtn}
                    onClick={() => handleAddCard(column.id)}
                  >
                    {language === 'ko' ? '추가' : 'Add'}
                  </button>
                  <button
                    className={styles.addCancelBtn}
                    onClick={() => {
                      setShowAddInput(null);
                      setNewCardText('');
                    }}
                  >
                    <IoClose />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={styles.addCardBtn}
                onClick={() => setShowAddInput(column.id)}
              >
                <IoAdd />
                <span>{language === 'ko' ? '카드 추가' : 'Add Card'}</span>
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Complete Drop Zone - hidden in edit mode */}
      {!isEditing && (
        <div
          className={`${styles.completeZone} ${dragOverComplete ? styles.dragOverComplete : ''} ${showCompleteEffect ? styles.showEffect : ''}`}
          onDragOver={handleCompleteDragOver}
          onDragLeave={handleCompleteDragLeave}
          onDrop={handleCompleteDrop}
        >
        <IoCheckmarkCircle className={styles.completeIcon} />
        <span className={styles.completeText}>
          {language === 'ko' ? '완료' : 'Done'}
        </span>
          {showCompleteEffect && (
            <div className={styles.completeEffect}>
              <IoCheckmarkCircle />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Kanban;
