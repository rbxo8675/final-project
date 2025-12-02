import { useState, useRef, useEffect } from 'react';
import { IoAdd, IoClose, IoCheckmark, IoEllipse } from 'react-icons/io5';
import { useSettings } from '../../hooks/useSettings';
import styles from './TodoList.module.css';

const TodoList = ({ widgetId }) => {
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

  // Get todos for this widget instance
  const data = widgetData?.[widgetId] || { items: [] };
  const todos = data.items || [];

  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  // Initialize widget data if not exists
  useEffect(() => {
    if (!widgetData?.[widgetId]) {
      setWidgetData(widgetId, { items: [] });
    }
  }, [widgetId, widgetData, setWidgetData]);

  // Focus edit input when editing
  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  // Add new todo
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const newItem = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      createdAt: Date.now()
    };

    updateWidgetData(widgetId, {
      items: [...todos, newItem]
    });

    setNewTodo('');
    inputRef.current?.focus();
  };

  // Toggle todo completion
  const handleToggle = (id) => {
    updateWidgetData(widgetId, {
      items: todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    });
  };

  // Delete todo
  const handleDelete = (id, e) => {
    e.stopPropagation();
    updateWidgetData(widgetId, {
      items: todos.filter(t => t.id !== id)
    });
  };

  // Start editing
  const handleStartEdit = (todo, e) => {
    e.stopPropagation();
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // Save edit
  const handleSaveEdit = (id) => {
    if (!editText.trim()) {
      handleDelete(id, { stopPropagation: () => {} });
      return;
    }

    updateWidgetData(widgetId, {
      items: todos.map(t =>
        t.id === id ? { ...t, text: editText.trim() } : t
      )
    });

    setEditingId(null);
    setEditText('');
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Handle edit key press
  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className={`${styles.container} ${styleClass} ${isEditing ? styles.editMode : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          {language === 'ko' ? '할 일' : 'To-Do'}
        </h3>
        {totalCount > 0 && (
          <span className={styles.count}>
            {completedCount}/{totalCount}
          </span>
        )}
      </div>

      {/* Todo List */}
      <div className={styles.list}>
        {todos.length === 0 ? (
          <div className={styles.empty}>
            {language === 'ko' ? '할 일이 없습니다' : 'No tasks yet'}
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`${styles.item} ${todo.completed ? styles.completed : ''}`}
              onClick={() => handleToggle(todo.id)}
            >
              {/* Checkbox */}
              <button className={styles.checkbox}>
                {todo.completed ? (
                  <IoCheckmark className={styles.checkIcon} />
                ) : (
                  <IoEllipse className={styles.emptyIcon} />
                )}
              </button>

              {/* Text */}
              {editingId === todo.id ? (
                <input
                  ref={editInputRef}
                  type="text"
                  className={styles.editInput}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                  onBlur={() => handleSaveEdit(todo.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className={styles.text}
                  onDoubleClick={(e) => handleStartEdit(todo, e)}
                >
                  {todo.text}
                </span>
              )}

              {/* Delete button - always visible for usability */}
              <button
                className={styles.deleteBtn}
                onClick={(e) => handleDelete(todo.id, e)}
                title={language === 'ko' ? '삭제' : 'Delete'}
              >
                <IoClose />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Todo Form */}
      <form className={styles.addForm} onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          type="text"
          className={styles.addInput}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder={language === 'ko' ? '새 할 일 추가...' : 'Add new task...'}
        />
        <button
          type="submit"
          className={styles.addBtn}
          disabled={!newTodo.trim()}
        >
          <IoAdd />
        </button>
      </form>
    </div>
  );
};

export default TodoList;
